import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Pencil, Trash2, MapPin, Globe, Map, MapPinned } from 'lucide-react';
import { toast } from 'sonner';
import { createCountry, CreateCountryRequest, getAllCountries, deleteCountry, createState, CreateStateRequest, getAllStates, deleteState, createDistrict, CreateDistrictRequest, getAllDistricts } from '../../api/api';

interface Country {
  id: string;
  country_code: string;
  name: string;
  currency_format: string;
  created_date: string;
}

interface State {
  id: string;
  country_id: string;
  state_code: string;
  name: string;
  type: string;
  created_date: string;
}

interface District {
  id: string;
  state_id: string;
  district_code: string;
  name: string;
  created_date: string;
}

// Initial mock data
const initialCountries: Country[] = [
  { id: '1', country_code: 'IN', name: 'India', currency_format: '₹', created_date: '2025-11-14' },
];
const initialStates: State[] = [
  { id: '1', country_id: '1', state_code: 'TN', name: 'Tamil Nadu', type: 'State', created_date: '2025-01-10' },
  { id: '2', country_id: '1', state_code: 'MH', name: 'Maharashtra', type: 'State', created_date: '2025-01-10' },
  { id: '3', country_id: '1', state_code: 'DL', name: 'Delhi', type: 'Union Territory', created_date: '2025-01-11' },
  { id: '4', country_id: '1', state_code: 'KA', name: 'Karnataka', type: 'State', created_date: '2025-01-11' },
  { id: '5', country_id: '1', state_code: 'TG', name: 'Telangana', type: 'State', created_date: '2025-01-12' },
  { id: '6', country_id: '1', state_code: 'GJ', name: 'Gujarat', type: 'State', created_date: '2025-01-12' },
  { id: '7', country_id: '1', state_code: 'RJ', name: 'Rajasthan', type: 'State', created_date: '2025-01-13' },
  { id: '8', country_id: '1', state_code: 'AP', name: 'Andhra Pradesh', type: 'State', created_date: '2025-01-13' },
];

const initialDistricts: District[] = [
  { id: '1', state_id: '1', district_code: 'CHN', name: 'Chennai', created_date: '2025-01-10' },
  { id: '2', state_id: '1', district_code: 'CBE', name: 'Coimbatore', created_date: '2025-01-10' },
  { id: '3', state_id: '2', district_code: 'MUM', name: 'Mumbai', created_date: '2025-01-11' },
  { id: '4', state_id: '2', district_code: 'PUN', name: 'Pune', created_date: '2025-01-11' },
  { id: '5', state_id: '3', district_code: 'CD', name: 'Central Delhi', created_date: '2025-01-12' },
  { id: '6', state_id: '4', district_code: 'BLR', name: 'Bangalore Urban', created_date: '2025-01-12' },
  { id: '7', state_id: '5', district_code: 'HYD', name: 'Hyderabad', created_date: '2025-01-13' },
  { id: '8', state_id: '6', district_code: 'AMD', name: 'Ahmedabad', created_date: '2025-01-13' },
  { id: '9', state_id: '7', district_code: 'JPR', name: 'Jaipur', created_date: '2025-01-14' },
  { id: '10', state_id: '8', district_code: 'WG', name: 'West Godavari', created_date: '2025-01-14' },
];

type TabType = 'country' | 'state' | 'district';

