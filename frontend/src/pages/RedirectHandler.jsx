import { useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RedirectHandler() {
  const { shortCode } = useParams();

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/${shortCode}`);
        const data = await res.json();

        if (data?.originalUrl) {
          window.location.href = data.originalUrl;
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        window.location.href = "/";
      }
    };

    redirect();
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}
