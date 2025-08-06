import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User, 
  LogOut, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Upload,
  FileText,
  Mic,
  MicOff,
  Grid,
  List
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import LoginForm from '../components/LoginForm';
import CreateTaskDialog from '../components/CreateTaskDialog';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'admin' | 'client';
  projects: string[];
}

interface Task {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  assignee: string;
}

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  files?: string[];
  audio?: string;
}

interface ProjectDetails {
  id: string;
  title: string;
  clientName: string;
  projectCost: number;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  totalTickets: number;
  tasks: Task[];
  fundsCollected: number;
  paymentsReceived: number;
  remainingBalance: number;
  updates: ProjectUpdate[];
}

// Mock project data
const mockProjects: Record<string, ProjectDetails> = {
  '1': {
    id: '1',
    title: 'E-commerce Platform',
    clientName: 'TechCorp Solutions',
    projectCost: 50000,
    status: 'in-progress',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    clientEmail: 'contact@techcorp.com',
    clientPhone: '+1 (555) 123-4567',
    clientAddress: '123 Business Ave, Tech City, TC 12345',
    totalTickets: 12,
    fundsCollected: 30000,
    paymentsReceived: 25000,
    remainingBalance: 25000,
    tasks: [
      {
        id: 'T001',
        name: 'Database Design',
        status: 'completed',
        progress: 100,
        priority: 'high',
        startDate: '2024-01-15',
        endDate: '2024-02-01',
        assignee: 'John Smith'
      },
      {
        id: 'T002',
        name: 'Frontend Development',
        status: 'in-progress',
        progress: 65,
        priority: 'high',
        startDate: '2024-02-01',
        endDate: '2024-04-15',
        assignee: 'Sarah Johnson'
      },
      {
        id: 'T003',
        name: 'Payment Integration',
        status: 'not-started',
        progress: 0,
        priority: 'medium',
        startDate: '2024-04-01',
        endDate: '2024-05-01',
        assignee: 'Mike Wilson'
      }
    ],
    updates: [
      {
        id: 'U001',
        title: 'Project Kickoff',
        description: 'Initial meeting completed with client. Requirements gathered and project timeline established.',
        date: '2024-01-15T10:00:00Z',
        author: 'Project Manager'
      },
      {
        id: 'U002',
        title: 'Database Schema Approved',
        description: 'Client has approved the database design. Development team can proceed with implementation.',
        date: '2024-02-01T14:30:00Z',
        author: 'John Smith'
      }
    ]
  }
};

const ProjectDetailsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '' });
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    if (!projectId || !mockProjects[projectId]) {
      navigate('/admin');
    } else {
      setProject(mockProjects[projectId]);
    }
  }, [projectId, navigate]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleBack = () => {
    if (user?.type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) selected for upload`,
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Audio recording is now active",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Audio recorded successfully",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAddUpdate = () => {
    if (!project || !newUpdate.title.trim() || !newUpdate.description.trim()) return;
    
    const update: ProjectUpdate = {
      id: `U${Date.now()}`,
      title: newUpdate.title,
      description: newUpdate.description,
      date: new Date().toISOString(),
      author: user?.name || 'Unknown',
      files: uploadedFiles.map(file => file.name),
      audio: audioBlob ? 'audio_recording.wav' : undefined
    };

    setProject({
      ...project,
      updates: [update, ...project.updates]
    });

    setNewUpdate({ title: '', description: '' });
    setUploadedFiles([]);
    setAudioBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Update added",
      description: "Project update has been posted successfully",
    });
  };

  const handleDeleteUpdate = (updateId: string) => {
    if (!project) return;
    
    const updatedUpdates = project.updates.filter(update => update.id !== updateId);
    setProject({
      ...project,
      updates: updatedUpdates
    });
    
    toast({
      title: "Update deleted",
      description: "Project update has been removed",
    });
  };

  const handleTaskCreate = (newTask: any) => {
    if (!project) return;
    
    const task: Task = {
      id: newTask.id,
      name: newTask.name,
      status: newTask.status,
      progress: newTask.progress,
      priority: newTask.priority,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      assignee: newTask.assignees.join(', ')
    };

    setProject({
      ...project,
      tasks: [...project.tasks, task]
    });
  };

  const handleTaskEdit = (taskId: string) => {
    if (!project) return;
    const taskToEdit = project.tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      toast({
        title: "Edit mode",
        description: "Task editing functionality will be implemented",
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (!project) return;
    
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    setProject({
      ...project,
      tasks: updatedTasks
    });
    
    toast({
      title: "Task deleted",
      description: "Task has been removed from the project",
    });
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task-details/${taskId}`);
  };

  if (!project) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Button variant="ghost" onClick={handleBack} className="mr-3 text-purple-300 hover:bg-purple-900/30">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <img 
                      src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                      alt="CloudHouse Technologies" 
                      className="h-8 w-auto mr-3"
                    />
                    <h1 className="text-xl font-semibold text-white">{project.title}</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-white">{user.name}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="border-purple-500/30 text-purple-300 hover:bg-purple-900/30">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Project Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Project Details & Information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Client Name</Label>
                        <p className="text-lg font-semibold">{project.clientName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Project Cost</Label>
                        <p className="text-lg font-semibold">{formatCurrency(project.projectCost)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(project.startDate)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">End Date</Label>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(project.endDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{project.clientEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{project.clientPhone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      <span className="text-sm">{project.clientAddress}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.projectCost)}</p>
                        <p className="text-sm text-gray-600">Total Project Cost</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.fundsCollected)}</p>
                        <p className="text-sm text-gray-600">Funds Collected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.paymentsReceived)}</p>
                        <p className="text-sm text-gray-600">Payments Received</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.remainingBalance)}</p>
                        <p className="text-sm text-gray-600">Remaining Balance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks Table */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Tasks</CardTitle>
                      <CardDescription>Total Tickets: {project.totalTickets}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'card' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('card')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <CreateTaskDialog onTaskCreate={handleTaskCreate} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.tasks.map((task) => (
                        <Card key={task.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTaskClick(task.id)}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{task.name}</CardTitle>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskEdit(task.id);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskDelete(task.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Progress value={task.progress} className="w-20" />
                                <span className="text-sm">{task.progress}%</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Assignee: {task.assignee}</p>
                                <p>Due: {formatDate(task.endDate)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.tasks.map((task) => (
                          <TableRow key={task.id} className="cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                            <TableCell className="font-medium">{task.id}</TableCell>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={task.progress} className="w-16" />
                                <span className="text-sm">{task.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(task.startDate)}</TableCell>
                            <TableCell>{formatDate(task.endDate)}</TableCell>
                            <TableCell>{task.assignee}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskEdit(task.id);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskDelete(task.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Project Updates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Project Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="update-title">Title</Label>
                      <Input
                        id="update-title"
                        value={newUpdate.title}
                        onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                        placeholder="Update title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="update-description">Description</Label>
                      <Textarea
                        id="update-description"
                        value={newUpdate.description}
                        onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                        placeholder="Describe the update..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Attach Files</Label>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files {uploadedFiles.length > 0 && `(${uploadedFiles.length} selected)`}
                      </Button>
                    </div>
                    <div>
                      <Label>Record Audio</Label>
                      <Button 
                        variant={isRecording ? "destructive" : "outline"} 
                        className="w-full"
                        onClick={toggleRecording}
                      >
                        {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                        {audioBlob && !isRecording && " (Recorded)"}
                      </Button>
                    </div>
                    <Button onClick={handleAddUpdate} className="w-full">
                      Post Update
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Updates & History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {project.updates.map((update) => (
                        <div key={update.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{update.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {formatDate(update.date)}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteUpdate(update.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                          <p className="text-xs text-gray-500">By {update.author}</p>
                          {update.files && update.files.length > 0 && (
                            <div className="mt-2">
                              {update.files.map((file, index) => (
                                <Badge key={index} variant="outline" className="mr-1">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {update.audio && (
                            <div className="mt-2">
                              <Badge variant="outline">
                                <Mic className="h-3 w-3 mr-1" />
                                Audio Recording
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default ProjectDetailsPage;
