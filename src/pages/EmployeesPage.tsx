
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Search, Grid, List, Edit, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';

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

const mockEmployees: Employee[] = [
  {
    id: 1,
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    fullName: 'John Smith',
    role: 'Senior Developer',
    department: 'Engineering',
    email: 'john.smith@cloudhouse.com',
    phoneNumber: '+1-555-0101',
    address: '123 Tech Street, San Francisco, CA',
    joinDate: '2022-03-15'
  },
  {
    id: 2,
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b332c5f1?w=150&h=150&fit=crop&crop=face',
    fullName: 'Sarah Johnson',
    role: 'Product Manager',
    department: 'Product',
    email: 'sarah.johnson@cloudhouse.com',
    phoneNumber: '+1-555-0102',
    address: '456 Innovation Ave, San Jose, CA',
    joinDate: '2021-08-20'
  },
  {
    id: 3,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    fullName: 'Michael Chen',
    role: 'UI/UX Designer',
    department: 'Design',
    email: 'michael.chen@cloudhouse.com',
    phoneNumber: '+1-555-0103',
    address: '789 Creative Blvd, Palo Alto, CA',
    joinDate: '2023-01-10'
  },
  {
    id: 4,
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    fullName: 'Emily Davis',
    role: 'DevOps Engineer',
    department: 'Engineering',
    email: 'emily.davis@cloudhouse.com',
    phoneNumber: '+1-555-0104',
    address: '321 Cloud Lane, Mountain View, CA',
    joinDate: '2022-11-05'
  },
  {
    id: 5,
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    fullName: 'Robert Wilson',
    role: 'Sales Manager',
    department: 'Sales',
    email: 'robert.wilson@cloudhouse.com',
    phoneNumber: '+1-555-0105',
    address: '654 Business Park, Fremont, CA',
    joinDate: '2020-05-18'
  }
];

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (employeeId: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log('Deleting employee:', employeeId);
      // Delete logic would go here
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800';
      case 'product':
        return 'bg-green-100 text-green-800';
      case 'design':
        return 'bg-purple-100 text-purple-800';
      case 'sales':
        return 'bg-orange-100 text-orange-800';
      case 'marketing':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Employee Management</h1>
            </div>
            <Button onClick={() => navigate('/employees/create')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.profilePic} alt={employee.fullName} />
                        <AvatarFallback>{employee.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{employee.fullName}</CardTitle>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employees/edit/${employee.id}`)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge className={getDepartmentColor(employee.department)}>
                    {employee.department}
                  </Badge>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-3 w-3 mr-2" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{employee.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span className="truncate">{employee.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.profilePic} alt={employee.fullName} />
                          <AvatarFallback>{employee.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(employee.department)}>
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phoneNumber}</TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/employees/edit/${employee.id}`)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No employees found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeesPage;
