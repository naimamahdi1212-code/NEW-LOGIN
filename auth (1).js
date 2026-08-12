/* ============================================
   Shared Appwrite auth helpers
   Requires appwrite-config.js and the Appwrite
   CDN script to be loaded first.
   ============================================ */

const { Client, Account, ID } = Appwrite;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);

/**
 * Sends a magic login link to the given email.
 * The user will be redirected to verify.html after clicking it.
 */
async function sendMagicLink(email) {
  const redirectUrl = new URL("verify.html", window.location.href).toString();
  return account.createMagicURLToken(ID.unique(), email, redirectUrl);
}

/**
 * Completes login using the userId + secret Appwrite appends
 * to the redirect URL after the user clicks the magic link.
 */
async function completeMagicLinkLogin(userId, secret) {
  return account.createSession(userId, secret);
}

/**
 * Guards a protected page. Redirects to login.html if there's
 * no active session. Returns the current user if logged in.
 */
async function requireAuth() {
  try {
    const user = await account.get();
    return user;
  } catch (err) {
    window.location.href = "login.html";
    return null;
  }
}

/**
 * If a session already exists, skip the login page.
 */
async function redirectIfLoggedIn(destination = "index.html") {
  try {
    await account.get();
    window.location.href = destination;
  } catch (err) {
    // no active session — stay on the login page
  }
}

async function logout() {
  try {
    await account.deleteSession("current");
  } finally {
    window.location.href = "login.html";
  }
}
