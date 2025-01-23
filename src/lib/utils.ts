import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, { ...init, credentials: "include" });

  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.reload();
    return Promise.reject(new Error("Unauthorized"));
  }

  return response;
}
