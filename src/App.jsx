import React, { useState, useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import {
    Linkedin,
    Mail,
    MapPin,
    User,
    ArrowRight,
    ArrowUpRight,
    Menu,
    X,
    Briefcase,
    GraduationCap,
    Award,
    Bot,
    Send,
    Sparkles,
    Loader2,
    Phone,
} from "lucide-react";

// ==========================================
// 📂 DATA CONFIGURATION & CONTEXT
// ==========================================

const PORTFOLIO_DATA = {
    personal: {
        name: "Vicky Manavadariya",
        title: "Software Engineer",
        role: "Backend & Angular Architect",
        location: "Bengaluru, India",
        email: "vicky.manavadariya321@gmail.com",
        phone: "+91 78748 04852",
        linkedin: "https://www.linkedin.com/in/vicky-manavadariya",
        about: "I engineer scalable, high-performance web applications. With a robust foundation in C#, .NET Core, Microservices, and Angular, I architect systems that handle complex business logic with elegance and speed. My philosophy is simple: clean code, seamless user experiences, and production-ready reliability.",
    },
    education: {
        degree: "B.E. Computer Engineering",
        institution: "Marwadi University",
        details: "CGPA: 8.0",
    },
    certification: {
        title: "AWS Cloud Foundations",
        issuer: "Amazon Web Services",
    },
    skills: [
        {
            category: "Backend Architecture",
            outline: "BACKEND",
            items: [
                "C#",
                ".NET Core",
                "Microservices",
                "REST APIs",
                "EF Core",
                "RabbitMQ",
            ],
        },
        {
            category: "Frontend Interfaces",
            outline: "FRONTEND",
            items: [
                "Angular",
                "React",
                "TypeScript",
                "JavaScript",
                "Tailwind CSS",
            ],
        },
        {
            category: "Cloud & Database",
            outline: "INFRA",
            items: ["SQL Server", "Azure", "CI/CD", "Git/GitHub", "Stripe API"],
        },
    ],
    experience: [
        {
            id: 1,
            role: "Software Engineer Professional",
            company: "Mettler-Toledo",
            date: "Oct 2025 – Present",
            description:
                "Architecting microservice-based enterprise solutions using C# and .NET Core. Driving backend optimization and distributed system design.",
        },
        {
            id: 2,
            role: "Software Engineer – L2",
            company: "HTC Global Services",
            date: "Aug 2024 – Oct 2025",
            description:
                "Engineered Labour Schedule and Time Scan Maintenance applications, automating critical shift planning and secure labor tracking.",
        },
        {
            id: 3,
            role: "Software Engineer",
            company: "WeyBee Solutions",
            date: "Jun 2023 – Aug 2024",
            description:
                "Developed core plugins for Syncware. Architected complex Stripe subscription billing, anchoring, and automated trial management flows.",
        },
        {
            id: 4,
            role: "Software Developer",
            company: "Anicca Data Science",
            date: "Mar 2022 – May 2023",
            description:
                "Modernized McDonald's internal CRM serving 1000+ users. Migrated legacy systems to a microservice architecture with rich Angular UIs.",
        },
        {
            id: 5,
            role: "Junior Software Engineer",
            company: "Krishith Tech",
            date: "Jun 2021 – Mar 2022",
            description:
                "Co-developed an Order & Inventory Management System, improving system performance by 20%. Implemented wishlist and recommendation engine.",
        },
    ],
    projects: [
        {
            id: 1,
            title: "Enterprise Core",
            context: "Mettler-Toledo",
            description:
                "High-throughput microservice infrastructure handling asynchronous data processing and enterprise workflows.",
            tech: ["C#", ".NET Core", "Microservices", "RabbitMQ"],
            theme: "from-cyan-500/30 to-blue-600/30",
        },
        {
            id: 2,
            title: "Syncware Billing",
            context: "WeyBee Solutions",
            description:
                "End-to-end subscription management platform for consumer brands, featuring complex payment routing and lifecycle management.",
            tech: [".NET", "Stripe API", "SQL Server", "EF Core"],
            theme: "from-purple-500/30 to-pink-600/30",
        },
        {
            id: 3,
            title: "Workforce Manager",
            context: "HTC Global Services",
            description:
                "Secure, real-time shift scheduling and time-tracking application optimized for large-scale retail environments.",
            tech: ["C#", "REST APIs", "SQL Server"],
            theme: "from-emerald-500/30 to-teal-600/30",
        },
        {
            id: 4,
            title: "CRM Ecosystem",
            context: "Anicca Data Science",
            description:
                "Next-generation customer relationship platform rebuilt from the ground up for massive internal scale.",
            tech: ["Angular", "Microservices", "C#"],
            theme: "from-orange-500/30 to-red-600/30",
        },
    ],
};

// ==========================================
// 📂 GEMINI AI API UTILS
// ==========================================

const apiKey = "AIzaSyA0mXiPujEwOwLA-v3D3MHamqbI8DaTX0o"; // API key is provided by the execution environment

const callGeminiAI = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = `You are a professional, polite, and highly intelligent AI assistant for Vicky Manavadariya's portfolio website. 
  Your job is to answer questions about Vicky's skills, experience, and projects to potential recruiters or clients.
  Be concise, confident, and highlight his expertise as a scalable systems architect. 
  Do not invent information. Use ONLY the following data:
  ${JSON.stringify(PORTFOLIO_DATA)}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            return (
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't formulate a response."
            );
        } catch (error) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    return "I'm having trouble connecting to my AI core right now. Please try again later.";
};

// ==========================================
// 📂 PREMIUM ANIMATION UTILS & EFFECTS
// ==========================================

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) =>
            setMousePosition({ x: e.clientX, y: e.clientY });
        const handleMouseOver = (e) =>
            setIsHovering(!!e.target.closest("a, button, .hover-target"));
        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                scale: isHovering ? 2.5 : 1,
                backgroundColor: isHovering
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(255, 255, 255, 0.8)",
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5,
            }}
        />
    );
};

const ScrollFillText = ({ text, className = "" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 85%", "center 40%"],
    });
    const clipPath = useTransform(
        scrollYProgress,
        [0, 1],
        ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
    );

    return (
        <div ref={ref} className={`relative inline-block ${className}`}>
            <div
                className="text-transparent"
                style={{
                    WebkitTextStroke: "max(1px, 0.1vw) rgba(255,255,255,0.3)",
                }}
            >
                {text}
            </div>
            <motion.div
                style={{ clipPath }}
                className="absolute top-0 left-0 w-full h-full text-white whitespace-nowrap overflow-hidden"
            >
                {text}
            </motion.div>
        </div>
    );
};

const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } =
            ref.current.getBoundingClientRect();
        setPosition({
            x: (clientX - (left + width / 2)) * 0.2,
            y: (clientY - (top + height / 2)) * 0.2,
        });
    };
    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            className="inline-block cursor-pointer hover-target"
        >
            {children}
        </motion.div>
    );
};

// ==========================================
// 📂 COMPONENTS
// ==========================================

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Hi! I'm Vicky's AI assistant. Ask me anything about his skills, experience, or projects.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        const responseText = await callGeminiAI(userMessage);

        setMessages((prev) => [...prev, { role: "ai", text: responseText }]);
        setIsLoading(false);
    };

    const handleSuggestion = (prompt) => {
        setInput(prompt);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: 20,
                            filter: "blur(10px)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="mb-4 w-[90vw] md:w-[400px] h-[500px] max-h-[70vh] bg-[#050505]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-cyan-900/30 to-blue-900/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                                        Portfolio AI
                                    </h3>
                                    <p className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />{" "}
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors hover-target p-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 rounded-2xl rounded-br-sm"
                                                : "bg-white/5 border border-white/5 text-slate-300 rounded-2xl rounded-bl-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-bl-sm text-cyan-400 flex items-center gap-2">
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />{" "}
                                        Thinking...
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length === 1 && (
                            <div className="px-5 pb-2 flex flex-wrap gap-2">
                                <button
                                    onClick={() =>
                                        handleSuggestion(
                                            "✨ Summarize Vicky's backend skills",
                                        )
                                    }
                                    className="text-[10px] uppercase font-mono tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors hover-target"
                                >
                                    ✨ Backend Skills
                                </button>
                                <button
                                    onClick={() =>
                                        handleSuggestion(
                                            "✨ What is his experience with Microservices?",
                                        )
                                    }
                                    className="text-[10px] uppercase font-mono tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors hover-target"
                                >
                                    ✨ Microservices Exp
                                </button>
                            </div>
                        )}

                        <form
                            onSubmit={handleSend}
                            className="p-4 border-t border-white/10 bg-[#0a0a0a] flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-xl bg-cyan-400 text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover-target"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-3 px-6 py-4 rounded-full bg-[#0a0a0a] border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover-target"
            >
                <Sparkles
                    size={20}
                    className={
                        isOpen
                            ? "rotate-45 transition-transform"
                            : "animate-pulse"
                    }
                />
                <span className="font-bold text-sm tracking-widest uppercase">
                    {isOpen ? "Close AI" : "Ask AI"}
                </span>
            </motion.button>
        </div>
    );
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [mobileMenuOpen]);

    const navLinks = ["About", "Expertise", "Experience", "Projects"];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-4" : "py-6 md:py-8"}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div
                        className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-4 sm:px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" : ""}`}
                    >
                        <a
                            href="#home"
                            className="hover-target text-xl font-bold tracking-tighter text-white flex items-center gap-3"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center font-black">
                                V
                            </div>
                            <span className="flex flex-col">
                                <span className="text-xs md:text-sm font-bold leading-tight uppercase tracking-widest">
                                    Vicky.
                                </span>
                                <span className="text-[9px] md:text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                                    Engineer
                                </span>
                            </span>
                        </a>

                        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            {navLinks.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="hover-target text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] relative group py-2"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
                                </a>
                            ))}
                        </nav>

                        <div className="hidden md:block">
                            <Magnetic>
                                <a
                                    href="#contact"
                                    className="px-6 py-3 rounded-full text-xs font-bold bg-white text-black hover:bg-cyan-400 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2"
                                >
                                    Let's Talk <ArrowUpRight size={14} />
                                </a>
                            </Magnetic>
                        </div>

                        <button
                            className="md:hidden text-white p-2 hover-target"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
                    >
                        <button
                            className="absolute top-6 right-6 text-white p-2 hover-target"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col items-center gap-8 text-center">
                            {[...navLinks, "Contact"].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="text-4xl font-black text-transparent hover:text-white uppercase tracking-widest transition-colors duration-300"
                                    style={{
                                        WebkitTextStroke:
                                            "1px rgba(255,255,255,0.5)",
                                    }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Hero = () => {
    return (
        <section
            id="home"
            className="relative min-h-[100svh] flex flex-col justify-center pt-24 md:pt-20 bg-black overflow-hidden border-b border-white/5"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-grow flex flex-col justify-center pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-8 md:mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md self-start"
                >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <span className="text-[10px] md:text-xs font-mono text-cyan-400 uppercase tracking-widest">
                        Available for hire
                    </span>
                </motion.div>

                <div className="flex flex-col mb-8 md:mb-12 relative z-10 leading-[0.85] tracking-tighter uppercase w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[clamp(3rem,10vw,10rem)] font-black text-transparent hover-target transition-colors duration-500 hover:text-white"
                        style={{
                            WebkitTextStroke:
                                "max(1px, 0.15vw) rgba(255,255,255,0.4)",
                        }}
                    >
                        Architecting
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-[clamp(3.5rem,12vw,12rem)] font-black text-white hover-target"
                    >
                        Scalable
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-x-4 md:gap-x-12 items-center hover-target"
                    >
                        <span
                            className="text-[clamp(3rem,10vw,10rem)] font-black text-transparent transition-colors duration-500 hover:text-white"
                            style={{
                                WebkitTextStroke:
                                    "max(1px, 0.15vw) rgba(255,255,255,0.4)",
                            }}
                        >
                            Systems
                        </span>
                        <span className="text-[clamp(3rem,10vw,10rem)] font-black text-cyan-400">
                            &
                        </span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-wrap gap-x-4 md:gap-x-10 items-center hover-target"
                    >
                        <span className="text-[clamp(3.2rem,11vw,11rem)] font-black text-white">
                            Clean
                        </span>
                        <span
                            className="text-[clamp(3.2rem,11vw,11rem)] font-black text-transparent transition-colors duration-500 hover:text-white"
                            style={{
                                WebkitTextStroke:
                                    "max(1px, 0.15vw) rgba(255,255,255,0.4)",
                            }}
                        >
                            Code.
                        </span>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-4 md:mt-8"
                >
                    {/* Replaced just text with Text + Image Layout */}
                    <div className="lg:col-span-9 flex flex-col sm:flex-row gap-6 sm:items-center">
                        {/* Animated Profile Image Placeholder */}
                        <motion.div
                            initial={{
                                scale: 0.8,
                                opacity: 0,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 1,
                                delay: 0.8,
                                type: "spring",
                            }}
                            className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/20 overflow-hidden shrink-0 relative group hover-target"
                        >
                            <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            {/* Replace src with your actual image URL */}
                            <img
                                src="https://lh3.googleusercontent.com/a/ACg8ocKwH7nAB8AY1fSFBs2Tngj7UV7uDnW5dy2-zAPADSGhJRvh7j598A=s317-c-no"
                                alt="Vicky Manavadariya"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                        </motion.div>

                        <p className="text-lg md:text-2xl text-slate-400 font-light leading-relaxed border-l-2 border-cyan-500/50 pl-4 md:pl-6 max-w-2xl">
                            I'm{" "}
                            <strong className="text-white font-medium">
                                Vicky Manavadariya
                            </strong>
                            , a Software Engineer specializing in C#, .NET Core,
                            Microservices, and Angular.
                        </p>
                    </div>

                    <div className="lg:col-span-3 flex justify-start lg:justify-end mt-4 lg:mt-0">
                        <Magnetic>
                            <a
                                href="#projects"
                                className="hover-target group flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-500"
                            >
                                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                            </a>
                        </Magnetic>
                    </div>
                </motion.div>
            </div>

            {/* ⚠️ Scrolling Marquee Removed From Here Completely */}
        </section>
    );
};

const About = () => {
    return (
        <section
            id="about"
            className="py-24 md:py-40 relative bg-black overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="mb-12 md:mb-20">
                    <h2 className="text-xs md:text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-4">
                        01. The Architect
                    </h2>
                    <ScrollFillText
                        text="About Me."
                        className="text-[clamp(3rem,8vw,5rem)] font-black tracking-tight"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:col-span-2 md:row-span-2 p-8 md:p-14 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-colors duration-500" />
                        <User className="text-white/20 w-8 h-8 md:w-12 md:h-12 mb-6 md:mb-8" />
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                            Philosophy
                        </h3>
                        <p className="text-base md:text-xl text-slate-400 font-light leading-relaxed">
                            {PORTFOLIO_DATA.personal.about}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#050505] border border-white/5 flex flex-col justify-center items-center text-center group hover:border-cyan-500/30 transition-colors"
                    >
                        <MapPin className="text-cyan-400 w-8 h-8 md:w-12 md:h-12 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500" />
                        <p className="text-xs md:text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">
                            Based In
                        </p>
                        <h4 className="text-2xl md:text-3xl font-bold text-white">
                            Bengaluru,
                            <br />
                            India
                        </h4>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 flex flex-col justify-center items-center text-center group hover-target"
                    >
                        <h4 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 group-hover:scale-105 transition-transform duration-500">
                            4+
                        </h4>
                        <p className="text-xs md:text-sm font-mono text-cyan-400 uppercase tracking-widest">
                            Years Experience
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-white/20 transition-colors flex flex-col justify-center"
                    >
                        <GraduationCap className="text-white/20 w-8 h-8 mb-4" />
                        <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                            {PORTFOLIO_DATA.education.details}
                        </p>
                        <h4 className="text-lg md:text-xl font-bold text-white mb-1">
                            {PORTFOLIO_DATA.education.institution}
                        </h4>
                        <p className="text-sm text-cyan-400">
                            {PORTFOLIO_DATA.education.degree}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="md:col-span-2 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors flex flex-col justify-center"
                    >
                        <Award className="text-cyan-400 w-8 h-8 mb-4" />
                        <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                            Certification
                        </p>
                        <h4 className="text-xl md:text-3xl font-bold text-white mb-1">
                            {PORTFOLIO_DATA.certification.title}
                        </h4>
                        <p className="text-sm md:text-base text-slate-400">
                            {PORTFOLIO_DATA.certification.issuer}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Expertise = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <section
            id="expertise"
            className="py-24 md:py-40 relative bg-[#030303] border-t border-white/5 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20">
                <div className="lg:w-1/3">
                    <div className="lg:sticky lg:top-40">
                        <h2 className="text-xs md:text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-4">
                            02. Arsenal
                        </h2>
                        <ScrollFillText
                            text="Expertise."
                            className="text-[clamp(3rem,8vw,4rem)] font-black tracking-tight mb-4 md:mb-6 leading-none"
                        />
                        <p className="text-base md:text-xl text-slate-400 font-light leading-relaxed">
                            The tools and technologies I use to build resilient,
                            scalable systems.
                        </p>
                    </div>
                </div>

                <div className="lg:w-2/3 flex flex-col justify-center">
                    {PORTFOLIO_DATA.skills.map((skill, index) => (
                        <div
                            key={index}
                            className="border-b border-white/10 py-6 md:py-10 relative group cursor-pointer hover-target"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 w-full">
                                <div className="w-full md:w-1/2 flex-shrink-0">
                                    <h3
                                        className="text-4xl md:text-6xl font-black transition-all duration-500 uppercase tracking-tighter"
                                        style={{
                                            WebkitTextStroke:
                                                hoveredIndex === index
                                                    ? "max(1px, 0.1vw) #fff"
                                                    : "max(1px, 0.1vw) rgba(255,255,255,0.4)",
                                            color:
                                                hoveredIndex === index
                                                    ? "#fff"
                                                    : "transparent",
                                        }}
                                    >
                                        {skill.outline}
                                    </h3>
                                </div>

                                <div
                                    className={`w-full md:w-1/2 transition-all duration-500 ease-[0.22,1,0.36,1] overflow-hidden ${hoveredIndex === index ? "max-h-96 opacity-100" : "max-h-0 md:max-h-96 opacity-50 md:opacity-100"}`}
                                >
                                    <div
                                        className={`rounded-2xl transition-all duration-500 border ${hoveredIndex === index ? "p-6 bg-white/[0.05] border-white/10 backdrop-blur-md" : "p-0 border-transparent bg-transparent"}`}
                                    >
                                        <p
                                            className={`font-mono text-xs uppercase tracking-widest mb-4 hidden md:block transition-colors duration-300 ${hoveredIndex === index ? "text-cyan-400" : "text-slate-500"}`}
                                        >
                                            {skill.category}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {skill.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] md:text-xs border transition-colors duration-300 ${hoveredIndex === index ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100" : "bg-[#050505] border-white/10 text-slate-400"}`}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Experience = () => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <section
            id="experience"
            className="py-24 md:py-40 relative bg-black border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="mb-16 md:mb-24 text-center flex flex-col items-center">
                    <h2 className="text-xs md:text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-4">
                        03. Journey
                    </h2>
                    <ScrollFillText
                        text="Experience."
                        className="text-[clamp(3rem,8vw,5rem)] font-black tracking-tight"
                    />
                </div>

                <div className="max-w-4xl mx-auto relative group/timeline">
                    <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />

                    <div className="space-y-12 md:space-y-0">
                        {PORTFOLIO_DATA.experience.map((exp, index) => {
                            const isHovered = hoveredId === exp.id;
                            const isDimmed = hoveredId !== null && !isHovered;

                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    onMouseEnter={() => setHoveredId(exp.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16 transition-all duration-500 hover-target ${isDimmed ? "opacity-30 blur-[2px] scale-[0.98]" : "opacity-100 blur-0 scale-100"} ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                                >
                                    <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 mt-8 md:mt-0 z-10">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${isHovered ? "bg-cyan-400 border-cyan-400 shadow-[0_0_20px_#22d3ee] scale-150" : "bg-black border-cyan-500/50"}`}
                                        />
                                    </div>

                                    <div
                                        className={`hidden md:block w-1/2 ${index % 2 === 0 ? "text-right pr-16" : "text-left pl-16"}`}
                                    >
                                        <span
                                            className={`font-mono text-2xl font-black transition-colors duration-500 ${isHovered ? "text-cyan-400" : "text-white/20"}`}
                                        >
                                            {exp.date}
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16"}`}
                                    >
                                        <div
                                            className={`p-6 md:p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-md transition-all duration-500 ${isHovered ? "border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.1)] bg-white/[0.05]" : "border-white/5"}`}
                                        >
                                            <div className="md:hidden font-mono text-cyan-400 text-xs mb-4">
                                                {exp.date}
                                            </div>
                                            <h3
                                                className={`text-xl md:text-2xl font-bold transition-colors duration-500 mb-2 ${isHovered ? "text-white" : "text-slate-300"}`}
                                            >
                                                {exp.role}
                                            </h3>
                                            <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Briefcase size={14} />{" "}
                                                {exp.company}
                                            </div>
                                            <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Projects = () => {
    return (
        <section
            id="projects"
            className="py-24 md:py-40 relative bg-[#030303] border-y border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-8">
                    <div>
                        <h2 className="text-xs md:text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-4">
                            04. Selected Works
                        </h2>
                        <ScrollFillText
                            text="Featured Projects."
                            className="text-[clamp(3rem,8vw,5rem)] font-black tracking-tight"
                        />
                    </div>
                    {/* GitHub link previously here is now removed */}
                </div>

                <div className="relative space-y-8 md:space-y-0">
                    {PORTFOLIO_DATA.projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="md:sticky"
                            style={{ top: `calc(15vh + ${index * 40}px)` }}
                        >
                            <div className="hover-target w-full rounded-[2rem] md:rounded-[3rem] p-[1px] md:p-[2px] overflow-hidden relative group">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${project.theme} opacity-40 blur-2xl group-hover:opacity-80 transition-opacity duration-700`}
                                />

                                <div className="relative h-full bg-[#050505]/60 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] border border-white/10 p-8 md:p-14 overflow-hidden">
                                    <div
                                        className="absolute top-4 right-4 md:top-8 md:right-8 text-[6rem] md:text-[10rem] font-black text-transparent opacity-10 transition-all duration-700 select-none pointer-events-none group-hover:scale-110 group-hover:opacity-20"
                                        style={{
                                            WebkitTextStroke:
                                                "max(1px, 0.2vw) rgba(255,255,255,0.8)",
                                        }}
                                    >
                                        0{index + 1}
                                    </div>

                                    <div className="relative z-10 w-full md:w-3/4 flex flex-col">
                                        <div className="flex justify-between items-start mb-10 md:mb-16">
                                            <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 bg-white/[0.05] text-[10px] md:text-xs font-mono text-white uppercase tracking-widest backdrop-blur-md shadow-lg">
                                                {project.context}
                                            </span>
                                        </div>

                                        <h3
                                            className="text-4xl md:text-6xl font-black text-transparent group-hover:text-white transition-colors duration-500 mb-6 md:mb-8 tracking-tight"
                                            style={{
                                                WebkitTextStroke:
                                                    "max(1px, 0.15vw) rgba(255,255,255,0.7)",
                                            }}
                                        >
                                            {project.title}
                                        </h3>

                                        <p className="text-base md:text-xl text-slate-300 font-light leading-relaxed mb-8 md:mb-12">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {project.tech.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-black/50 text-white font-mono text-[10px] md:text-xs border border-white/10 uppercase tracking-widest backdrop-blur-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Contact = () => {
    return (
        <section
            id="contact"
            className="pt-32 pb-10 md:pt-40 md:pb-12 relative bg-black overflow-hidden"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
                <p className="text-xs md:text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-8 md:mb-10">
                    Ready to build?
                </p>

                {/* Restored the Magnetic Pull Animation for SAY HELLO */}
                <div className="mb-16 md:mb-24 flex justify-center w-full">
                    <Magnetic>
                        <h2
                            className="text-[18vw] md:text-[13vw] font-black text-transparent tracking-tighter leading-none transition-colors duration-500 hover:text-white cursor-default select-none"
                            style={{
                                WebkitTextStroke:
                                    "max(1px, 0.2vw) rgba(255,255,255,0.4)",
                            }}
                        >
                            SAY HELLO.
                        </h2>
                    </Magnetic>
                </div>

                {/* Contact Info Added Here */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-20 z-20">
                    <Magnetic>
                        <a
                            href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                            className="flex flex-col items-center gap-4 hover-target group"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-colors duration-500">
                                <Mail
                                    size={24}
                                    className="text-slate-400 group-hover:text-black transition-colors"
                                />
                            </div>
                            <span className="text-lg md:text-xl font-medium text-slate-300 group-hover:text-white">
                                {PORTFOLIO_DATA.personal.email}
                            </span>
                        </a>
                    </Magnetic>

                    <Magnetic>
                        <a
                            href={`tel:${PORTFOLIO_DATA.personal.phone.replace(/\s+/g, "")}`}
                            className="flex flex-col items-center gap-4 hover-target group"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-colors duration-500">
                                <Phone
                                    size={24}
                                    className="text-slate-400 group-hover:text-black transition-colors"
                                />
                            </div>
                            <span className="text-lg md:text-xl font-medium text-slate-300 group-hover:text-white">
                                {PORTFOLIO_DATA.personal.phone}
                            </span>
                        </a>
                    </Magnetic>
                </div>

                <div className="pt-8 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 w-full">
                    <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">
                        © {new Date().getFullYear()} Vicky Manavadariya.
                    </p>
                    <div className="flex gap-6 md:gap-10">
                        <a
                            href={PORTFOLIO_DATA.personal.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="hover-target text-[10px] md:text-xs font-mono text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                        >
                            LinkedIn
                        </a>
                        {/* GitHub removed from footer */}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==========================================
// 📂 MAIN APP ROOT
// ==========================================

export default function App() {
    return (
        <div className="min-h-[100svh] bg-black text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden md:cursor-none">
            <CustomCursor />
            <Navbar />
            <AIChatWidget />

            <main className="relative z-10">
                <Hero />
                <About />
                <Expertise />
                <Experience />
                <Projects />
                <Contact />
            </main>
        </div>
    );
}
