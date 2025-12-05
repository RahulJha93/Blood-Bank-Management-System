import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const WEBSITE_NAME = import.meta.env.VITE_WEBSITE_NAME;
import logo from "../../public/logo.png";
export default function Header({ currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Search Blood Banks", path: "/search-blood-banks" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const authLinks = currentUser
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profile", path: "/profile" },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Register as Donor", path: "/register/donor" },
        { name: "Register as Facility", path: "/register/facility" },
      ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-48 h-auto flex items-center justify-center rounded-lg text-white">
              <img src={logo} alt="Logo" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              {WEBSITE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActiveLink(link.path)
                    ? "text-primary-red"
                    : "text-gray-700 hover:text-primary-red"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    link.name.includes("Register")
                      ? "bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red-dark"
                      : isActiveLink(link.path)
                      ? "text-primary-red"
                      : "text-gray-700 hover:text-primary-red"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute top-2 left-0 w-6 h-0.5 bg-gray-600 transform transition duration-200 ${
                mobileOpen ? "rotate-45 top-3" : ""
              }`}></span>
              <span className={`absolute top-3 left-0 w-6 h-0.5 bg-gray-600 transition duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}></span>
              <span className={`absolute top-4 left-0 w-6 h-0.5 bg-gray-600 transform transition duration-200 ${
                mobileOpen ? "-rotate-45 top-3" : ""
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`md:hidden transition-all duration-300 ${
          mobileOpen ? "block" : "hidden"
        }`}>
          <div className="border-t border-gray-200 pt-4 pb-4 bg-white">
            {/* Main Navigation Links */}
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2 text-sm font-medium ${
                    isActiveLink(link.path)
                      ? "text-primary-red"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Auth Links */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2 text-sm font-medium ${
                    link.name.includes("Register")
                      ? "bg-primary-red text-white rounded-lg mx-4 text-center"
                      : isActiveLink(link.path)
                      ? "text-primary-red"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}