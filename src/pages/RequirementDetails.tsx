import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import requirementListService from "@/services/requirement-list.service";
import { quotationsService } from "@/services/modules/quotations";
import { RequirementDetail } from "@/types/requirement-list";
import { QuotationsByRequirementResponse } from "@/types/quotation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import IndustryHeader from "@/components/industry/IndustryHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  User,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Edit,
  Workflow,
  MessageSquare,
  Download,
} from "lucide-react";
import { QuotationsTab } from "@/components/requirement/QuotationsTab";

const RequirementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<RequirementDetail | null>(null);
  const [quotations, setQuotations] = useState<QuotationsByRequirementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [quotationsLoading, setQuotationsLoading] = useState(false);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await requirementListService.getRequirementById(id);
        setRequirement(data);
        
        // Fetch quotations if published
        if (data.status === 'published') {
          fetchQuotations();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load requirement details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);

  const fetchQuotations = async () => {
    if (!id) return;
    
    try {
      setQuotationsLoading(true);
      const data = await quotationsService.getByRequirement(id);
      setQuotations(data);
    } catch (error: any) {
      console.error("Failed to load quotations:", error);
    } finally {
      setQuotationsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Requirement not found</p>
      </div>
    );
  }

  // Mock data preserved as fallback structure
  const mockRequirement = {
    id: id || "REQ-001",
    title: "Industrial Valve Procurement",
    category: "Product",
    status: "Active",
    priority: "High",
    description:
      "Procurement of high-quality industrial valves for chemical processing plant. These valves must meet strict safety and performance standards for handling corrosive chemicals.",
    costCenter: "CC-001-PROCUREMENT",
    department: "Process Engineering",
    requestedBy: "John Smith",
    businessJustification:
      "Critical equipment replacement needed for plant safety and operational efficiency. Current valves are showing signs of wear and potential failure.",
    estimatedBudget: 25000,
    riskLevel: "Medium",
    complianceRequired: true,
    productSpecifications:
      "Stainless steel ball valves, 6-inch diameter, pressure rating 600 PSI, temperature range -20°C to 200°C, corrosion resistant coating",
    quantity: 12,
    technicalStandards: ["ISO 9001:2015", "ASME Standards", "API Standards"],
    qualityRequirements: "ISO 9001",
    createdDate: "2024-01-10",
    deadline: "2024-01-25",
    productDeliveryDate: "2024-01-20",
    approvalStatus: "approved",
    approvalSteps: [
      {
        stepName: "Department Review",
        approverRole: "Department Head",
        status: "approved",
        approvedBy: "Jane Doe",
        approvedAt: "2024-01-11",
      },
      {
        stepName: "Budget Approval",
        approverRole: "Finance Manager",
        status: "approved",
        approvedBy: "Mike Johnson",
        approvedAt: "2024-01-12",
      },
      {
        stepName: "Compliance Review",
        approverRole: "Quality Manager",
        status: "pending",
        required: true,
      },
    ],
    complianceChecklist: [
      {
        item: "ISO 9001:2015 Compliance Verified",
        completed: true,
        verifiedBy: "Quality Team",
      },
      {
        item: "Technical Specifications Reviewed",
        completed: true,
        verifiedBy: "Engineering Team",
      },
      {
        item: "Safety Standards Validated",
        completed: false,
        verifiedBy: "",
      },
      {
        item: "Vendor Pre-qualification Required",
        completed: true,
        verifiedBy: "Procurement Team",
      },
    ],
    documents: [
      {
        name: "Technical Specifications.pdf",
        type: "specification",
        uploadedAt: "2024-01-10",
      },
      {
        name: "Safety Requirements.pdf",
        type: "compliance",
        uploadedAt: "2024-01-10",
      },
      {
        name: "Budget Approval.pdf",
        type: "reference",
        uploadedAt: "2024-01-12",
      },
    ],
    applicants: 8,
    auditTrail: [
      {
        action: "Requirement Created",
        timestamp: "2024-01-10 09:00",
        user: "John Smith",
        details: "Initial requirement creation with basic details",
      },
      {
        action: "Technical Details Added",
        timestamp: "2024-01-10 10:30",
        user: "John Smith",
        details: "Added product specifications and technical standards",
      },
      {
        action: "Submitted for Approval",
        timestamp: "2024-01-10 11:00",
        user: "John Smith",
        details: "Requirement submitted to approval workflow",
      },
      {
        action: "Department Approved",
        timestamp: "2024-01-11 14:00",
        user: "Jane Doe",
        details: "Approved by Department Head",
      },
      {
        action: "Budget Approved",
        timestamp: "2024-01-12 09:30",
        user: "Mike Johnson",
        details: "Budget allocation approved",
      },
      {
        action: "Published",
        timestamp: "2024-01-12 15:00",
        user: "System",
        details: "Requirement published to vendor marketplace",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Published":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedCompliance = requirement.complianceChecklist.filter(
    (item) => item.completed
  ).length;
  const compliancePercentage = Math.round(
    (completedCompliance / requirement.complianceChecklist.length) * 100
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Requirement Details - {requirement.title} | Diligince.ai</title>
      </Helmet>

      

      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        {/* Back and Actions */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/dashboard/requirements/${requirement.status === 'draft' ? 'drafts' : requirement.status === 'pending_approval' ? 'pending' : requirement.status === 'approved' ? 'approved' : requirement.status === 'published' ? 'published' : 'archived'}`}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Back to Requirements
          </Link>
          <div className="flex gap-2">
            {requirement.status === "draft" && (
              <Button variant="outline" asChild>
                <Link to={`/create-requirement?edit=${requirement.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Requirement
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to={`/industry-project-workflow/${requirement.id}`}>
                <Workflow className="h-4 w-4 mr-2" />
                View Workflow
              </Link>
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Vendors
            </Button>
          </div>
        </div>

        {/* Title and Status */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {requirement.title}
            </h1>
            <p className="text-gray-600 mb-4">{requirement.id}</p>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(requirement.status)}>
                {requirement.status}
              </Badge>
              <Badge className={getPriorityColor(requirement.priority)}>
                {requirement.priority} Priority
              </Badge>
              <Badge variant="outline">{requirement.category}</Badge>
              {requirement.complianceRequired && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  ISO 9001 Required
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${requirement.estimatedValue?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-500">Estimated Budget</div>
            {requirement.status === 'published' && quotations && (
              <div className="text-sm text-gray-500 mt-2">
                {quotations.data.summary.totalQuotations} quotation{quotations.data.summary.totalQuotations !== 1 ? 's' : ''} received
                {quotations.data.summary.pendingReview > 0 && (
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                    {quotations.data.summary.pendingReview} pending
                  </Badge>
                )}
              </div>
            )}
            {requirement.status !== 'published' && (
              <div className="text-sm text-gray-500 mt-2">
                {requirement.applicants} vendor applicants
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="quotations">
              Quotations
              {quotations && quotations.data.summary.totalQuotations > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white">
                  {quotations.data.summary.totalQuotations}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Requirement Description */}
            <Card>
              <CardHeader>
                <CardTitle>Requirement Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {requirement.description}
                </p>
              </CardContent>
            </Card>

            {/* Business Context */}
            <Card>
              <CardHeader>
                <CardTitle>Business Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Business Justification
                  </h4>
                  <p className="text-gray-700">
                    {requirement.businessJustification}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Department
                    </h4>
                    <p className="text-gray-600">{requirement.department}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Cost Center
                    </h4>
                    <p className="text-gray-600">{requirement.costCenter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specifications */}
          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  {requirement.productSpecifications}
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Quantity Required</h4>
                    <p>{requirement.quantity} units</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Quality Requirements</h4>
                    <p>{requirement.qualityRequirements}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">Technical Standards</h4>
                  <div className="flex flex-wrap gap-2">
                    {requirement.technicalStandards.map((std, i) => (
                      <Badge key={i} variant="outline">
                        {std}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expected Delivery:{" "}
                  {new Date(
                    requirement.productDeliveryDate
                  ).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <CardDescription>
                  Track compliance requirements for quality management standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirement.complianceChecklist.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    {item.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.item}</div>
                      {item.verifiedBy && (
                        <div className="text-sm text-gray-500">
                          Verified by: {item.verifiedBy}
                        </div>
                      )}
                    </div>
                    <Badge
                      className={
                        item.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.completed ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow */}
          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirement.approvalSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-lg border"
                  >
                    {step.status === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{step.stepName}</div>
                      <div className="text-sm text-gray-600">
                        Approver: {step.approverRole}
                      </div>
                      {step.approvedBy && (
                        <div className="text-sm text-gray-500">
                          Approved by {step.approvedBy} on{" "}
                          {new Date(step.approvedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Badge
                      className={
                        step.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirement.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.type} • Uploaded{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotations */}
          <TabsContent value="quotations">
            <QuotationsTab quotations={quotations} loading={quotationsLoading} />
          </TabsContent>

          {/* Audit Trail */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>
                  Complete history of all actions and changes to this
                  requirement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {requirement.auditTrail.map((entry, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 border-l-2 border-blue-200 bg-blue-50/50"
                  >
                    <div>
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-sm text-gray-600">
                        {entry.details}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.timestamp} • {entry.user}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RequirementDetails;