export function LocationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('country');
  
  // Country state
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countryFormData, setCountryFormData] = useState({
    country_code: '',
    name: '',
    currency_format: '',
  });
  const [countryFormErrors, setCountryFormErrors] = useState({
    country_code: '',
    name: '',
    currency_format: '',
  });
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // State state
  const [states, setStates] = useState<State[]>(initialStates);
  const [isStateDialogOpen, setIsStateDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [stateFormData, setStateFormData] = useState({
    country_id: '',
    state_code: '',
    name: '',
    type: '',
  });
  const [stateFormErrors, setStateFormErrors] = useState({
    country_id: '',
    state_code: '',
    name: '',
    type: '',
  });
  const [stateToDelete, setStateToDelete] = useState<string | null>(null);
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  // District state
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [isDistrictDialogOpen, setIsDistrictDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [districtFormData, setDistrictFormData] = useState({
    state_id: '',
    district_code: '',
    name: '',
  });
  const [districtFormErrors, setDistrictFormErrors] = useState({
    state_id: '',
    district_code: '',
    name: '',
  });
  const [districtToDelete, setDistrictToDelete] = useState<string | null>(null);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');

  // Fetch countries from API on mount
  useEffect(() => {
    let mounted = true;
    const fetchCountries = async () => {
      const res = await getAllCountries();
      if (!mounted) return;
      if (res.ok && res.data) {
        // Ensure IDs are strings and map to local Country shape
        const mapped = res.data.map((c) => ({
          id: String(c.id),
          country_code: c.country_code,
          name: c.name,
          currency_format: c.currency_format,
          created_date: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : (c as any).created_date || new Date().toISOString().split('T')[0],
        }));
        setCountries(mapped);
      }
    };
    fetchCountries();
    // also fetch states
    const fetchStates = async () => {
      const res = await getAllStates();
      if (!mounted) return;
      if (res.ok && res.data) {
        const mappedStates: State[] = res.data.map((s) => ({
          id: String(s.id),
          country_id: String(s.country_id),
          state_code: s.state_code,
          name: s.name,
          type: s.type,
          created_date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setStates(mappedStates);
      }
    };
    fetchStates();

    // fetch districts
    const fetchDistricts = async () => {
      const res = await getAllDistricts();
      if (!mounted) return;
      if (res.ok && res.data) {
        const mappedDistricts: District[] = res.data.map((d) => ({
          id: String(d.id),
          state_id: String(d.state_id),
          district_code: d.district_code,
          name: d.name,
          created_date: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setDistricts(mappedDistricts);
      }
    };

    fetchDistricts();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter functions
  const filteredCountries = countries.filter(
    (country) =>
      country.country_code.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const filteredStates = states.filter(
    (state) =>
      state.state_code.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
      state.name.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
      state.type.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const filteredDistricts = districts.filter(
    (district) =>
      district.district_code.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
      district.name.toLowerCase().includes(districtSearchQuery.toLowerCase())
  );

  // Country handlers
  const handleAddCountry = () => {
    setEditingCountry(null);
    setCountryFormData({ country_code: '', name: '', currency_format: '' });
    setCountryFormErrors({ country_code: '', name: '', currency_format: '' });
    setIsCountryDialogOpen(true);
  };

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setCountryFormData({
      country_code: country.country_code,
      name: country.name,
      currency_format: country.currency_format,
    });
    setCountryFormErrors({ country_code: '', name: '', currency_format: '' });
    setIsCountryDialogOpen(true);
  };

  const validateCountryForm = () => {
    const errors = { country_code: '', name: '', currency_format: '' };
    let isValid = true;

    if (!countryFormData.country_code.trim()) {
      errors.country_code = 'Country code is required';
      isValid = false;
    }

    if (!countryFormData.name.trim()) {
      errors.name = 'Country name is required';
      isValid = false;
    }

    if (!countryFormData.currency_format.trim()) {
      errors.currency_format = 'Currency format is required';
      isValid = false;
    }

    setCountryFormErrors(errors);
    return isValid;
  };

  const handleSaveCountry = async () => {
    if (!validateCountryForm()) return;

    const payload: CreateCountryRequest = {
      country_code: countryFormData.country_code.toUpperCase().trim(),
      name: countryFormData.name.trim(),
      currency_format: countryFormData.currency_format.trim(),
    };

    try {
      // Close dialog early – gives instant feedback
      setIsCountryDialogOpen(false);

      const result = await createCountry(payload);

      if (result.ok && result.data) {
        // API may return either the created Country directly or a wrapper { success, message, data }
        const resp: any = result.data;
        const created = resp.data ?? resp; // prefer wrapped data if present

        const createdAt = created.created_at || created.created_date || new Date().toISOString();

        const newCountry: Country = {
          id: String(created.id),
          country_code: created.country_code,
          name: created.name,
          currency_format: created.currency_format,
          created_date: new Date(createdAt).toISOString().split('T')[0],
        };

        // Add to local UI state
        setCountries((prev) => [...prev, newCountry]);

        toast.success(resp.message || 'Country added successfully!');
      } else {
        toast.error(result.error || 'Failed to add country');
      }
    } catch (err) {
      console.error('Country creation error:', err);
      toast.error('Network error – please try again.');
    } finally {
      // Reset form regardless of success/failure
      setCountryFormData({ country_code: '', name: '', currency_format: '' });
      setEditingCountry(null);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    try {
      const res = await deleteCountry(id);
      if (res.ok) {
        setCountries((prev) => prev.filter((c) => c.id !== id));
        toast.success('Country deleted successfully');
      } else {
        toast.error(res.error || 'Failed to delete country');
      }
    } catch (err) {
      console.error('Delete country error:', err);
      toast.error('Network error while deleting country');
    } finally {
      setCountryToDelete(null);
    }
  };

  // State handlers
  const handleAddState = () => {
    setEditingState(null);
    setStateFormData({ country_id: '', state_code: '', name: '', type: '' });
    setStateFormErrors({ country_id: '', state_code: '', name: '', type: '' });
    setIsStateDialogOpen(true);
  };

  const handleEditState = (state: State) => {
    setEditingState(state);
    setStateFormData({
      country_id: state.country_id,
      state_code: state.state_code,
      name: state.name,
      type: state.type,
    });
    setStateFormErrors({ country_id: '', state_code: '', name: '', type: '' });
    setIsStateDialogOpen(true);
  };

  const validateStateForm = () => {
    const errors = { country_id: '', state_code: '', name: '', type: '' };
    let isValid = true;

    if (!stateFormData.country_id) {
      errors.country_id = 'Country is required';
      isValid = false;
    }

    if (!stateFormData.state_code.trim()) {
      errors.state_code = 'State code is required';
      isValid = false;
    }

    if (!stateFormData.name.trim()) {
      errors.name = 'State name is required';
      isValid = false;
    }

    if (!stateFormData.type) {
      errors.type = 'Type is required';
      isValid = false;
    }

    setStateFormErrors(errors);
    return isValid;
  };

  const handleSaveState = () => {
    if (!validateStateForm()) return;
    (async () => {
      if (editingState) {
        setStates(
          states.map((s) =>
            s.id === editingState.id
              ? {
                  ...s,
                  country_id: stateFormData.country_id,
                  state_code: stateFormData.state_code,
                  name: stateFormData.name,
                  type: stateFormData.type,
                }
              : s
          )
        );
        toast.success('State updated successfully');
      } else {
        // Call API to create state
        const payload: CreateStateRequest = {
          country_id: stateFormData.country_id,
          state_code: stateFormData.state_code,
          name: stateFormData.name,
          type: stateFormData.type,
        };

        try {
          setIsStateDialogOpen(false);
          const res = await createState(payload);
          if (res.ok && res.data) {
            const created = res.data.data ?? res.data;
            const newState: State = {
              id: String(created.id),
              country_id: String(created.country_id),
              state_code: created.state_code,
              name: created.name,
              type: created.type,
              created_date: created.created_at ? new Date(created.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            };
            setStates((prev) => [...prev, newState]);
            toast.success(res.data.message || 'State added successfully');
          } else {
            toast.error(res.error || 'Failed to add state');
          }
        } catch (err) {
          console.error('Create state error:', err);
          toast.error('Network error – please try again.');
        }
      }

      setIsStateDialogOpen(false);
      setStateFormData({ country_id: '', state_code: '', name: '', type: '' });
      setEditingState(null);
    })();
  };

  const handleDeleteState = async (id: string) => {
    try {
      const res = await deleteState(id);
      if (res.ok) {
        setStates((prev) => prev.filter((s) => s.id !== id));
        toast.success('State deleted successfully');
      } else {
        toast.error(res.error || 'Failed to delete state');
      }
    } catch (err) {
      console.error('Delete state error:', err);
      toast.error('Network error while deleting state');
    } finally {
      setStateToDelete(null);
    }
  };

  // District handlers
  const handleAddDistrict = () => {
    setEditingDistrict(null);
    setDistrictFormData({ state_id: '', district_code: '', name: '' });
    setDistrictFormErrors({ state_id: '', district_code: '', name: '' });
    setIsDistrictDialogOpen(true);
  };

  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setDistrictFormData({
      state_id: district.state_id,
      district_code: district.district_code,
      name: district.name,
    });
    setDistrictFormErrors({ state_id: '', district_code: '', name: '' });
    setIsDistrictDialogOpen(true);
  };

  const validateDistrictForm = () => {
    const errors = { state_id: '', district_code: '', name: '' };
    let isValid = true;

    if (!districtFormData.state_id) {
      errors.state_id = 'State is required';
      isValid = false;
    }

    if (!districtFormData.district_code.trim()) {
      errors.district_code = 'District code is required';
      isValid = false;
    }

    if (!districtFormData.name.trim()) {
      errors.name = 'District name is required';
      isValid = false;
    }

    setDistrictFormErrors(errors);
    return isValid;
  };

  const handleSaveDistrict = () => {
    if (!validateDistrictForm()) return;

    (async () => {
      if (editingDistrict) {
        setDistricts(
          districts.map((d) =>
            d.id === editingDistrict.id
              ? {
                  ...d,
                  state_id: districtFormData.state_id,
                  district_code: districtFormData.district_code,
                  name: districtFormData.name,
                }
              : d
          )
        );
        toast.success('District updated successfully');
      } else {
        const payload: CreateDistrictRequest = {
          state_id: districtFormData.state_id,
          district_code: districtFormData.district_code,
          name: districtFormData.name,
        };

        try {
          setIsDistrictDialogOpen(false);
          const res = await createDistrict(payload);
          if (res.ok && res.data) {
            const created = (res.data as any).data ?? res.data;
            const newDistrict: District = {
              id: String(created.id),
              state_id: String(created.state_id),
              district_code: created.district_code,
              name: created.name,
              created_date: created.created_at ? new Date(created.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            };
            setDistricts((prev) => [...prev, newDistrict]);
            toast.success((res.data as any).message || 'District added successfully');
          } else {
            toast.error(res.error || 'Failed to add district');
          }
        } catch (err) {
          console.error('Create district error:', err);
          toast.error('Network error – please try again.');
        }
      }

      setIsDistrictDialogOpen(false);
      setDistrictFormData({ state_id: '', district_code: '', name: '' });
      setEditingDistrict(null);
    })();
  };

  const handleDeleteDistrict = (id: string) => {
    setDistricts(districts.filter((d) => d.id !== id));
    toast.success('District deleted successfully');
    setDistrictToDelete(null);
  };

  // Helper functions
  const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  const getStateName = (stateId: string) => {
    const state = states.find((s) => s.id === stateId);
    return state ? state.name : 'Unknown';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#111827', margin: 0 }}>Location Masters</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage countries, states, and districts across India
        </p>
      </div>

      {/* Summary Stats */}
      {/* <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, marginBottom: '0.5rem' }}>Total Countries</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F97316', margin: 0 }}>
            {countries.length}
          </p>
        </div>
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, marginBottom: '0.5rem' }}>Total States</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F97316', margin: 0 }}>
            {states.length}
          </p>
        </div>
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, marginBottom: '0.5rem' }}>Total Districts</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F97316', margin: 0 }}>
            {districts.length}
          </p>
        </div>
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, marginBottom: '0.5rem' }}>Total Locations</p>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F97316', margin: 0 }}>
            {countries.length + states.length + districts.length}
          </p>
        </div>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin style={{ height: '1.25rem', width: '1.25rem', color: '#F97316' }} />
            Location Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('country')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'country' ? '2px solid #F97316' : '2px solid transparent',
                  color: activeTab === 'country' ? '#F97316' : '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <Globe style={{ height: '1rem', width: '1rem' }} />
                Country
              </button>
              <button
                onClick={() => setActiveTab('state')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'state' ? '2px solid #F97316' : '2px solid transparent',
                  color: activeTab === 'state' ? '#F97316' : '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <Map style={{ height: '1rem', width: '1rem' }} />
                State
              </button>
              <button
                onClick={() => setActiveTab('district')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'district' ? '2px solid #F97316' : '2px solid transparent',
                  color: activeTab === 'district' ? '#F97316' : '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <MapPinned style={{ height: '1rem', width: '1rem' }} />
                District
              </button>
            </div>
          </div>

          {/* Country Tab */}
          {activeTab === 'country' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Input
                  placeholder="Search countries..."
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  style={{ maxWidth: '300px' }}
                />
                <Button onClick={handleAddCountry} style={{ backgroundColor: '#F97316', color: 'white' }}>
                  <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                  Add Country
                </Button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px' }}>S.No</TableHead>
                      <TableHead>Country Code</TableHead>
                      <TableHead>Country Name</TableHead>
                      <TableHead>Currency Format</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                          {countrySearchQuery ? 'No countries found matching your search.' : 'No countries added yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCountries.map((country, index) => (
                        <TableRow key={country.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{country.country_code}</TableCell>
                          <TableCell>{country.name}</TableCell>
                          <TableCell>{country.currency_format}</TableCell>
                          <TableCell style={{ color: '#6B7280' }}>{country.created_date}</TableCell>
                          <TableCell style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCountry(country)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Pencil style={{ height: '1rem', width: '1rem', color: '#2563EB' }} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCountryToDelete(country.id)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* State Tab */}
          {activeTab === 'state' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Input
                  placeholder="Search states..."
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  style={{ maxWidth: '300px' }}
                />
                <Button onClick={handleAddState} style={{ backgroundColor: '#F97316', color: 'white' }}>
                  <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                  Add State
                </Button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px' }}>S.No</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>State Code</TableHead>
                      <TableHead>State Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                          {stateSearchQuery ? 'No states found matching your search.' : 'No states added yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStates.map((state, index) => (
                        <TableRow key={state.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{getCountryName(state.country_id)}</TableCell>
                          <TableCell>{state.state_code}</TableCell>
                          <TableCell>{state.name}</TableCell>
                          <TableCell>{state.type}</TableCell>
                          <TableCell style={{ color: '#6B7280' }}>{state.created_date}</TableCell>
                          <TableCell style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditState(state)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Pencil style={{ height: '1rem', width: '1rem', color: '#2563EB' }} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStateToDelete(state.id)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* District Tab */}
          {activeTab === 'district' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Input
                  placeholder="Search districts..."
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  style={{ maxWidth: '300px' }}
                />
                <Button onClick={handleAddDistrict} style={{ backgroundColor: '#F97316', color: 'white' }}>
                  <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                  Add District
                </Button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px' }}>S.No</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>District Code</TableHead>
                      <TableHead>District Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistricts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                          {districtSearchQuery ? 'No districts found matching your search.' : 'No districts added yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDistricts.map((district, index) => (
                        <TableRow key={district.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{getStateName(district.state_id)}</TableCell>
                          <TableCell>{district.district_code}</TableCell>
                          <TableCell>{district.name}</TableCell>
                          <TableCell style={{ color: '#6B7280' }}>{district.created_date}</TableCell>
                          <TableCell style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDistrict(district)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Pencil style={{ height: '1rem', width: '1rem', color: '#2563EB' }} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDistrictToDelete(district.id)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Country Dialog */}
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCountry ? 'Edit Country' : 'Add Country'}</DialogTitle>
            <DialogDescription>
              {editingCountry ? 'Update the country details below.' : 'Enter the details for the new country.'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="country_code">
                Country Code <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="country_code"
                value={countryFormData.country_code}
                onChange={(e) => {
                  setCountryFormData({ ...countryFormData, country_code: e.target.value });
                  setCountryFormErrors({ ...countryFormErrors, country_code: '' });
                }}
                placeholder="e.g., IN"
                style={countryFormErrors.country_code ? { borderColor: '#EF4444' } : {}}
              />
              {countryFormErrors.country_code && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{countryFormErrors.country_code}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="country_name">
                Country Name <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="country_name"
                value={countryFormData.name}
                onChange={(e) => {
                  setCountryFormData({ ...countryFormData, name: e.target.value });
                  setCountryFormErrors({ ...countryFormErrors, name: '' });
                }}
                placeholder="e.g., India"
                style={countryFormErrors.name ? { borderColor: '#EF4444' } : {}}
              />
              {countryFormErrors.name && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{countryFormErrors.name}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="currency_format">
                Currency Format <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="currency_format"
                value={countryFormData.currency_format}
                onChange={(e) => {
                  setCountryFormData({ ...countryFormData, currency_format: e.target.value });
                  setCountryFormErrors({ ...countryFormErrors, currency_format: '' });
                }}
                placeholder="e.g., ₹"
                style={countryFormErrors.currency_format ? { borderColor: '#EF4444' } : {}}
              />
              {countryFormErrors.currency_format && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{countryFormErrors.currency_format}</p>
              )}
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsCountryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCountry} style={{ backgroundColor: '#F97316', color: 'white' }}>
              {editingCountry ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* State Dialog */}
      <Dialog open={isStateDialogOpen} onOpenChange={setIsStateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingState ? 'Edit State' : 'Add State'}</DialogTitle>
            <DialogDescription>
              {editingState ? 'Update the state details below.' : 'Enter the details for the new state.'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="state_country">
                Country <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Select
                value={stateFormData.country_id}
                onValueChange={(value) => {
                  setStateFormData({ ...stateFormData, country_id: value });
                  setStateFormErrors({ ...stateFormErrors, country_id: '' });
                }}
              >
                <SelectTrigger style={stateFormErrors.country_id ? { borderColor: '#EF4444' } : {}}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {stateFormErrors.country_id && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{stateFormErrors.country_id}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="state_code">
                State Code <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="state_code"
                value={stateFormData.state_code}
                onChange={(e) => {
                  setStateFormData({ ...stateFormData, state_code: e.target.value });
                  setStateFormErrors({ ...stateFormErrors, state_code: '' });
                }}
                placeholder="e.g., TN"
                style={stateFormErrors.state_code ? { borderColor: '#EF4444' } : {}}
              />
              {stateFormErrors.state_code && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{stateFormErrors.state_code}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="state_name">
                State Name <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="state_name"
                value={stateFormData.name}
                onChange={(e) => {
                  setStateFormData({ ...stateFormData, name: e.target.value });
                  setStateFormErrors({ ...stateFormErrors, name: '' });
                }}
                placeholder="e.g., Tamil Nadu"
                style={stateFormErrors.name ? { borderColor: '#EF4444' } : {}}
              />
              {stateFormErrors.name && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{stateFormErrors.name}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="state_type">
                Type <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Select
                value={stateFormData.type}
                onValueChange={(value) => {
                  setStateFormData({ ...stateFormData, type: value });
                  setStateFormErrors({ ...stateFormErrors, type: '' });
                }}
              >
                <SelectTrigger style={stateFormErrors.type ? { borderColor: '#EF4444' } : {}}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="State">State</SelectItem>
                  <SelectItem value="Union Territory">Union Territory</SelectItem>
                </SelectContent>
              </Select>
              {stateFormErrors.type && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{stateFormErrors.type}</p>
              )}
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsStateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveState} style={{ backgroundColor: '#F97316', color: 'white' }}>
              {editingState ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* District Dialog */}
      <Dialog open={isDistrictDialogOpen} onOpenChange={setIsDistrictDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDistrict ? 'Edit District' : 'Add District'}</DialogTitle>
            <DialogDescription>
              {editingDistrict ? 'Update the district details below.' : 'Enter the details for the new district.'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="district_state">
                State <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Select
                value={districtFormData.state_id}
                onValueChange={(value) => {
                  setDistrictFormData({ ...districtFormData, state_id: value });
                  setDistrictFormErrors({ ...districtFormErrors, state_id: '' });
                }}
              >
                <SelectTrigger style={districtFormErrors.state_id ? { borderColor: '#EF4444' } : {}}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {districtFormErrors.state_id && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{districtFormErrors.state_id}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="district_code">
                District Code <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="district_code"
                value={districtFormData.district_code}
                onChange={(e) => {
                  setDistrictFormData({ ...districtFormData, district_code: e.target.value });
                  setDistrictFormErrors({ ...districtFormErrors, district_code: '' });
                }}
                placeholder="e.g., WG"
                style={districtFormErrors.district_code ? { borderColor: '#EF4444' } : {}}
              />
              {districtFormErrors.district_code && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{districtFormErrors.district_code}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="district_name">
                District Name <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="district_name"
                value={districtFormData.name}
                onChange={(e) => {
                  setDistrictFormData({ ...districtFormData, name: e.target.value });
                  setDistrictFormErrors({ ...districtFormErrors, name: '' });
                }}
                placeholder="e.g., West Godavari"
                style={districtFormErrors.name ? { borderColor: '#EF4444' } : {}}
              />
              {districtFormErrors.name && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{districtFormErrors.name}</p>
              )}
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsDistrictDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDistrict} style={{ backgroundColor: '#F97316', color: 'white' }}>
              {editingDistrict ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={!!countryToDelete} onOpenChange={() => setCountryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Country</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this country? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => countryToDelete && handleDeleteCountry(countryToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!stateToDelete} onOpenChange={() => setStateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete State</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this state? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => stateToDelete && handleDeleteState(stateToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!districtToDelete} onOpenChange={() => setDistrictToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete District</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this district? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => districtToDelete && handleDeleteDistrict(districtToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
