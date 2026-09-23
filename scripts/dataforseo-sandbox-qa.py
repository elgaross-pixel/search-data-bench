"""One no-cost DataForSEO sandbox smoke check. Never use sandbox data as editorial evidence."""
import base64
import json
import os
import sys
import urllib.error
import urllib.request

URL = "https://sandbox.dataforseo.com/v3/serp/google/organic/live/advanced"
TASK = {"keyword": "dataforseo api", "location_code": 2840, "language_code": "en", "device": "desktop", "depth": 10}


def main():
    login = os.environ.get("DATAFORSEO_API_LOGIN")
    password = os.environ.get("DATAFORSEO_API_PASSWORD")
    if not login or not password:
        print("BLOCKED: DATAFORSEO_API_LOGIN and DATAFORSEO_API_PASSWORD must be supplied as private runner secrets.")
        return 2
    assert URL.startswith("https://sandbox.dataforseo.com/v3/")
    auth = base64.b64encode(f"{login}:{password}".encode()).decode("ascii")
    request = urllib.request.Request(
        URL,
        data=json.dumps([TASK]).encode("utf-8"),
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json",
            "User-Agent": "SearchDataBench-SandboxQA/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            http_status = response.status
            payload = json.load(response)
    except urllib.error.HTTPError as exc:
        print(f"FAIL: sandbox HTTP status {exc.code}; response body omitted.")
        return 1
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        print(f"FAIL: sandbox request/JSON error ({type(exc).__name__}); credentials and body omitted.")
        return 1
    tasks = payload.get("tasks") if isinstance(payload, dict) else None
    task = tasks[0] if isinstance(tasks, list) and len(tasks) == 1 else {}
    result = task.get("result") if isinstance(task, dict) else None
    cost = task.get("cost") if isinstance(task, dict) else None
    summary = {
        "environment": "SANDBOX / DUMMY DATA",
        "http_status": http_status,
        "status_code": payload.get("status_code") if isinstance(payload, dict) else None,
        "task_status_code": task.get("status_code") if isinstance(task, dict) else None,
        "task_count": len(tasks) if isinstance(tasks, list) else None,
        "result_is_list": isinstance(result, list),
        "reported_task_cost": cost,
    }
    print(json.dumps(summary, sort_keys=True))
    passed = (http_status == 200 and summary["status_code"] == 20000
              and summary["task_status_code"] == 20000 and isinstance(result, list)
              and (cost is None or float(cost) == 0))
    print("Sandbox integration QA: " + ("PASS" if passed else "FAIL") + " (dummy data; no live benchmark)")
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
