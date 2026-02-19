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
            "diff":diff
        }