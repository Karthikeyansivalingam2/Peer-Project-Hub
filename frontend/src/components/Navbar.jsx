import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const avatarLabel = user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-all duration-300">
                        🎓
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 leading-none block">Peer Hub</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Student Portal</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2.5 rounded-xl bg-indigo-600 font-bold text-white text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/create" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                                <span>+</span> Share Project
                            </Link>
                            
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                                >
                                    {avatarLabel}
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-14 w-56 p-2 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
                                        >
                                            <div className="px-4 py-3 mb-1 border-b border-slate-100 text-xs text-slate-400 font-semibold truncate leading-tight">
                                                {user.email}
                                            </div>
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 transition-colors font-semibold text-sm">
                                                👤 My Profile
                                            </Link>
                                            <Link to="/bookmarks" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 transition-colors font-semibold text-sm">
                                                📌 Saved Projects
                                            </Link>
                                            <button onClick={() => signOut(auth)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm">
                                                🚪 Exit Session
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
