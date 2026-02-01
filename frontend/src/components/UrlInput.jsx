import React, { useState } from "react";

function UrlInput({ onShorten, loading }) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading && isValidUrl(url)) {
      onShorten(url.trim());
    }
  };

  const isValidUrl = (string) => {
    if (!string) return false;
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const showValidation = url.length > 0;
  const isValid = isValidUrl(url);
  const canSubmit = url.trim() && isValid && !loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="https://example.com/your-long-url"
          disabled={loading}
          className={`
            w-full px-5 py-4 rounded-xl text-base outline-none 
            transition-all duration-200 
            border-2
            ${isFocused 
              ? 'border-blue-500 dark:border-blue-400' 
              : showValidation && !isValid 
              ? 'border-red-500 dark:border-red-400'
              : 'border-zinc-300 dark:border-zinc-600'
            }
            bg-white dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
          style={{ fontFamily: 'var(--font-mono)' }}
        />
        
        {/* URL Icon - only show when empty */}
        {!url && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {showValidation && !isValid && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Please enter a valid URL (e.g., https://example.com)</span>
        </div>
      )}

      {/* Submit Button - Only visible when URL is valid */}
      {canSubmit && (
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-base
            transition-all duration-200
            flex items-center justify-center gap-3
            bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600
            text-white
            shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30
            hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
            active:scale-98
            disabled:opacity-60 disabled:cursor-not-allowed
            disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500
          `}
        >
          {loading ? (
            <>
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
              </div>
              <span>Shortening URL...</span>
            </>
          ) : (
            <>
            <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg> 
              <span>Shorten URL</span>
            </>
          )}
        </button>
      )}

      {/* Helper Text - Only show when input is empty */}
      {!url && !loading && (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Paste your long URL above to get started
        </p>
      )}
    </form>
  );
}

export default UrlInput;