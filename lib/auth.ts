export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}

export function mockLogin(email: string): void {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", email);
}

export function mockLogout(): void {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
}
