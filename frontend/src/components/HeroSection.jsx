import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative py-24 mb-10 overflow-hidden">
            {/* Background elements move to parent or kept here if isolated */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl mx-auto z-10 px-4 text-center"
            >
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm mb-12"
                >
                    <span className="flex h-2.5 w-2.5 bg-indigo-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest shadow-none">Final Project Submission</span>
                </motion.div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                    Showcase Your <br />
                    <span className="text-indigo-600 underline">Project Excellence.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-16 leading-relaxed px-4">
                    The simplest way to discover amazing technical projects created by your peers. 
                    Share your builds, learn with mentors, and grow your student portfolio.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
                    <Link
                        to="/create"
                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span>🚀</span>
                        <span>Start Sharing</span>
                    </Link>
                    <Link
                        to="/projects"
                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg shadow-sm hover:bg-slate-50 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span>🔭</span>
                        <span>Browse Projects</span>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
