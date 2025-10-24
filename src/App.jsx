import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ParticleBackground from "./components/Layout/ParticleBackground";
import "../css/main.css"; // Import main CSS file

// Lazy load feature modules
const DailyCommunicator = lazy(() => import("./components/solutions/DailyCommunicator"));
const VoicePersonalizer = lazy(() => import("./components/solutions/VoicePersonalizer"));
const ContentAmplifier = lazy(() => import("./components/solutions/ContentAmplifier"));
const SmartPredictor = lazy(() => import("./components/solutions/SmartPredictor"));
const SymbolBoard = lazy(() => import("./components/solutions/SymbolBoard"));
const EmergencyMode = lazy(() => import("./components/solutions/EmergencyMode"));

// Error Boundary
function ComponentErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Component error:", error);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return hasError ? fallback : children;
}

// Global Loading Spinner
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading VoiceForge...</p>
      </div>
    </div>
  );
}

// Error fallback
function ErrorFallback({ componentName }) {
  return (
    <div className="error-fallback">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Component Load Error</h2>
        <p className="error-description">
          Failed to load {componentName}. Please try refreshing the page.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Refresh Page
        </button>
      </div>
    </div>
  );
}

function App() {
  const [activeSolution, setActiveSolution] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({ online: true, battery: 90 });
  const [currentLanguage, setCurrentLanguage] = useState("en-KE");

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for hash changes in URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActiveSolution(hash);
    };

    handleHashChange(); // Load correct section on initial visit
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Map solution keys to components
  const solutionComponents = {
    daily: { component: DailyCommunicator, name: "Daily Communicator" },
    voice: { component: VoicePersonalizer, name: "Voice Personalizer" },
    content: { component: ContentAmplifier, name: "Content Amplifier" },
    predictor: { component: SmartPredictor, name: "Smart Predictor" },
    symbols: { component: SymbolBoard, name: "Symbol Board" },
    emergency: { component: EmergencyMode, name: "Emergency Mode" },
  };

  const renderSolution = () => {
    const currentSolution = solutionComponents[activeSolution] || solutionComponents.daily;
    const SolutionComponent = currentSolution.component;

    return (
      <ComponentErrorBoundary fallback={<ErrorFallback componentName={currentSolution.name} />}>
        <Suspense
          fallback={
            <div className="component-loading">
              <div className="loading-spinner small"></div>
              <p className="loading-text">Loading {currentSolution.name}...</p>
            </div>
          }
        >
          <SolutionComponent />
        </Suspense>
      </ComponentErrorBoundary>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="app-layout">
      <ParticleBackground />

      <Header
        activeSolution={activeSolution}
        setActiveSolution={(solution) => {
          setActiveSolution(solution);
          window.location.hash = solution; // Update URL hash when user clicks a menu item
        }}
        systemStatus={systemStatus}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />

      <main className="main-content">{renderSolution()}</main>

      <Footer />
    </div>
  );
}

export default App;
