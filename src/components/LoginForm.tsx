import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, Building, Eye, EyeOff, Sparkles } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

// Mock user data - in a real app, this would come from your backend
const mockUsers: Record<string, User> = {
  'admin@cloudhouse.tech': {
    id: 'admin1',
    email: 'admin@cloudhouse.tech',
    name: 'CloudHouse Admin',
    type: 'admin',
    projects: ['Project Management System', 'CRM Dashboard', 'Static Website', 'Server Management Tool']
  },
  'client1@company.com': {
    id: '1',
    email: 'client1@company.com',
    name: 'John Smith',
    type: 'client',
    projects: ['Project Management System', 'CRM Dashboard']
  },
  'client2@company.com': {
    id: '2',
    email: 'client2@company.com',
    name: 'Sarah Johnson',
    type: 'client',
    projects: ['Static Website', 'Server Management Tool']
  },
  'demo@client.com': {
    id: '3',
    email: 'demo@client.com',
    name: 'Demo User',
    type: 'client',
    projects: ['Project Management System']
  }
};

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin) {
      // Registration logic
      if (password !== confirmPassword) {
        toast({
          title: "Registration Failed",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Mock registration - create new user
      setTimeout(() => {
        const newUser: User = {
          id: `client_${Date.now()}`,
          email,
          name: fullName,
          type: 'client',
          projects: []
        };
        
        toast({
          title: "Account Created Successfully",
          description: `Welcome ${fullName}! You can now sign in.`,
        });
        
        // Switch to login mode after successful registration
        setIsLogin(true);
        setFullName('');
        setCompany('');
        setConfirmPassword('');
        setIsLoading(false);
      }, 1000);
    } else {
      // Login logic
      setTimeout(() => {
        const user = mockUsers[email];
        if (user && password === 'password123') {
          onLogin(user);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}!`,
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Try demo@client.com / password123 or admin@cloudhouse.tech / password123",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return {
      minLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar
    };
  };

  const handleForgotPasswordSubmit = (step: 'email' | 'otp' | 'newPassword') => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (step === 'email') {
        // Mock email sending
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the 6-digit verification code.",
        });
        setForgotPasswordStep('otp');
      } else if (step === 'otp') {
        // Mock OTP verification
        if (otp === '123456') {
          toast({
            title: "Code Verified",
            description: "Please enter your new password.",
          });
          setForgotPasswordStep('newPassword');
        } else {
          toast({
            title: "Invalid Code",
            description: "Please enter the correct 6-digit code.",
            variant: "destructive",
          });
        }
      } else if (step === 'newPassword') {
        // Mock password reset
        const validation = validatePassword(newPassword);
        if (!validation.isValid) {
          toast({
            title: "Password Requirements Not Met",
            description: "Please ensure your password meets all requirements.",
            variant: "destructive",
          });
        } else if (newPassword !== confirmNewPassword) {
          toast({
            title: "Passwords Don't Match",
            description: "Please ensure both passwords match.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Password Reset Successful",
            description: "Your password has been updated. You can now sign in.",
          });
          // Reset forgot password state
          setShowForgotPassword(false);
          setForgotPasswordStep('email');
          setForgotEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                  alt="CloudHouse Technologies" 
                  className="h-10 w-auto"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  CloudHouse Technologies
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Premium Solutions & Support
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Trusted by 1000+ clients
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex items-center justify-center p-4 py-12 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {/* Hero section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3">
              {isLogin ? 'Welcome Back!' : 'Join Our Platform'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              {isLogin 
                ? 'Access your projects and premium support' 
                : 'Create your account and start your journey'
              }
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden">
            {/* Card header with gradient */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-6 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-2xl text-center font-bold text-gray-900 dark:text-white flex items-center justify-center space-x-2">
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-2 font-medium">
                {isLogin 
                  ? 'Enter your credentials to continue' 
                  : 'Fill in your details to get started'
                }
              </CardDescription>
            </div>

            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                        Full Name *
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                        Company
                      </Label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your company name (optional)"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                    Password *
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                      Confirm Password *
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <Sparkles className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Forgot Password Link - Only show in login mode */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Create one" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              {isLogin && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 font-medium">Demo Credentials</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-bold">Client Access</p>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-mono bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded">demo@client.com / password123</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200 font-bold">Admin Access</p>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded">admin@cloudhouse.tech / password123</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-6 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-xl text-center font-bold text-gray-900 dark:text-white">
                    {forgotPasswordStep === 'email' && 'Reset Your Password'}
                    {forgotPasswordStep === 'otp' && 'Verify Your Email'}
                    {forgotPasswordStep === 'newPassword' && 'Create New Password'}
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-2">
                    {forgotPasswordStep === 'email' && 'Enter your email address to receive a reset code'}
                    {forgotPasswordStep === 'otp' && 'Enter the 6-digit code sent to your email'}
                    {forgotPasswordStep === 'newPassword' && 'Enter your new password'}
                  </CardDescription>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  {forgotPasswordStep === 'email' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgotEmail" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                          Email Address *
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="forgotEmail"
                            type="email"
                            placeholder="your@email.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {forgotPasswordStep === 'otp' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                          Verification Code *
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-12 text-center text-2xl tracking-widest border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Use <span className="font-mono font-bold">123456</span> for demo
                      </p>
                    </div>
                  )}

                  {forgotPasswordStep === 'newPassword' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                          New Password *
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword" className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                          Confirm New Password *
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="confirmNewPassword"
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white rounded-xl transition-all duration-200 font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Password Requirements */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Password Requirements:</p>
                        {(() => {
                          const validation = validatePassword(newPassword);
                          return (
                            <div className="space-y-1 text-xs">
                              <div className={`flex items-center space-x-2 ${validation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${validation.minLength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>At least 8 characters</span>
                              </div>
                              <div className={`flex items-center space-x-2 ${validation.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${validation.hasLowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>At least one lowercase letter</span>
                              </div>
                              <div className={`flex items-center space-x-2 ${validation.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${validation.hasUppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>At least one uppercase letter</span>
                              </div>
                              <div className={`flex items-center space-x-2 ${validation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${validation.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>At least one number</span>
                              </div>
                              <div className={`flex items-center space-x-2 ${validation.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${validation.hasSpecialChar ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span>At least one special character (!@#$%^&*)</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordStep('email');
                        setForgotEmail('');
                        setOtp('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                      className="flex-1 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleForgotPasswordSubmit(forgotPasswordStep)}
                      disabled={isLoading || 
                        (forgotPasswordStep === 'email' && !forgotEmail) ||
                        (forgotPasswordStep === 'otp' && otp.length !== 6) ||
                        (forgotPasswordStep === 'newPassword' && (!newPassword || !confirmNewPassword))
                      }
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {forgotPasswordStep === 'email' && 'Sending...'}
                            {forgotPasswordStep === 'otp' && 'Verifying...'}
                            {forgotPasswordStep === 'newPassword' && 'Updating...'}
                          </span>
                        </div>
                      ) : (
                        <span>
                          {forgotPasswordStep === 'email' && 'Send Code'}
                          {forgotPasswordStep === 'otp' && 'Verify Code'}
                          {forgotPasswordStep === 'newPassword' && 'Update Password'}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer tagline */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              🔒 Your data is secure and encrypted
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Trusted by businesses worldwide for premium project management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
