const PHONE_KEY = 'smart_shop_phone';
const CUSTOMER_ID_KEY = 'smart_shop_customer_id';
const ADMIN_KEY = 'smart_shop_admin';

export const ADMIN_LOGIN = 'admin';
export const ADMIN_PASSWORD = 'admin';

export function getPhone(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PHONE_KEY);
}

export function getCustomerId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CUSTOMER_ID_KEY);
}

export function setAuth(phone: string, customerId: string) {
  localStorage.setItem(PHONE_KEY, phone);
  localStorage.setItem(CUSTOMER_ID_KEY, customerId);
  window.dispatchEvent(new Event('auth-changed'));
}

export function logout() {
  localStorage.removeItem(PHONE_KEY);
  localStorage.removeItem(CUSTOMER_ID_KEY);
  window.dispatchEvent(new Event('auth-changed'));
}

export function isLoggedIn(): boolean {
  return !!getPhone();
}

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_KEY) === '1';
}

export function setAdmin() {
  localStorage.setItem(ADMIN_KEY, '1');
  window.dispatchEvent(new Event('auth-changed'));
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event('auth-changed'));
}
