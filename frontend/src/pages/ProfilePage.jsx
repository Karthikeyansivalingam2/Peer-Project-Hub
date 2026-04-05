import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
                fetchProfileData(currentUser);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchProfileData = async (currentUser) => {
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const [profileRes, projectsRes] = await Promise.all([
                axios.get('http://localhost:5001/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:5001/api/projects/user/${currentUser.uid}`)
            ]);
            
            setDbUser(profileRes.data);
            setEditName(profileRes.data.name || '');
            setEditBio(profileRes.data.bio || '');
            setProjects(projectsRes.data);
        } catch (err) {
            console.error('Error fetching profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');
        try {
            const token = await user.getIdToken();
            const res = await axios.put('http://localhost:5001/api/auth/profile', 
                { name: editName, bio: editBio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDbUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.details || err.response?.data?.error || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const token = await user.getIdToken();
            await axios.delete(`http://localhost:5001/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects((current) => current.filter((p) => p._id !== projectId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl mb-12"
                >
                    <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
                    <div className="relative px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:space-x-5 mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-2 shadow-xl">
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white font-black">
                                        {dbUser?.name?.[0]?.toUpperCase() || dbUser?.email?.[0]?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0 text-center sm:text-left flex-grow">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    {dbUser?.name || 'Developer'}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">{dbUser?.email}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-6 sm:mt-0 px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    key="edit-form"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleUpdateProfile}
                                    className="space-y-4 pt-6"
                                >
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                                        <textarea
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            rows={4}
                                            placeholder="Tell the community about yourself..."
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
                                    >
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="display-bio"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-6 border-t border-slate-100 dark:border-slate-800"
                                >
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">About Me</h3>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {dbUser?.bio || "This developer hasn't added a bio yet."}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Projects Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        My Showcase <span className="text-indigo-600 dark:text-indigo-400 text-lg">({projects.length})</span>
                    </h2>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="text-5xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Build your first showcase</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Share your coding journey with the community.</p>
                        <button
                            onClick={() => navigate('/create')}
                            className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
                        >
                            🚀 Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <ProjectCard 
                                key={project._id} 
                                project={project} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

