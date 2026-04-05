export function getUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setUser(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}