import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlusCircle, Briefcase, Calendar, Clock, Building2, Tag, 
  LayoutGrid, List, Edit, Trash, Eye, Loader2, ChevronLeft, 
  ChevronRight, Filter, ArrowUpDown, X, Image, DollarSign,
  CheckCircle, Activity, TrendingUp
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { format, differenceInMonths, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

// Corporate navy theme color
const CORPORATE_NAVY = "#153b60";

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Project name is required" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientIndustry: z.string().min(1, { message: "Please select an industry" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  status: z.enum(["completed", "active", "on-hold"]),
  value: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  technologies: z.string().optional(),
  outcomes: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectState = Omit<ProjectFormValues, "startDate" | "endDate" | "technologies"> & {
  startDate: Date;
  endDate?: Date;
  technologies: string[];
  imageUrl?: string;
};

type SortField = "name" | "startDate" | "value" | "clientName";
type SortDirection = "asc" | "desc";
type ViewMode = "grid" | "list";

const INDUSTRIES = [
  "Manufacturing", "Healthcare", "Finance", "Technology", "Energy", 
  "Retail", "Automotive", "Pharmaceuticals", "Construction", "Logistics"
];

const TECHNOLOGY_OPTIONS = [
  "PLC", "SCADA", "HMI", "IoT", "AI/ML", "Robotics", "Automation",
  "Data Analytics", "Cloud Computing", "ERP", "MES", "CAD/CAM"
];

const LOCAL_STORAGE_KEY = "vendorProjects";
const ITEMS_PER_PAGE = 6;

const SAMPLE_PROJECTS: ProjectState[] = [
  {
    id: "1",
    name: "Manufacturing Line Automation",
    clientName: "XYZ Pharmaceuticals Ltd.",
    clientIndustry: "Pharmaceuticals",
    startDate: new Date("2022-04-01"),
    endDate: new Date("2022-09-30"),
    status: "completed",
    value: "45,00,000",
    description: "Complete automation of the pharmaceutical manufacturing line including quality control integration.",
    technologies: ["PLC", "SCADA", "HMI", "IoT"],
    outcomes: "40% improvement in production efficiency, 99.9% quality compliance",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Energy Management System",
    clientName: "ABC Cement Industries",
    clientIndustry: "Manufacturing",
    startDate: new Date("2023-01-15"),
    endDate: new Date("2023-04-30"),
    status: "completed",
    value: "28,00,000",
    description: "Implementation of smart energy monitoring and management system across the plant.",
    technologies: ["IoT", "Data Analytics", "Cloud Computing"],
    outcomes: "25% reduction in energy costs, real-time monitoring dashboard",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Warehouse Automation Project",
    clientName: "FastLogistics Corp",
    clientIndustry: "Logistics",
    startDate: new Date("2023-08-01"),
    status: "active",
    value: "65,00,000",
    description: "End-to-end warehouse automation including robotic picking systems and inventory management.",
    technologies: ["Robotics", "Automation", "AI/ML", "MES"],
    imageUrl: "/placeholder.svg",
  },
];

const VendorProjectsPortfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectState | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { 
      name: "", clientName: "", clientIndustry: "", startDate: "", 
      endDate: "", status: "active", value: "", description: "", 
      technologies: "", outcomes: ""
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const formatted = parsedData.map((project: any) => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : undefined,
        }));
        setProjects(formatted);
      } else {
        setProjects(SAMPLE_PROJECTS);
      }
    } catch {
      toast.error("Failed to load projects");
      setProjects(SAMPLE_PROJECTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  // Filtered and sorted projects
  const filteredProjects = projects.filter(project => {
    if (filterIndustry !== "all" && project.clientIndustry !== filterIndustry) return false;
    if (filterStatus !== "all" && project.status !== filterStatus) return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "clientName":
        comparison = a.clientName.localeCompare(b.clientName);
        break;
      case "startDate":
        comparison = a.startDate.getTime() - b.startDate.getTime();
        break;
      case "value":
        const aValue = parseFloat(a.value?.replace(/,/g, '') || '0');
        const bValue = parseFloat(b.value?.replace(/,/g, '') || '0');
        comparison = aValue - bValue;
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const currentItems = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === "completed").length,
    active: projects.filter(p => p.status === "active").length,
    totalValue: projects.reduce((sum, p) => {
      const value = parseFloat(p.value?.replace(/,/g, '') || '0');
      return sum + value;
    }, 0),
  };

  const formatValue = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const calculateDuration = (start: Date, end?: Date) => {
    const endDate = end || new Date();
    const months = differenceInMonths(endDate, start);
    if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    const days = differenceInDays(endDate, start);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const resetAndCloseDialog = () => {
    form.reset();
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (project?: ProjectState) => {
    setIsDialogOpen(true);
    if (project) {
      setEditingProject(project);
      form.setValue("name", project.name);
      form.setValue("clientName", project.clientName);
      form.setValue("clientIndustry", project.clientIndustry);
      form.setValue("startDate", format(project.startDate, "yyyy-MM-dd"));
      form.setValue("endDate", project.endDate ? format(project.endDate, "yyyy-MM-dd") : "");
      form.setValue("status", project.status);
      form.setValue("value", project.value || "");
      form.setValue("description", project.description);
      form.setValue("technologies", project.technologies.join(", "));
      form.setValue("outcomes", project.outcomes || "");
    } else {
      form.reset();
      setEditingProject(null);
    }
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted successfully");
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const newProject: ProjectState = {
        ...values,
        id: editingProject?.id || Date.now().toString(),
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : undefined,
        technologies: values.technologies?.split(",").map(t => t.trim()).filter(Boolean) || [],
        imageUrl: editingProject?.imageUrl || "/placeholder.svg",
      };

      if (editingProject) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? newProject : p));
        toast.success("Project updated successfully");
      } else {
        setProjects(prev => [...prev, newProject]);
        toast.success("Project added successfully");
      }
      resetAndCloseDialog();
    } catch {
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "active": return "bg-blue-100 text-blue-700";
      case "on-hold": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${CORPORATE_NAVY}15` }}>
            <Briefcase className="h-6 w-6" style={{ color: CORPORATE_NAVY }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects & Portfolio</h1>
            <p className="text-sm text-gray-500">Showcase your completed and ongoing projects</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(viewMode === "grid" && "text-white")}
              style={viewMode === "grid" ? { backgroundColor: CORPORATE_NAVY } : {}}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(viewMode === "list" && "text-white")}
              style={viewMode === "list" ? { backgroundColor: CORPORATE_NAVY } : {}}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => openEditDialog()}
            className="text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: CORPORATE_NAVY }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4" style={{ borderLeftColor: CORPORATE_NAVY }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatValue(stats.totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filterIndustry} onValueChange={(v) => { setFilterIndustry(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map(ind => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          {[
            { field: "startDate" as SortField, label: "Date" },
            { field: "name" as SortField, label: "Name" },
            { field: "value" as SortField, label: "Value" },
          ].map(({ field, label }) => (
            <Button
              key={field}
              variant={sortField === field ? "default" : "outline"}
              size="sm"
              className={cn(sortField === field && "text-white")}
              style={sortField === field ? { backgroundColor: CORPORATE_NAVY } : {}}
              onClick={() => handleSort(field)}
            >
              {label}
              <ArrowUpDown className="h-3 w-3 ml-1" />
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: CORPORATE_NAVY }} />
        </div>
      ) : sortedProjects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {projects.length === 0 ? "No projects yet" : "No matching projects"}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {projects.length === 0 
                ? "Add your first project to build your portfolio"
                : "Try adjusting your filters"
              }
            </p>
            {projects.length === 0 && (
              <Button
                onClick={() => openEditDialog()}
                className="text-white"
                style={{ backgroundColor: CORPORATE_NAVY }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Projects Grid/List */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
          )}>
            {currentItems.map((project) => (
              <Card 
                key={project.id}
                className={cn(
                  "overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
                  viewMode === "list" && "flex flex-row"
                )}
                onClick={() => { setViewingProject(project); setIsViewDialogOpen(true); }}
              >
                {/* Project Image */}
                <div className={cn(
                  "bg-gray-100 relative overflow-hidden",
                  viewMode === "grid" ? "h-40" : "w-48 h-auto flex-shrink-0"
                )}>
                  <img 
                    src={project.imageUrl || "/placeholder.svg"} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2",
                      getStatusColor(project.status)
                    )}
                  >
                    {project.status === "completed" ? "Completed" : 
                     project.status === "active" ? "Active" : "On Hold"}
                  </Badge>
                </div>

                <CardContent className={cn("p-4 flex-1", viewMode === "list" && "flex flex-col justify-between")}>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2">
                      {project.name}
                    </h3>
                    
                    <div className="space-y-1.5 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {format(project.startDate, "MMM yyyy")} 
                          {project.endDate ? ` - ${format(project.endDate, "MMM yyyy")}` : " - Present"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{calculateDuration(project.startDate, project.endDate)}</span>
                      </div>
                      {project.value && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>₹{project.value}</span>
                        </div>
                      )}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={(e) => { e.stopPropagation(); setViewingProject(project); setIsViewDialogOpen(true); }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditDialog(project); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDelete(project.id!); }}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          {viewingProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{viewingProject.name}</DialogTitle>
                    <DialogDescription className="mt-1">
                      {viewingProject.clientName} • {viewingProject.clientIndustry}
                    </DialogDescription>
                  </div>
                  <Badge className={getStatusColor(viewingProject.status)}>
                    {viewingProject.status === "completed" ? "Completed" : 
                     viewingProject.status === "active" ? "Active" : "On Hold"}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={viewingProject.imageUrl || "/placeholder.svg"} 
                    alt={viewingProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {format(viewingProject.startDate, "MMM yyyy")} - 
                      {viewingProject.endDate ? format(viewingProject.endDate, "MMM yyyy") : "Present"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{calculateDuration(viewingProject.startDate, viewingProject.endDate)}</span>
                  </div>
                  {viewingProject.value && (
                    <div className="flex items-center gap-2 col-span-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Project Value:</span>
                      <span className="font-medium">₹{viewingProject.value}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{viewingProject.description}</p>
                </div>

                {viewingProject.technologies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingProject.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {viewingProject.outcomes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Outcomes</h4>
                    <p className="text-gray-600 text-sm">{viewingProject.outcomes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button 
                  onClick={() => { setIsViewDialogOpen(false); openEditDialog(viewingProject); }}
                  className="text-white"
                  style={{ backgroundColor: CORPORATE_NAVY }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetAndCloseDialog()}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject 
                ? "Update the project details below"
                : "Add a new project to your portfolio"
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Manufacturing Line Automation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., XYZ Industries" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientIndustry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Industry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map(ind => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Value (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 25,00,000" {...field} />
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
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the project scope, objectives, and your role..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PLC, SCADA, IoT (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Outcomes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the results and impact of the project..."
                        className="min-h-[60px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="text-white"
                  style={{ backgroundColor: CORPORATE_NAVY }}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProject ? "Update Project" : "Add Project"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProjectsPortfolio;
