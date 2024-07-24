import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Fintech Platform</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Create Account</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
                
                <li className="nav-item">
                    <Link className="nav-link" to="/deposit">Deposit</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/withdraw">Withdraw</Link>
                </li>
            </ul>
        </div>
    </nav>
);

export default Navbar;
