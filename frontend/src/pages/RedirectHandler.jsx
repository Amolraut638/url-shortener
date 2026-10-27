import { useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RedirectHandler() {
  const { shortCode } = useParams();

  useEffect(() => {
    const redirect = async () => {
      try {
        // The redirect route is /:shortCode at the ROOT level, NOT /api/:shortCode
        const res = await fetch(`${API_BASE}/${shortCode}`, {
          redirect: "follow",
        });

        // If the server redirected us, the browser follows it automatically.
        // But since fetch follows redirects, we check the final URL.
        if (res.redirected) {
          window.location.href = res.url;
        } else if (res.ok) {
          // Fallback: try to parse JSON (for API-style responses)
          const data = await res.json().catch(() => null);
          if (data?.originalUrl) {
            window.location.href = data.originalUrl;
          } else {
            window.location.href = "/";
          }
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
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
