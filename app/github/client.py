import httpx
from app.core.config import settings

BASE_URL = "https://api.github.com"

class GithubClient:

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
        }

    def get(self, url: str):
        response = httpx.get(f"{BASE_URL}{url}", headers=self.headers,follow_redirects=True)
        response.raise_for_status() #for type of error
        return response.json()

    def get_diff(self, url:str):
        #Take existing headers,and override the Accept type.
        headers = self.headers | {
            "Accept": "application/vnd.github.v3.diff",
        }
        response = httpx.get(f"{BASE_URL}{url}", headers=headers ,follow_redirects=True)
        response.raise_for_status()
        return response.text

