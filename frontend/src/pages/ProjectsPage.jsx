import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/projects');
                // Backend returns { projects, ... }
                const projectData = res.data.projects || res.data;
                setProjects(projectData);
                setFilteredProjects(projectData);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        let filtered = projects;
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProjects(filtered);
    }, [searchTerm, projects]);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Explore <span className="text-indigo-600">The Catalog</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            Discover innovative solutions crafted by students across various disciplines.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 rounded-[2.5rem] bg-slate-200 animate-pulse border border-slate-300" />
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-32 rounded-[3rem] bg-white border border-slate-200">
                        <span className="text-5xl mb-6 block">📂</span>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No projects matching your search</h2>
                        <p className="text-slate-400 mb-8">Try broader keywords or browse all tags.</p>
                        <button onClick={() => setSearchTerm('')} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
