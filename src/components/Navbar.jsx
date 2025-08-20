import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaCalendarAlt, FaHome, FaTachometerAlt, FaEnvelope, FaGift, FaBullhorn, FaUserCircle, FaCreditCard, FaBars, FaTimes, FaCog, FaStar, FaCrown } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-black border-b border-zinc-900 px-6 py-4 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenus}>
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-lg">GGE</span>
          </div>
          <span className="text-white font-bold text-xl"><span className="text-yellow-400">Glow </span><span className="text-blue-800">gracious Events</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaHome />
            <span>Accueil</span>
          </Link>
          <Link to="/events" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaCalendarAlt />
            <span>Événements</span>
          </Link>
          <Link to="/packages" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaGift />
            <span>Packages</span>
          </Link>
          <Link to="/testimonials" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaStar />
            <span>Témoignages</span>
          </Link>
          <Link to="/announcements" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaBullhorn />
            <span>Annonces</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
            <FaEnvelope />
            <span>Contact</span>
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                  <FaCrown />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/payments" className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors">
                <FaCreditCard />
                <span>Paiements</span>
              </Link>
            </>
          )}
          {user && (user.role === "admin" || user.role === "agency") && (
            <Link to="/events/create" className="btn-primary">
              Créer Événement
            </Link>
          )}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username || user.email}
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-800"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-white text-lg" />
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  
                  {/* User Info */}
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">
                      {user.username || user.email}
                    </div>
                    <div className="text-blue-800 text-xs capitalize">
                      {user.role || 'client'}
                    </div>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="flex items-center px-4 py-2 text-white hover:bg-zinc-800 transition-colors"
                      >
                        <FaUser className="mr-3" />
                        Mon Profil
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={closeMenus}
                        className="flex items-center px-4 py-2 text-white hover:bg-zinc-800 transition-colors"
                      >
                        <FaCog className="mr-3" />
                        Paramètres
                      </Link>
                      <hr className="border-zinc-700 my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-zinc-700 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="btn-blue">
                Connexion
              </Link>
              <Link to="/register" className="btn-blue-outline">
                Inscription
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-7 bg-black border-b border-zinc-900 z-50">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              <Link to="/" className="flex items-center space-x-3 text-white hover:text-yellow-400 transition-colors" onClick={closeMenus}>
                <FaHome />
                <span>Accueil</span>
              </Link>
              <Link to="/events" className="flex items-center space-x-3 text-white hover:text-yellow-400 transition-colors" onClick={closeMenus}>
                <FaCalendarAlt />
                <span>Événements</span>
              </Link>
              <Link to="/packages" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                <FaGift />
                <span>Packages</span>
              </Link>
              <Link to="/testimonials" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                <FaStar />
                <span>Témoignages</span>
              </Link>
              <Link to="/announcements" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                <FaBullhorn />
                <span>Annonces</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </div>

            {/* User-specific links */}
            {user && (
              <div className="space-y-3 border-t border-zinc-800 pt-4">
                <Link to="/dashboard" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 transition-colors" onClick={closeMenus}>
                    <FaCrown />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to="/payments" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                  <FaCreditCard />
                  <span>Paiements</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-3 text-white hover:text-blue-800 transition-colors" onClick={closeMenus}>
                  <FaUser />
                  <span>Mon Profil</span>
                </Link>
                {user.role === "admin" || user.role === "agency" ? (
                  <Link to="/events/create" className="flex items-center space-x-3 text-yellow-500 hover:text-yellow-400 transition-colors" onClick={closeMenus}>
                    <FaCalendarAlt />
                    <span>Créer Événement</span>
                  </Link>
                ) : null}
              </div>
            )}

            {/* Auth buttons */}
            {!user ? (
              <div className="space-y-3 border-t border-zinc-800 pt-4">
                <Link to="/login" className="block w-full btn-blue text-center" onClick={closeMenus}>
                  Connexion
                </Link>
                <Link to="/register" className="block w-full btn-blue-outline text-center" onClick={closeMenus}>
                  Inscription
                </Link>
              </div>
            ) : (
              <div className="border-t border-zinc-800 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-white hover:text-red-400 transition-colors w-full"
                >
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenus}
        />
      )}
    </nav>
  );
}
