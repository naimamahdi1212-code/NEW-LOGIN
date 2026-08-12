# Web Dev 101 — login-gated info site (Appwrite auth)

Plain HTML/CSS/JS front end. Magic-link (passwordless) auth via Appwrite.

## Files

- `login.html` — email entry, sends the magic link
- `verify.html` — the redirect target the emailed link points to; completes the login
- `index.html` — protected homepage (high-level "what is web dev")
- `about.html` — protected about page (frontend vs backend, tools) + logout button
- `css/style.css` — shared styling
- `js/appwrite-config.js` — your endpoint + project ID go here
- `js/auth.js` — shared login/session helpers

## Setup

1. **Create an Appwrite project**
   Go to [cloud.appwrite.io](https://cloud.appwrite.io) → create a new project. Note the
   **Project ID** and the **API endpoint** shown in Project Settings → General (endpoint
   looks like `https://<region>.cloud.appwrite.io/v1`).

2. **Fill in `js/appwrite-config.js`**
   Paste your endpoint and project ID into the two constants at the top of the file.

3. **Register this site as a Web platform**
   In the Appwrite console: your project → Overview → **Add platform** → Web app.
   Add the hostname you'll deploy to (e.g. `your-site.vercel.app`), and `localhost`
   while you're testing locally. Appwrite rejects requests from hostnames that
   aren't registered here — this is the step people forget, same as the Supabase
   redirect URL step.

4. **Confirm Magic URL login is available**
   It's enabled by default on new projects (Auth → the Magic URL method should
   already be on). If your project uses self-hosted Appwrite rather than Appwrite
   Cloud, you'll also need SMTP configured so it can actually send the email.

5. **Push to GitHub, deploy to Vercel**
   Same as always — this is a static site, so no build step or environment
   variables are required on Vercel (the config lives in `appwrite-config.js`
   since it's not a secret — it's the same public project ID/endpoint your
   browser sends on every request either way).

6. **Test the flow**
   - Visit the live site → land on `login.html`
   - Enter your email → check inbox/spam → click the link
   - You should land on `verify.html` briefly, then `index.html`, logged in
   - Try visiting `index.html` or `about.html` directly in an incognito window
     → you should get bounced to `login.html`
   - Log out from the About page → confirm you're back at login

## How the pieces fit together

- `login.html` calls `account.createMagicURLToken()`, which emails a link
  pointing at `verify.html?userId=...&secret=...`
- `verify.html` reads those two params and calls `account.createSession()` to
  turn them into a real logged-in session, then redirects to `index.html`
- `index.html` and `about.html` both call `requireAuth()` on load, which asks
  Appwrite "is there a valid session?" and bounces to `login.html` if not
- `about.html`'s logout button calls `account.deleteSession('current')`
