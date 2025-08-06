
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createIndustry, fetchIndustries } from '@/hooks/authThunks';
import { RootState } from '@/hooks/store'
import type { AppDispatch } from '@/hooks/store';
import { toast } from 'sonner';



interface CreateIndustryForm {
  industry_name: string;
  description: string;
}


const CreateIndustryPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { industries, loading, error } = useSelector((state: RootState) => state.industry);
  const navigate = useNavigate();
  
  const form = useForm<CreateIndustryForm>({
    defaultValues: {
      industry_name: '',
      description: ''
    }
  });
  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  // const onSubmit = (data: CreateIndustryForm) => {
  //   console.log('Industry data:', data);
  //   dispatch(createIndustry(data));
  //   navigate('/industry');
  // };

//   const onSubmit = (data: CreateIndustryForm) => {
//   const payload = {
//     industry_name: data.industry_name,
//     description: data.description,
//   };

//   dispatch(createIndustry(payload));
//   toast.success('Industry created successfully!');
//   navigate('/industry');
// };
  
const onSubmit = (data :CreateIndustryForm) => {
    dispatch(createIndustry(data))
      .unwrap()
      .then(() => {
        toast.success('Industry created successfully!');
        navigate('/industry');
      })
      .catch(() => toast.error('Failed to create industry'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/industry')}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Industries
              </Button>
              <img 
                src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                alt="CloudHouse Technologies" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-white">Create New Industry</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Industry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="industry_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter industry name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter industry description" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/industry')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Create Industry
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateIndustryPage;
