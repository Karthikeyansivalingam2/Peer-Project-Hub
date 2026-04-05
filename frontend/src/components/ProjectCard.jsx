import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProjectCard = ({ project, isTrending, onDelete }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(project.likes?.length || 0);
    const [user, setUser] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        setLiked(allLiked(user, project.likes));
        setLikeCount(project.likes?.length || 0);
    }, [project.likes, user]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await axios.get('http://localhost:5001/api/auth/bookmarks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const projectIds = res.data.bookmarks?.map((bookmark) => bookmark._id);
                setBookmarked(projectIds?.includes(project._id));
            } catch (error) { console.error(error); }
        };
        fetchBookmarks();
    }, [user, project._id]);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return alert('Please login to bookmark');
        try {
            const token = await user.getIdToken();
            await axios.post(`http://localhost:5001/api/auth/bookmark/${project._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookmarked(!bookmarked);
        } catch (error) { console.error(error); }
    };

    function allLiked(user, likes) {
        return user && likes?.includes(user.uid);
    }

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return alert('Please login to like projects');
        try {
            const token = await user.getIdToken();
            const res = await axios.post(`http://localhost:5001/api/projects/${project._id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLiked(res.data.liked);
            setLikeCount(res.data.likes.length);
        } catch (error) { console.error(error); }
    };

    return (
        <motion.div
            whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
            className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 hover:border-indigo-500/20 shadow-sm transition-all duration-300 relative overflow-hidden"
        >
            {/* Visual Indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm">
                        {project.user?.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 truncate max-w-[150px] leading-none mb-1">
                            {project.user?.email}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Student Dev</p>
                    </div>
                </div>
                {isTrending && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        🔥 Trending
                    </span>
                )}
            </div>

            <Link to={`/project/${project._id}`} className="flex flex-col h-full group">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {project.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                    {project.tags?.length > 3 && (
                        <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 group transition-all font-bold text-sm ${
                            liked ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
                        }`}
                    >
                        <span className="text-lg group-active:scale-125 transition-transform">{liked ? '♥' : '♡'}</span>
                        <span>{likeCount}</span>
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`flex items-center gap-2 transition-all font-bold text-sm ${
                            bookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                        }`}
                    >
                        <span className="text-lg">{bookmarked ? '📌' : '🔖'}</span>
                    </button>
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if(window.confirm('Are you sure you want to delete this project?')) onDelete(project._id);
                            }}
                            className="text-slate-300 hover:text-red-500 transition-all font-bold text-sm"
                        >
                            🗑 Delete
                        </button>
                    )}
                </div>
                <Link
                    to={`/project/${project._id}`}
                    className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
                >
                    View More <span>→</span>
                </Link>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
