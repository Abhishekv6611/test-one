
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Users, Edit, Trash2, Eye, Search } from 'lucide-react';
import { AppDispatch, RootState } from '@/hooks/store';
import { useDispatch, useSelector } from 'react-redux';
import { getLeads } from '@/hooks/authThunks';
interface TransformedLeads {
    id: number;
    companyName: string;
    contactPersonName: string;
    phoneNumber: string;
    email: string;
    industry: number;
    productInterested: string;
    address: string;
    notes: string;
}

interface HardcodedCustomer {
    id: number;
    companyName: string;
    contactPersonName: string;
    phoneNumber: string;
    email: string;
    industry: string;
    productInterested: string;
    address: string;
    notes: string;
}

const CustomersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const leads = useSelector((state: RootState) => state.industry.leads || []);
  const [searchTerm, setSearchTerm] = useState('');
const industries = useSelector((state: RootState) => state.industry.industries);

  const hardcodedCustomers: HardcodedCustomer[] = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc.',
      contactPersonName: 'John Smith',
      phoneNumber: '+1-555-0123',
      email: 'john@techsolutions.com',
      industry: 'Technology',
      productInterested: 'Project Management System',
      address: '123 Tech Street, Silicon Valley, CA',
      notes: 'Interested in enterprise solution'
    },
    {
      id: 2,
      companyName: 'Healthcare Plus',
      contactPersonName: 'Sarah Johnson',
      phoneNumber: '+1-555-0124',
      email: 'sarah@healthcareplus.com',
      industry: 'Healthcare',
      productInterested: 'CRM Dashboard',
      address: '456 Medical Ave, Boston, MA',
      notes: 'Needs integration with existing systems'
    },
    {
      id: 3,
      companyName: 'Green Energy Corp',
      contactPersonName: 'Mike Wilson',
      phoneNumber: '+1-555-0125',
      email: 'mike@greenenergy.com',
      industry: 'Manufacturing',
      productInterested: 'Custom Software Development',
      address: '789 Energy Blvd, Austin, TX',
      notes: 'Focus on sustainability features'
    }
  ];

  const [customers, setCustomers] = useState([...hardcodedCustomers]);

  useEffect(() => {
    dispatch(getLeads());
  }, [dispatch]);

  // Update customers when leads change
useEffect(() => {
  const transformedLeads: HardcodedCustomer[] = leads.map((lead, index) => {
    const industryName =
      industries.find((ind) => ind.id === lead.industry_id)?.industry_name || 'Unknown';

    return {
      id: hardcodedCustomers.length + index + 1,
      companyName: lead.company_name,
      contactPersonName: lead.full_name,
      phoneNumber: lead.phone_number,
      email: lead.email,
      industry: industryName, // Now a string ✅
      productInterested: '—',
      address: lead.address,
      notes: lead.note,
    };
  });

  setCustomers([...hardcodedCustomers, ...transformedLeads]); 
}, [leads, industries]);


  // Filter
  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.productInterested || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actions
  const handleEdit = (customerId: number) => {
    navigate(`/customers/edit/${customerId}`);
  };

  const handleDelete = (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
    }
  };

  const handleViewDetails = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
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
              <h1 className="text-xl font-semibold text-white">Customer Management</h1>
            </div>
            <Button
              onClick={() => navigate('/customers/add')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <Users className="h-6 w-6 mr-3 text-purple-600" />
              Customer List
            </CardTitle>
            <CardDescription>
              Manage all your customers and their information in one place.
            </CardDescription>
            
            {/* Search Input */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Product Interest</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.companyName}</TableCell>
                      <TableCell>{customer.contactPersonName}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.industry}</TableCell>
                      <TableCell>{customer.productInterested}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No customers found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomersPage;
