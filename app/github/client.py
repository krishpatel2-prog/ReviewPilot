import httpx
from app.core.config import settings

BASE_URL = "https://api.github.com"

class GithubClient:

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",#header → how you prove who you are to any API
            "Accept": "application/vnd.github.v3+json",#header → what format you want back
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

    def post(self, url: str, json: dict):
        response = httpx.post(f"{BASE_URL}{url}", headers=self.headers, json=json)
        response.raise_for_status()
        return response.json()