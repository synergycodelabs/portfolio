// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import Resume from './components/sections/Resume';
import FloatingChatBot from './components/FloatingChatBot';
import NotFound from './components/sections/NotFound';
import MobileNav from './components/ui/MobileNav';

const App = () => {
  const [theme, toggleTheme] = useTheme();
  const basename = import.meta.env.PROD ? '/portfolio/' : '/';

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
          <header className={`fixed top-0 w-full ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm z-50`}>
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Angel's Portfolio</h1>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <NavLink to="/" end className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Home
                  </NavLink>
                  <NavLink to="/about" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    About
                  </NavLink>
                  <NavLink to="/experience" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Experience
                  </NavLink>
                  <NavLink to="/skills" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Skills
                  </NavLink>
                  <NavLink to="/projects" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Projects
                  </NavLink>
                  <NavLink to="/resume" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Resume
                  </NavLink>
                  <NavLink to="/contact" className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
                  }>
                    Contact
                  </NavLink>
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                {/* Mobile Theme Toggle */}
                <div className="md:hidden">
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
              </div>
              {/* Mobile Navigation */}
              <MobileNav theme={theme} />
            </div>
          </header>

          <main className="pt-32">
            <Routes>
              <Route path="/" element={<Home theme={theme} />} />
              <Route path="/about" element={<About theme={theme} />} />
              <Route path="/experience" element={<Experience theme={theme} />} />
              <Route path="/skills" element={<Skills theme={theme} />} />
              <Route path="/projects" element={<Projects theme={theme} />} />
              <Route path="/resume" element={<Resume theme={theme} />} />
              <Route path="/contact" element={<Contact theme={theme} />} />
              <Route path="*" element={<NotFound theme={theme} />} />
            </Routes>
          </main>

          <FloatingChatBot theme={theme} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;