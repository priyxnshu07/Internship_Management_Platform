import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      background: 'white', 
      borderBottom: '1px solid #e2e8f0', 
      padding: '0 20px', 
      height: '64px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2563eb' }}>
        Internship Platform
      </div>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 500 }}>{user.name}</span>
            <span className={`badge badge-${user.role}`} style={{ 
              background: user.role === 'admin' ? '#fee2e2' : user.role === 'mentor' ? '#e0f2fe' : '#dcfce7',
              color: user.role === 'admin' ? '#991b1b' : user.role === 'mentor' ? '#075985' : '#166534'
            }}>
              {user.role}
            </span>
          </div>
          <button onClick={handleLogout} className="btn-primary" style={{ background: '#f1f5f9', color: '#475569' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
