import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Download, FileText, Star, X, ArrowLeft } from "lucide-react";

import IndustryHeader from "@/components/industry/IndustryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useUser } from "@/contexts/UserContext";

// ------------------ Types ------------------
type DeliverableItem = {
  id: string;
  description: string;
  isCompleted: boolean;
};

type AcceptanceCriteria = {
  id: string;
  description: string;
  isVerified: boolean;
};

type RequiredDocument = {
  id: string;
  name: string;
  isUploaded: boolean;
  isVerified: boolean;
  uploadedDate?: string;
  verifiedDate?: string;
};

type PurchaseOrder = {
  poNumber: string;
  projectTitle: string;
  vendor: string;
  vendorType: string;
  startDate: string;
  completionDate: string;
  totalValue: number;
  preTaxValue: number;
  taxPercentage: number;
  taxAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentTerms: string;
  deliverables: DeliverableItem[];
  acceptanceCriteria: AcceptanceCriteria[];
  requiredDocuments: RequiredDocument[];
};

// ------------------ Component ------------------
const WorkCompletionPayment = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  const [viewingDocument, setViewingDocument] =
    useState<RequiredDocument | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [poData, setPoData] = useState<PurchaseOrder | null>(null);

  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [criteria, setCriteria] = useState<AcceptanceCriteria[]>([]);
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      qualityRating: 0,
      timelinessRating: 0,
      communicationRating: 0,
      feedback: "",
    },
  });

  // ------------------ Authentication ------------------
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role !== "industry") {
      toast({
        title: "Access Denied",
        description: "This page is only accessible to industry users.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, toast]);

  // ------------------ Load PO Data ------------------
  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Purchase Order ID is required.",
        variant: "destructive",
      });
      navigate("/industry-dashboard");
      return;
    }

    const loadPoData = async () => {
      setIsLoading(true);

      // Mock Data (replace with API later)
      const mockData: PurchaseOrder = {
        poNumber: `PO-2302-${id}`,
        projectTitle: "Industrial Equipment Procurement",
        vendor: "Acme Industrial Supplies",
        vendorType: "Product Vendor",
        startDate: "2023-03-15",
        completionDate: "2023-04-20",
        totalValue: 28600,
        preTaxValue: 26000,
        taxPercentage: 10,
        taxAmount: 2600,
        paidAmount: 13000,
        balanceDue: 15600,
        paymentTerms: "50% advance, 50% upon completion",
        deliverables: [
          {
            id: "del-1",
            description: "Supply of industrial metal frames (10 units)",
            isCompleted: true,
          },
          {
            id: "del-2",
            description: "Delivery to manufacturing facility",
            isCompleted: true,
          },
          {
            id: "del-3",
            description: "Installation and configuration",
            isCompleted: false,
          },
          {
            id: "del-4",
            description: "Technical training for staff",
            isCompleted: false,
          },
        ],
        acceptanceCriteria: [
          {
            id: "ac-1",
            description: "All units meet ISO 9001 quality standards",
            isVerified: true,
          },
          {
            id: "ac-2",
            description: "Installation completed within 7 working days",
            isVerified: true,
          },
          {
            id: "ac-3",
            description: "Training materials provided in digital format",
            isVerified: false,
          },
        ],
        requiredDocuments: [
          {
            id: "doc-1",
            name: "Quality Certification",
            isUploaded: true,
            isVerified: true,
            uploadedDate: "2023-04-15",
            verifiedDate: "2023-04-17",
          },
          {
            id: "doc-2",
            name: "Installation Report",
            isUploaded: true,
            isVerified: false,
            uploadedDate: "2023-04-18",
          },
          {
            id: "doc-3",
            name: "Training Completion Report",
            isUploaded: false,
            isVerified: false,
          },
        ],
      };

      setTimeout(() => {
        setPoData(mockData);
        setDeliverables(mockData.deliverables);
        setCriteria(mockData.acceptanceCriteria);
        setDocuments(mockData.requiredDocuments);
        setIsLoading(false);
      }, 1000);
    };

    loadPoData();
  }, [id, navigate, toast]);

  // ------------------ Helpers ------------------
  const allDeliverablesComplete = deliverables.every((d) => d.isCompleted);
  const allCriteriaVerified = criteria.every((c) => c.isVerified);
  const allDocumentsVerified = documents.every(
    (doc) => doc.isUploaded && doc.isVerified
  );
  const canProcessPayment =
    allDeliverablesComplete && allCriteriaVerified && allDocumentsVerified;

  const toggleDeliverable = (id: string) =>
    setDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d))
    );

  const toggleCriteria = (id: string) =>
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );

  const verifyDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              isVerified: true,
              verifiedDate: new Date().toISOString().split("T")[0],
            }
          : doc
      )
    );
    toast({
      title: "Document Verified",
      description: "The document has been successfully verified.",
    });
  };

  const onSubmitRating = (data: any) => {
    console.log("Rating submitted:", data);
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback.",
    });
  };

  const processPayment = () => {
    console.log("Processing payment");
    setShowPaymentModal(false);
    toast({
      title: "Payment Processed",
      description: "The payment has been successfully processed.",
    });
    setTimeout(() => navigate("/dashboard/industry"), 2000);
  };

  // ------------------ Star Rating ------------------
  const StarRating = ({
    name,
    value,
    onChange,
  }: {
    name: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-xl ${
            value >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
        >
          <Star className="h-6 w-6" />
        </button>
      ))}
    </div>
  );

  // ------------------ Return JSX ------------------
  if (isLoading) {
    return (
      <div className="p-6 text-center">Loading purchase order details...</div>
    );
  }

  if (!poData) {
    return <div className="p-6 text-center">Purchase Order Not Found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Work Completion & Payment | Diligince.ai</title>
      </Helmet>
      

      {/* TODO: Paste your JSX layout for tables, payment summary, etc. */}
    </div>
  );
};

export default WorkCompletionPayment;

