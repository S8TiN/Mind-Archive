// src/cookies.js
// Returns the value of a cookie by name; '' if not found
export function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
}

// Also export as default (so either import style works)
export default getCookie;
