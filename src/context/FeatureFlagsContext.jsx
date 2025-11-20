import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

const FeatureFlagsContext = createContext();

export function FeatureFlagsProvider({ children }) {
  const [advanced, setAdvancedState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("featureFlags");
    if (stored) {
      try {
        const flags = JSON.parse(stored);
        setAdvancedState(flags.advanced || false);
      } catch (err) {
        console.warn("Failed to parse stored feature flags:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever advanced changes
  const setAdvanced = (value) => {
    setAdvancedState(value);
    localStorage.setItem("featureFlags", JSON.stringify({ advanced: value }));
  };

  const value = useMemo(() => ({
    advanced,
    setAdvanced,
  }), [advanced]);

  // Avoid hydration mismatch by not rendering children until loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
};
