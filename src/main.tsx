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

interface Skill {
    name: string;
    level: number;
}

const Main: React.FC = () => {
    const [scrollY, setScrollY] = useState<number>(0);
    const [scrollPosition, setScrollPosition] = useState(0);
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
    const headerRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
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
            period: "Mai, Juin, Âout 2025",
            type: "Stage puis CDD",
            responsibilities: [
                "Maintenance et expertise de sondes à ultrasons pour l’imagerie médicale : analyse de pannes, mesures électroniques et réparations de précision en environnement biomédical.",
            ]
        }
    ] as Experience[]), []);

    const project = useMemo(() => ([
        {
            title: "RC-XD",
            description: "Conception d’un véhicule connecté capable d’atteindre 20 km/h batisé RC-XD, pilotable via smartphone ou en mode autonome grâce à un système de suivi de ligne. Projet mené en autonomie : conception mécanique, architecture électronique, programmation embarquée et intégration des systèmes de contrôle.",
            technologies: ["C", "C++", "Python", "Arduino", "Électronique"],
            image: "/joris/imgs/fpv.png",
            video: "/joris/video/voiture.mp4",
        },
        {
            title: "Système domotique Jarvis",
            description: "Développement d’un assistant vocal domotique intelligent capable de contrôler un ordinateur, l’éclairage et divers appareils connectés. Conçu pour interagir à la voix, gérer des rappels et automatiser le quotidien, Jarvis est un système évolutif en amélioration continue, alliant logiciel, électronique et IA.",
            technologies: ["Next.js", "TypeScript", "Réseaux", "IoT", "TailwindCSS"],
            image: "/joris/imgs/jarvis.png",
            video: "/joris/video/jarvis.mp4",
        },
    ] as Project[]), []);

    const skills = useMemo(() => ({
        technical: [
            { name: "C", level: 85 },
            { name: "C++", level: 78 },
            { name: "Python", level: 90 },
            { name: "Électronique", level: 88 },
            { name: "Conception de Circuits", level: 80 },
            { name: "Prototypage", level: 85 },
            { name: "Soudure", level: 92 },
            { name: "Réseaux", level: 75 },
            { name: "Arduino IDE", level: 95 },
            { name: "Packet Tracer", level: 80 },
            { name: "Multisim", level: 85 }
        ],
        languages: [
            { name: "Français", level: 100 },
            { name: "Anglais", level: 70 }
        ],
        soft: [
            { name: "Rigueur et Ponctualité", level: 90 },
            { name: "Travail en Équipe et Communication", level: 85 },
            { name: "Adaptabilité", level: 88 },
            { name: "Pensée Analytique", level: 92 },
            { name: "Autonomie", level: 95 }
        ]
    }), []);

    const education = useMemo(() => ({
        institution: "Lycée Édouard Branly",
        location: "Lyon",
        degree: "BTS CIEL Option B Électronique et Réseaux : Électronique et Réseaux",
        period: "09/2024 - Présent"
    }), []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (cursorOuterRef.current) {
            gsap.to(cursorOuterRef.current, {
                x: mousePosition.x,
                y: mousePosition.y,
                duration: 1,
                ease: "power2.out"
            });
        }
    }, [mousePosition]);

    useEffect(() => {
        const tl = gsap.timeline();
        timelineRef.current = tl;

        const splitTextElements = () => {
            const headings = document.querySelectorAll('.animate-text');

            headings.forEach((heading) => {
                const headingElement = heading as HTMLElement;

                const splitText = new SplitType(headingElement, { types: 'chars,words' });

                if (splitText.chars) {
                    gsap.from(splitText.chars, {
                        opacity: 0,
                        y: 20,
                        rotateX: -90,
                        stagger: 0.02,
                        duration: 0.5,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingElement,
                            start: "top 80%",
                            toggleActions: "play none none none",
                            once: true,
                        }
                    });
                }

                if (splitText.words) {
                    gsap.from(splitText.words, {
                        opacity: 0,
                        y: 30,
                        stagger: 0.1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingElement,
                            start: "top 80%",
                            toggleActions: "play none none none",
                            once: true,
                        }
                    });
                }
            });

            ScrollTrigger.refresh();
        };

        const splitTextElements2 = () => {
            const headings = document.querySelectorAll('.animate-text2');

            headings.forEach((heading) => {
                const headingElement = heading as HTMLElement;

                const splitText = new SplitType(headingElement, { types: 'words' });

                if (splitText.chars) {
                    gsap.from(splitText.chars, {
                        opacity: 0,
                        y: 20,
                        rotateX: -90,
                        stagger: 0.02,
                        duration: 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: headingElement,
                            start: "top 80%",
                            toggleActions: "play none none none",
                            once: true,
                        }
                    });
                }

                if (splitText.words) {
                    gsap.from(splitText.words, {
                        opacity: 0,
                        y: 30,
                        stagger: 0.01,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingElement,
                            start: "top 80%",
                            toggleActions: "play none none none",
                            once: true,
                        }
                    });
                }
            });

            ScrollTrigger.refresh();
        };

        const animateSections = () => {
            const sections = document.querySelectorAll('section');
            sections.forEach((section) => {
                gsap.from(section, {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });
        };

        const initLoadingAnimation = () => {
            tl.to(".loader", {
                duration: 1,
                opacity: 0,
                delay: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    document.body.classList.add('loaded');
                    setIsLoaded(true);
                }
            });

            tl.from(".header", {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5");

            tl.from(".hero-content", {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: "power3.out"
            }, "-=0.7");

            tl.from(".profile-photo", {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out(1, 0.5)"
            }, "-=1");

            tl.from(".social-icons a", {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=1");
        };

        const timer = setTimeout(() => {
            initLoadingAnimation();
            splitTextElements();
            splitTextElements2();
            animateSections();

            gsap.utils.toArray<HTMLElement>('.skill-progress').forEach((bar) => {
                const value = parseInt(bar.getAttribute('data-value') || '0');

                gsap.to(bar, {
                    width: `${value}%`,
                    duration: .25,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: bar,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                });
            });

            gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
                gsap.from(item, {
                    opacity: 0,
                    x: i % 2 === 0 ? -50 : 50,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });

            gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });
        }, 500);

        return () => {
            clearTimeout(timer);
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, []);

    useEffect(() => {
        Object.entries(sectionRefs).forEach(([id, ref]) => {
            if (ref.current) {
                ScrollTrigger.create({
                    trigger: ref.current,
                    start: "top 50%",
                    end: "bottom 50%",
                    onEnter: () => setActiveSection(id),
                    onEnterBack: () => setActiveSection(id)
                });
            }
        });
    }, [isLoaded]);

    const scrollToSection = useCallback((sectionName: string) => {
        setIsMenuOpen(false);
        const sectionId = sectionMapping[sectionName];
        const section = sectionRefs[sectionId as keyof typeof sectionRefs]?.current;

        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }
    }, []);

    useEffect(() => {
        if (introRef.current) {
            gsap.to(".parallax-bg", {
                y: scrollY * 0.5,
                ease: "none",
            });
        }
    }, [scrollY]);

    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            new SplitType(textRef.current, { types: 'words,chars' });
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string): boolean => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'email') {
            setErrors({
                ...errors,
                [name]: value.trim() !== '' && !validateEmail(value) ? 'Adresse email invalide.' : ''
            });
        } else {
            setErrors({
                ...errors,
                [name]: value.trim() === '' ? 'Ce champ est requis.' : ''
            });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = {
            name: formData.name.trim() === '' ? 'Le nom est requis.' : '',
            email: formData.email.trim() === '' || !validateEmail(formData.email) ? 'Une adresse email valide est requise.' : '',
            subject: formData.subject.trim() === '' ? 'Le sujet est requis.' : '',
            message: formData.message.trim() === '' ? 'Le message ne peut pas être vide.' : ''
        };

        setErrors(newErrors);

        if (!newErrors.name && !newErrors.email && !newErrors.subject && !newErrors.message) {
            setIsSubmitting(true);

            try {
                const formDataObj = new FormData();
                formDataObj.append('name', formData.name);
                formDataObj.append('email', formData.email);
                formDataObj.append('subject', formData.subject);
                formDataObj.append('message', formData.message);

                const response = await fetch('https://formsubmit.co/ajax/payen.joris.pro@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formDataObj
                });

                if (response.ok) {
                    setFormSubmitted(true);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                setFormSubmitted(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const modelRef = useRef<any>(null);
    const rendererRef = useRef<WebGLRenderer | null>(null);
    const cameraRef = useRef<PerspectiveCamera | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const scene = new Scene();
        sceneRef.current = scene;

        const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-.15, -1, 3);
        cameraRef.current = camera;

        const renderer = new WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        if (containerRef.current) {
            const existingCanvas = containerRef.current.querySelector('canvas');
            if (existingCanvas) {
                existingCanvas.remove();
            }
            containerRef.current.appendChild(renderer.domElement);
        }

        const ambientLight = new AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        const gltfPath = '/joris/env/car.glb';

        loader.load(gltfPath, (gltf: any) => {
            const model = gltf.scene;

            const updateModelTransform = () => {
                if (window.innerWidth < 769) {
                    model.position.set(-.1, -1.2, 0);
                    model.scale.set(2, 2, 2);
                }
                else if (window.innerWidth < 1100) {
                    model.position.set(-0.5, -.6, 0);
                    model.scale.set(4, 4, 4);
                } else {
                    model.position.set(-1, -.6, 0);
                    model.scale.set(4, 4, 4);
                }
            };

            updateModelTransform();

            model.rotation.set(0, -Math.PI / 1.3, 0);
            modelRef.current = model;

            model.traverse((child: any) => {
                if (child instanceof Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(model);

            window.addEventListener('resize', updateModelTransform);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);

                if (modelRef.current) {
                    const scaleFactor = window.innerWidth < 768 ? 2.5 : 4;
                    modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
                }
            }
        };

        window.addEventListener('resize', handleResize);

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '-1';

        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, []);

    return (
        <>


            {/* Curseur personnalisé */}
            <div className="cursor">
                <div ref={cursorOuterRef} className="cursor-outline"></div>
            </div>

            {/* En-tête */}
            <header ref={headerRef} className="header">
                <div className="container header-container">
                    <div className="logo">
                        <Link to="/">JP</Link>
                    </div>
                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <ul className="nav-list">
                            {['accueil', 'à propos', 'compétences', 'expérience', 'projets', 'contact'].map((section) => (
                                <li key={section} className="nav-item">
                                    <button
                                        className={`nav-link ${activeSection === section ? 'active' : ''}`}
                                        onClick={() => {
                                            scrollToSection(section);
                                            setActiveSection(section);
                                        }}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Basculer le menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="page-main"
                data-grid="607"
                data-mouse="0.11"
                data-strength="0.36"
                data-relaxation="0.96">
                {/* Section Héro */}
                <div
                    ref={containerRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
                <section id="home" ref={sectionRefs.home} className="hero-section">
                    <div className="parallax-bg"></div>
                    <div className="container hero-container">
                        <div className="hero-content">
                            <h1 className="hero-title animate-text">
                                {personalInfo.name}
                            </h1>
                            <h2 className="hero-subtitle animate-text">
                                {personalInfo.title}
                            </h2>
                            <div className="hero-cta" style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
                             <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
                             Voir mes Projets
                             </button>

                             <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
                               Me Contacter
                             </button>

                              <a
                                href="/CV_Joris_Payen.pdf"
                               download="CV_Joris_Payen.pdf"
                                className="btn btn-secondary"
                                 >
                                Télécharger mon CV
                             </a>
                            </div>
                        </div>
                        <div className="profile-photo-container">
                            <div className="profile-photo">
                                <div className="photo-outline"></div>
                                <div className="photo-glow"></div>
                            </div>
                        </div>
                    </div>
                    <div className="scroll-indicator">
                        <div className="scroll-arrow"></div>
                        <span>Défiler vers le bas</span>
                    </div>
                </section>

                {/* Section À Propos */}
                <section id="about" ref={sectionRefs.about} className="about-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">À Propos de Moi</h2>
                            <div className="section-divider"></div>
                        </div>
                        <div className="about-content">
                            <div className="about-text">
                                <p className="animate-text2">
                                    {personalInfo.about}
                                </p>
                            </div>
                            <div className="about-education">
                                <h3 className="animate-text">Formation</h3>
                                <div className="education-card">
                                    <div className="education-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                        </svg>
                                    </div>
                                    <div className="education-details">
                                        <h4>{education.degree}</h4>
                                        <h5>{education.institution} | {education.location}</h5>
                                        <p>{education.period}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Compétences */}
                <section id="skills" ref={sectionRefs.skills} className="skills-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Compétences</h2>
                            <div className="section-divider"></div>
                        </div>

                        <div className="skills-container">
                            <div className="skills-category">
                                <h3 className="category-title animate-text">Compétences Techniques</h3>
                                <div className="skills-grid">
                                    {skills.technical.map((skill, index) => (
                                        <div key={index} className="skill-item">
                                            <div className="skill-header">
                                                <span className="skill-name">{skill.name}</span>
                                                <span className="skill-percentage">{skill.level}%</span>
                                            </div>
                                            <div className="skill-bar">
                                                <div className="skill-progress" data-value={skill.level}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="skills-category">
                                <h3 className="category-title animate-text">Langues</h3>
                                <div className="skills-grid">
                                    {skills.languages.map((skill, index) => (
                                        <div key={index} className="skill-item">
                                            <div className="skill-header">
                                                <span className="skill-name">{skill.name}</span>
                                                <span className="skill-percentage">{skill.level}%</span>
                                            </div>
                                            <div className="skill-bar">
                                                <div className="skill-progress" data-value={skill.level}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="skills-category">
                                <h3 className="category-title animate-text">Compétences Générales</h3>
                                <div className="skills-grid">
                                    {skills.soft.map((skill, index) => (
                                        <div key={index} className="skill-item">
                                            <div className="skill-header">
                                                <span className="skill-name">{skill.name}</span>
                                                <span className="skill-percentage">{skill.level}%</span>
                                            </div>
                                            <div className="skill-bar">
                                                <div className="skill-progress" data-value={skill.level}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Expérience */}
                <section id="experience" ref={sectionRefs.experience} className="experience-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Expérience</h2>
                            <div className="section-divider"></div>
                        </div>

                        <div className="timeline">
                            {experiences.map((exp, index) => (
                                <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                    <div className="timeline-content">
                                        <div className="timeline-date">{exp.period}</div>
                                        <h3 className="timeline-title">{exp.title}</h3>
                                        <h4 className="timeline-subtitle">{exp.company} | {exp.location}</h4>
                                        <p className="timeline-type">{exp.type}</p>
                                        <ul className="timeline-responsibilities">
                                            {exp.responsibilities.map((resp, i) => (
                                                <li key={i}>{resp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Projets */}
                <section id="projects" ref={sectionRefs.projects} className="projects-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Mes Projets</h2>
                            <div className="section-divider"></div>
                        </div>

                        <div className="projects-grid">
                            {project.map((project, index) => (
                                <div key={index} className="project-card">
                                    <div className="project-image">
                                        {project.video ? (
                                            <video
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                src={project.video}
                                                className="project-media"
                                            ></video>
                                        ) : project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="project-media"
                                            />
                                        ) : (
                                            <div className="project-placeholder"></div>
                                        )}
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>
                                        <div className="project-tags">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="project-tag">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-links">
                                            <a href="#" className="project-link">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 16 16 12 12 8"></polyline>
                                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                                </svg>
                                                Voir les Détails
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Contact */}
                <section id="contact" ref={sectionRefs.contact} className="contact-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Me Contacter</h2>
                            <div className="section-divider"></div>
                        </div>

                        <div className="contact-container">
                            <div className="contact-info">
                                <h3>Restons en Contact</h3>
                                <p>N'hésitez pas à me contacter pour toute demande ou collaboration.</p>

                                <div className="contact-details">
                                    <div className="contact-item">
                                        <a href="tel:+33787498686">
                                            <div className="contact-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                            </div>
                                        </a>
                                        <div className="contact-text">
                                            <h4>Téléphone</h4>
                                            <p>{personalInfo.phone}</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <a href="mailto:payen.joris.pro@gmail.com">
                                            <div className="contact-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                        </a>
                                        <div className="contact-text">
                                            <h4>Email</h4>
                                            <p>{personalInfo.email}</p>
                                        </div>
                                    </div>

                                    <div className="contact-item">
                                        <a href="https://www.google.fr/maps/place/7+Rue+des+C%C3%A8dres,+69340+Francheville/">
                                            <div className="contact-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                    <circle cx="12" cy="10" r="3"></circle>
                                                </svg>
                                            </div>
                                        </a>
                                        <div className="contact-text">
                                            <h4>Adresse</h4>
                                            <p>{personalInfo.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="social-icons">
                                    <a href="#" className="social-icon" aria-label="GitHub">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="social-icon" aria-label="LinkedIn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                            <rect x="2" y="9" width="4" height="12"></rect>
                                            <circle cx="4" cy="4" r="2"></circle>
                                        </svg>
                                    </a>
                                    <a href="#" className="social-icon" aria-label="Twitter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="contact-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Votre Nom</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Entrez votre nom"
                                            required
                                        />
                                        {errors.name && <p className="error-message">{errors.name}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Votre Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-input"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Entrez votre email"
                                            required
                                        />
                                        {errors.email && <p className="error-message">{errors.email}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject" className="form-label">Sujet</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            className="form-input"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Entrez le sujet"
                                            required
                                        />
                                        {errors.subject && <p className="error-message">{errors.subject}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            id="message"
                                            className="form-textarea"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={5}
                                            placeholder="Entrez votre message"
                                            required
                                        />
                                        {errors.message && <p className="error-message">{errors.message}</p>}
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        <span>{isSubmitting ? 'Envoi...' : 'Envoyer le Message'}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pied de page */}
                <footer className="footer">
                    <div className="container">
                        <div className="footer-content">
                            <div className="footer-logo">
                                <span>Joris Payen</span>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>&copy; {new Date().getFullYear()} <a href="www.newgenesis.ai">NewGenesis</a>. Tous droits réservés.</p>
                        </div>
                    </div>
                    <button
                        className={`back-to-top ${activeSection !== 'accueil' ? 'visible' : ''}`}
                        onClick={() => {
                            scrollToSection('accueil');
                            setActiveSection('accueil');
                        }}
                        aria-label="Retour en haut"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                </footer>
            </motion.div>
        </>
    );
}

export default Main;