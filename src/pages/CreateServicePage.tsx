
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Server, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import { createService, fetchService, ServiceCreatePayload } from '@/hooks/authThunks';
import { toast } from 'sonner';






const CreateServicePage = () => {
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  console.log("category:", category);
  const [newCategory, setNewCategory] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [cost, setCost] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [yearlyCost, setYearlyCost] = useState('');
  const [descriptionPoints, setDescriptionPoints] = useState<string[]>(['']);
  const [customFields, setCustomFields] = useState<Array<{
    id: string;
    fieldName: string;
    mandatory: boolean;
    fieldType: 'string' | 'digit' | 'password' | 'selection';
    options: string[];
  }>>([]);
  const dispatch = useDispatch<AppDispatch>()
  const [services, setServices] = useState([])
  const [categoriesId, setCategoriesId] = useState(null);
  // console.log(serviceName,category,newCategory,paymentType,cost,monthlyCost,yearlyCost,descriptionPoints,customFields);
  const serviceCategories = useSelector((state: RootState) => state.industry.serviceCategories);



  useEffect(() => {
    dispatch(fetchService()).then((action) => {
      if (fetchService.fulfilled.match(action)) {
        console.log("Fetched services:", action.payload);
        setServices(action.payload);
      }
    });
  }, []);


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

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      fieldName: '',
      mandatory: false,
      fieldType: 'string' as const,
      options: []
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<typeof customFields[0]>) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addOption = (fieldId: string) => {
    updateCustomField(fieldId, {
      options: [...customFields.find(f => f.id === fieldId)?.options || [], '']
    });
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = customFields.find(f => f.id === fieldId);
    if (field) {
      updateCustomField(fieldId, {
        options: field.options.filter((_, index) => index !== optionIndex)
      });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = customFields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateCustomField(fieldId, { options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //     const payload = {
    //   service_name: serviceName,
    //   category: newCategory || category,
    //   paymentType,
    //   price: paymentType === 'one-time' ? parseFloat(cost) : undefined,
    //   monthlyCost: paymentType === 'recurring' ? parseFloat(monthlyCost) : undefined,
    //   yearlyCost: paymentType === 'recurring' ? parseFloat(yearlyCost) : undefined,
    //   description: descriptionPoints.filter(point => point.trim()),
    //   customFields: customFields.filter(field => field.fieldName.trim())
    // };
    const payload: ServiceCreatePayload = {
      name: serviceName.trim(),
      category_id: 1, // ensure it's a number
      type: paymentType === 'one-time' ? 'onetime' : 'recurring',
      one_time_cost: paymentType === 'one-time' ? parseFloat(cost).toFixed(2) : undefined,
      monthly_cost: paymentType === 'recurring' ? parseFloat(monthlyCost).toFixed(2) : undefined,
      yearly_cost: paymentType === 'recurring' ? parseFloat(yearlyCost).toFixed(2) : undefined,
      features: descriptionPoints.filter(point => point.trim()),
      custom_fields: customFields
        .filter(field => field.fieldName.trim())
        .map(field => {
          const normalizedType = field.fieldType === 'selection' ? 'select' : field.fieldType;

          // Ensure the type matches the expected union
          if (!['string', 'digit', 'password', 'select'].includes(normalizedType)) {
            throw new Error(`Invalid field_type: ${field.fieldType}`);
          }

          const base = {
            field_name: field.fieldName.trim(),
            field_type: normalizedType as 'string' | 'digit' | 'password' | 'select',
            is_mandatory: field.mandatory,
          };

          if (normalizedType === 'select') {
            return {
              ...base,
              field_select: field.options
                .filter(opt => opt.trim())
                .map(opt => ({ options: opt.trim() })),
            };
          }

          return base;
        }),

    };


    // if (paymentType === 'one-time') {
    //   payload.price = parseFloat(cost);
    // } else if (paymentType === 'recurring') {
    //   payload.monthly_cost = parseFloat(monthlyCost);
    //   payload.yearly_cost = parseFloat(yearlyCost);
    // }


    console.log("Payload being sent:", JSON.stringify(payload, null, 2));


    try {
      const resultAction = await dispatch(createService(payload))
      if (createService.fulfilled.match(resultAction)) {
        console.log("Service created successfully:", resultAction.payload);
        toast.success('Service created successfully!')
        navigate('/services');
      } else {
        console.error('Service creation failed:', resultAction.error.message);
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };
  console.log("serviceCategories:", serviceCategories);
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
              <h1 className="text-xl font-semibold text-white">Create New Service</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-gray-900">Service Details</CardTitle>
            <CardDescription>
              Create a new service offering with pricing and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">cat
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
                      {serviceCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.category}>
                          {cat.category}
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

              {/* Custom Fields Section */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                    Custom Fields
                  </CardTitle>
                  <CardDescription>
                    Add custom fields that clients need to fill when ordering this service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Service Custom Fields</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCustomField}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>

                    {customFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No custom fields added yet. Click "Add Field" to create one.
                      </div>
                    )}

                    {customFields.map((field) => (
                      <Card key={field.id} className="p-4 border border-gray-200">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Field {customFields.indexOf(field) + 1}</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCustomField(field.id)}
                              className="text-red-600 hover:text-red-700 border-red-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`fieldName-${field.id}`}>Field Name *</Label>
                              <Input
                                id={`fieldName-${field.id}`}
                                value={field.fieldName}
                                onChange={(e) => updateCustomField(field.id, { fieldName: e.target.value })}
                                placeholder="e.g., Domain Name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`fieldType-${field.id}`}>Field Type *</Label>
                              <Select
                                value={field.fieldType}
                                onValueChange={(value: 'string' | 'digit' | 'password' | 'selection') =>
                                  updateCustomField(field.id, { fieldType: value, options: value === 'selection' ? [''] : [] })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="string">Text (String)</SelectItem>
                                  <SelectItem value="digit">Number (Digit)</SelectItem>
                                  <SelectItem value="password">Password</SelectItem>
                                  <SelectItem value="selection">Selection (Dropdown)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-7">
                              <Checkbox
                                id={`mandatory-${field.id}`}
                                checked={field.mandatory}
                                onCheckedChange={(checked) =>
                                  updateCustomField(field.id, { mandatory: checked === true })
                                }
                              />
                              <Label htmlFor={`mandatory-${field.id}`} className="text-sm">
                                Mandatory Field
                              </Label>
                            </div>
                          </div>

                          {field.fieldType === 'selection' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Selection Options</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(field.id)}
                                  className="border-green-200 text-green-600 hover:bg-green-50"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>

                              {field.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-red-600 hover:text-red-700 border-red-200"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/services')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Create Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateServicePage;
