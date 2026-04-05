import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StatsSection = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/projects/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return null;

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, icon: '🚀', color: 'from-blue-500 to-indigo-600' },
        { label: 'Active Users', value: stats.totalUsers, icon: '🎓', color: 'from-purple-500 to-pink-600' },
        { 
            label: 'Top Project', 
            value: stats.topProjectTitle, 
            icon: '🌟', 
            color: 'from-amber-400 to-orange-500',
            link: stats.topProjectId ? `/project/${stats.topProjectId}` : null 
        },
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl border border-slate-200 p-10 hover:border-indigo-600/30 transition-all duration-300 shadow-sm hover:shadow-xl group"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="text-4xl group-hover:rotate-12 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                                    {stat.label}
                                </h3>
                            </div>
                            
                            {stat.link ? (
                                <Link to={stat.link} className="text-3xl font-extrabold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 block">
                                    {stat.value}
                                </Link>
                            ) : (
                                <div className="text-4xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {stat.value}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
