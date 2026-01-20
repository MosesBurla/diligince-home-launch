import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { Address } from '@/types/verification';

// Indian states and cities data
const indianStatesAndCities: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada", "Rajahmundry", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Hisar", "Rohtak", "Karnal", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Kullu", "Mandi", "Hamirpur", "Chamba"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Kalaburagi", "Shivamogga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Kolhapur"],
  "Manipur": ["Imphal", "Churachandpur", "Bishnupur", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Gorakhpur", "Jhansi"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Haldia", "Kharagpur", "Darjeeling"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
};

const indianStates = Object.keys(indianStatesAndCities);

interface VendorAddressSectionProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
  isProfileLocked?: boolean;
  maxAddresses?: number;
}

export const VendorAddressSection: React.FC<VendorAddressSectionProps> = ({
  addresses,
  onChange,
  isProfileLocked = false,
  maxAddresses = 3,
}) => {
  // Initialize addresses if empty
  React.useEffect(() => {
    if (!addresses || addresses.length === 0) {
      onChange([{ line1: '', city: '', state: '', pincode: '', isPrimary: true }]);
    }
  }, []); // Only run on mount

  const currentAddresses = addresses && addresses.length > 0
    ? addresses
    : [{ line1: '', city: '', state: '', pincode: '', isPrimary: true }];

  const hasValidAddress = currentAddresses.some(addr => addr.line1?.trim());

  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    // Use currentAddresses which always has at least one element
    const updated = [...currentAddresses];
    updated[index] = { ...updated[index], [field]: value };

    // If setting isPrimary to true, unset others
    if (field === 'isPrimary' && value === true) {
      updated.forEach((addr, i) => {
        if (i !== index) addr.isPrimary = false;
      });
    }

    console.log('[VendorAddressSection] calling onChange with:', updated);
    onChange(updated);
  };

  const addAddress = () => {
    if (currentAddresses.length < maxAddresses) {
      onChange([...currentAddresses, { line1: '', city: '', state: '', pincode: '', isPrimary: false }]);
    }
  };

  const removeAddress = (index: number) => {
    if (currentAddresses.length > 1) {
      const updated = currentAddresses.filter((_, i) => i !== index);
      // Ensure at least one is primary
      if (!updated.some(a => a.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      onChange(updated);
    }
  };

  const getCitiesForState = (state: string) => {
    return indianStatesAndCities[state] || [];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Business Address</CardTitle>
          <span className="text-red-500">*</span>
          {hasValidAddress ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        {!isProfileLocked && currentAddresses.length < maxAddresses && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAddress}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasValidAddress && (
          <p className="text-xs text-red-600">At least one business address is required for verification</p>
        )}

        {currentAddresses.map((address, index) => (
          <div
            key={index}
            className="space-y-4 rounded-md border p-4 relative bg-muted/30"
          >
            {/* Address header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Address {index + 1}</span>
                {address.isPrimary && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Primary</span>
                )}
              </div>
              {!isProfileLocked && currentAddresses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor={`address-line1-${index}`}>
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`address-line1-${index}`}
                value={address.line1 || ''}
                onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                placeholder="Enter street address"
                disabled={isProfileLocked}
                className={!address.line1?.trim() ? 'border-red-300' : 'border-green-300'}
              />
            </div>

            {/* State and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`address-state-${index}`}>
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={address.state || ''}
                  onValueChange={(value) => {
                    // Batch both updates to avoid stale closure issue
                    const updated = [...currentAddresses];
                    updated[index] = {
                      ...updated[index],
                      state: value,
                      city: '' // Reset city when state changes
                    };
                    onChange(updated);
                  }}
                  disabled={isProfileLocked}
                >
                  <SelectTrigger className={!address.state ? 'border-red-300' : 'border-green-300'}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`address-city-${index}`}>
                  City <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={address.city || ''}
                  onValueChange={(value) => handleAddressChange(index, 'city', value)}
                  disabled={isProfileLocked || !address.state}
                >
                  <SelectTrigger className={!address.city ? 'border-red-300' : 'border-green-300'}>
                    <SelectValue placeholder={address.state ? "Select city" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    {getCitiesForState(address.state).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pincode and Primary checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`address-pincode-${index}`}>
                  Pincode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`address-pincode-${index}`}
                  value={address.pincode || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    handleAddressChange(index, 'pincode', value);
                  }}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  disabled={isProfileLocked}
                  className={!address.pincode || address.pincode.length !== 6 ? 'border-red-300' : 'border-green-300'}
                />
              </div>

              {currentAddresses.length > 1 && (
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id={`address-primary-${index}`}
                    checked={address.isPrimary || false}
                    onCheckedChange={(checked) => handleAddressChange(index, 'isPrimary', !!checked)}
                    disabled={isProfileLocked}
                  />
                  <Label htmlFor={`address-primary-${index}`} className="text-sm font-normal">
                    Set as primary address
                  </Label>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VendorAddressSection;
