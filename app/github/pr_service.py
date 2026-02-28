import requests
#Imports the client you just built. This file doesn't know HOW to talk to GitHub — it just uses the client that already knows how. That's the whole point of separation.
from app.github.client import GithubClient

#“This class knows what a pull request means in my system.”
class PullRequestService:

    def __init__(self):
        self.client = GithubClient()

    def get_pr_data(self, repo: str, pr_number: int):

        pr = self.client.get(f"/repos/{repo}/pulls/{pr_number}")
        files=self.client.get(f"/repos/{repo}/pulls/{pr_number}/files")
        diff=self.client.get_diff(f"/repos/{repo}/pulls/{pr_number}")

        return {
            "title":pr["title"],
            "description":pr["body"],
            "files_changed":[f["filename"] for f in files],#From each file object, take only the filename.
            "additions":pr["additions"],
            "deletions":pr["deletions"],
            "changed_files_count":pr["changed_files"],
            "diff":diff
        }

    def post_pr_comment(self, repo: str, pr_number: int, body: str):
        return self.client.post(
            f"/repos/{repo}/issues/{pr_number}/comments",
            json={"body": body}
        )

#Fetches the list of files changed in the PR. Each file object from GitHub contains many fields but the two important ones are:Filename, patch
    def get_pr_files(self, repo:str, pr_number: int):
        return self.client.get(f"/repos/{repo}/pulls/{pr_number}/files")

    def get_pr_details(self, repo: str, pr_number: int):
        return self.client.get(f"/repos/{repo}/pulls/{pr_number}")

    def post_inline_comment(self, repo, pr_number, commit_id, path, line, body):

            return self.client.post(
                f"/repos/{repo}/pulls/{pr_number}/comments",
                json={
                    "body": body,
                    "commit_id": commit_id,
                    "path": path,
                    "line": line,
                    "side": "RIGHT"
                }
            )