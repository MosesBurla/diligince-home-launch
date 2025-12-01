import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { useRequirement } from "@/contexts/RequirementContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RequiredFieldsChecklistProps {
  onNavigateToStep?: (step: number) => void;
}

export const RequiredFieldsChecklist = ({ onNavigateToStep }: RequiredFieldsChecklistProps) => {
  const { formData } = useRequirement();
  
  const getRequiredFields = () => {
    const fields = [
      { name: 'Title', completed: !!formData.title?.trim(), step: 1 },
      { name: 'Category', completed: !!formData.category, step: 1 },
      { name: 'Priority', completed: !!formData.priority, step: 1 },
    ];
    
    // Add category-specific required fields
    if (formData.category === 'product') {
      fields.push(
        { name: 'Product Specifications', completed: !!formData.productSpecifications?.trim(), step: 2 },
        { name: 'Quantity', completed: !!formData.quantity && formData.quantity > 0, step: 2 }
      );
    } else if (formData.category === 'expert') {
      fields.push(
        { name: 'Specialization', completed: !!formData.specialization?.trim(), step: 2 },
        { name: 'Description', completed: !!formData.description?.trim(), step: 2 }
      );
    } else if (formData.category === 'service') {
      fields.push(
        { name: 'Service Description', completed: !!formData.serviceDescription?.trim(), step: 2 },
        { name: 'Scope of Work', completed: !!formData.scopeOfWork?.trim(), step: 2 }
      );
    } else if (formData.category === 'logistics') {
      fields.push(
        { name: 'Equipment Type', completed: !!formData.equipmentType?.trim(), step: 2 },
        { name: 'Pickup Location', completed: !!formData.pickupLocation?.trim(), step: 2 },
        { name: 'Delivery Location', completed: !!formData.deliveryLocation?.trim(), step: 2 }
      );
    }
    
    // Budget is required
    fields.push(
      { name: 'Estimated Budget', completed: !!formData.estimatedBudget && formData.estimatedBudget > 0, step: 4 }
    );
    
    // Deadline is required (using the generic deadline field)
    fields.push(
      { name: 'Deadline', completed: !!formData.deadline, step: 5 }
    );
    
    return fields;
  };
  
  const requiredFields = getRequiredFields();
  const completedCount = requiredFields.filter(f => f.completed).length;
  const allCompleted = completedCount === requiredFields.length;
  
  return (
    <Card className={allCompleted ? "border-green-500" : "border-amber-500"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
          Required Fields ({completedCount}/{requiredFields.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requiredFields.map((field, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {field.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={field.completed ? 'text-muted-foreground' : 'font-medium'}>
                  {field.name}
                </span>
              </div>
              {!field.completed && onNavigateToStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToStep(field.step)}
                  className="text-xs"
                >
                  Go to Step {field.step}
                </Button>
              )}
            </div>
          ))}
        </div>
        {!allCompleted && (
          <p className="text-sm text-muted-foreground mt-4">
            Please complete all required fields before publishing
          </p>
        )}
      </CardContent>
    </Card>
  );
};
