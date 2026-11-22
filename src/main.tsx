import React, { useEffect, useState, useRef, useMemo, useCallback, FormEvent, ChangeEvent } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from 'split-type';
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

    const sectionRefs = {
        home: useRef<HTMLDivElement>(null),
        about: useRef<HTMLDivElement>(null),
        skills: useRef<HTMLDivElement>(null),
        experience: useRef<HTMLDivElement>(null),
        projects: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };

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
        title: "Élève en CPGE ATS · Futur ingénieur en alternance",
        phone: "+33 7 87 49 86 86",
        email: "payen.joris.pro@gmail.com",
        address: "Lyon (69)",
        about: "Après un BTS CIEL option B en électronique et réseaux, j’ai choisi la prépa ATS pour poursuivre vers une école d’ingénieurs. J’aime comprendre comment fonctionne un système, rechercher l’origine d’une panne et transformer une idée en prototype. Je recherche une alternance à partir de septembre 2027, notamment en électronique et systèmes embarqués."
    }), []);

    const experiences = useMemo(() => ([
        {
            title: "Technicien contrôleur",
            company: "PRS Healthcare",
            location: "Sainte-Foy-lès-Lyon",
            period: "Mai–août 2025",
            type: "Stage puis CDD",
            responsibilities: [
                "Contrôle et diagnostic de sondes échographiques.",
                "Application de procédures de vérification et analyse des anomalies."
            ]
        },
        {
            title: "Équipier polyvalent → Formateur → Manager",
            company: "McDonald’s",
            location: "Francheville",
            period: "2025–2026",
            type: "CDD",
            responsibilities: [
                "Évolution interne jusqu’au poste de manager.",
                "Formation des nouveaux équipiers et coordination des opérations en service."
            ]
        },
        {
            title: "Auxiliaire de vie",
            company: "EHPAD Le Garezin",
            location: "Francheville",
            period: "Juillet–août 2024",
            type: "CDD",
            responsibilities: [
                "Aide aux résidents et gestion autonome des tâches.",
                "Vigilance et réactivité au quotidien."
            ]
        }
    ] as Experience[]), []);

    const projects = useMemo(() => ([
        {title:"RC-XD — Véhicule connecté FPV",kind:"Projet personnel",description:"Un véhicule télécommandé pensé autour d’un ESP32, du pilotage Wi-Fi et du retour vidéo FPV.",technologies:["ESP32","Wi-Fi","FPV","Commande moteur"],video:"/video/voiture.mp4",objective:"Associer pilotage depuis un smartphone, retour caméra et commande des moteurs.",implementation:"Architecture ESP32, électronique de commande et intégration d’une caméra FPV.",technicalFocus:"Intégration matérielle, communication et mise au point des commandes."},
        {title:"Banc de mesure d’inductance",kind:"Projet BTS · Partenariat Alphée",description:"Conception d’un banc destiné à mesurer l’inductance de bobines dans le cadre d’un projet BTS réalisé avec Alphée.",technologies:["Instrumentation","Mesures électriques","Électronique","Banc de test"],video:"/video/illustation-induct.mp4",objective:"Faciliter la mesure et le contrôle d’inductances au moyen d’un dispositif dédié.",implementation:"Étude de la chaîne de mesure et de l’électronique associée au banc.",technicalFocus:"Méthode de test, instrumentation et contraintes pratiques de mesure."},
        {title:"Jarvis — Assistant vocal domotique",kind:"Projet personnel",description:"Expérimentation d’un assistant vocal basé sur Python pour interagir avec des fonctions informatiques et domotiques.",technologies:["Python","Commande vocale","Automatisation","IoT"],video:"/video/jarvis.mp4",objective:"Explorer le pilotage d’actions numériques et d’équipements par la voix.",implementation:"Assemblage de composants logiciels Python et logique de traitement des commandes.",technicalFocus:"Compréhension, débogage et amélioration progressive d’un prototype."}
    ]), []);

    const skillGroups = useMemo(() => ([
        {number:"01",title:"Électronique & conception",description:"Comprendre, assembler et mettre au point un système.",topics:["Électronique analogique et numérique","Conception de montages","Lecture de schémas et prototypage"]},
        {number:"02",title:"Instrumentation & diagnostic",description:"Mesurer, vérifier et chercher l’origine d’une anomalie.",topics:["Mesures électriques","Contrôle de sondes échographiques","Procédures de test et diagnostic"]},
        {number:"03",title:"Systèmes embarqués",description:"Faire fonctionner ensemble matériel, commande et communication.",topics:["Microcontrôleurs ESP32","Intégration de capteurs et actionneurs","Wi-Fi et systèmes connectés"]},
        {number:"04",title:"Développement & outils",description:"Lire, adapter et déboguer des programmes utilisés dans les projets.",topics:["Bases en Python et C/C++","Analyse et débogage de code","Arduino IDE et outils de simulation"]}
    ]), []);

    const education = useMemo(() => ({
        institution: "Lycée Édouard Branly",
        location: "Lyon",
        degree: "CPGE ATS",
        period: "2026–2027",
        previousDegree: "BTS CIEL — option B (Électronique et réseaux)",
        previousPeriod: "2024–2026"
    }), []);

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

            tl.from(".hero-visual", {
                scale: 0.92,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=1");

        };

        const timer = setTimeout(() => {
            initLoadingAnimation();
            splitTextElements();
            splitTextElements2();
            animateSections();

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
        const sectionId = sectionMapping[sectionName] || sectionName;
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
    const [formError, setFormError] = useState(false);
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
            setFormSubmitted(false);
            setFormError(false);

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
                } else {
                    setFormError(true);
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                setFormError(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    return (
        <>


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
                                        className={`nav-link ${activeSection === sectionMapping[section] ? 'active' : ''}`}
                                        onClick={() => {
                                            scrollToSection(section);
                                            setActiveSection(sectionMapping[section]);
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
                {/* Accueil : portrait professionnel à intégrer lors de la passe finale */}
                <section id="home" ref={sectionRefs.home} className="hero-section">
                    <div className="parallax-bg" aria-hidden="true"></div>
                    <div className="container hero-container">
                        <div className="hero-content">
                            <p className="hero-eyebrow">ÉLECTRONIQUE · SYSTÈMES EMBARQUÉS</p>
                            <h1 className="hero-title">{personalInfo.name}</h1>
                            <h2 className="hero-subtitle animate-text">{personalInfo.title}</h2>
                            <p className="hero-description">
                                Recherche d’une alternance pour intégrer une formation d’ingénieur à la rentrée 2027.
                                Conception, électronique et projets techniques concrets.
                            </p>
                            <div className="hero-cta">
                                <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
                                    Voir mes projets
                                </button>
                                <a href="/CV_Joris_Payen.pdf?v=20261122" download="CV_Joris_Payen.pdf" className="btn btn-secondary">
                                    Télécharger mon CV
                                </a>
                                <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
                                    Me contacter
                                </button>
                            </div>
                        </div>
                        <div className="hero-visual" aria-hidden="true">
                            <div className="hero-visual-frame">
                                <span className="hero-visual-chip">
                                    <span className="hero-visual-fallback">JP</span>
                                    <img src="/portrait-joris.webp"
                                         alt=""
                                         className="hero-visual-photo"
                                         loading="eager"
                                         decoding="async"
                                         onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                                </span>
                                <div className="hero-visual-caption">CONCEVOIR <span>·</span> TESTER <span>·</span> COMPRENDRE</div>
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
                            <h2 className="section-title animate-text">À propos de moi</h2>
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
                                <div className="education-list">
                                    <article className="education-item education-item-current">
                                        <div className="education-item-top">
                                            <span className="education-period">{education.period}</span>
                                            <span className="education-status">En cours</span>
                                        </div>
                                        <h4>{education.degree} — Adaptation Technicien Supérieur</h4>
                                        <p>{education.institution} · {education.location}</p>
                                        <p className="education-caption">Année préparatoire aux écoles d’ingénieurs.</p>
                                    </article>
                                    <article className="education-item">
                                        <div className="education-item-top">
                                            <span className="education-period">{education.previousPeriod}</span>
                                        </div>
                                        <h4>{education.previousDegree}</h4>
                                        <p>{education.institution} · {education.location}</p>
                                        <p className="education-caption">Électronique et réseaux.</p>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Compétences structurées, sans pourcentages subjectifs */}
                <section id="skills" ref={sectionRefs.skills} className="skills-section">
                    <div className="container">
                        <div className="section-header"><h2 className="section-title animate-text">Compétences</h2><div className="section-divider"></div></div>
                        <p className="skills-intro">Des compétences construites en BTS CIEL, en entreprise et au travers de projets personnels.</p>
                        <div className="skill-groups-grid">
                            {skillGroups.map(group => (
                                <article key={group.number} className="skill-group-card">
                                    <div className="skill-group-heading"><span className="skill-group-number" aria-hidden="true">{group.number}</span><h3>{group.title}</h3></div>
                                    <p className="skill-group-description">{group.description}</p>
                                    <ul className="skill-topic-list">{group.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
                                </article>
                            ))}
                        </div>
                        <div className="language-strip"><strong>Langues</strong><span>Français · langue maternelle</span><span>Anglais · niveau B2</span></div>
                    </div>
                </section>

                {/* Section Expérience */}
                <section id="experience" ref={sectionRefs.experience} className="experience-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Expériences professionnelles</h2>
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

                {/* Projets : vidéo à la demande et démarche technique */}
                <section id="projects" ref={sectionRefs.projects} className="projects-section">
                    <div className="container">
                        <div className="section-header"><h2 className="section-title animate-text">Mes projets</h2><div className="section-divider"></div></div>
                        <p className="projects-intro">Trois réalisations pour montrer ma démarche : partir d’un besoin, concevoir un système et le mettre à l’épreuve.</p>
                        <div className="projects-grid">
                            {projects.map((project, index) => (
                                <article key={project.title} className="project-card">
                                    <div className="project-image">
                                        <video src={project.video} className="project-media" autoPlay muted loop playsInline preload="metadata" aria-label={`Vidéo de démonstration du projet ${project.title} (muette et en boucle)`}>
                                            Votre navigateur ne prend pas en charge la lecture vidéo.
                                        </video>
                                    </div>
                                    <div className="project-content">
                                        <div className="project-meta"><span className="project-index">{String(index + 1).padStart(2, '0')} / 03</span><span className="project-kind">{project.kind}</span></div>
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>
                                        <div className="project-tags">{project.technologies.map(tech => <span key={tech} className="project-tag">{tech}</span>)}</div>
                                        <details className="project-details">
                                            <summary>Découvrir la démarche <span aria-hidden="true" className="project-details-icon">+</span></summary>
                                            <div className="project-details-content">
                                                <h4>Objectif</h4><p>{project.objective}</p>
                                                <h4>Mise en œuvre</h4><p>{project.implementation}</p>
                                                <h4>Points techniques</h4><p>{project.technicalFocus}</p>
                                            </div>
                                        </details>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <p className="projects-outro">Les vidéos illustrent mes travaux. Les détails techniques peuvent être approfondis lors d’un échange.</p>
                    </div>
                </section>

                {/* Section Contact */}
                <section id="contact" ref={sectionRefs.contact} className="contact-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title animate-text">Me contacter</h2>
                            <div className="section-divider"></div>
                        </div>

                        <div className="contact-container">
                            <div className="contact-info">
                                <span className="contact-availability">Recherche d’alternance · Septembre 2027</span>
                                <h3>Échangeons sur vos projets</h3>
                                <p>Je recherche une entreprise pour une alternance en école d’ingénieurs, avec une orientation électronique et systèmes embarqués. Vous pouvez me joindre directement :</p>

                                <div className="contact-details">
                                    <a className="contact-item contact-clickable" href="mailto:payen.joris.pro@gmail.com" aria-label="Envoyer un e-mail à Joris Payen">
                                        <div className="contact-icon" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m2 6 10 7 10-7"></path></svg>
                                        </div>
                                        <div className="contact-text"><h4>Email</h4><p>{personalInfo.email}</p></div>
                                    </a>
                                    <a className="contact-item contact-clickable" href="tel:+33787498686" aria-label="Appeler Joris Payen">
                                        <div className="contact-icon" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </div>
                                        <div className="contact-text"><h4>Téléphone</h4><p>{personalInfo.phone}</p></div>
                                    </a>
                                    <div className="contact-item contact-item-location">
                                        <div className="contact-icon" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </div>
                                        <div className="contact-text"><h4>Localisation</h4><p>{personalInfo.address}</p></div>
                                    </div>
                                </div>

                                <div className="contact-social">
                                    <a href="https://www.linkedin.com/in/joris-payen-19b747395/"
                                       target="_blank" rel="noopener noreferrer" className="contact-social-link">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.6 0 4.265 2.37 4.265 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .775 0 1.729v20.542C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.271V1.729C24 .775 23.2 0 22.225 0z"></path></svg>
                                        <span>Retrouver mon profil LinkedIn</span>
                                        <span aria-hidden="true">↗</span>
                                    </a>
                                </div>

                            </div>

                            <div className="contact-form">
                                {formSubmitted && <p role="status">Votre demande a été transmise au service d’envoi. Merci pour votre message.</p>}
                                {formError && <p role="alert">L’envoi a échoué. Vous pouvez me contacter directement par e-mail.</p>}
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
                                        <span>{isSubmitting ? 'Envoi...' : 'Envoyer le message'}</span>
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
                            <p>&copy; {new Date().getFullYear()} Joris Payen. Tous droits réservés.</p>
                        </div>
                    </div>
                    <button
                        className={`back-to-top ${activeSection !== 'home' ? 'visible' : ''}`}
                        onClick={() => {
                            scrollToSection('accueil');
                            setActiveSection('home');
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
