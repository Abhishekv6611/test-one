
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import LoginForm from '../components/LoginForm';
import { ThemeProvider } from '../contexts/ThemeContext';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

const ClientDashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is client
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === 'client') {
        setUser(userData);
      } else {
        navigate('/admin');
      }
    }
  }, [navigate]);

  const handleLogin = (userData: User) => {
    if (userData.type === 'client') {
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default ClientDashboardPage;
