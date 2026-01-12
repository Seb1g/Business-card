import React, { useState, useRef, useEffect } from 'react';
import '../styles/userPopup.scss';
import { Settings, Moon, Sun, LogOut } from 'lucide-react';

interface UserProps {
  name: string;
  email: string;
}

const UserPopup: React.FC<UserProps> = ({ name, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={popupRef}>
      <button className="avatar-button" onClick={togglePopup}>
        {name.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="user-popup">
          <div className="user-info">
            <div className="user-avatar-large">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{name}</p>
              <p className="user-email">{email}</p>
            </div>
          </div>

          <hr className="divider" />

          <div className="popup-actions">
            <button className="action-item">
              <Settings size={18} />
              <span>Настройки аккаунта</span>
            </button>

            <button className="action-item" onClick={toggleTheme}>
              {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkTheme ? 'Светлая тема' : 'Темная тема'}</span>
            </button>
          </div>

          <hr className="divider" />

          <div className="logout-action">
            <button className="logout-button">
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPopup;