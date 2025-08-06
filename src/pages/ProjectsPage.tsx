import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Calendar, DollarSign, User, AlertCircle, Clock, CheckCircle, Grid, List } from 'lucide-react';

// Mock projects data (this would come from your backend/state management)
const mockProjects = [
  {
    id: 1,
    name: 'Project Management System',
    description: 'A comprehensive project management system with task tracking, team collaboration, and reporting features.',
    client: 'TechCorp Inc.',
    cost: 25000,
    progress: 75,
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    name: 'CRM Dashboard',
    description: 'Customer relationship management dashboard with analytics and lead tracking capabilities.',
    client: 'Sales Solutions Ltd.',
    cost: 18500,
    progress: 45,
    status: 'in-progress',
    priority: 'medium',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    createdAt: '2024-01-25'
  },
  {
    id: 3,
    name: 'Static Website',
    description: 'Modern responsive website with content management system integration.',
    client: 'Creative Agency',
    cost: 8500,
    progress: 100,
    status: 'completed',
    priority: 'low',
    startDate: '2023-12-01',
    endDate: '2024-01-31',
    createdAt: '2023-11-25'
  },
  {
    id: 4,
    name: 'Server Management Tool',
    description: 'Automated server monitoring and management tool with real-time alerts.',
    client: 'DevOps Pro',
    cost: 32000,
    progress: 20,
    status: 'planning',
    priority: 'urgent',
    startDate: '2024-03-01',
    endDate: '2024-08-01',
    createdAt: '2024-02-15'
  }
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects] = useState(mockProjects);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-900/30 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-white">All Projects</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-purple-900/30 rounded-lg p-1">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className={viewMode === 'card' ? 'bg-purple-600' : 'text-purple-300 hover:bg-purple-800/50'}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-600' : 'text-purple-300 hover:bg-purple-800/50'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={() => navigate('/projects/create')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Overview</h2>
          <p className="text-gray-600">Manage and track all your projects in one place</p>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {project.name}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Progress: {project.progress}%
                    </span>
                  </div>

                  <Progress value={project.progress} className="h-2" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {project.client}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${project.cost.toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => navigate(`/project-details/${project.id}`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)} variant="outline">
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progress} className="w-16" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>${project.cost.toLocaleString()}</TableCell>
                      <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => navigate(`/project-details/${project.id}`)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first project.</p>
              <Button 
                onClick={() => navigate('/projects/create')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
