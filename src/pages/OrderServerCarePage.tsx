import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Eye, EyeOff, Server, CreditCard, Tag } from 'lucide-react';
import PaymentDialog from '@/components/PaymentDialog';

interface ServerCredentials {
  ipAddress: string;
  hostname: string;
  rootPassword: string;
  showPassword: boolean;
  controlPanel: string;
}

interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const OrderServerCarePage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [tenure, setTenure] = useState('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState('');
  const [serverCredentials, setServerCredentials] = useState<ServerCredentials[]>([
    { ipAddress: '', hostname: '', rootPassword: '', showPassword: false, controlPanel: '' }
  ]);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    countryCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Autofill from profile on component mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setPersonalDetails(prev => ({
          ...prev,
          fullName: userData.name || '',
          email: userData.email || ''
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Try to get profile data if available
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      try {
        const profile = JSON.parse(profileData);
        setPersonalDetails(prev => ({
          ...prev,
          fullName: profile.name || prev.fullName,
          email: profile.email || prev.email,
          phone: profile.phone || '',
          company: profile.company || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          zipCode: profile.zipCode || '',
          country: profile.country || ''
        }));
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
  }, []);

  const controlPanels = [
    'cPanel/WHM',
    'Plesk',
    'DirectAdmin',
    'CyberPanel',
    'VestaCP',
    'ISPConfig',
    'Webmin/Virtualmin',
    'None'
  ];

  const countryCodes = [
    { code: 'USA', country: 'United States' },
    { code: 'CAN', country: 'Canada' },
    { code: 'GBR', country: 'United Kingdom' },
    { code: 'AUS', country: 'Australia' },
    { code: 'DEU', country: 'Germany' },
    { code: 'FRA', country: 'France' },
    { code: 'IND', country: 'India' },
    { code: 'JPN', country: 'Japan' },
    { code: 'CHN', country: 'China' },
    { code: 'RUS', country: 'Russia' },
    { code: 'KOR', country: 'South Korea' },
    { code: 'ITA', country: 'Italy' },
    { code: 'ESP', country: 'Spain' },
    { code: 'NLD', country: 'Netherlands' },
    { code: 'SWE', country: 'Sweden' },
    { code: 'NOR', country: 'Norway' },
    { code: 'DNK', country: 'Denmark' },
    { code: 'FIN', country: 'Finland' }
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India',
    'Japan',
    'China',
    'Russia',
    'South Korea',
    'Italy',
    'Spain',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Other'
  ];

  const statesByCountry = {
    'United States': [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    'Canada': [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ],
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal'
    ],
    'Australia': [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
      'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ],
    'United Kingdom': [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ]
  };

  const getStatesForCountry = (country: string) => {
    return statesByCountry[country as keyof typeof statesByCountry] || ['Other'];
  };

  const serverCarePlan = {
    name: 'Professional Server Care',
    monthlyPrice: 99,
    yearlyPrice: 999, // 15% discount for yearly
    features: [
      '24/7 Server Monitoring',
      'Real-time Security Updates',
      'Performance Optimization',
      'Database Management',
      'Backup & Recovery',
      'Priority Support',
      'Monthly Security Reports',
      'Load Balancing Setup'
    ]
  };

  // Mock coupon codes - in a real app, this would come from an API
  const validCoupons: CouponCode[] = [
    { code: 'SAVE10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'percentage' },
    { code: 'WELCOME50', discount: 50, type: 'fixed' },
    { code: 'NEWCLIENT', discount: 15, type: 'percentage' }
  ];

  // Calculate total price based on quantity, tenure, and coupon
  const calculateTotalPrice = () => {
    const pricePerServer = tenure === 'yearly' ? serverCarePlan.yearlyPrice : serverCarePlan.monthlyPrice;
    const subtotal = pricePerServer * quantity;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        return subtotal - (subtotal * appliedCoupon.discount / 100);
      } else {
        return Math.max(0, subtotal - appliedCoupon.discount);
      }
    }
    
    return subtotal;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const pricePerServer = tenure === 'yearly' ? serverCarePlan.yearlyPrice : serverCarePlan.monthlyPrice;
    const subtotal = pricePerServer * quantity;
    
    if (appliedCoupon.type === 'percentage') {
      return subtotal * appliedCoupon.discount / 100;
    } else {
      return Math.min(appliedCoupon.discount, subtotal);
    }
  };

  const applyCoupon = () => {
    const foundCoupon = validCoupons.find(coupon => coupon.code.toLowerCase() === couponCode.toLowerCase());
    
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    const newCredentials = [...serverCredentials];
    
    if (newQuantity > serverCredentials.length) {
      // Add new server credential fields
      for (let i = serverCredentials.length; i < newQuantity; i++) {
        newCredentials.push({ ipAddress: '', hostname: '', rootPassword: '', showPassword: false, controlPanel: '' });
      }
    } else {
      // Remove excess server credential fields
      newCredentials.splice(newQuantity);
    }
    
    setServerCredentials(newCredentials);
  };

  const updateServerCredential = (index: number, field: keyof ServerCredentials, value: string | boolean) => {
    const updated = [...serverCredentials];
    updated[index] = { ...updated[index], [field]: value };
    setServerCredentials(updated);
  };

  const togglePasswordVisibility = (index: number) => {
    updateServerCredential(index, 'showPassword', !serverCredentials[index].showPassword);
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      // Add validation for payment method selection
      return;
    }
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <img src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" alt="CloudHouse Technologies" className="h-8 w-auto mr-3" />
            <h1 className="text-xl font-semibold text-white">Order Server Care Plan</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Customer Details and Server Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Please provide your contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalDetails.fullName}
                    onChange={(e) => setPersonalDetails({...personalDetails, fullName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalDetails.email}
                    onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={personalDetails.phone}
                    onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={personalDetails.company}
                    onChange={(e) => setPersonalDetails({...personalDetails, company: e.target.value})}
                  />
                </div>
                 <div>
                   <Label htmlFor="country">Country *</Label>
                   <Select 
                     value={personalDetails.country} 
                     onValueChange={(value) => {
                       const selectedCountryCode = countryCodes.find(item => item.country === value)?.code || '';
                       setPersonalDetails({
                         ...personalDetails, 
                         country: value,
                         countryCode: selectedCountryCode,
                         state: '' // Reset state when country changes
                       });
                     }}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select country" />
                     </SelectTrigger>
                     <SelectContent>
                       {countries.map((country) => (
                         <SelectItem key={country} value={country}>
                           {country}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Input
                      id="countryCode"
                      value={personalDetails.countryCode}
                      readOnly
                      placeholder="Auto-filled based on country"
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                 <div>
                   <Label htmlFor="state">State/Province</Label>
                   <Select 
                     value={personalDetails.state} 
                     onValueChange={(value) => setPersonalDetails({...personalDetails, state: value})}
                     disabled={!personalDetails.country}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select state" />
                     </SelectTrigger>
                     <SelectContent>
                       {getStatesForCountry(personalDetails.country).map((state) => (
                         <SelectItem key={state} value={state}>
                           {state}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="city">City</Label>
                     <Input
                       id="city"
                       value={personalDetails.city}
                       onChange={(e) => setPersonalDetails({...personalDetails, city: e.target.value})}
                     />
                   </div>
                   <div>
                     <Label htmlFor="zipCode">ZIP Code</Label>
                     <Input
                       id="zipCode"
                       value={personalDetails.zipCode}
                       onChange={(e) => setPersonalDetails({...personalDetails, zipCode: e.target.value})}
                     />
                   </div>
                 </div>
                 <div>
                   <Label htmlFor="address">Address</Label>
                   <Textarea
                     id="address"
                     value={personalDetails.address}
                     onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                     rows={2}
                   />
                 </div>
              </CardContent>
            </Card>

            {/* Plan Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Configuration</CardTitle>
                <CardDescription>Configure your server care plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Number of Servers:</Label>
                    <Select value={quantity.toString()} onValueChange={(value) => handleQuantityChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tenure">Billing Cycle:</Label>
                    <Select value={tenure} onValueChange={setTenure}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly - ${serverCarePlan.monthlyPrice}/server</SelectItem>
                        <SelectItem value="yearly">Yearly - ${serverCarePlan.yearlyPrice}/server (Save 15%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Server Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Server Credentials
                </CardTitle>
                <CardDescription>Provide access details for your servers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {serverCredentials.map((server, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Server {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`ip-${index}`}>IP Address *</Label>
                        <Input
                          id={`ip-${index}`}
                          value={server.ipAddress}
                          onChange={(e) => updateServerCredential(index, 'ipAddress', e.target.value)}
                          placeholder="192.168.1.1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`hostname-${index}`}>Hostname</Label>
                        <Input
                          id={`hostname-${index}`}
                          value={server.hostname}
                          onChange={(e) => updateServerCredential(index, 'hostname', e.target.value)}
                          placeholder="server.example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`password-${index}`}>Root Password *</Label>
                      <div className="relative">
                        <Input
                          id={`password-${index}`}
                          type={server.showPassword ? 'text' : 'password'}
                          value={server.rootPassword}
                          onChange={(e) => updateServerCredential(index, 'rootPassword', e.target.value)}
                          placeholder="Enter root password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => togglePasswordVisibility(index)}
                        >
                          {server.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`control-panel-${index}`}>Control Panel</Label>
                      <Select value={server.controlPanel} onValueChange={(value) => updateServerCredential(index, 'controlPanel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select control panel" />
                        </SelectTrigger>
                        <SelectContent>
                          {controlPanels.map((panel) => (
                            <SelectItem key={panel} value={panel}>
                              {panel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe">Stripe (Credit/Debit Card)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Coupon Code and Service Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Coupon Code
                </CardTitle>
                <CardDescription>Apply a coupon code for additional savings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                      />
                      {couponError && (
                        <p className="text-sm text-red-600 mt-1">{couponError}</p>
                      )}
                    </div>
                    <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Coupon "{appliedCoupon.code}" applied
                      </span>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}% discount` 
                          : `$${appliedCoupon.discount} off`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon}>
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Server Care Plan</CardTitle>
                <CardDescription>Professional server management service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{serverCarePlan.name}</h3>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 block">
                        {tenure === 'yearly' ? 'Yearly' : 'Monthly'}
                      </span>
                      <span className="text-xl font-bold text-purple-600">
                        ${tenure === 'yearly' ? serverCarePlan.yearlyPrice : serverCarePlan.monthlyPrice}
                        <span className="text-sm text-gray-500">/{tenure === 'yearly' ? 'year' : 'month'}</span>
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {serverCarePlan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Calculation */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Servers ({quantity})</span>
                      <span>{quantity} × ${tenure === 'yearly' ? serverCarePlan.yearlyPrice : serverCarePlan.monthlyPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(tenure === 'yearly' ? serverCarePlan.yearlyPrice : serverCarePlan.monthlyPrice) * quantity}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    {tenure === 'yearly' && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Yearly Discount (15%)</span>
                        <span>-${((serverCarePlan.monthlyPrice * 12 - serverCarePlan.yearlyPrice) * quantity).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-purple-600">${calculateTotalPrice().toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {tenure === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary and Submit */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="ml-2 font-medium">{quantity} server(s)</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Billing:</span>
                  <span className="ml-2 font-medium capitalize">{tenure}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="ml-2 font-medium">{paymentMethod || 'Not selected'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-lg font-semibold">Total Amount:</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">${calculateTotalPrice().toFixed(2)}</span>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600">
                      Savings: ${calculateDiscount().toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleProceedToPayment}
                  disabled={!paymentMethod}
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        paymentMethod={paymentMethod}
        totalAmount={calculateTotalPrice()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default OrderServerCarePage;
