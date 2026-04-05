import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CreateProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveDemoLink, setLiveDemoLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login first');
        setLoading(true);
        try {
            const token = await user.getIdToken();
            await axios.post('http://localhost:5001/api/projects', {
                title,
                description,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                githubLink,
                liveDemoLink,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 shadow-sm">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Share Your Build</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Tell the community about your technical masterpiece.</p>
                    </div>

                    {!user && (
                        <div className="p-4 mb-8 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-center">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-amber-800 font-bold text-sm">You must be logged in to create a project.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Project Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Healthcare Automation AI"
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Detailed Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What problem does it solve? What tech did you use?"
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all min-h-[160px] font-semibold text-slate-800 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Technologies Used (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="React, Node.js, MongoDB..."
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    GitHub Link
                                </label>
                                <input
                                    type="url"
                                    value={githubLink}
                                    onChange={(e) => setGithubLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    Live Demo URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={liveDemoLink}
                                    onChange={(e) => setLiveDemoLink(e.target.value)}
                                    placeholder="https://my-app.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={!user || loading}
                                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:shadow-none"
                            >
                                {loading ? 'Processing...' : '🚀 Launch Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateProject;
