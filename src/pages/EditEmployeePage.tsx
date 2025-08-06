
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: number;
  profilePic: string;
  fullName: string;
  role: string;
  department: string;
  email: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
}

// Mock data - in real app this would come from API
const mockEmployee: Employee = {
  id: 1,
  profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  fullName: 'John Smith',
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'john.smith@cloudhouse.com',
  phoneNumber: '+1-555-0101',
  address: '123 Tech Street, San Francisco, CA',
  joinDate: '2022-03-15'
};

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [formData, setFormData] = useState({
    profilePic: '',
    fullName: '',
    role: '',
    department: '',
    email: '',
    phoneNumber: '',
    address: '',
    joinDate: ''
  });

  useEffect(() => {
    // In real app, fetch employee data by ID
    setFormData({
      profilePic: mockEmployee.profilePic,
      fullName: mockEmployee.fullName,
      role: mockEmployee.role,
      department: mockEmployee.department,
      email: mockEmployee.email,
      phoneNumber: mockEmployee.phoneNumber,
      address: mockEmployee.address,
      joinDate: mockEmployee.joinDate
    });
  }, [employeeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePic: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.role || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    console.log('Updating employee:', employeeId, formData);
    toast.success('Employee updated successfully!');
    navigate('/employees');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/employees')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Edit Employee</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.profilePic} alt="Profile" />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="profilePic" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Change Profile Picture</span>
                    </div>
                  </Label>
                  <Input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer, Product Manager"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Engineering, Sales, Design"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1-555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Employee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditEmployeePage;
