import subprocess
import json
import sys
import os
from dotenv import load_dotenv

def test_mcp_server():
    load_dotenv()
    
    token = os.getenv("CANVAS_API_TOKEN")
    url = os.getenv("CANVAS_BASE_URL")
    print(f"Loaded config: BASE_URL={url}, TOKEN_SET={bool(token)}")
    
    # Launch MCP server process
    proc = subprocess.Popen(
        ["node", "canvas-lms-mcp/index.js"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )
    
    try:
        # Step 1: Send tools/list request
        list_req = {
            "jsonrpc": "2.0",
            "method": "tools/list",
            "params": {},
            "id": 1
        }
        print("Sending tools/list request...")
        proc.stdin.write(json.dumps(list_req) + "\n")
        proc.stdin.flush()
        
        stdout_line = proc.stdout.readline()
        if not stdout_line:
            print("ERROR: No response from MCP server.")
            proc.terminate()
            stderr_output = proc.stderr.read()
            print(f"Stderr output from server:\n{stderr_output}")
            sys.exit(1)
            
        list_resp = json.loads(stdout_line)
        tools = list_resp.get("result", {}).get("tools", [])
        tool_names = [t.get("name") for t in tools]
        print(f"Available tools: {tool_names}")
        
        expected_tools = ["get_current_user", "list_courses", "list_assignments", "get_user_grades"]
        for expected in expected_tools:
            assert expected in tool_names, f"Expected tool '{expected}' is missing!"
        print("PASS: tools/list test successful.")
        
        # Step 2: Test get_current_user
        call_req = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": "get_current_user",
                "arguments": {}
            },
            "id": 2
        }
        print("Testing get_current_user...")
        proc.stdin.write(json.dumps(call_req) + "\n")
        proc.stdin.flush()
        stdout_line = proc.stdout.readline()
        call_resp = json.loads(stdout_line)
        result = call_resp.get("result", {})
        assert not result.get("isError", False), f"get_current_user failed: {result}"
        user_data = json.loads(result.get("content", [])[0].get("text", "{}"))
        print(f"Authenticated user: {user_data.get('name')} (ID: {user_data.get('id')})")
        print("PASS: get_current_user test successful.")
        
        # Step 3: Test list_courses
        call_courses = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": "list_courses",
                "arguments": {}
            },
            "id": 3
        }
        print("Testing list_courses...")
        proc.stdin.write(json.dumps(call_courses) + "\n")
        proc.stdin.flush()
        stdout_line = proc.stdout.readline()
        call_resp = json.loads(stdout_line)
        result = call_resp.get("result", {})
        assert not result.get("isError", False), f"list_courses failed: {result}"
        courses_data = json.loads(result.get("content", [])[0].get("text", "[]"))
        print(f"Found {len(courses_data)} active courses.")
        if courses_data:
            print(f"First course: {courses_data[0]}")
            course_id = courses_data[0].get("id")
            
            # Step 4: Test list_assignments
            call_assignments = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_assignments",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 4
            }
            print(f"Testing list_assignments for course {course_id}...")
            proc.stdin.write(json.dumps(call_assignments) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_assignments failed: {result}"
            assignments_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(assignments_data)} assignments in course {course_id}.")
            if assignments_data:
                print(f"First assignment: {assignments_data[0]}")
                
            # Step 5: Test get_user_grades
            call_grades = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "get_user_grades",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 5
            }
            print(f"Testing get_user_grades for course {course_id}...")
            proc.stdin.write(json.dumps(call_grades) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"get_user_grades failed: {result}"
            grades_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(grades_data)} submission grades in course {course_id}.")
            # Step 6: Test list_modules
            call_modules = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_modules",
                    "arguments": {
                        "course_id": course_id,
                        "include_items": True
                    }
                },
                "id": 6
            }
            print(f"Testing list_modules for course {course_id}...")
            proc.stdin.write(json.dumps(call_modules) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_modules failed: {result}"
            modules_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(modules_data)} modules.")
            if modules_data:
                print(f"First module: {modules_data[0]}")

            # Step 7: Test list_files
            call_files = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_files",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 7
            }
            print(f"Testing list_files for course {course_id}...")
            proc.stdin.write(json.dumps(call_files) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_files failed: {result}"
            files_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(files_data)} files.")
            if files_data:
                print(f"First file: {files_data[0]}")

            # Step 8: Test list_discussion_topics
            call_topics = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_discussion_topics",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 8
            }
            print(f"Testing list_discussion_topics for course {course_id}...")
            proc.stdin.write(json.dumps(call_topics) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_discussion_topics failed: {result}"
            topics_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(topics_data)} discussion topics.")
            if topics_data:
                print(f"First discussion topic: {topics_data[0]}")

            # Step 9: Test list_announcements
            call_announcements = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_announcements",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 9
            }
            print(f"Testing list_announcements for course {course_id}...")
            proc.stdin.write(json.dumps(call_announcements) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_announcements failed: {result}"
            announcements_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(announcements_data)} announcements.")
            if announcements_data:
                print(f"First announcement: {announcements_data[0]}")

            # Step 10: Test list_pages
            call_pages = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_pages",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 10
            }
            print(f"Testing list_pages for course {course_id}...")
            proc.stdin.write(json.dumps(call_pages) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_pages failed: {result}"
            pages_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(pages_data)} pages.")
            if pages_data:
                print(f"First page: {pages_data[0]}")
                page_url = pages_data[0].get("url")
                
                # Step 11: Test get_page
                call_get_page = {
                    "jsonrpc": "2.0",
                    "method": "tools/call",
                    "params": {
                        "name": "get_page",
                        "arguments": {
                            "course_id": course_id,
                            "url_or_id": page_url
                        }
                    },
                    "id": 11
                }
                print(f"Testing get_page for url/id '{page_url}'...")
                proc.stdin.write(json.dumps(call_get_page) + "\n")
                proc.stdin.flush()
                stdout_line = proc.stdout.readline()
                call_resp = json.loads(stdout_line)
                result = call_resp.get("result", {})
                assert not result.get("isError", False), f"get_page failed: {result}"
                page_detail = json.loads(result.get("content", [])[0].get("text", "{}"))
                print(f"Retrieved page: '{page_detail.get('title')}' with content length {len(page_detail.get('body', ''))} chars.")

            # Step 12: Test list_quizzes
            call_quizzes = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": "list_quizzes",
                    "arguments": {
                        "course_id": course_id
                    }
                },
                "id": 12
            }
            print(f"Testing list_quizzes for course {course_id}...")
            proc.stdin.write(json.dumps(call_quizzes) + "\n")
            proc.stdin.flush()
            stdout_line = proc.stdout.readline()
            call_resp = json.loads(stdout_line)
            result = call_resp.get("result", {})
            assert not result.get("isError", False), f"list_quizzes failed: {result}"
            quizzes_data = json.loads(result.get("content", [])[0].get("text", "[]"))
            print(f"Found {len(quizzes_data)} quizzes.")
            if quizzes_data:
                print(f"First quiz: {quizzes_data[0]}")
                
        else:
            print("No active courses found to perform full testing.")
            
        print("ALL MCP SERVER TESTS PASSED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"Exception during test: {e}")
        proc.terminate()
        stderr_output = proc.stderr.read()
        print(f"Stderr output from server:\n{stderr_output}")
        sys.exit(1)
        
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    test_mcp_server()
