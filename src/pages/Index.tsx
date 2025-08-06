
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { ThemeProvider } from '../contexts/ThemeContext';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Redirect based on user type
        if (userData.type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, [navigate]);

  const handleLogin = (userData: User) => {
    console.log('Login successful, user data:', userData);
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Check if user came from purchase-services page
    const fromPurchaseServices = location.state?.fromPurchaseServices;
    
    if (fromPurchaseServices) {
      console.log('Redirecting to order-server-care after login from purchase services');
      navigate('/order-server-care');
    } else {
      // Redirect based on user type
      if (userData.type === 'admin') {
        console.log('Redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Redirecting to client dashboard');
        navigate('/dashboard');
      }
    }
  };

  // Don't render login form if user is already logged in and we're redirecting
  if (user) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <LoginForm onLogin={handleLogin} />
      </div>
    </ThemeProvider>
  );
};

export default Index;
