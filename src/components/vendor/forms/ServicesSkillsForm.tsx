import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash, Plus, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { vendorServicesService, VendorService } from "@/services/modules/vendor-profile/vendor-services.service";

// Define service schema
const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Service name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  pricingModel: z.string().min(1, { message: "Pricing model is required" }),
  tags: z.array(z.string()).min(1, { message: "Add at least one service tag" }),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

// Define pricing model options
const pricingModelOptions = [
  "Hourly Rate",
  "Fixed Price",
  "Fixed Price + Materials",
  "Annual Contract",
  "Performance-based",
  "Time & Materials",
  "Retainer",
  "Subscription",
];

interface ServicesSkillsFormProps {
  isProfileLocked?: boolean;
  onSaveSuccess?: () => void;
}

const ServicesSkillsForm = ({ isProfileLocked = false, onSaveSuccess }: ServicesSkillsFormProps) => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<VendorService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      pricingModel: "",
      tags: [],
    },
  });

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await vendorServicesService.getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openAddServiceDialog = () => {
    if (isProfileLocked) {
      toast.warning("Profile is locked for verification");
      return;
    }
    form.reset({
      name: "",
      description: "",
      pricingModel: "",
      tags: [],
    });
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const openEditServiceDialog = (service: VendorService) => {
    if (isProfileLocked) {
      toast.warning("Profile is locked for verification");
      return;
    }
    form.reset({
      id: service.id,
      name: service.name,
      description: service.description,
      pricingModel: service.pricingModel,
      tags: service.tags,
    });
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: ServiceFormData) => {
    if (isProfileLocked) {
      toast.warning("Profile is locked for verification");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingService) {
        // Update existing service
        const response = await vendorServicesService.updateService(editingService.id, {
          name: values.name,
          description: values.description,
          pricingModel: values.pricingModel,
          tags: values.tags,
        });

        if (response.success) {
          setServices(services.map((service) => 
            service.id === editingService.id ? response.data : service
          ));
          toast.success("Service updated successfully!");
          onSaveSuccess?.();
        } else {
          toast.error(response.message || "Failed to update service");
        }
      } else {
        // Add new service
        const response = await vendorServicesService.createService({
          name: values.name,
          description: values.description,
          pricingModel: values.pricingModel,
          tags: values.tags,
        });

        if (response.success) {
          setServices([...services, response.data]);
          toast.success("Service added successfully!");
          onSaveSuccess?.();
        } else {
          toast.error(response.message || "Failed to add service");
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (isProfileLocked) {
      toast.warning("Profile is locked for verification");
      return;
    }

    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setIsDeleting(id);
    
    try {
      const response = await vendorServicesService.deleteService(id);
      
      if (response.success) {
        setServices(services.filter((service) => service.id !== id));
        toast.success("Service deleted successfully!");
        onSaveSuccess?.();
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(null);
    }
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    
    const currentTags = form.getValues().tags || [];
    if (!currentTags.includes(currentTag.trim())) {
      form.setValue("tags", [...currentTags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Services & Skills</CardTitle>
          <CardDescription>Manage your service offerings and specialized skills</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Services & Skills</CardTitle>
            <CardDescription>
              Manage your service offerings and specialized skills
            </CardDescription>
          </div>
          <Button 
            onClick={openAddServiceDialog} 
            className="bg-primary hover:bg-primary/90"
            disabled={isProfileLocked}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </CardHeader>
        
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No services added yet. Click "Add Service" to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditServiceDialog(service)}
                          className="h-8 w-8 text-primary"
                          disabled={isProfileLocked}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteService(service.id)}
                          className="h-8 w-8 text-destructive"
                          disabled={isProfileLocked || isDeleting === service.id}
                        >
                          {isDeleting === service.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {service.pricingModel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the details of your service offering"
                : "Add a new service to your company profile"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} />
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
                        placeholder="Describe your service offering in detail..." 
                        className="h-32 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricingModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pricingModelOptions.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Tags</FormLabel>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              className="ml-1 text-xs"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex">
                        <Input
                          placeholder="Type a tag and press enter"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="rounded-r-none"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="rounded-l-none"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? "Update Service" : "Add Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesSkillsForm;
