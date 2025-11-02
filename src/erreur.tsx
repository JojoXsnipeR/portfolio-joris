import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const gererDeplacementSouris = (e: MouseEvent) => {
            if (containerRef.current) {
                const { left, top, width, height } = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - left - width / 2) / 25;
                const y = (e.clientY - top - height / 2) / 25;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', gererDeplacementSouris);

        return () => {
            window.removeEventListener('mousemove', gererDeplacementSouris);
        };
    }, []);

    const variantesContainer = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.1
            }
        }
    };

    const variantesItem = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            initial={{ filter: "brightness(0)" }}
            animate={{ filter: "brightness(1)" }}
            exit={{ filter: "brightness(0)" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="page-main"
            style={{ 
                minHeight: '100vh',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div 
                className="parallax-bg" 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at top right, rgba(108, 92, 231, 0.2), transparent), radial-gradient(circle at bottom left, rgba(75, 73, 172, 0.15), transparent)',
                    opacity: 0.5,
                    zIndex: -1
                }}
            />

            <motion.div
                ref={containerRef}
                variants={variantesContainer}
                initial="initial"
                animate="animate"
                className="container"
                style={{
                    maxWidth: '800px',
                    textAlign: 'center',
                    padding: 'var(--space-xl)',
                    transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${-mousePosition.x}deg)`
                }}
            >
                <motion.div 
                    variants={variantesItem} 
                    className="error-code"
                    style={{
                        fontSize: '10rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        marginBottom: 'var(--space-md)',
                        background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontFamily: 'var(--font-heading)',
                    }}
                >
                    404
                </motion.div>

                <motion.h1 
                    variants={variantesItem}
                    style={{
                        fontSize: '2.5rem',
                        marginBottom: 'var(--space-md)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                    }}
                >
                    Page introuvable
                </motion.h1>

                <motion.p 
                    variants={variantesItem}
                    style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-xl)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                >
                    La page que vous recherchez a peut-être été supprimée, renommée ou est temporairement indisponible.
                </motion.p>

                <motion.div 
                    variants={variantesItem}
                    style={{
                        display: 'flex',
                        gap: 'var(--space-md)',
                        justifyContent: 'center',
                        marginTop: 'var(--space-lg)',
                    }}
                >
                    <Link to="/joris/">
                        <motion.button 
                            whileHover={{ y: -5, boxShadow: '0 6px 20px rgba(108, 92, 231, 0.5)' }}
                            className="btn btn-primary"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--space-sm)',
                                padding: 'var(--space-sm) var(--space-lg)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                borderRadius: 'var(--border-radius-md)',
                                backgroundColor: 'var(--accent-primary)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                minWidth: '150px',
                                marginTop: '15px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Retour à l'accueil
                        </motion.button>
                    </Link>
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 5,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                    style={{
                        position: "absolute",
                        top: "15%",
                        right: "15%",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))",
                        filter: "blur(20px)",
                        opacity: 0.5,
                    }}
                />

                <motion.div
                    animate={{
                        x: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 7,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{
                        position: "absolute",
                        bottom: "20%",
                        left: "15%",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))",
                        filter: "blur(25px)",
                        opacity: 0.3,
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

export default NotFound;