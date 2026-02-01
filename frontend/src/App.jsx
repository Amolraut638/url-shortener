import React from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import UrlInput from "./components/UrlInput";
import FlowSteps from "./components/FlowSteps";
import ShortUrlResult from "./components/ShortUrlResult";
import { useShortenFlow } from "./hooks/useShortenFlow";

function App() {
  const flow = useShortenFlow();
  
  return (
    <div className="min-h-screen transition-colors duration-300" 
         style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b fade-in" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              ZipURL
            </h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Create short links in seconds.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Long URLs made simple.
            </span>
          </h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Paste a URL and watch what happens behind the scenes until your link is ready.
          </p>
        </div>

        {/* URL Input Card */}
        <div className="glass rounded-2xl p-8 mb-8 shadow-xl fade-in" style={{ animationDelay: '0.2s' }}>
          <UrlInput onShorten={flow.start} loading={flow.loading} />
        </div>

        {/* Flow Steps Visualization */}
        {(flow.currentStep >= 0 || flow.completedSteps.length > 0) && (
          <div className="glass rounded-2xl p-8 mb-8 shadow-xl scale-in">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              Processing Pipeline
            </h3>
            <FlowSteps
              steps={flow.steps}
              currentStep={flow.currentStep}
              completedSteps={flow.completedSteps}
            />
          </div>
        )}

        {/* Result */}
        {flow.shortUrl && (
          <div className="scale-in">
            <ShortUrlResult shortUrl={flow.shortUrl} onReset={flow.reset} />
          </div>
        )}

        {/* Error */}
        {flow.error && (
          <div className="glass rounded-2xl p-6 border-2 scale-in" 
               style={{ 
                 borderColor: 'var(--error)',
                 backgroundColor: 'rgba(239, 68, 68, 0.1)' 
               }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl"></span>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--error)' }}>
                  Error
                </h4>
                <p style={{ color: 'var(--error)' }}>{flow.error}</p>
              </div>
            </div>
          </div>
        )}  

      </main>

    </div>
  );
}

export default App;
