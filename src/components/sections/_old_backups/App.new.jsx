import React from 'react';
import ThemeToggle from '../../ThemeToggle';
import { useTheme } from '../../../hooks/useTheme';
import Home from '../Home';
import About from '../About';
import Experience from '../Experience';
import Skills from '../Skills';
import Projects from '../Projects';
import Contact from '../Contact';

const App = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
        {/* Header/Navigation */}
        <header className={`fixed top-0 w-full ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm z-50 p-4`}>
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Angel Guevara</h1>
            <div className="flex items-center space-x-6">
              <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
              <a href="#skills" className="hover:text-blue-500 transition-colors">Skills</a>
              <a href="#projects" className="hover:text-blue-500 transition-colors">Projects</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Home theme={theme} />
          <About theme={theme} />
          <Experience theme={theme} />
          <Skills theme={theme} />
          <Projects theme={theme} />
          <Contact theme={theme} />
        </main>
      </div>
    </div>
  );
};

export default App;