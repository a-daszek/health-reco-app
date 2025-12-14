import type { SignInFormData } from "./pages/SignIn";
import type { RegisterFormData } from "./pages/Register";
import type { BloodType, UserType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getAiRecommendation = async (blood: BloodType) => {
  const res = await fetch(`${API_BASE_URL}/api/recommendations/blood`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blood),
  });

  if (!res.ok) throw new Error("AI error");
  const data = await res.json();
  return data.recommendations;
};

export const deleteBloodResult = async (bloodId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/me/blood-tests/${bloodId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Nie udało się usunąć wyniku");
  }
};

export const getBloodResults = async (): Promise<BloodType[]> => {
  const res = await fetch(`${API_BASE_URL}/api/users/me/blood-tests`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Nie udało się pobrać wyników krwi");
  return res.json();
};

export const postBloodResult = async (
  payload: Partial<BloodType>
): Promise<BloodType> => {
  const res = await fetch(`${API_BASE_URL}/api/users/me/blood-tests`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.message) || "Błąd zapisu wyniku");
  }
  return res.json();
};

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Nie udało się uzyskać danych o użytkowniku");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out.");
  }
};
