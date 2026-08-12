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
 * Sends a 6-digit OTP code to the given email.
 * Returns the Appwrite Token object — its `userId` is needed
 * later to complete the session, so callers must hang onto it
 * (e.g. sessionStorage) until the code is submitted.
 */
async function sendEmailOtp(email) {
  return account.createEmailToken(ID.unique(), email);
}

/**
 * Completes login using the userId (from the createEmailToken
 * response) and the 6-digit code the user typed in.
 */
async function completeEmailOtpLogin(userId, otp) {
  return account.createSession(userId, otp);
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
