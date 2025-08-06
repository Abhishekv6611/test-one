                                                                                                                                                                                                                                                                                                                    
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building, User, FolderOpen, Server, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { toast } = useToast();

  // Mock customer data with projects and services
  const [customer] = useState({
    id: 1,
    companyName: 'Tech Solutions Inc.',
    contactPersonName: 'John Smith',
    phoneNumber: '+1-555-0123',
    email: 'john@techsolutions.com',
    industry: 'Technology',
    productInterested: 'Project Management System',
    address: '123 Tech Street, Silicon Valley, CA',
    notes: 'Interested in enterprise solution',
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-06-15',
        budget: '$15,000'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        status: 'Completed',
        startDate: '2023-08-01',
        endDate: '2023-12-01',
        budget: '$25,000'
      },
      {
        id: 3,
        name: 'CRM Integration',
        status: 'In Progress',
        startDate: '2024-03-01',
        endDate: '2024-08-01',
        budget: '$12,000'
      }
    ],
    services: [
      {
        id: 1,
        name: 'Web Hosting',
        status: 'Active',
        monthlyFee: '$29.99',
        startDate: '2024-01-01'
      },
      {
        id: 2,
        name: 'Email Server',
        status: 'Active',
        monthlyFee: '$19.99',
        startDate: '2024-01-15'
      },
      {
        id: 3,
        name: 'Database Management',
        status: 'Inactive',
        monthlyFee: '$49.99',
        startDate: '2023-12-01'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateCredentials = () => {
    toast({
      title: "Success!",
      description: "Login credentials have been generated and sent to the customer successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/customers')}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>
              <img 
                src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                alt="CloudHouse Technologies" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-white">Customer Details</h1>
            </div>
            <Button
              onClick={() => navigate(`/customers/edit/${customerId}`)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Building className="h-6 w-6 mr-3 text-purple-600" />
                  {customer.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="text-lg">{customer.contactPersonName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg">{customer.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-lg">{customer.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-lg">{customer.industry}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Product Interest</p>
                    <p className="text-lg">{customer.productInterested}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-700">{customer.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleGenerateCredentials}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <KeyRound className="h-4 w-4 mr-2" />
              Generate & send login credentials
            </Button>
          </div>

          {/* Projects and Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <FolderOpen className="h-5 w-5 mr-3 text-purple-600" />
                  Projects ({customer.projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Start:</span> {project.startDate}
                        </div>
                        <div>
                          <span className="font-medium">End:</span> {project.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span> {project.budget}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Server className="h-5 w-5 mr-3 text-purple-600" />
                  Services ({customer.services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Monthly Fee:</span> {service.monthlyFee}
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span> {service.startDate}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {service.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailPage;
