import React, { useState } from "react";

function ShortUrlResult({ shortUrl, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!shortUrl) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div 
      className="glass rounded-2xl p-8 shadow-xl border-2 scale-in" 
      style={{ borderColor: 'var(--success)' }}
    >
      
      {/* Success Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: 'var(--success)', color: 'white' }}
        >
          ✓
        </div>
        <div>
          <h3 
            className="text-xl font-bold" 
            style={{ color: 'var(--success)' }}
          >
            Success!
          </h3>
          <p className="text-sm opacity-70">Your short URL is ready</p>
        </div>
      </div>

      {/* Short URL Display */}
      <div 
        className="rounded-xl p-6 mb-6" 
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <label className="text-xs uppercase font-semibold opacity-60 mb-2 block">
          Shortened URL
        </label>
        <div className="flex items-center gap-3">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xl font-semibold hover:underline break-all transition-colors"
            style={{ 
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {shortUrl}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`
            flex-1 min-w-[140px] py-3 px-6 rounded-xl font-semibold
            transition-all duration-300 transform
            hover:shadow-lg active:scale-95
            flex items-center justify-center gap-2
          `}
          style={{
            backgroundColor: copied ? 'var(--success)' : 'var(--accent)',
            color: 'white'
          }}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
              <span>Copy URL</span>
            </>
          )}
        </button>

        {/* Visit Button */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-6 rounded-xl font-semibold 
                     transition-all duration-300 transform 
                     hover:shadow-lg active:scale-95 
                     flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '2px solid var(--border)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
          <span>Visit</span>
        </a>

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="py-3 px-6 rounded-xl font-semibold 
                       transition-all duration-300 transform 
                       hover:shadow-lg active:scale-95 
                       flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '2px solid var(--border)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span>New</span>
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div 
        className="mt-6 pt-6 grid grid-cols-3 gap-4 text-center"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div>
          <p 
            className="text-2xl font-bold" 
            style={{ color: 'var(--success)' }}
          >
            {shortUrl.length}
          </p>
          <p className="text-xs opacity-60 mt-1">Characters</p>
        </div>
        <div>
          <p 
            className="text-2xl font-bold" 
            style={{ color: 'var(--success)' }}
          >
            ∞
          </p>
          <p className="text-xs opacity-60 mt-1">Valid Forever</p>
        </div>
        <div>
          <p 
            className="text-2xl font-bold" 
            style={{ color: 'var(--success)' }}
          >
            ⚡
          </p>
          <p className="text-xs opacity-60 mt-1">Lightning Fast</p>
        </div>
      </div>
    </div>
  );
}

export default ShortUrlResult;