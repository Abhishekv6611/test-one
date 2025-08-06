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
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Upload,
  FileText,
  Grid,
  List,
  Mic,
  MicOff
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

interface TaskUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  files?: string[];
  audio?: string;
}

interface Subtask {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  assignees: string[];
  reportsTo: string;
  cost: number;
}

interface TaskDetails {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  assignees: string[];
  reportsTo: string;
  subtasks: Subtask[];
  updates: TaskUpdate[];
}

// Mock task data
const mockTask: TaskDetails = {
  id: 'T001',
  name: 'Database Design',
  description: 'Design and implement the database schema for the e-commerce platform',
  status: 'in-progress',
  progress: 75,
  priority: 'high',
  startDate: '2024-01-15',
  endDate: '2024-02-01',
  assignees: ['John Smith', 'Sarah Johnson'],
  reportsTo: 'Mike Wilson',
  subtasks: [
    {
      id: 'ST001',
      name: 'Create User Tables',
      status: 'completed',
      progress: 100,
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      assignees: ['John Smith'],
      reportsTo: 'Mike Wilson',
      cost: 500
    },
    {
      id: 'ST002',
      name: 'Design Product Schema',
      status: 'in-progress',
      progress: 60,
      priority: 'medium',
      startDate: '2024-01-18',
      endDate: '2024-01-25',
      assignees: ['Sarah Johnson'],
      reportsTo: 'Mike Wilson',
      cost: 300
    }
  ],
  updates: [
    {
      id: 'TU001',
      title: 'Initial Database Design',
      description: 'Created initial database schema with user and product tables.',
      date: '2024-01-16T10:00:00Z',
      author: 'John Smith'
    }
  ]
};

const TaskDetailsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [task, setTask] = useState<TaskDetails>(mockTask);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '' });
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

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
    navigate(-1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
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

  const handleAddUpdate = () => {
    if (!newUpdate.title.trim() || !newUpdate.description.trim()) return;
    
    const update: TaskUpdate = {
      id: `TU${Date.now()}`,
      title: newUpdate.title,
      description: newUpdate.description,
      date: new Date().toISOString(),
      author: user?.name || 'Unknown'
    };

    setTask({
      ...task,
      updates: [update, ...task.updates]
    });

    setNewUpdate({ title: '', description: '' });
  };

  const handleSubtaskCreate = (newSubtask: any) => {
    const subtask: Subtask = {
      id: newSubtask.id,
      name: newSubtask.name,
      status: newSubtask.status,
      progress: newSubtask.progress,
      priority: newSubtask.priority,
      startDate: newSubtask.startDate,
      endDate: newSubtask.endDate,
      assignees: newSubtask.assignees,
      reportsTo: newSubtask.reportsTo,
      cost: newSubtask.cost || 0
    };

    setTask({
      ...task,
      subtasks: [...task.subtasks, subtask]
    });
  };

  const handleSubtaskClick = (subtaskId: string) => {
    navigate(`/subtask-details/${subtaskId}`);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!user) {
    return (
      <ThemeProvider>
        <LoginForm onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

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

  const handleDeleteUpdate = (updateId: string) => {
    const updatedUpdates = task.updates.filter(update => update.id !== updateId);
    setTask({
      ...task,
      updates: updatedUpdates
    });
    
    toast({
      title: "Update deleted",
      description: "Task update has been removed",
    });
  };

  const handleSubtaskEdit = (subtaskId: string) => {
    const subtaskToEdit = task.subtasks.find(subtask => subtask.id === subtaskId);
    if (subtaskToEdit) {
      toast({
        title: "Edit mode",
        description: "Subtask editing functionality will be implemented",
      });
    }
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
    setTask({
      ...task,
      subtasks: updatedSubtasks
    });
    
    toast({
      title: "Subtask deleted",
      description: "Subtask has been removed from the task",
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
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
                <h1 className="text-xl font-semibold text-white">{task.name}</h1>
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
          {/* Task Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {task.name}
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={task.progress} className="w-20" />
                    <span className="text-sm">{task.progress}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(task.startDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">End Date</Label>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(task.endDate)}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Assignees</Label>
                  <div className="flex flex-wrap gap-2">
                    {task.assignees.map((assignee, index) => (
                      <Badge key={index} variant="outline">{assignee}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Reports To</Label>
                  <p>{task.reportsTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtasks */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subtasks</CardTitle>
                  <CardDescription>Total Subtasks: {task.subtasks.length}</CardDescription>
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
                  <CreateTaskDialog 
                    onTaskCreate={handleSubtaskCreate} 
                    buttonText="Add Subtask"
                    isSubtask={true}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {task.subtasks.map((subtask) => (
                    <Card key={subtask.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSubtaskClick(subtask.id)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{subtask.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubtaskEdit(subtask.id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubtaskDelete(subtask.id);
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
                            <Badge className={getStatusColor(subtask.status)}>
                              {subtask.status}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Progress value={subtask.progress} className="w-16" />
                              <span className="text-sm">{subtask.progress}%</span>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(subtask.priority)}>
                            {subtask.priority}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p>Assignees: {subtask.assignees.join(', ')}</p>
                            <p>Reports to: {subtask.reportsTo}</p>
                            <p>Due: {formatDate(subtask.endDate)}</p>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignees</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {task.subtasks.map((subtask) => (
                      <TableRow key={subtask.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleSubtaskClick(subtask.id)}>
                        <TableCell className="font-medium">{subtask.id}</TableCell>
                        <TableCell>{subtask.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(subtask.status)}>
                            {subtask.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={subtask.progress} className="w-16" />
                            <span className="text-sm">{subtask.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(subtask.priority)}>
                            {subtask.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{subtask.assignees.join(', ')}</TableCell>
                        <TableCell>{formatDate(subtask.endDate)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubtaskEdit(subtask.id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubtaskDelete(subtask.id);
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

          {/* Task Updates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Task Update</CardTitle>
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
                <CardTitle>Task Updates & History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {task.updates.map((update) => (
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
      </div>
    </ThemeProvider>
  );
};

export default TaskDetailsPage;
