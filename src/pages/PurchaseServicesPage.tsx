import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  cost: number;
  billing: 'monthly' | 'yearly' | 'one-time';
  description: string[];
  isActive: boolean;
  popular?: boolean;
}

const mockServices: Service[] = [
  {
    id: 1,
    name: 'Basic Care',
    category: 'Server Management',
    cost: 15,
    billing: 'monthly',
    description: ['24/7 Monitoring', '2 Support Requests/mo', 'Security Hardening', 'Weekly Backups Check'],
    isActive: true
  },
  {
    id: 2,
    name: 'Starter Plus',
    category: 'Server Management',
    cost: 35,
    billing: 'monthly',
    description: ['Everything in Basic', '5 Support Requests/mo', 'Monthly Updates & Patch Management', 'DNS / Mail Fix'],
    isActive: true,
    popular: true
  },
  {
    id: 3,
    name: 'Pro Admin',
    category: 'Server Management',
    cost: 65,
    billing: 'monthly',
    description: ['Unlimited Support Requests', 'Proactive Monitoring', 'Full Server Stack Optimization', 'Migration Support', 'Malware/Blacklist Removal'],
    isActive: true
  },
  {
    id: 4,
    name: 'Website Design',
    category: 'Web Development',
    cost: 500,
    billing: 'one-time',
    description: ['Custom Design', 'Responsive Layout', 'SEO Optimization', '3 Revisions Included'],
    isActive: true
  }
];

const faqs = [
  {
    question: "What services do you offer?",
    answer: "We offer a comprehensive range of IT services including server management, web development, hosting solutions, and custom software development to meet all your technology needs."
  },
  {
    question: "Do you offer 24/7 support?",
    answer: "Yes, we provide round-the-clock support for all our managed services to ensure your systems are always running smoothly."
  },
  {
    question: "What if I have multiple servers or complex requirements?",
    answer: "We offer custom pricing for larger deployments and complex projects. Contact our sales team to discuss your specific requirements and get a tailored quote."
  },
  {
    question: "How long does it take to resolve issues?",
    answer: "Most issues are resolved within 4-6 hours. Critical issues are prioritized and typically resolved within 1-2 hours."
  },
  {
    question: "Can you handle projects without existing infrastructure?",
    answer: "Yes, our team can work with various configurations and can help you build your technology infrastructure from the ground up."
  }
];

const PurchaseServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(mockServices.map(service => service.category)))];
  
  const filteredServices = selectedCategory === 'All' 
    ? mockServices.filter(service => service.isActive)
    : mockServices.filter(service => service.category === selectedCategory && service.isActive);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleGetStarted = () => {
    navigate('/order-server-care');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10 mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <img src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" alt="CloudHouse Technologies" className="h-8 w-auto mr-3" />
              <h1 className="text-xl font-semibold text-white">Purchase Services</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Available Services</h2>
          <p className="text-gray-600 dark:text-gray-300">Choose from our comprehensive range of IT services</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Categories</CardTitle>
                {/* Category Search Input */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {filteredCategories.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No categories found
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredServices.map((service) => (
                <Card key={service.id} className={`relative bg-white dark:bg-gray-800 border dark:border-gray-700 transition-all duration-300 hover:shadow-lg ${
                  service.popular ? 'border-purple-300 dark:border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800' : 'hover:border-purple-200 dark:hover:border-purple-700'
                }`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">${service.cost}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        per {service.billing === 'monthly' ? 'month' : service.billing === 'yearly' ? 'year' : 'time'}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.description.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={handleGetStarted}
                      className={`w-full ${
                        service.popular 
                          ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800' 
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                      } text-white font-medium py-3`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white text-center">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-6 py-4 bg-white dark:bg-gray-800">
                          <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseServicesPage;
