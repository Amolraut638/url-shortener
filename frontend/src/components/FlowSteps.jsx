import React from "react";

function FlowSteps({ steps, currentStep, completedSteps = [] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = completedSteps.includes(index);
        const isPending = index > currentStep;

        return (
          <div
            key={step.id}
            className={`
              relative flex items-center gap-4 p-4 rounded-xl
              transition-all duration-500 transform
              ${isActive ? 'scale-[1.02]' : 'scale-100'}
              ${isCompleted ? 'opacity-100' : isPending ? 'opacity-40' : 'opacity-100'}
            `}
            style={{
              backgroundColor: isActive 
                ? 'rgba(59, 130, 246, 0.1)' 
                : isCompleted 
                ? 'rgba(16, 185, 129, 0.05)' 
                : 'transparent',
              borderLeft: isActive 
                ? '3px solid var(--accent)' 
                : isCompleted 
                ? '3px solid var(--success)' 
                : '3px solid var(--border)'
            }}
          >
            {/* Icon/Status Indicator */}
            <div className="flex-shrink-0 relative">
              {/* Pulse animation for active step */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30"></div>
              )}
              
              <div 
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  text-xl font-semibold transition-all duration-300
                  ${isActive ? 'ring-4 ring-blue-500/30' : ''}
                `}
                style={{
                  backgroundColor: isCompleted 
                    ? 'var(--success)' 
                    : isActive 
                    ? 'var(--accent)' 
                    : 'var(--bg-secondary)',
                  color: isActive || isCompleted ? 'white' : 'var(--text-secondary)'
                }}
              >
                {isCompleted ? (
                  // Checkmark with animation
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
            </div>

            {/* Step Label and Progress */}
            <div className="flex-1 min-w-0">
              <p 
                className={`
                  font-medium transition-all duration-300
                  ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                `}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem'
                }}
              >
                {step.label}
              </p>
              
              {/* Progress bar for active step */}
              {isActive && (
                <div 
                  className="mt-2 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--border)' }}
                >
                  <div 
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      animation: `progressBar ${step.duration}ms linear forwards`,
                      transformOrigin: 'left'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Loading spinner for active step */}
            {isActive && (
              <div className="flex-shrink-0">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Success checkmark for completed steps */}
            {isCompleted && !isActive && (
              <div className="flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-green-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FlowSteps;