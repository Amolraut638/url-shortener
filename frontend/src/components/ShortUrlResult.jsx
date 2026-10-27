import React, { useState } from "react";
import { Copy, Check, ExternalLink, RotateCcw, Link2 } from "lucide-react";

function ShortUrlResult({ shortUrl, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!shortUrl) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shortUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayUrl = shortUrl.replace(/^https?:\/\//, "");

  return (
    <div className="card animate-fade-up" style={{ overflow: "hidden" }}>

      {/* Success banner */}
      <div style={{
        padding: "12px 20px",
        backgroundColor: "var(--success-muted)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          backgroundColor: "var(--success)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Check size={11} color="#fff" strokeWidth={3} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>
          Short link created
        </span>
      </div>

      {/* URL display */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          backgroundColor: "var(--surface-2)",
          borderRadius: 8,
          border: "1px solid var(--border)",
        }}>
          <Link2 size={14} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0 }} />
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              color: "var(--accent)",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayUrl}
          </a>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "0 20px 20px",
      }}>
        {/* Copy */}
        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: copied ? "var(--success)" : "var(--text-1)",
            backgroundColor: copied ? "var(--success-muted)" : "var(--surface-2)",
            border: `1px solid ${copied ? "var(--success)" : "var(--border)"}`,
            borderRadius: 7,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* Visit */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-1)",
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            textDecoration: "none",
            transition: "border-color 0.15s ease",
          }}
        >
          <ExternalLink size={13} strokeWidth={2} />
          Visit
        </a>

        {/* New link */}
        {onReset && (
          <button
            onClick={onReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-2)",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              borderRadius: 7,
              cursor: "pointer",
              marginLeft: "auto",
              transition: "color 0.15s ease",
            }}
          >
            <RotateCcw size={13} strokeWidth={2} />
            New link
          </button>
        )}
      </div>

      {/* Meta row */}
      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        gap: 20,
      }}>
        <MetaStat label="Length" value={`${displayUrl.length} chars`} />
        <MetaStat label="Expires" value="Never" />
        <MetaStat label="Clicks" value="Tracked" />
      </div>
    </div>
  );
}

function MetaStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>
        {value}
      </div>
    </div>
  );
}

export default ShortUrlResult;