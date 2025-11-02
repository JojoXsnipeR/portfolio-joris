import React, { useEffect, useState, useRef, useMemo, useCallback, FormEvent, ChangeEvent } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from 'split-type';
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Mesh } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  video?: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  responsibilities: string[];
}

const Main: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const sectionMapping: { [key: string]: string } = {
    'accueil': 'home',
    'à propos': 'about',
    'compétences': 'skills',
    'expérience': 'experience',
    'projets': 'projects',
    'contact': 'contact',
  };

  const personalInfo = useMemo(() => ({
    name: "Joris Payen",
    title: "Étudiant en systèmes électroniques et connectés et créateur autodidacte de projets techniques.",
    phone: "+33 7 87 49 86 86",
    email: "payen.joris.pro@gmail.com",
    address: "7 rue des cèdres, 69340 Francheville",
    about: "Créateur autodidacte de projets techniques, je suis convaincu que chaque innovation naît d'une idée claire, d'un plan structuré et d'une bonne dose de passion. En chemin vers le métier d’ingénieur, je suis prêt à m’investir pleinement pour concevoir les technologies électroniques de demain, avec méthode, énergie et ambition."
  }), []);

  const experiences = useMemo(() => ([
    {
      title: "Auxiliaire de Vie / Equipier McDonald",
      company: "EHPAD Le Garezin / McDonald Reloc",
      location: "Francheville",
      period: "07/2024 - 08/2024 / Actuel :Weekends",
      type: "CDD",
      responsibilities: [
        "Aider les personnes dans les activités quotidiennes telles que se lever/se coucher, toilette et habillage",
        "Gestion des commandes et du service client dans un environnement dynamique."
      ]
    },
    {
      title: "Technicien Controleur",
      company: "PRS HealthCare",
      location: "St Foy Lès Lyon",
      period: "Mai, Juin, Août 2025",
      type: "Stage puis CDD",
      responsibilities: [
        "Maintenance et expertise de sondes à ultrasons pour l’imagerie médicale : analyse de pannes, mesures électroniques et réparations de précision en environnement biomédical.",
      ]
    }
  ] as Experience[]), []);

  const projects = useMemo(() => ([
    {
      title: "RC-XD",
      description: "Conception d’un véhicule connecté capable d’atteindre 20 km/h baptisé RC-XD, pilotable via smartphone ou en mode autonome grâce à un système de suivi de ligne.",
      technologies: ["C", "C++", "Python", "Arduino", "Électronique"],
      image: "/imgs/fpv.png",
      video: "/video/voiture.mp4",
    },
    {
      title: "Système domotique Jarvis",
      description: "Développement d’un assistant vocal domotique intelligent capable de contrôler un ordinateur, l’éclairage et divers appareils connectés.",
      technologies: ["Next.js", "TypeScript", "Réseaux", "IoT", "TailwindCSS"],
      image: "/imgs/jarvis.png",
      video: "/video/jarvis.mp4",
    },
  ] as Project[]), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (cursorOuterRef.current) {
      gsap.to(cursorOuterRef.current, { x: mousePosition.x, y: mousePosition.y, duration: 1, ease: "power2.out" });
    }
  }, [mousePosition]);

  // --- 🚀 3D CAR ---
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-.15, -1, 3);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new AmbientLight(0x404040, 1);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(ambientLight, directionalLight);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const gltfPath = '/env/car.glb';
    loader.load(gltfPath, (gltf: any) => {
      const model = gltf.scene;
      model.position.set(-1, -0.6, 0);
      model.scale.set(4, 4, 4);
      scene.add(model);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const scrollToSection = useCallback((sectionName: string) => {
    setIsMenuOpen(false);
    const sectionId = sectionMapping[sectionName];
    const section = sectionRefs[sectionId as keyof typeof sectionRefs]?.current;
    if (section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="loader">
        <svg className="loader-svg" width="50" height="50" viewBox="0 0 50 50">
          <circle className="loader-circle" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
        <div className="loading-text">chargement du portfolio</div>
      </div>

      <div className="cursor">
        <div ref={cursorOuterRef} className="cursor-outline"></div>
      </div>

      <header className="header">
        <div className="container header-container">
          <div className="logo"><Link to="/">JP</Link></div>
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              {['accueil', 'à propos', 'compétences', 'expérience', 'projets', 'contact'].map((section) => (
                <li key={section} className="nav-item">
                  <button
                    className={`nav-link ${activeSection === section ? 'active' : ''}`}
                    onClick={() => { scrollToSection(section); setActiveSection(section); }}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <section id="home" ref={sectionRefs.home} className="hero-section">
          <div className="container hero-container">
            <div className="hero-content">
              <h1 className="hero-title">{personalInfo.name}</h1>
              <h2 className="hero-subtitle">{personalInfo.title}</h2>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={() => scrollToSection('projets')}>Voir mes Projets</button>
                <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>Me Contacter</button>
                <a href="/CV_Joris_Payen.pdf" download="CV_Joris_Payen.pdf" className="btn btn-secondary">Télécharger mon CV</a>
              </div>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="footer">
          <div className="container">
            <div className="social-icons">
              <a href="https://www.linkedin.com/in/joris-payen-19b747395/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://www.newgenesis.ai" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="NewGenesis">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </a>
            </div>
            <p>&copy; {new Date().getFullYear()} <a href="https://www.newgenesis.ai">NewGenesis</a>. Tous droits réservés.</p>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default Main;
