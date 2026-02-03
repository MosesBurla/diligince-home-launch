// ============= Project Workflow Types =============

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'payment_pending' | 'paid' | 'completed';

export interface ProjectWorkflow {
    id: string;
    workflowId: string;
    projectTitle: string;
    poNumber?: string;
    quotationNumber?: string;
    status: WorkflowStatus;
    progress: number;
    totalValue: number;
    currency: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    isOverdue: boolean;
    milestones: {
        total: number;
        completed: number;
        pending: number;
    };
    createdAt: string;
}

export interface WorkflowMilestone {
    id: string;
    name?: string;
    description: string;
    percentage: number;
    amount: number;
    dueDate: string;
    status: MilestoneStatus;
    completedAt?: string;
    payment?: {
        paymentId: string;
        status: string;
        paidAt?: string;
        receipt?: {
            receiptNumber: string;
            url: string;
            downloadCount: number;
        };
        uploadedReceipt?: {
            url: string;
            fileName: string;
            uploadedAt: string;
        };
        vendorVerification?: {
            verified: boolean;
            verifiedAt?: string;
            comments?: string;
        };
    };
    canMarkComplete?: boolean;
}

export interface WorkflowDetail {
    workflow: {
        id: string;
        workflowId: string;
        projectTitle: string;
        status: WorkflowStatus;
        progress: number;
        totalValue: number;
        currency: string;
        startDate: string;
        endDate: string;
        daysRemaining: number;
        isOverdue: boolean;
    };
    linkedEntities: {
        purchaseOrder?: {
            poNumber: string;
            projectTitle: string;
            scopeOfWork: string;
        };
        quotation?: {
            quotationNumber: string;
            vendorName?: string;
        };
        requirement?: {
            title: string;
        };
    };
    stakeholder: {
        id: string;
        type: 'vendor' | 'professional';
        name: string;
        contact?: {
            email?: string;
            phone?: string;
        };
    };
    milestones: WorkflowMilestone[];
    stats: {
        totalMilestones: number;
        completedMilestones: number;
        paidMilestones: number;
        pendingMilestones: number;
        paidAmount: number;
        remainingAmount: number;
    };
    events: Array<{
        type: string;
        description: string;
        performedBy: {
            name: string;
            email: string;
        };
        performedByRole: string;
        timestamp: string;
        metadata?: Record<string, any>;
    }>;
}

// ============= API Response Types =============
export interface WorkflowListResponse {
    success: boolean;
    data: {
        workflows: ProjectWorkflow[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface WorkflowDetailResponse {
    success: boolean;
    data: WorkflowDetail;
}

// ============= Payment Types =============
export interface InitiatePaymentResponse {
    success: boolean;
    data: {
        paymentId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        razorpayKeyId: string;
        prefill?: {
            name: string;
            email: string;
            contact: string;
        };
        milestone: {
            id: string;
            name?: string;
            description: string;
            percentage: number;
        };
        expiresAt: string;
        existingOrder?: boolean;
    };
}

export interface VerifyPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    data: {
        paymentId: string;
        status: string;
        amount: number;
        currency: string;
        paidAt: string;
        receipt: {
            receiptNumber: string;
            downloadUrl: string;
        };
    };
    message: string;
}

export interface UploadReceiptResponse {
    success: boolean;
    data: {
        paymentId: string;
        uploadedReceipt: {
            url: string;
            fileName: string;
            uploadedAt: string;
        };
    };
    message: string;
}

// ============= Vendor Types =============
export interface MarkMilestoneCompleteRequest {
    notes?: string;
}

export interface MarkMilestoneCompleteResponse {
    success: boolean;
    data: {
        milestone: {
            id: string;
            name?: string;
            description: string;
            status: MilestoneStatus;
            completedAt: string;
        };
        workflowProgress: number;
        workflowStatus: WorkflowStatus;
    };
    message: string;
}
