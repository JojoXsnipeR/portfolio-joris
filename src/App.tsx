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
    description: "Portfolio de Joris Payen, étudiant en CPGE ATS après un BTS CIEL : projets d’électronique et de systèmes embarqués, recherche d’alternance ingénieur 2027.",
    notFoundTitle: "Joris Payen - Page Introuvable (404)",
    notFoundDesc: "La page que vous cherchez n'existe pas ou a été déplacée.",
  },
  en: {
    title: "Joris Payen - Portfolio",
    description: "Joris Payen’s engineering portfolio: electronics and embedded-systems projects, ATS preparatory class, and an engineering apprenticeship search for 2027.",
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
              path="/"
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


    </HelmetProvider>



  );
};


export default App;