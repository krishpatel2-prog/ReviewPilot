from groq import Groq
from app.core.config import settings
from app.github.pr_service import PullRequestService
import json
import re

class ReviewService:

    def __init__(self):
        self.pr_service = PullRequestService()
        self.client = Groq(api_key=settings.GROQ_API_KEY)#talks to Groq LLM

    def review_pr(self, repo: str, pr_number: int):

        pr_data = self.pr_service.get_pr_data(repo, pr_number)
        prompt= self.build_prompt(pr_data)

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior code reviewer. Always return valid JSON with ALL fields."
                },
                {
                    "role": "user",
                    "content": prompt
                }
                      ],
        )

# you'll use this every time you call an LLM and expect JSON back:

        #Extracts the raw text the LLM returned.
        content = response.choices[0].message.content
        # Finds the JSON block inside that text — handles cases where LLM adds extra text around the JSON.
        match = re.search(r"\{.*\}", content, re.DOTALL)

        if not match:
          raise ValueError("No JSON found in LLM output")

        try:
            #Converts the JSON string into a Python dictionary.
            review = json.loads(match.group(0))

            comment = self.format_review_comment(review)

            self.pr_service.post_pr_comment(repo, pr_number, comment)
            # ✅ new AI-driven inline comment
            self.post_inline_comments(repo, pr_number, pr_data)

            return review

        except Exception as e:
            print("ERROR:", e)
            return {
                "summary": "LLM output could not be parsed",
                "issues": [],
                "suggestions": [],
                "risk": "unknown",
                "risk_reason": "Model did not return valid JSON"
            }



    def format_review_comment(self, review: dict) -> str:
        issues = "\n".join(f"- {i}" for i in review['issues']) or "None"
        suggestions = "\n".join(f"- {s}" for s in review['suggestions']) or "None"

        return f"""## 🤖 AI Code Review by ReviewPilot
### 📌 Summary
{review['summary']}

### ⚠️ Issues
{issues}

### 💡 Suggestions
{suggestions}

### 🔥 Risk Level: `{review['risk'].upper()}`
> {review.get('risk_reason', 'Not provided')}

---
*Powered by ReviewPilot 🤖*
"""

    def post_inline_comments(self, repo: str, pr_number: int, pr_data: dict):

        # step 1 - ask AI which lines matter most
        inline_prompt = self.build_inline_prompt(pr_data)

        inline_response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": inline_prompt}],
        )

        inline_content = inline_response.choices[0].message.content

        inline_match = re.search(r"\[.*\]", inline_content, re.DOTALL)

        if not inline_match:
            print("No inline JSON array found")
            print("RAW INLINE CONTENT:", inline_content)
            return

        inline_json = json.loads(inline_match.group(0))
        print("INLINE FINDINGS:", inline_json)

        # step 2 - get files and commit id
        files = self.pr_service.get_pr_files(repo, pr_number)
        pr = self.pr_service.get_pr_details(repo, pr_number)
        commit_id = pr["head"]["sha"]

        # step 3 - loop through each finding
        for finding in inline_json:

            for file in files:
                if file["filename"] == finding["file"] and file.get("patch"):

                    patch_lines = file["patch"].split("\n")
                    current_line = 0

                    for patch_line in patch_lines:

                        # parse @@ header to get real file line number
                        if patch_line.startswith("@@"):
                            match = re.search(r"\+(\d+)", patch_line)
                            if match:
                                current_line = int(match.group(1)) - 1
                            continue

                        if patch_line.startswith("-"):
                            continue  # deleted lines don't exist in new file

                        current_line += 1

                        if finding["line_hint"].strip() in patch_line:
                            print(f"POSTING ON: {file['filename']} line {current_line}")
                            self.pr_service.post_inline_comment(
                                repo,
                                pr_number,
                                commit_id,
                                file["filename"],
                                current_line,
                                f"🤖 {finding['comment']}"
                            )
                            break


    def build_prompt(self, pr_data):
        return f"""
        You are a senior software engineer reviewing a pull request.

        PR Title:
        {pr_data["title"]}

        PR Description:
        {pr_data["description"]}

        Files Changed:
        {pr_data["files_changed"]}
        
        CHANGE STATS:
        - Files changed: {pr_data["changed_files_count"]}
        - Additions: {pr_data["additions"]}
        - Deletions: {pr_data["deletions"]}


        Code Diff:
        {pr_data["diff"]}

         Rules for risk assessment:
        - Test-only changes → low risk
        - Large code changes → higher risk
        - Core logic changes without tests → high risk
        - Small, isolated changes → low risk
        
        Output format — ALL fields are REQUIRED:
        {{
          "summary": "What changed and why in 2-3 sentences",
          "issues": ["concrete issue from the diff"],
          "suggestions": ["specific suggestion tied to the code"],
          "risk": "low | medium | high",
          "risk_reason": "e.g. 93 additions in core logic with no new tests = medium risk"
        }}

        CRITICAL: risk_reason is MANDATORY. It must reference the actual numbers:
        {pr_data["additions"]} additions, {pr_data["deletions"]} deletions, {pr_data["changed_files_count"]} files changed.
        Do NOT omit it. Do NOT leave it empty.
        
        Output requirements:

        - Summary must be 2–3 sentences explaining WHAT changed and WHY.
        - List real, concrete issues based on the diff (not generic advice).
        - Give specific improvement suggestions tied to the changed code.
        - Use the change stats when deciding the risk.
        - Always provide a short risk_reason.
        - risk_reason is mandatory and must explain the risk using the change stats and type of modification.
        
        Return ONLY valid JSON.
        The response must start with {{ and end with }}.
        """

    def build_inline_prompt(self, pr_data):
        return f"""
    You are a senior code reviewer.

    Find the most important issues in this pull request.
    
    Return ONLY valid JSON as an array:
    
    [
      {{
        "file": "exact file path",
        "line_hint": "exact changed line text",
        "comment": "short actionable review comment"
      }}
    ]
    
    Rules:
    - Max 5 findings
    - Only real issues (no style nits)
    - Use changed lines only
    
    Diff:
    {pr_data["diff"]}
    """

