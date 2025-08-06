import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Server, Eye, Bell, BellOff } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  ipAddress: string;
  status: 'active' | 'inactive';
  username: string;
  password: string;
  registrationDate: string;
  serverMonitoring: boolean;
  totalAmount: string;
  category: string;
  description: string[];
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Web Hosting',
    ipAddress: '192.168.1.100',
    status: 'active',
    username: 'admin',
    password: 'securepass123',
    registrationDate: '2024-01-01',
    serverMonitoring: true,
    totalAmount: '$29.99/month',
    category: 'Server Management',
    description: [
      '10GB SSD Storage',
      '100GB Bandwidth',
      '24/7 Support',
      'SSL Certificate Included',
      'Daily Backups'
    ]
  },
  {
    id: '2',
    name: 'Database Server',
    ipAddress: '192.168.1.101',
    status: 'active',
    username: 'dbuser',
    password: 'dbpass456',
    registrationDate: '2024-01-15',
    serverMonitoring: true,
    totalAmount: '$49.99/month',
    category: 'Server Management',
    description: [
      'MySQL 8.0 Database',
      '50GB Storage',
      'Automated Backups',
      'High Availability',
      'Performance Monitoring'
    ]
  },
  {
    id: '3',
    name: 'Email Server',
    ipAddress: '192.168.1.102',
    status: 'inactive',
    username: 'mailuser',
    password: 'mailpass789',
    registrationDate: '2024-02-01',
    serverMonitoring: false,
    totalAmount: '$19.99/month',
    category: 'Email Services',
    description: [
      'Professional Email Hosting',
      '50 Email Accounts',
      'Anti-Spam Protection',
      'Email Forwarding',
      'Mobile Access'
    ]
  }
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services] = useState<Service[]>(mockServices);

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/my-services/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <img 
                src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                alt="CloudHouse Technologies" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-white">My Services</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Services</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your hosting and server services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
              onClick={() => handleServiceClick(service.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg text-gray-900 dark:text-white">{service.name}</span>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">IP Address:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.ipAddress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.username}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{service.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Registration Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.registrationDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monitoring:</span>
                    <div className="flex items-center">
                      {service.serverMonitoring ? (
                        <Bell className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <BellOff className="h-4 w-4 text-gray-400 mr-1" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {service.serverMonitoring ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="text-center py-12 bg-white dark:bg-gray-800 dark:border-gray-700">
            <CardContent>
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Services Found</h3>
              <p className="text-gray-600 dark:text-gray-300">Contact support to set up your services.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ServicesPage;
