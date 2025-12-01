export interface ParsedBackendError {
  type: 'validation' | 'generic';
  field?: string;
  friendlyField?: string;
  step?: number;
  message: string;
}

const fieldToStepMap: Record<string, number> = {
  // Step 1: Basic Info
  'title': 1,
  'category': 1,
  'priority': 1,
  
  // Step 2: Details (varies by category)
  'productSpecifications': 2,
  'quantity': 2,
  'specialization': 2,
  'description': 2,
  'serviceDescription': 2,
  'scopeOfWork': 2,
  'equipmentType': 2,
  'pickupLocation': 2,
  'deliveryLocation': 2,
  'duration': 2,
  
  // Step 3: Documents
  'documents': 3,
  
  // Step 4: Budget
  'estimatedBudget': 4,
  'budget': 4,
  
  // Step 5: Timeline
  'deadline': 5,
  'productDeliveryDate': 5,
  'serviceStartDate': 5,
  'deliveryDate': 5,
  
  // Step 6: Publish
  'submissionDeadline': 6,
  'evaluationCriteria': 6,
  'termsAccepted': 6,
};

const fieldNameMap: Record<string, string> = {
  'productSpecifications': 'Product Specifications',
  'quantity': 'Quantity',
  'specialization': 'Specialization',
  'description': 'Description',
  'serviceDescription': 'Service Description',
  'scopeOfWork': 'Scope of Work',
  'equipmentType': 'Equipment Type',
  'pickupLocation': 'Pickup Location',
  'deliveryLocation': 'Delivery Location',
  'duration': 'Duration',
  'title': 'Requirement Title',
  'category': 'Category',
  'priority': 'Priority',
  'estimatedBudget': 'Estimated Budget',
  'budget': 'Budget',
  'deadline': 'Deadline',
  'productDeliveryDate': 'Product Delivery Date',
  'serviceStartDate': 'Service Start Date',
  'deliveryDate': 'Delivery Date',
  'submissionDeadline': 'Submission Deadline',
  'evaluationCriteria': 'Evaluation Criteria',
  'termsAccepted': 'Terms & Conditions',
  'stakeholders': 'Stakeholders',
  'documents': 'Documents',
};

export const parseBackendError = (error: any): ParsedBackendError => {
  const message = error?.message || error?.error?.message || error?.data?.message || '';
  
  // Parse "field is not allowed to be empty" errors
  const emptyFieldMatch = message.match(/"([^"]+)" is not allowed to be empty/);
  if (emptyFieldMatch) {
    const field = emptyFieldMatch[1];
    return {
      type: 'validation',
      field: field,
      friendlyField: fieldNameMap[field] || field,
      step: fieldToStepMap[field],
      message: `${fieldNameMap[field] || field} is required and cannot be empty`
    };
  }
  
  // Parse "field must be a number" errors
  const numberFieldMatch = message.match(/"([^"]+)" must be a number/);
  if (numberFieldMatch) {
    const field = numberFieldMatch[1];
    return {
      type: 'validation',
      field: field,
      friendlyField: fieldNameMap[field] || field,
      step: fieldToStepMap[field],
      message: `${fieldNameMap[field] || field} must be a valid number`
    };
  }
  
  // Parse "field must be greater than X" errors
  const greaterThanMatch = message.match(/"([^"]+)" must be greater than (\d+)/);
  if (greaterThanMatch) {
    const field = greaterThanMatch[1];
    const value = greaterThanMatch[2];
    return {
      type: 'validation',
      field: field,
      friendlyField: fieldNameMap[field] || field,
      step: fieldToStepMap[field],
      message: `${fieldNameMap[field] || field} must be greater than ${value}`
    };
  }
  
  // Parse array/object validation errors
  const arrayFieldMatch = message.match(/"([^"]+)" must contain at least/);
  if (arrayFieldMatch) {
    const field = arrayFieldMatch[1];
    return {
      type: 'validation',
      field: field,
      friendlyField: fieldNameMap[field] || field,
      step: fieldToStepMap[field],
      message: `At least one ${fieldNameMap[field] || field} is required`
    };
  }
  
  // Generic validation error
  if (error?.statusCode === 422 || message.includes('validation')) {
    return {
      type: 'validation',
      message: message || 'Please check all required fields and try again'
    };
  }
  
  // Generic error
  return {
    type: 'generic',
    message: message || 'An unexpected error occurred. Please try again.'
  };
};

export const getFriendlyFieldName = (field: string): string => {
  return fieldNameMap[field] || field;
};

export const getStepForField = (field: string): number | undefined => {
  return fieldToStepMap[field];
};
