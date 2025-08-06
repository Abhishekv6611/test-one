
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Server } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  paymentType: 'one-time' | 'recurring';
  cost?: number;
  monthlyCost?: number;
  yearlyCost?: number;
  description: string[];
  isActive: boolean;
}

const EditServicePage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [cost, setCost] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [yearlyCost, setYearlyCost] = useState('');
  const [descriptionPoints, setDescriptionPoints] = useState<string[]>(['']);

  const existingCategories = [
    'Server Management',
    'Web Development',
    'Digital Marketing',
    'Cloud Services',
    'Security Services'
  ];

  // Mock service data - in real app, fetch based on serviceId
  const mockService: Service = {
    id: 1,
    name: 'Basic Care',
    category: 'Server Management',
    paymentType: 'recurring',
    monthlyCost: 15,
    yearlyCost: 150,
    description: ['24/7 Monitoring', '2 Support Requests/mo', 'Security Hardening', 'Weekly Backups Check'],
    isActive: true
  };

  useEffect(() => {
    // Load service data based on serviceId
    if (serviceId) {
      setServiceName(mockService.name);
      setCategory(mockService.category);
      setPaymentType(mockService.paymentType);
      if (mockService.paymentType === 'one-time' && mockService.cost) {
        setCost(mockService.cost.toString());
      } else if (mockService.paymentType === 'recurring') {
        setMonthlyCost(mockService.monthlyCost?.toString() || '');
        setYearlyCost(mockService.yearlyCost?.toString() || '');
      }
      setDescriptionPoints(mockService.description);
    }
  }, [serviceId]);

  const addDescriptionPoint = () => {
    setDescriptionPoints([...descriptionPoints, '']);
  };

  const removeDescriptionPoint = (index: number) => {
    setDescriptionPoints(descriptionPoints.filter((_, i) => i !== index));
  };

  const updateDescriptionPoint = (index: number, value: string) => {
    const updated = [...descriptionPoints];
    updated[index] = value;
    setDescriptionPoints(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      id: serviceId,
      serviceName,
      category: newCategory || category,
      paymentType,
      cost: paymentType === 'one-time' ? parseFloat(cost) : undefined,
      monthlyCost: paymentType === 'recurring' ? parseFloat(monthlyCost) : undefined,
      yearlyCost: paymentType === 'recurring' ? parseFloat(yearlyCost) : undefined,
      description: descriptionPoints.filter(point => point.trim())
    });
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/services')} className="text-white hover:bg-white/10 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
            <div className="flex items-center">
              <Server className="h-6 w-6 text-white mr-2" />
              <h1 className="text-xl font-semibold text-white">Edit Service</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-gray-900">Edit Service Details</CardTitle>
            <CardDescription>
              Update service information, pricing and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name *</Label>
                  <Input
                    id="serviceName"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g., Basic Care"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create category" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">Create New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {category === 'new' && (
                <div className="space-y-2">
                  <Label htmlFor="newCategory">New Category Name *</Label>
                  <Input
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One Time Payment</SelectItem>
                    <SelectItem value="recurring">Recurring Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentType === 'one-time' && (
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (USD) *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="100"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}

              {paymentType === 'recurring' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyCost">Monthly Cost (USD) *</Label>
                    <Input
                      id="monthlyCost"
                      type="number"
                      value={monthlyCost}
                      onChange={(e) => setMonthlyCost(e.target.value)}
                      placeholder="15"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearlyCost">Yearly Cost (USD) *</Label>
                    <Input
                      id="yearlyCost"
                      type="number"
                      value={yearlyCost}
                      onChange={(e) => setYearlyCost(e.target.value)}
                      placeholder="150"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Service Features (Bullet Points) *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDescriptionPoint}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {descriptionPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={point}
                          onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                        />
                      </div>
                      {descriptionPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDescriptionPoint(index)}
                          className="text-red-600 hover:text-red-700 border-red-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/services')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Update Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditServicePage;
