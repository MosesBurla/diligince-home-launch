import { useState, DragEvent, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreVertical, PlusCircle, Upload, FileText, Download, Trash, Check, Edit, Loader2, X, ArrowUpDown, ChevronRight, ChevronLeft, Info, Award, Calendar, Building2, ShieldCheck, AlertCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Corporate navy theme color
const CORPORATE_NAVY = "#153b60";

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Certification name is required" }),
  issuingOrganization: z.string().min(2, { message: "Issuing organization is required" }),
  issueDate: z.string().min(1, { message: "Issue date is required" }),
  expiryDate: z.string().optional(),
  documentName: z.string().optional(),
  isVerified: z.boolean().default(false),
}).refine((data) => {
    if (data.issueDate && data.expiryDate) {
      return new Date(data.expiryDate) > new Date(data.issueDate);
    }
    return true;
  }, {
    message: "Expiry date must be after the issue date.",
    path: ["expiryDate"],
});

type CertificationFormValues = z.infer<typeof certificationSchema>;
type CertificationState = Omit<CertificationFormValues, "issueDate" | "expiryDate"> & {
  issueDate: Date;
  expiryDate?: Date;
  documentUrl?: string;
  isMandatory?: boolean;
};

type SortField = "name" | "issuingOrganization" | "issueDate" | "expiryDate";
type SortDirection = "asc" | "desc";

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const LOCAL_STORAGE_KEY = "vendorCertifications";
const ITEMS_PER_PAGE = 6;

const MANDATORY_CERTIFICATIONS: CertificationState[] = [
  {
    id: "1",
    name: "GST Certificate",
    issuingOrganization: "Goods and Services Tax Network",
    issueDate: new Date("2022-01-15"),
    documentName: "gst_certificate.pdf",
    isVerified: true,
    documentUrl: "/docs/gst_certificate.pdf",
    isMandatory: true,
  },
  {
    id: "2",
    name: "PAN Card",
    issuingOrganization: "Income Tax Department",
    issueDate: new Date("2020-03-20"),
    documentName: "pan_card.pdf",
    isVerified: true,
    documentUrl: "/docs/pan_card.pdf",
    isMandatory: true,
  },
  {
    id: "3",
    name: "ISO 9001:2015",
    issuingOrganization: "Quality Council of India",
    issueDate: new Date("2021-05-10"),
    expiryDate: new Date("2024-05-10"),
    documentName: "iso_9001_certificate.pdf",
    isVerified: true,
    documentUrl: "/docs/iso_9001_certificate.pdf",
    isMandatory: true,
  },
];

const VendorCertifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingCertification, setEditingCertification] = useState<CertificationState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sortField, setSortField] = useState<SortField>("issueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [customCertifications, setCustomCertifications] = useState<CertificationState[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: "", issuingOrganization: "", issueDate: "", expiryDate: "" },
    mode: 'onTouched',
  });

  const [mandatoryCertifications, setMandatoryCertifications] = useState<CertificationState[]>(MANDATORY_CERTIFICATIONS);
  const allCertifications = [...mandatoryCertifications, ...customCertifications];
  
  const sortedCertifications = [...allCertifications].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "issuingOrganization":
        comparison = a.issuingOrganization.localeCompare(b.issuingOrganization);
        break;
      case "issueDate":
        comparison = a.issueDate.getTime() - b.issueDate.getTime();
        break;
      case "expiryDate":
        const aExpiry = a.expiryDate?.getTime() || Infinity;
        const bExpiry = b.expiryDate?.getTime() || Infinity;
        comparison = aExpiry - bExpiry;
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedCertifications.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = sortedCertifications.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const formatted = parsedData.map((cert: any) => ({
          ...cert,
          issueDate: new Date(cert.issueDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
          isMandatory: false,
        }));
        setCustomCertifications(formatted);
      }
    } catch {
      toast.error("Failed to load certifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customCertifications));
    }
  }, [customCertifications, isLoading]);

  function handleDragOver(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);
  }

  function resetAndCloseDialog(): void {
    form.reset();
    setSelectedFile(null);
    setEditingCertification(null);
    setIsDialogOpen(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Please use PDF, JPG, or PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setSelectedFile(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Please use PDF, JPG, or PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setSelectedFile(file);
  }

  function handleDeleteCertification(id: string): void {
    if (MANDATORY_CERTIFICATIONS.some(cert => cert.id === id)) {
      toast.error("Mandatory certifications cannot be deleted");
      return;
    }

    const updated = customCertifications.filter(cert => cert.id !== id);
    setCustomCertifications(updated);
    toast.success("Certification deleted successfully");
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function openEditCertificationDialog(certification?: CertificationState): void {
    setIsDialogOpen(true);

    if (certification) {
      setEditingCertification(certification);
      form.setValue("name", certification.name);
      form.setValue("issuingOrganization", certification.issuingOrganization);
      form.setValue("issueDate", format(certification.issueDate, "yyyy-MM-dd"));
      form.setValue("expiryDate", certification.expiryDate ? format(certification.expiryDate, "yyyy-MM-dd") : "");
    } else {
      form.reset();
      setSelectedFile(null);
      setEditingCertification(null);
    }
  }

  function handleDownload(certification: CertificationState): void {
    if (!certification.documentUrl) {
      toast.error("No document available for download");
      return;
    }

    const link = document.createElement("a");
    link.href = certification.documentUrl;
    link.download = certification.documentName || "document";
    link.click();
    toast.success("Download started");
  }

  async function onSubmit(values: CertificationFormValues) {
    setIsSubmitting(true);

    try {
      const newCertification: CertificationState = {
        ...values,
        id: editingCertification?.id || Date.now().toString(),
        issueDate: new Date(values.issueDate),
        expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
        documentName: selectedFile?.name || editingCertification?.documentName,
        documentUrl: selectedFile
          ? URL.createObjectURL(selectedFile)
          : editingCertification?.documentUrl,
        isVerified: editingCertification?.isVerified || false,
        isMandatory: editingCertification?.isMandatory || false,
      };

      if (!editingCertification || 
          (editingCertification.name !== newCertification.name)) {
        
        const nameExists = allCertifications.some(
          cert => 
            cert.id !== editingCertification?.id &&
            cert.name.toLowerCase() === newCertification.name.toLowerCase()
        );

        if (nameExists) {
          toast.error("A certificate with this name already exists");
          setIsSubmitting(false);
          return;
        }
      }

      if (editingCertification) {
        if (editingCertification.isMandatory) {
          const updatedMandatory = mandatoryCertifications.map(cert => 
            cert.id === editingCertification.id ? newCertification : cert
          );
          setMandatoryCertifications(updatedMandatory);
          toast.success("Certification updated successfully");
        } else {
          const updated = customCertifications.map((cert) =>
            cert.id === editingCertification.id ? newCertification : cert
          );
          setCustomCertifications(updated);
          toast.success("Certification updated successfully");
        }
      } else {
        setCustomCertifications([...customCertifications, newCertification]);
        toast.success("Certification uploaded successfully");
      }

      resetAndCloseDialog();
    } catch (error) {
      toast.error("Failed to save certification");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Check if certification is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
  };

  // Check if certification is expired
  const isExpired = (expiryDate?: Date) => {
    if (!expiryDate) return false;
    return expiryDate < new Date();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${CORPORATE_NAVY}15` }}>
            <Award className="h-6 w-6" style={{ color: CORPORATE_NAVY }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
            {showInfo && (
              <p className="text-sm text-gray-500 mt-1">
                Manage your company certifications and compliance documents
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => openEditCertificationDialog()}
          className="text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: CORPORATE_NAVY }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Certification
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4" style={{ borderLeftColor: CORPORATE_NAVY }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{allCertifications.length}</p>
              </div>
              <Award className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allCertifications.filter(c => c.isVerified).length}
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allCertifications.filter(c => isExpiringSoon(c.expiryDate)).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allCertifications.filter(c => isExpired(c.expiryDate)).length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-500 self-center mr-2">Sort by:</span>
        {[
          { field: "name" as SortField, label: "Name" },
          { field: "issuingOrganization" as SortField, label: "Organization" },
          { field: "issueDate" as SortField, label: "Issue Date" },
          { field: "expiryDate" as SortField, label: "Expiry Date" },
        ].map(({ field, label }) => (
          <Button
            key={field}
            variant={sortField === field ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex items-center gap-1",
              sortField === field && "text-white"
            )}
            style={sortField === field ? { backgroundColor: CORPORATE_NAVY } : {}}
            onClick={() => handleSort(field)}
          >
            <span>{label}</span>
            <ArrowUpDown className="h-3 w-3" />
            {sortField === field && (
              <span className="text-xs ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: CORPORATE_NAVY }} />
        </div>
      ) : sortedCertifications.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No certifications yet</h3>
            <p className="text-sm text-gray-400 mb-4">Upload your company certifications to get started</p>
            <Button
              onClick={() => openEditCertificationDialog()}
              className="text-white"
              style={{ backgroundColor: CORPORATE_NAVY }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload First Certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {currentItems.map((certification) => (
              <Card 
                key={certification.id} 
                className={cn(
                  "overflow-hidden border-l-4 hover:shadow-lg transition-shadow",
                  certification.isMandatory && "bg-blue-50/50",
                  isExpired(certification.expiryDate) && "border-l-red-500",
                  isExpiringSoon(certification.expiryDate) && !isExpired(certification.expiryDate) && "border-l-amber-500",
                  !isExpired(certification.expiryDate) && !isExpiringSoon(certification.expiryDate) && "border-l-[#153b60]"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {certification.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {certification.isMandatory && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                            Mandatory
                          </Badge>
                        )}
                        {certification.isVerified && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {isExpired(certification.expiryDate) && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            Expired
                          </Badge>
                        )}
                        {isExpiringSoon(certification.expiryDate) && !isExpired(certification.expiryDate) && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditCertificationDialog(certification)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(certification)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        {!certification.isMandatory && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCertification(certification.id!)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{certification.issuingOrganization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Issued: {format(certification.issueDate, "MMM dd, yyyy")}</span>
                    </div>
                    {certification.expiryDate && (
                      <div className={cn(
                        "flex items-center gap-2",
                        isExpired(certification.expiryDate) ? "text-red-600" : 
                        isExpiringSoon(certification.expiryDate) ? "text-amber-600" : "text-gray-600"
                      )}>
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {format(certification.expiryDate, "MMM dd, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {certification.documentName && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{certification.documentName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(certification)}
                          className="h-8 px-3 hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetAndCloseDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingCertification ? "Edit Certification" : "Upload Certification"}
            </DialogTitle>
            <DialogDescription>
              {editingCertification 
                ? "Update the certification details below"
                : "Add a new certification to your profile"
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
                    <FormLabel>Certification Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ISO 9001:2015" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuingOrganization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Quality Council of India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Document</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                    isDragging ? "border-[#153b60] bg-blue-50" : "border-gray-200 hover:border-gray-300",
                    selectedFile && "border-green-500 bg-green-50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : editingCertification?.documentName ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">{editingCertification.documentName}</span>
                      <span className="text-xs text-gray-400">Click or drag to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Click or drag file to upload</span>
                      <span className="text-xs text-gray-400">PDF, JPG, PNG up to {MAX_FILE_SIZE_MB}MB</span>
                    </div>
                  )}
                </div>
              </div>

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
                  {editingCertification ? "Update" : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorCertifications;
