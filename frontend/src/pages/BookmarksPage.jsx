import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await axios.get('http://localhost:5001/api/auth/bookmarks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookmarks(res.data.bookmarks || []);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, [user]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Saved <span className="text-indigo-600">Archive</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Your curated collection of technical inspiration and research projects.
                    </p>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-32 rounded-[3rem] bg-white border border-slate-200">
                        <span className="text-5xl mb-6 block">📚</span>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No bookmarks yet</h2>
                        <p className="text-slate-400">Save projects while exploring the catalog to see them here.</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {bookmarks.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BookmarksPage;
