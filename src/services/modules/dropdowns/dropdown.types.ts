// Master Dropdowns Type Definitions

export type DropdownModule = 
  | 'expert' 
  | 'serviceVendor' 
  | 'productVendor' 
  | 'logisticsVendor' 
  | 'industry';

export type DropdownCategory = 
  | 'expertise' 
  | 'specialization' 
  | 'industryType';

export interface DropdownOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface DropdownOptionsResponse {
  success: boolean;
  data: {
    options: DropdownOption[];
    total: number;
  };
  message?: string;
}

export interface GetDropdownOptionsParams {
  module: string; // Can be comma-separated: "expert,serviceVendor,productVendor"
  category?: DropdownCategory; // Optional - defaults to 'specialization' for vendor modules
  parentCategory?: string;
  search?: string;
}
