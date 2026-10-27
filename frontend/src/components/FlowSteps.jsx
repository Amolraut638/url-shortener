import React from "react";
import { Check, Loader2 } from "lucide-react";

const STEP_ICONS = ["", "", "", "", "", ""];

function FlowSteps({ steps, currentStep, completedSteps = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {steps.map((step, index) => {
        const isActive    = currentStep === index;
        const isCompleted = completedSteps.includes(index);
        const isPending   = index > currentStep && !isCompleted;

        return (
          <div
            key={step.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 7,
              backgroundColor: isActive ? "var(--accent-muted)" : "transparent",
              opacity: isPending ? 0.38 : 1,
              transition: "opacity 0.2s ease, background-color 0.2s ease",
            }}
          >
            {/* Status dot / icon */}
            <div style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isCompleted
                ? "var(--success)"
                : isActive
                ? "var(--accent)"
                : "var(--border)",
              transition: "background-color 0.2s ease",
            }}>
              {isCompleted ? (
                <Check size={11} color="#fff" strokeWidth={3} />
              ) : isActive ? (
                <Loader2 size={11} color="#fff" style={{ animation: "spin 0.8s linear infinite" }} />
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--text-3)", display: "block" }} />
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isCompleted
                  ? "var(--success)"
                  : isActive
                  ? "var(--accent)"
                  : "var(--text-2)",
                fontFamily: "var(--font-mono)",
                transition: "color 0.2s ease",
                flex: 1,
              }}
            >
              {step.label}
            </span>

            {/* Active progress bar */}
            {isActive && (
              <div style={{ width: 48, height: 3, borderRadius: 99, backgroundColor: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                <div style={{
                  height: "100%",
                  borderRadius: 99,
                  backgroundColor: "var(--accent)",
                  animation: `progressFill ${step.duration}ms linear forwards`,
                }} />
              </div>
            )}

            {/* Completed tick badge */}
            {isCompleted && !isActive && (
              <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>done</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FlowSteps;