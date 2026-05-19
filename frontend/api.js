/**
 * API base URL: same origin when Express serves the app on :3000,
 * otherwise call the backend at localhost:3000.
 */
const API_BASE_URL =
  window.location.port === '3000'
    ? ''
    : `${window.location.protocol}//${window.location.hostname}:3000`;

function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function requireLogin(redirectTo = 'auth.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  return { response, data };
}
