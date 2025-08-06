
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import LoginForm from '../components/LoginForm';
import { ThemeProvider } from '../contexts/ThemeContext';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

const AdminDashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === 'admin') {
        setUser(userData);
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  // test-command

  const handleLogin = (userData: User) => {
    if (userData.type === 'admin') {
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleCreateLead = () => {
    navigate('/leads/create');
  };

  const handleCreateCustomer = () => {
    navigate('/customers/add');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <AdminDashboard 
            user={user} 
            onLogout={handleLogout}
            onCreateLead={handleCreateLead}
            onCreateCustomer={handleCreateCustomer}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default AdminDashboardPage;
