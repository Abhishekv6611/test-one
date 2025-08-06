import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Server, Trash2, TrendingUp, Eye, EyeOff, FileText, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaymentDialog from '@/components/PaymentDialog';

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

interface ServicePlan {
  id: string;
  name: string;
  price: string;
  features: string[];
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

const mockServicePlans: Record<string, ServicePlan[]> = {
  'Server Management': [
    {
      id: 'sm-basic',
      name: 'Basic Server',
      price: '$19.99/month',
      features: ['5GB Storage', '50GB Bandwidth', 'Basic Support']
    },
    {
      id: 'sm-pro',
      name: 'Pro Server',
      price: '$49.99/month',
      features: ['25GB Storage', '200GB Bandwidth', '24/7 Support', 'SSL Certificate']
    },
    {
      id: 'sm-enterprise',
      name: 'Enterprise Server',
      price: '$99.99/month',
      features: ['100GB Storage', 'Unlimited Bandwidth', 'Priority Support', 'Advanced Security']
    }
  ],
  'Email Services': [
    {
      id: 'es-starter',
      name: 'Email Starter',
      price: '$9.99/month',
      features: ['10 Email Accounts', 'Basic Spam Protection', 'Mobile Access']
    },
    {
      id: 'es-business',
      name: 'Email Business',
      price: '$29.99/month',
      features: ['100 Email Accounts', 'Advanced Spam Protection', 'Calendar Integration']
    },
    {
      id: 'es-enterprise',
      name: 'Email Enterprise',
      price: '$59.99/month',
      features: ['Unlimited Email Accounts', 'Enterprise Security', 'Full Office Suite']
    }
  ]
};

const ServiceDetailPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { toast } = useToast();
  
  const [service, setService] = useState<Service | null>(
    mockServices.find(s => s.id === serviceId) || null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Service Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">The requested service could not be found.</p>
            <Button onClick={() => navigate('/my-services')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const handleMonitoringToggle = (enabled: boolean) => {
    setService({ ...service, serverMonitoring: enabled });
    toast({
      title: "Monitoring Updated",
      description: `Server monitoring has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleCancelService = () => {
    toast({
      title: "Service Cancellation Requested",
      description: "Your service cancellation request has been submitted. Our team will contact you soon.",
    });
  };

  const handleProceedToPay = (plan: ServicePlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Upgrade Successful!",
      description: `Your service has been upgraded to ${selectedPlan?.name}. Changes will take effect shortly.`,
    });
    setSelectedPlan(null);
  };

  const availablePlans = mockServicePlans[service.category] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/my-services')}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
              <img 
                src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                alt="CloudHouse Technologies" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-white">{service.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Information */}
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">Service Information</span>
                <Badge className={getStatusColor(service.status)}>
                  {service.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">IP Address:</span>
                <span className="font-medium text-gray-900 dark:text-white">{service.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="font-medium text-gray-900 dark:text-white">{service.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                <span className="font-medium text-gray-900 dark:text-white">{service.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Password:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {showPassword ? service.password : '********'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Registration Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">{service.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 text-lg">{service.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Service Controls */}
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Service Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Server Monitoring */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Server Monitoring</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications about server status
                  </p>
                </div>
                <Switch
                  checked={service.serverMonitoring}
                  onCheckedChange={handleMonitoringToggle}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade Service
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[280px]">
                    {availablePlans.map((plan) => (
                      <div key={plan.id} className="p-3 border-b last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{plan.name}</span>
                          <span className="text-blue-600 font-semibold">{plan.price}</span>
                        </div>
                        <Button
                          onClick={() => handleProceedToPay(plan)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          Proceed to Pay
                        </Button>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Service
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Service</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this service? This action cannot be undone and your service will be terminated.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Service</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelService} className="bg-red-600 hover:bg-red-700">
                        Yes, Cancel Service
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Description */}
        <Card className="mt-8 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 mr-2" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {service.description.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Payment Dialog */}
      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          paymentMethod="stripe"
          totalAmount={parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''))}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default ServiceDetailPage;
