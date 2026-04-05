import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data);
                setLikeCount(res.data.likes?.length || 0);
            } catch (error) { console.error(error); }
        };
        const fetchComments = async () => {
            try {
                const res = await api.get(`/projects/${id}/comments`);
                setComments(res.data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchProject();
        fetchComments();
    }, [id]);

    useEffect(() => {
        if (project && user) {
            setLiked(project.likes?.includes(user.uid) || false);
            setUserRating(project.ratings?.find(r => r.userId === user.uid)?.rating || 0);
        }
    }, [project, user]);

    const handleLike = async () => {
        if (!user) return alert('Please login to like this project.');
        try {
            const token = await user.getIdToken();
            const res = await api.post(`/projects/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLiked(res.data.liked);
            setLikeCount(res.data.likes.length);
        } catch (error) { console.error(error); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        try {
            const token = await user.getIdToken();
            await api.post(`/projects/${id}/comments`, { text: newComment }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewComment('');
            const res = await api.get(`/projects/${id}/comments`);
            setComments(res.data);
        } catch (error) { console.error(error); }
    };

    const handleBookmark = async () => {
        if (!user) return alert('Please login to bookmark this project.');
        try {
            const token = await user.getIdToken();
            await api.post(`/auth/bookmark/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookmarked(!bookmarked);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await api.get('/auth/bookmarks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const projectIds = res.data.bookmarks?.map((bookmark) => bookmark._id);
                setBookmarked(projectIds?.includes(id));
            } catch (error) { console.error(error); }
        };
        fetchBookmarks();
    }, [user, id]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen pt-40 px-4 text-center bg-slate-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Project Not Found</h1>
            <Link to="/" className="text-indigo-600 font-bold hover:underline">← Go Back Home</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors">
                    <span>←</span> <span>All Projects</span>
                </Link>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Side: Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-slate-200 p-8 sm:p-12 shadow-sm">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                {project.title}
                            </h1>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                                    {project.user?.email?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold leading-none mb-1">{project.user?.email}</p>
                                    <p className="text-xs text-slate-400 font-medium">Published on {new Date(project.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest">About Project</h3>
                            <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 sm:p-12 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                <span>💬</span> Feedback <span className="text-indigo-600">({comments.length})</span>
                            </h3>

                            {user ? (
                                <form onSubmit={handleComment} className="mb-12">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a constructive review..."
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none min-h-[120px] mb-4 text-slate-700"
                                    />
                                    <button type="submit" className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                                        Post Review
                                    </button>
                                </form>
                            ) : (
                                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center mb-10">
                                    <p className="text-indigo-600 font-bold">Sign in to leave a review</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {comments.map(comment => (
                                    <div key={comment._id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                                                {comment.user?.email?.[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{comment.user?.email}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm sticky top-32">
                            <div className="space-y-6 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Metrics</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 font-medium">Views</span>
                                        <span className="font-bold text-slate-900">{project.views || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600 font-medium">Average Rating</span>
                                        <span className="font-bold text-indigo-600">{project.averageRating || 0}/5</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                                    <button onClick={handleLike} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${liked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        <span>{liked ? '♥' : '♡'}</span>
                                        <span>{liked ? 'Endorsed' : 'Endorse'} ({likeCount})</span>
                                    </button>
                                    <button onClick={handleBookmark} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${bookmarked ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        <span>{bookmarked ? '📌' : '🔖'}</span>
                                        <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
                                    </button>
                                    <a href={project.githubLink} target="_blank" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                        <span>💻</span> Source Code
                                    </a>
                                    {project.liveDemoLink && (
                                        <a href={project.liveDemoLink} target="_blank" className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                            <span>🌐</span> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
