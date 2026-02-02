const API_BASE = import.meta.env.VITE_API_BASE_URL;

// src/services/api.js
export const shortenUrl = async (url) => {
  const response = await fetch(`${API_BASE}/api/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }

  return response.json();
};
