import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, UserPlus, Users, ChevronDown, ChevronRight, FileText, Clock, StickyNote } from 'lucide-react';
import { ThemeProvider } from '../contexts/ThemeContext';

interface Reminder {
  id: string;
  date: string;
  description: string;
}

interface Lead {
  id: string;
  companyName: string;
  contactPersonName: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  product: string;
  status: 'active' | 'pending' | 'disqualified' | 'converted';
  notes?: string;
  attachments?: string[];
  reminders?: Reminder[];
}

const mockLeads: Lead[] = [
  {
    id: 'L001',
    companyName: 'TechCorp Solutions',
    contactPersonName: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    industry: 'Technology',
    location: 'San Francisco, CA',
    product: 'CRM System',
    status: 'active',
    notes: 'Interested in enterprise-level CRM solution. Mentioned budget of $50K-$100K.',
    attachments: ['proposal_techcorp.pdf', 'pricing_sheet.xlsx'],
    reminders: [
      { id: 'R001', date: '2024-01-15', description: 'Follow up on proposal discussion' },
      { id: 'R002', date: '2024-01-20', description: 'Schedule demo with technical team' }
    ]
  },
  {
    id: 'L002',
    companyName: 'Green Energy Ltd',
    contactPersonName: 'Sarah Johnson',
    email: 'sarah@greenenergy.com',
    phone: '+1 (555) 987-6543',
    industry: 'Energy',
    location: 'Austin, TX',
    product: 'Website Development',
    status: 'pending',
    notes: 'Looking for modern website with solar calculator integration.',
    attachments: ['requirements_document.pdf'],
    reminders: [
      { id: 'R003', date: '2024-01-18', description: 'Send website mockups and timeline' }
    ]
  },
  {
    id: 'L003',
    companyName: 'Retail Plus',
    contactPersonName: 'Mike Davis',
    email: 'mike.davis@retailplus.com',
    phone: '+1 (555) 456-7890',
    industry: 'Retail',
    location: 'New York, NY',
    product: 'E-commerce Platform',
    status: 'converted',
    notes: 'Successfully converted to customer. Project started on Dec 15, 2023.',
    attachments: ['signed_contract.pdf', 'project_specifications.docx'],
    reminders: []
  },
  {
    id: 'L004',
    companyName: 'HealthCare Pro',
    contactPersonName: 'Emily Wilson',
    email: 'emily@healthcarepro.com',
    phone: '+1 (555) 321-0987',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    product: 'Management System',
    status: 'disqualified',
    notes: 'Budget constraints. Not ready for implementation at this time.',
    attachments: [],
    reminders: []
  }
];

const LeadsPage = () => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
        return 'bg-blue-100 text-blue-800';
      case 'disqualified':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (leadId: string) => {
    const newExpanded = new Set(expandedLeads);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeads(newExpanded);
  };

  const handleLeadClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const handleCreateCustomer = () => {
    navigate('/customers/add');
  };

  const filteredLeads = leads.filter(lead =>
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
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
                <h1 className="text-xl font-semibold text-white">Leads Management</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Leads</h2>
                <p className="text-gray-600">Manage and track all your business leads</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => navigate('/leads/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Lead
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/middleman/create')}
                  className="border-orange-500/30 text-orange-600 hover:bg-orange-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Middle Man
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCreateCustomer}
                  className="border-green-500/30 text-green-600 hover:bg-green-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Customer
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>Leads List ({filteredLeads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Lead ID</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <>
                        <TableRow key={lead.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(lead.id)}
                              className="p-1"
                            >
                              {expandedLeads.has(lead.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell 
                            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => handleLeadClick(lead.id)}
                          >
                            {lead.id}
                          </TableCell>
                          <TableCell className="font-medium">{lead.companyName}</TableCell>
                          <TableCell>{lead.contactPersonName}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell>{lead.industry}</TableCell>
                          <TableCell>{lead.location}</TableCell>
                          <TableCell>{lead.product}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {expandedLeads.has(lead.id) && (
                          <TableRow>
                            <TableCell colSpan={10} className="bg-gray-50 p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Lead Details */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Lead Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Lead ID:</span> {lead.id}</div>
                                    <div><span className="font-medium">Company:</span> {lead.companyName}</div>
                                    <div><span className="font-medium">Contact Person:</span> {lead.contactPersonName}</div>
                                    <div><span className="font-medium">Email:</span> {lead.email}</div>
                                    <div><span className="font-medium">Phone:</span> {lead.phone}</div>
                                    <div><span className="font-medium">Industry:</span> {lead.industry}</div>
                                    <div><span className="font-medium">Location:</span> {lead.location}</div>
                                    <div><span className="font-medium">Product:</span> {lead.product}</div>
                                    <div>
                                      <span className="font-medium">Status:</span> 
                                      <Badge className={`ml-2 ${getStatusColor(lead.status)}`}>
                                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Notes & Attachments */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <StickyNote className="h-4 w-4 mr-2" />
                                    Notes & Files
                                  </h4>
                                  <div className="space-y-3">
                                    {/* Notes */}
                                    <div>
                                      <span className="font-medium text-sm">Notes:</span>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {lead.notes || 'No notes available'}
                                      </p>
                                    </div>
                                    
                                    {/* Attachments */}
                                    <div>
                                      <span className="font-medium text-sm">Attachments:</span>
                                      <div className="mt-1">
                                        {lead.attachments && lead.attachments.length > 0 ? (
                                          <ul className="space-y-1">
                                            {lead.attachments.map((file, index) => (
                                              <li key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center">
                                                <FileText className="h-3 w-3 mr-1" />
                                                {file}
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-sm text-gray-500">No attachments</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Reminders */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Reminders
                                  </h4>
                                  <div>
                                    {lead.reminders && lead.reminders.length > 0 ? (
                                      <div className="space-y-3">
                                        {lead.reminders.map((reminder) => (
                                          <div key={reminder.id} className="border-l-2 border-blue-200 pl-3 py-1">
                                            <div className="text-sm font-medium text-gray-900">
                                              {new Date(reminder.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {reminder.description}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No reminders set</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
                {filteredLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No leads found matching your search criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LeadsPage;
