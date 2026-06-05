// Tab-scoped anonymous session ID. Never tied to user identity.
// Clears on tab close (sessionStorage).

const SESSION_KEY = "faa-rsp-session";

export function getSessionId(): string {
  if (typeof sessionStorage === "undefined") {
    return "ssr";
  }
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
