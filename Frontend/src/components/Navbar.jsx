import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/',          label: 'Home',       end: true },
  { to: '/student',   label: 'Student'              },
  { to: '/parent',    label: 'Parent'               },
  { to: '/flashcards',label: 'Flashcards'           },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">⚡ AI Learning Companion</span>
      <div className="navbar-links">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
