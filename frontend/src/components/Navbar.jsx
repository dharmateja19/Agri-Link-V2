import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-green-700 text-white shadow">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="text-2xl font-bold">
          AgriLink
        </Link>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`flex-1 justify-end items-center md:flex ${isOpen ? 'block' : 'hidden'}`}>          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Link
              to="/"
              className=" hover:text-yellow-300 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/register"
                  className=" hover:text-yellow-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className=" hover:text-yellow-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className=" hover:text-yellow-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/profile"
                  className=" hover:text-yellow-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-medium cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;