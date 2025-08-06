import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface Industry {
  id: number;
  industry_name: string;
  description: string;
  status?: boolean;
}

interface ServiceCategory {
  id: number;
  category: string;
}

// interface IndustryState {
//   industries: Industry[];
//   serviceCategories: ServiceCategory[];
//   createdServices: ServiceCreatePayload[];
//   loading: boolean;
//   error: string | null;
//   // Optional: store leads if needed
//   leads?: LeadPayload[]; 
// }
export interface LeadPayload {
  full_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  country_code: string;
  note: string;
  industry_id: number;
}

interface IndustryState {
  industries: Industry[];
  serviceCategories: ServiceCategory[];
  createdServices: ServiceCreatePayload[];
  loading: boolean;
  error: string | null;
  leads?: LeadPayload[]; 
}



const initialState: IndustryState = {
  industries: [],
  serviceCategories: [],
  createdServices: [],
  loading: false,
  error: null,
  leads: [], 
};


// const initialState: IndustryState = {
//   industries: [],
//   serviceCategories: [],
//   createdServices: [],
//   loading: false,
//   error: null,
// };

// const initialState: IndustryState = {
//   industries: [],
//   loading: false,
//   error: null,
// };
// interface CustomField {
//   id: string;
//   fieldName: string;
//   mandatory: boolean;
//   fieldType: 'string' | 'digit' | 'password' | 'selection';
//   options: string[];
// }

// interface ServiceCreatePayload {
//   service_name: string;
//   category: string;
//   paymentType: string;
//   price?: number;
//   monthlyCost?: number;
//   yearlyCost?: number;
//   description: string[];
//   customFields: CustomField[];
// }
interface CustomField {
  id: string;
  field_name: string;
  mandatory: boolean;
  field_type: 'string' | 'digit' | 'password' | 'selection';
  options: string[];
}


export interface ServiceCreatePayload {
  name: string;
  category_id: number; // changed from string to number
  type: 'onetime' | 'recurring';
  one_time_cost?: string; // changed to string
  monthly_cost?: string;
  yearly_cost?: string;
  custom_fields: Array<{
    field_name: string;
    field_type: 'string' | 'digit' | 'password' | 'select';
    is_mandatory: boolean;
    field_select?: { options: string }[];
  }>;
}





// Fetch all industries
export const fetchIndustries = createAsyncThunk(
  'industries/fetchAll',
  async () => {
    const response = await axios.get('https://api.cloudhousetechnologies.com/api/v1/industry');
    return response.data;
  }
);

// Create new industry
export const createIndustry = createAsyncThunk(
  'industries/create',
  async (credentials: { industry_name: string; description: string }) => {
    const response = await axios.post('https://api.cloudhousetechnologies.com/api/v1/industry', credentials);
    return response.data;
  }
);

export const fetchService = createAsyncThunk(
  'industry/fetchservice',
  async () => {
    const response = await axios.get('https://api.cloudhousetechnologies.com/api/v1/service/categories');
    return response.data.data
  }
)

export const createService = createAsyncThunk(
  'service/createService',
  async (data: ServiceCreatePayload) => {
    const response = await axios.post('https://api.cloudhousetechnologies.com/api/v1/services', data);
    return response.data.data;
  }
)
export const getAllDetails = createAsyncThunk(
  'service/getAllDetails',
  async () => {
    const response = await axios.get('https://api.cloudhousetechnologies.com/api/v1/services?page=1&limit=2');
    return response.data.message.data;
  }
)
export const createLead = createAsyncThunk(
  'lead/create',
  async (data: LeadPayload) => {
    const response = await axios.post('https://api.cloudhousetechnologies.com/api/v1/customer', data);
    return response.data;
  }
);
export const getLeads = createAsyncThunk(
  'lead/getLeads',
  async () => {
    const response = await axios.get('https://api.cloudhousetechnologies.com/api/v1/customer');
    return response.data.message.data
  }
);


const industrySlice = createSlice({
  name: 'industries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // industries
      .addCase(fetchIndustries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload.data; // or action.payload depends on API
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch industries';
      })

      // create industry
      .addCase(createIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.industries.push(action.payload.data || action.payload);
      })
      .addCase(createIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create industry';
      })

      // services
      // fetch service categories
      .addCase(fetchService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceCategories = action.payload; // assuming payload = [{ id, name }]
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })

      // create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.createdServices.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create service';
      })
      // getAllDetailsfrom services
      .addCase(getAllDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.createdServices = action.payload
      })
      .addCase(getAllDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all details';
      })
      // create lead
      .addCase(createLead.pending,(state)=>{
        state.loading=true
        state.error=null
      })
      .addCase(createLead.fulfilled,(state,action)=>{
        state.loading=false
        state.leads.push(action.payload.data || action.payload);
      })
      .addCase(createLead.rejected,(state,action)=>{
        state.loading=false
        state.error=action.error.message || 'Failed to create lead';
      })
      // get leads
      .addCase(getLeads.pending,(state)=>{
        state.loading=true
        state.error=null
      })
      .addCase(getLeads.fulfilled,(state,action)=>{
        state.loading=false
        state.leads=action.payload.data || action.payload;
      })
      .addCase(getLeads.rejected,(state,action)=>{
        state.loading=false
        state.error=action.error.message || 'Failed to fetch leads';
      });
  },
});
export default industrySlice.reducer;
