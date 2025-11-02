import React, { Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider } from 'react-helmet-async';
import HelmetWrapper from './HelmetWrapper';

const NotFound = React.lazy(() => import("./erreur"));
const Main = React.lazy(() => import("./main"));

const Loader: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(true), 500);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 99 ? 99 : prev + 5));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return showLoader ? (
    <h2>Chargement...</h2>
  ) : null;
};

const translations: any = {
  fr: {
    title: "Joris Payen - Portfolio",
    projectDesc: "Créateur passionné et autodidacte, je conçois depuis ma chambre des projets techniques où rigueur, créativité et innovation se rencontrent. Convaincu qu'une idée claire, un plan structuré et une énergie sans faille sont les clés de la réussite, je m'investis pleinement pour imaginer et construire l'électronique de demain. Découvrez dans ce portfolio l'esprit méthodique, l'enthousiasme et l'ambition qui animent chacun de mes projets.",
    notFoundTitle: "Joris Payen - Page Introuvable (404)",
    notFoundDesc: "La page que vous cherchez n'existe pas ou a été déplacée.",
  },
  en: {
    title: "Joris Payen - Portfolio",
    description: "A passionate and self-taught creator, I design technical projects from my room where precision, creativity, and innovation come together. Convinced that a clear idea, a structured plan, and unwavering energy are the keys to success, I am fully committed to imagining and building the electronics of tomorrow. Through this portfolio, discover the methodical spirit, enthusiasm, and ambition that drive each of my projects.",
    notFoundTitle: "Joris Payen - Page Not Found (404)",
    notFoundDesc: "The page you're looking for doesn't exist or has been moved.",
  },
};

const App: React.FC = () => {
  const location = useLocation();
  const lang = (navigator.language || "en").split("-")[0];
  const t = lang === "fr" ? translations["fr"] : translations["en"];

  return (
    <HelmetProvider>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loader />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="joris/"
              element={
                <HelmetWrapper title={t.title} description={t.description}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 1 }}
                  >
                    <Main />
                  </motion.div>
                </HelmetWrapper>
              }
            />
            <Route
              path="*"
              element={
                <HelmetWrapper title={t.notFoundTitle} description={t.notFoundDesc}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 1 }}
                  >
                    <NotFound />
                  </motion.div>
                </HelmetWrapper>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
  
      {/* === Ton bouton de CV ici === */}
      <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
        <a
          href="/CV_Joris_Payen.pdf"
          download="CV_Joris_Payen.pdf"
          className="cv-button"
        >
          Télécharger mon CV
        </a>
      </div>
    </HelmetProvider>
  
  
    
  );
};


export default App;