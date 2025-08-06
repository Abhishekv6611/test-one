import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, FolderOpen, MessageSquare, Clock, CheckCircle, AlertCircle, Server, Settings, ShoppingCart, FileText, Plus } from 'lucide-react';
import ProjectView from './ProjectView';
import ThemeToggle from './ThemeToggle';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  project: string;
  module: string;
  subModule?: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  author: string;
  isClient: boolean;
  timestamp: string;
}

// Mock ticket data
const mockTickets: Ticket[] = [{
  id: '1',
  title: 'Login page not loading properly',
  description: 'The login page takes too long to load and sometimes shows a blank screen.',
  status: 'in-progress',
  priority: 'high',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:20:00Z',
  project: 'Project Management System',
  module: 'ui',
  messages: [{
    id: '1',
    content: 'The login page takes too long to load and sometimes shows a blank screen.',
    author: 'John Smith',
    isClient: true,
    timestamp: '2024-01-15T10:30:00Z'
  }, {
    id: '2',
    content: 'Thank you for reporting this issue. We are investigating the problem and will update you soon.',
    author: 'Support Team',
    isClient: false,
    timestamp: '2024-01-15T11:00:00Z'
  }]
}];

// Mock services data
const mockServices = [{
  id: '1',
  name: 'Web Hosting',
  ipAddress: '192.168.1.100',
  status: 'active',
  username: 'admin',
  password: '********',
  registrationDate: '2024-01-01',
  serverMonitoring: true
}, {
  id: '2',
  name: 'Database Server',
  ipAddress: '192.168.1.101',
  status: 'active',
  username: 'dbuser',
  password: '********',
  registrationDate: '2024-01-15',
  serverMonitoring: true
}, {
  id: '3',
  name: 'Email Server',
  ipAddress: '192.168.1.102',
  status: 'inactive',
  username: 'mailuser',
  password: '********',
  registrationDate: '2024-02-01',
  serverMonitoring: false
}];

const Dashboard = ({
  user,
  onLogout
}: DashboardProps) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tickets] = useState<Ticket[]>(mockTickets);

  const getProjectTickets = (project: string) => {
    return tickets.filter(ticket => ticket.project === project);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-900/50 text-red-300 border-red-500/30';
      case 'in-progress':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-900/50 text-green-300 border-green-500/30';
      case 'closed':
        return 'bg-gray-800/50 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-800/50 text-gray-300 border-gray-500/30';
    }
  };

  const handleOrderServerCare = () => {
    navigate('/order-server-care');
  };

  const handleServicesClick = () => {
    navigate('/my-services');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handlePurchaseServicesClick = () => {
    navigate('/purchase-services');
  };

  const handleInvoicesClick = () => {
    navigate('/invoices');
  };

  if (selectedProject) {
    return <ProjectView project={selectedProject} user={user} tickets={getProjectTickets(selectedProject)} onBack={() => setSelectedProject(null)} onLogout={onLogout} />;
  }

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" alt="CloudHouse Technologies" className="h-8 w-auto mr-3" />
              <h1 className="text-xl font-semibold text-white">CloudHouse Technologies</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleOrderServerCare} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Order a new server care plan
              </Button>
              <Button onClick={handlePurchaseServicesClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase Services
              </Button>
              <Button onClick={handleInvoicesClick} className="bg-green-600 hover:bg-green-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                My Invoices
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center hover:bg-white/10 text-white">
                    <User className="h-4 w-4 text-gray-300 mr-2" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">Select a project to view and manage tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {user.projects.map(project => {
          const projectTickets = getProjectTickets(project);
          const openTickets = projectTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
          return <Card key={project} className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600" onClick={() => setSelectedProject(project)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-gray-900 dark:text-white">{project}</span>
                    {openTickets > 0 && <Badge variant="destructive" className="ml-2">
                        {openTickets} active
                      </Badge>}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Click to view tickets and support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Tickets:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{projectTickets.length}</span>
                    </div>
                    
                    {projectTickets.length > 0 && <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Recent Tickets:</p>
                        {projectTickets.slice(0, 2).map(ticket => <div key={ticket.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border dark:border-gray-600">
                            <div className="flex items-center">
                              {getStatusIcon(ticket.status)}
                              <span className="ml-2 text-sm truncate max-w-40 text-gray-700 dark:text-gray-200">{ticket.title}</span>
                            </div>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>)}
                      </div>}
                    
                    <Button variant="outline" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {user.projects.length === 0 && <Card className="text-center py-12 bg-white dark:bg-gray-800 dark:border-gray-700 mb-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Projects Assigned</h3>
              <p className="text-gray-600 dark:text-gray-300">Contact support to get access to your projects.</p>
            </CardContent>
          </Card>}

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Services</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your hosting and server services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600" onClick={handleServicesClick}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg text-gray-900 dark:text-white">My Services</span>
                <Badge className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {mockServices.length} total
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                View and manage your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Services:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {mockServices.filter(s => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Inactive Services:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {mockServices.filter(s => s.status === 'inactive').length}
                  </span>
                </div>
                
                <Button variant="outline" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white">
                  <Server className="h-4 w-4 mr-2" />
                  View Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};

export default Dashboard;
