import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const MyProjectsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        fetchMyProjects(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMyProjects = async (uid) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/projects/user/${uid}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5001/api/projects/${projectId}`);
      setProjects((current) => current.filter((project) => project._id !== projectId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      {loading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">You have not created any projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
