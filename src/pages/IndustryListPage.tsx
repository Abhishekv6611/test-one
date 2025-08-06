import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Building, Edit, Trash2, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import { useDispatch } from 'react-redux';
import { fetchIndustries } from '@/hooks/authThunks';
const IndustryListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [industries, setIndustries] = useState(useSelector((state:RootState) => state.industry.industries|| []));

  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  // useEffect(() => {
  //   fetch("https://api.cloudhousetechnologies.com/api/v1/industry")
  //     .then((res) => res.json())
  //     .then((data) => setIndustries(data))
  //     .catch((error) => {
  //       console.error("Failed to fetch industries", error);
  //     });
  // }, []);
  
  const handleStatusToggle = (industryId: number) => {
    setIndustries(industries.map(industry => 
      industry.id === industryId 
        ? { ...industry, status: !industry.status }
        : industry
    ));
  };

  const handleEdit = (industryId: number) => {
    navigate(`/industry/edit/${industryId}`);
  };

  const handleDelete = (industryId: number) => {
    if (window.confirm('Are you sure you want to delete this industry?')) {
      setIndustries(industries.filter(industry => industry.id !== industryId));
    }
  };

  const handleViewDetails = (industryId: number) => {
    navigate(`/industry/${industryId}`);
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
              <h1 className="text-xl font-semibold text-white">Industry Management</h1>
            </div>
            <Button
              onClick={() => navigate('/industry/create')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Industry
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <Building className="h-6 w-6 mr-3 text-purple-600" />
              Industry List
            </CardTitle>
            <CardDescription>
              Manage all industries and their status in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industries.map((industry) => (
                    <TableRow key={industry.id}>
                      <TableCell className="font-medium">{industry.industry_name}</TableCell>
                      <TableCell>{industry.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={industry.status}
                            onCheckedChange={() => handleStatusToggle(industry.id)}
                          />
                          <span className={industry.status ? 'text-green-600' : 'text-red-600'}>
                            {industry.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(industry.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(industry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default IndustryListPage;
