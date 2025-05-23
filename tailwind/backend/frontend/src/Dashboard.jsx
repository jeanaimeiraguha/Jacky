import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Dashboard() {
  const navItems = [
    { to: '/parkingslots', icon: 'bi-box-seam', label: 'Parking Slots' },
    { to: '/cars', icon: 'bi-car-front-fill', label: 'Cars' },
    { to: '/parkingrecords', icon: 'bi-clock-history', label: 'Parking Records' },
    { to: '/payments', icon: 'bi-currency-dollar', label: 'Payments' },
  ];

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Navbar with horizontal nav */}
      <nav
        className="navbar navbar-expand bg-teal text-white shadow-sm px-4"
        style={{ backgroundColor: '#008080' }}
      >
        <div className="container-fluid">
          {/* Brand */}
          <NavLink
            to="/"
            className="navbar-brand text-white fw-bold fs-4"
            style={{ letterSpacing: '1.5px' }}
          >
            PSSMS
          </NavLink>

          {/* Hamburger for small screens */}
          <button
            className="navbar-toggler border-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {navItems.map(({ to, icon, label }) => (
                <li className="nav-item mx-2" key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center ${
                        isActive ? 'active text-warning' : 'text-white'
                      }`
                    }
                    style={{ fontWeight: '500' }}
                  >
                    <i className={`bi ${icon} me-1 fs-5`}></i> {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            {/* User Section */}
            <div className="d-flex align-items-center text-white">
              <i className="bi bi-person-circle fs-4 me-2"></i>
              <span className="fw-semibold">Admin</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="flex-grow-1 p-4"
        style={{ backgroundColor: '#e0f2f1', overflowY: 'auto' }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;