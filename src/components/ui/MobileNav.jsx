import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNav = ({ theme }) => {
  return (
    <div className="flex md:hidden w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-6 px-4 py-2 min-w-min">
        <NavLink to="/" end className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          About
        </NavLink>
        <NavLink to="/experience" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Experience
        </NavLink>
        <NavLink to="/skills" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Skills
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Projects
        </NavLink>
        <NavLink to="/resume" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Resume
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) =>
          `transition-colors whitespace-nowrap ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`
        }>
          Contact
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;