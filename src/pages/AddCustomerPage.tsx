import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppDispatch, RootState } from '@/hooks/store';
import { useDispatch, useSelector } from 'react-redux';
import { createLead, fetchIndustries } from '@/hooks/authThunks';

const AddCustomerPage = () => {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIndustries())
  }, [dispatch]);

  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    phoneNumber: '',
    email: '',
    industryId: 1, // use number
    address: '',
    notes: ''
  });


  const industries = useSelector((state: RootState) => state.industry.industries || []);

  console.log(industries)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // console.log(formData.companyName ,formData.contactPersonName ,formData.email ,formData.industryId);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  // Basic validation
  // if (!formData.companyName || !formData.contactPersonName || !formData.email || !formData.industryId) {
  //   toast({
  //     title: "Error",
  //     description: "Please fill in all required fields",
  //     variant: "destructive",
  //   });
  //   return;
  // }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast({
      title: "Error",
      description: "Invalid email format",
      variant: "destructive",
    });
    return;
  }

  const payload = {
    full_name:formData.contactPersonName,
    company_name: formData.companyName,
    email: formData.email,
    phone_number: formData.phoneNumber,
    address: formData.address,
    city: 'Kochi',
    state: 'kerala',
    zip_code: '0123',
    country: 'IN',
    country_code: '+91',
    note: formData.notes,
    industry_id: 2,
  };

  try {
    await dispatch(createLead(payload)).unwrap();
    toast({
      title: "Success",
      description: "Customer added successfully!",
    });
    navigate('/customers');
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to create customer.",
      variant: "destructive",
    });
    console.error(err);
  }
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
              <h1 className="text-xl font-semibold text-white">Add New Customer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <User className="h-6 w-6 mr-3 text-purple-600" />
              Customer Information
            </CardTitle>
            <CardDescription>
              Enter the details for the new customer to add them to the CRM system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonName" className="text-sm font-medium text-gray-700">
                    Contact Person Name *
                  </Label>
                  <Input
                    id="contactPersonName"
                    type="text"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                    placeholder="Enter contact person name"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                    Industry
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange('industryId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.industry_name}>
                          {industry.industry_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes about the customer"
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddCustomerPage;
