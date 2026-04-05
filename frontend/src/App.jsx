import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import ProfilePage from './pages/ProfilePage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProjectsPage from './pages/ProjectsPage';
import BookmarksPage from './pages/BookmarksPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-inter">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-projects" element={<MyProjectsPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/project/:id/edit" element={<EditProject />} />
            <Route path="/create" element={<CreateProject />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
