import { useState } from "react";
import { shortenUrl } from "../services/api";

const STEPS = [
  { 
    id: 1, 
    label: "Sending request to server",
    icon: "",
    duration: 600
  },
  { 
    id: 2, 
    label: "Validating URL",
    icon: "",
    duration: 500
  },
  { 
    id: 3, 
    label: "Generating Base62 ID",
    icon: "",
    duration: 550
  },
  { 
    id: 4, 
    label: "Storing in PostgreSQL",
    icon: "",
    duration: 600
  },
  { 
    id: 5, 
    label: "Caching in Redis",
    icon: "",
    duration: 450
  },
  { 
    id: 6, 
    label: "Short URL created",
    icon: "",
    duration: 400
  },
];

export function useShortenFlow() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = async (url) => {
    setLoading(true);
    setError(null);
    setShortUrl(null);
    setCurrentStep(-1);
    setCompletedSteps([]);

    try {
      // Animate through each step (except the last one)
      for (let i = 0; i < STEPS.length - 1; i++) {
        setCurrentStep(i);
        await delay(STEPS[i].duration);
        setCompletedSteps(prev => [...prev, i]);
      }

      // Make the actual API call
      const res = await shortenUrl(url);

      // Show final step
      setCurrentStep(STEPS.length - 1);
      await delay(STEPS[STEPS.length - 1].duration);
      setCompletedSteps(prev => [...prev, STEPS.length - 1]);
      
      // Set the short URL from API response
      setShortUrl(res.shortUrl);
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
      setCurrentStep(-1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCurrentStep(-1);
    setCompletedSteps([]);
    setShortUrl(null);
    setError(null);
    setLoading(false);
  };

  return {
    steps: STEPS,
    currentStep,
    completedSteps,
    shortUrl,
    error,
    loading,
    start,
    reset,
  };
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}