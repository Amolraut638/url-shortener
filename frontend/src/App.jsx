import React from "react";
import { Link2 } from "lucide-react";
import DarkModeToggle from "./components/DarkModeToggle";
import UrlInput from "./components/UrlInput";
import FlowSteps from "./components/FlowSteps";
import ShortUrlResult from "./components/ShortUrlResult";
import { useShortenFlow } from "./hooks/useShortenFlow";

function App() {
  const flow = useShortenFlow();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text-1)" }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              backgroundColor: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Link2 size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em", color: "var(--text-1)" }}>
              ZipURL
            </span>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Hero */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.25,
            marginBottom: 10,
            color: "var(--text-1)"
          }}>
            Shorten any link,<br />share it anywhere.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>
            Paste a long URL below and get a clean, shareable short link in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="card animate-fade-up delay-1" style={{ padding: 24, marginBottom: 16 }}>
          <UrlInput onShorten={flow.start} loading={flow.loading} />
        </div>

        {/* Processing Pipeline */}
        {(flow.currentStep >= 0 || flow.completedSteps.length > 0) && (
          <div className="card animate-fade-in" style={{ padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", marginBottom: 16, margin: "0 0 14px" }}>
              Processing
            </p>
            <FlowSteps
              steps={flow.steps}
              currentStep={flow.currentStep}
              completedSteps={flow.completedSteps}
            />
          </div>
        )}

        {/* Result */}
        {flow.shortUrl && (
          <div className="animate-fade-up">
            <ShortUrlResult shortUrl={flow.shortUrl} onReset={flow.reset} />
          </div>
        )}

        {/* Error */}
        {flow.error && (
          <div className="card animate-fade-in" style={{
            padding: "14px 16px",
            borderColor: "var(--error)",
            backgroundColor: "var(--error-muted)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 13, color: "var(--error)", fontWeight: 500 }}>
              {flow.error}
            </span>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "18px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>
          Built with PostgreSQL · Redis · React
        </p>
      </footer>

    </div>
  );
}

export default App;
