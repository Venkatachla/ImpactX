import os
import re
from git import Repo

class ChangeAnalyzer:
    @staticmethod
    def detect_change(repo_path: str, diff_mode: str = "demo"):
        """
        Analyzes the changes in the repo.
        """
        try:
            repo = Repo(repo_path)
            
            # Print rev-parse information as requested
            try:
                head_sha = repo.git.rev_parse("HEAD")
                print(f"[ChangeAnalyzer] git rev-parse HEAD: {head_sha}")
            except Exception as e:
                print(f"[ChangeAnalyzer] Failed to resolve HEAD: {str(e)}")
                
            try:
                head_parent_sha = repo.git.rev_parse("HEAD~1")
                print(f"[ChangeAnalyzer] git rev-parse HEAD~1: {head_parent_sha}")
            except Exception as e:
                print(f"[ChangeAnalyzer] Failed to resolve HEAD~1: {str(e)}")
                
            diffs = []
            if diff_mode == "git-commit":
                commits = list(repo.iter_commits(max_count=1))
                if not commits:
                    raise Exception("No commits found in repository history.")
                if not commits[0].parents:
                    raise Exception("Latest commit comparison unavailable because this repository does not contain enough accessible commit history.")
                
                print(f"[ChangeAnalyzer] Running git diff --name-status HEAD~1 HEAD")
                name_status = repo.git.diff("--name-status", "HEAD~1", "HEAD")
                print(f"[ChangeAnalyzer] Diff Name Status:\n{name_status}")
                
                diffs = commits[0].parents[0].diff(commits[0], create_patch=True)
            else:
                diffs = repo.index.diff(None, create_patch=True) + repo.index.diff('HEAD', create_patch=True)
            
            changes = []
            for diff in diffs:
                path = diff.b_path or diff.a_path
                if not path:
                    continue
                path_clean = path.replace("\\", "/")
                
                if path_clean.endswith((".java", ".ts", ".tsx", ".js", ".py", ".json", ".properties", ".xml", ".yml", ".yaml")):
                    diff_text = diff.diff.decode('utf-8', errors='ignore') if isinstance(diff.diff, bytes) else str(diff.diff)
                    
                    rename_match = re.search(r'-(\s*\w+)\s*;\s*\n\+(\s*\w+)\s*;', diff_text)
                    if rename_match:
                        changes.append({
                            "file": path_clean,
                            "symbol": rename_match.group(1).strip(),
                            "changeType": "FIELD_RENAMED",
                            "oldValue": rename_match.group(1).strip(),
                            "newValue": rename_match.group(2).strip(),
                            "lines": [1, 10]
                        })
                    else:
                        changes.append({
                            "file": path_clean,
                            "symbol": os.path.basename(path_clean),
                            "changeType": "GENERIC_FILE_CHANGE",
                            "oldValue": "original",
                            "newValue": "modified",
                            "lines": [1, 5]
                        })
            
            repo.close()
            return changes
        except Exception as e:
            repo.close()
            raise e
        return []
