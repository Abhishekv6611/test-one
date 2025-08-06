
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface CreateTaskDialogProps {
  onTaskCreate: (task: any) => void;
  buttonText?: string;
  dialogTitle?: string;
  isSubtask?: boolean;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ 
  onTaskCreate, 
  buttonText = "Add Task",
  dialogTitle,
  isSubtask = false
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    startDate: '',
    endDate: '',
    assignees: [] as string[],
    reportsTo: '',
    cost: ''
  });

  const statuses = ['not-started', 'in-progress', 'completed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      id: `${isSubtask ? 'ST' : 'T'}${Date.now()}`,
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      progress: formData.status === 'completed' ? 100 : formData.status === 'in-progress' ? 50 : 0
    };

    onTaskCreate(newTask);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      startDate: '',
      endDate: '',
      assignees: [],
      reportsTo: '',
      cost: ''
    });
    
    setOpen(false);
  };

  const defaultTitle = isSubtask ? "Create New Subtask" : "Create New Task";
  const costLabel = isSubtask ? "Subtask Cost" : "Task Cost";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle || defaultTitle}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new {isSubtask ? 'subtask' : 'task'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={`${isSubtask ? 'Subtask' : 'Task'} Name`}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={`${isSubtask ? 'Subtask' : 'Task'} Description`}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" defaultValue={formData.status} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" defaultValue={formData.priority} />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cost">{costLabel}</Label>
            <Input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="assignees">Assignees</Label>
            <Input
              type="text"
              id="assignees"
              name="assignees"
              value={formData.assignees.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, assignees: e.target.value.split(',').map(s => s.trim()) }))}
              placeholder="Assignees (comma separated)"
            />
          </div>
          <div>
            <Label htmlFor="reportsTo">Reports To</Label>
            <Input
              type="text"
              id="reportsTo"
              name="reportsTo"
              value={formData.reportsTo}
              onChange={handleInputChange}
              placeholder="Reports To"
            />
          </div>
          <Button type="submit">Create {isSubtask ? 'Subtask' : 'Task'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
