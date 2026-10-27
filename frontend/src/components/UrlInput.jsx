import React, { useState } from "react";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";

function UrlInput({ onShorten, loading }) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = (s) => {
    if (!s) return false;
    try { new URL(s); return true; } catch { return false; }
  };

  const valid = isValid(url);
  const showError = touched && url.length > 0 && !valid;
  const canSubmit = valid && !loading;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (canSubmit) onShorten(url.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="url-input"
        style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 8 }}
      >
        Destination URL
      </label>

      {/* Input row */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setTouched(false); }}
            onBlur={() => setTouched(true)}
            placeholder="https://example.com/your-very-long-url-goes-here"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              border: `1.5px solid ${showError ? "var(--error)" : "var(--border)"}`,
              borderRadius: 8,
              outline: "none",
              backgroundColor: "var(--surface)",
              color: "var(--text-1)",
              transition: "border-color 0.15s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              if (!showError) e.target.style.borderColor = "var(--border-focus)";
            }}
            onBlurCapture={(e) => {
              if (!showError) e.target.style.borderColor = "var(--border)";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: canSubmit ? "var(--accent)" : "var(--border)",
            border: "none",
            borderRadius: 8,
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "background-color 0.15s ease",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = "var(--accent)"; }}
        >
          {loading ? (
            <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
          ) : (
            <ArrowRight size={15} strokeWidth={2.5} />
          )}
          {loading ? "Working…" : "Shorten"}
        </button>
      </div>

      {/* Inline error */}
      {showError && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <AlertCircle size={13} color="var(--error)" />
          <span style={{ fontSize: 13, color: "var(--error)" }}>
            Enter a valid URL starting with http:// or https://
          </span>
        </div>
      )}

      {/* Helper */}
      {!url && !loading && (
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-3)" }}>
          Supports any http or https URL
        </p>
      )}
    </form>
  );
}

export default UrlInput;