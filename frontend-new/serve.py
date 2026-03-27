import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


FRONTEND_DIR = Path(__file__).resolve().parent


class FrontendHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path in {"/", ""}:
            self.path = "/homepage.html"
        return super().do_GET()


def main() -> None:
    host = os.getenv("FRONTEND_HOST", "127.0.0.1")
    port = int(os.getenv("FRONTEND_PORT", "5500"))
    handler = partial(FrontendHandler, directory=str(FRONTEND_DIR))
    server = ThreadingHTTPServer((host, port), handler)

    print(f"ReviewPilot frontend running at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
