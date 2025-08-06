
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  countryCode: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in real app this would come from localStorage or API
  const [profile, setProfile] = useState<UserProfile>({
    id: 'client1',
    name: 'John Smith',
    email: 'john.smith@techstart.com',
    phone: '+91 98765 43210',
    company: 'TechStart Solutions Ltd',
    address: '123 Business District',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400058',
    country: 'India',
    countryCode: '+91'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, name: editedProfile.name, email: editedProfile.email };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
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
              <img src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" alt="CloudHouse Technologies" className="h-8 w-auto mr-3" />
              <h1 className="text-xl font-semibold text-white">My Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Manage your personal information and account details
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="countryCode" className="text-gray-700 dark:text-gray-300">Country Code</Label>
                <Input
                  id="countryCode"
                  value={isEditing ? editedProfile.countryCode : profile.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">Company</Label>
                <Input
                  id="company"
                  value={isEditing ? editedProfile.company : profile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Address</Label>
              <Input
                id="address"
                value={isEditing ? editedProfile.address : profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">City</Label>
                <Input
                  id="city"
                  value={isEditing ? editedProfile.city : profile.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">State</Label>
                <Input
                  id="state"
                  value={isEditing ? editedProfile.state : profile.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={isEditing ? editedProfile.zipCode : profile.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  disabled={!isEditing}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country</Label>
              <Input
                id="country"
                value={isEditing ? editedProfile.country : profile.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
