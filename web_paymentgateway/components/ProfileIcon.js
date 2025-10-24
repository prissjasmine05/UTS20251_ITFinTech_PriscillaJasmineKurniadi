// components/ProfileIcon.js
import { useState, useEffect } from 'react';
import LoginChooser from './LoginChooser';

export default function ProfileIcon() {
  const [showChooser, setShowChooser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' | 'admin'

  useEffect(() => {
    // Check login status
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');
    
    if (user) {
      setIsLoggedIn(true);
      setUserType('user');
    } else if (admin) {
      setIsLoggedIn(true);
      setUserType('admin');
    }
  }, []);

  const handleIconClick = () => {
    if (isLoggedIn) {
      // Already logged in - go to respective dashboard
      if (userType === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/checkout'; // or profile page
      }
    } else {
      // Not logged in - show chooser
      setShowChooser(true);
    }
  };

  return (
    <>
      <button
        onClick={handleIconClick}
        className="relative bg-zinc-800 text-white p-2 rounded-full hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
        aria-label="Profile menu"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
        
        {isLoggedIn && (
          <span className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></span>
        )}
      </button>

      <LoginChooser 
        show={showChooser} 
        onClose={() => setShowChooser(false)} 
      />
    </>
  );
}