import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Package, Edit, Trash2 } from 'lucide-react';

const ProductListPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Project Management System',
      description: 'Complete project management solution with task tracking and reporting',
      status: true
    },
    {
      id: 2,
      name: 'CRM Dashboard',
      description: 'Customer relationship management system with analytics',
      status: true
    },
    {
      id: 3,
      name: 'E-commerce Platform',
      description: 'Full-featured online store with payment integration',
      status: false
    },
    {
      id: 4,
      name: 'Custom Mobile App',
      description: 'Tailored mobile applications for iOS and Android',
      status: true
    }
  ]);

  const handleStatusToggle = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: !product.status }
        : product
    ));
  };

  const handleEdit = (productId: number) => {
    navigate(`/product/edit/${productId}`);
  };

  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
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
              <h1 className="text-xl font-semibold text-white">Product Management</h1>
            </div>
            <Button
              onClick={() => navigate('/product/create')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <Package className="h-6 w-6 mr-3 text-blue-600" />
              Product List
            </CardTitle>
            <CardDescription>
              Manage all products and their status in one place.
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
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={product.status}
                            onCheckedChange={() => handleStatusToggle(product.id)}
                          />
                          <span className={product.status ? 'text-green-600' : 'text-red-600'}>
                            {product.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
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

export default ProductListPage;
