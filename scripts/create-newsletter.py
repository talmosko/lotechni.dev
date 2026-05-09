#!/usr/bin/env python3
"""
Create and send a lotechni.dev newsletter via MailerLite API.
Uses the TEMPLATE CAMPAIGN (copy → update → send) for true reuse.

The template campaign is a permanent draft in MailerLite containing:
  - Logo (hermes-bucket.tmosko.com/lotechni/logo.png)
  - Dark theme + RTL + responsive design
  - 11 box components (highlight, insight, code, tip, warning, stat, quote, link, step, compare, teaser)

ONE SOURCE OF TRUTH: The template lives ONLY in MailerLite (campaign ID below).
The local newsletter-template.html is a reference copy for version control — it is NOT used by this script.
When you update the template design, edit it in MailerLite. This script fetches the template HTML fresh every run.

Workflow:
  1. Fetch template HTML from MailerLite template campaign
  2. Insert content into template
  3. Copy template campaign → new draft
  4. Update new draft with full HTML
  5. (Optional) Send

Usage:
    python3 scripts/create-newsletter.py "כותרת" "<html_content>"
    python3 scripts/create-newsletter.py "כותרת" "<html_content>" --send
    cat content.html | python3 scripts/create-newsletter.py "כותרת" -
"""

import sys, os, json, requests
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

# ── Config ──
API_KEY = os.getenv("MAILERLITE_API_KEY")
if not API_KEY:
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("MAILERLITE_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip()
                break

if not API_KEY:
    print("ERROR: MAILERLITE_API_KEY not found in .env or environment", file=sys.stderr)
    sys.exit(1)

API_BASE = "https://connect.mailerlite.com/api"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Template campaign ID (permanent draft — never send this one)
TEMPLATE_CAMPAIGN_ID = "186999246575109911"


def fetch_campaign_html(campaign_id: str) -> str:
    """Fetch the full HTML content from a MailerLite campaign (ONE SOURCE OF TRUTH)."""
    resp = requests.get(
        f"{API_BASE}/campaigns/{campaign_id}",
        headers=HEADERS,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["data"]["emails"][0]["content"]


def wrap_content(title: str, body_html: str) -> str:
    """
    Fetch the template FROM MAILERLITE (not local file), then insert content.
    The logo, colors, and layout come from the template campaign automatically.
    """
    template = fetch_campaign_html(TEMPLATE_CAMPAIGN_ID)
    placeholder = "<!-- CONTENT (replace this entire section)  -->"
    content_block = f"""<!-- CONTENT (replace this entire section)  -->
  <h1>{title}</h1>

  {body_html}
"""
    return template.replace(placeholder, content_block, 1)


def copy_template_campaign() -> dict:
    """Copy the template campaign to create a new draft."""
    resp = requests.post(
        f"{API_BASE}/campaigns/{TEMPLATE_CAMPAIGN_ID}/copy",
        headers=HEADERS,
    )
    resp.raise_for_status()
    return resp.json()


def update_campaign(campaign_id: str, name: str, subject: str, html_content: str) -> dict:
    """Update a campaign with new name, subject, and HTML content."""
    payload = {
        "name": name,
        "subject": subject,
        "language": "he",
        "emails": [{
            "subject": subject,
            "from_name": "לא טכני ולא במקרה",
            "from": "info@lotechni.dev",
            "content": html_content,
        }]
    }
    resp = requests.put(
        f"{API_BASE}/campaigns/{campaign_id}",
        headers=HEADERS,
        json=payload,
    )
    resp.raise_for_status()
    return resp.json()


def send_campaign(campaign_id: str) -> dict:
    """Send a campaign immediately (recipients must already be assigned)."""
    resp = requests.post(
        f"{API_BASE}/campaigns/{campaign_id}/actions/send",
        headers=HEADERS,
    )
    resp.raise_for_status()
    return resp.json()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    title = sys.argv[1]

    # Read body from argument or stdin
    if len(sys.argv) >= 3 and sys.argv[2] != "-" and sys.argv[2] != "--send":
        body_html = sys.argv[2]
    elif len(sys.argv) >= 3 and sys.argv[2] == "-":
        body_html = sys.stdin.read()
    elif len(sys.argv) >= 2 and sys.argv[1] == "-":
        body_html = sys.stdin.read()
    else:
        body_html = sys.stdin.read() if not sys.stdin.isatty() else ""

    should_send = "--send" in sys.argv or os.getenv("SEND") == "1"

    # Step 1: Copy template campaign
    print(f"📋 Copying template campaign {TEMPLATE_CAMPAIGN_ID}...")
    copy_result = copy_template_campaign()
    new_id = copy_result["data"]["id"]
    print(f"   New campaign: {new_id}")

    # Step 2: Wrap content in template
    subject = f"לא טכני — {title}"
    if body_html:
        full_html = wrap_content(title, body_html)
    else:
        full_html = wrap_content(title, "<p>תוכן הניוזלטר כאן</p>")
        print("   ⚠️  No content provided — using placeholder")

    # Step 3: Update name + content
    print(f"📝 Updating: {title}")
    update_campaign(new_id, title, subject, full_html)

    # Step 4: Optional send
    if should_send:
        print(f"📤 Sending...")
        send_campaign(new_id)
        print(f"✅ Sent!")
    else:
        print(f"✅ Campaign ready: {new_id}")
        print(f"   Subject: {subject}")
        print(f"   To send: python3 {__file__} '{title}' '<html>' --send")
        print(f"   Or via UI: https://app.mailerlite.com/campaigns/{new_id}")

    # Print summary
    print(f"\n📊 Summary:")
    print(f"   Template: 📋 תבנית: לא טכני — ניוזלטר")
    print(f"   Logo: https://hermes-bucket.tmosko.com/lotechni/logo.png")
    print(f"   Design: Dark theme · RTL · 11 boxes · Responsive")
