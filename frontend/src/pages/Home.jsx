import { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import ProjectCard from '../components/ProjectCard';
import StatsSection from '../components/StatsSection';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/projects?page=${page}&limit=6`);
                setProjects(res.data.projects);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [page]);

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 selection:bg-indigo-600 selection:text-white">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-soft-gradient opacity-100" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <HeroSection />

                {/* Platform Stats Section */}
                <StatsSection />

                {/* Dashboard Header */}
                <section className="mb-10 mt-16 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm shadow-indigo-100/30">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 leading-tight">
                                Explore <span className="text-indigo-600 underline">Project Pool</span>
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">
                                Discover technical breakthroughs and share your own masterpieces with others.
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </div>
                    </div>
                </section>

                {/* Project Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 rounded-[2rem] bg-slate-200 animate-pulse border border-slate-300" />
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-24 rounded-[2rem] bg-slate-100/50 border-2 border-dashed border-slate-200">
                        <span className="text-4xl mb-4 block">📦</span>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No projects found</h3>
                        <p className="text-slate-400">Try common tags like React, Node, or Firebase.</p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Simple Pagination */}
                {!loading && (
                    <div className="mt-16 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-6 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            ← Earlier
                        </button>
                        <div className="px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 font-bold text-indigo-600 text-sm">
                            {page} / {totalPages}
                        </div>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-6 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
            
            <footer className="mt-40 p-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] bg-white border-t border-slate-100">
                Created for Final Student Assessment // 2026
            </footer>
        </div>
    );
};

export default Home;
