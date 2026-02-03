import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PurchaseOrderDetail } from './modules/purchase-orders';
import { format } from 'date-fns';

interface PDFExportOptions {
    includeTerms?: boolean;
    includeSignature?: boolean;
}

export class POPDFGenerator {
    private doc: jsPDF;
    private yPos: number = 20;
    private readonly margin = 20;
    private readonly pageWidth: number;

    constructor() {
        this.doc = new jsPDF();
        this.pageWidth = this.doc.internal.pageSize.width;
    }

    /**
     * Generate PDF for a Purchase Order
     */
    async generatePO(po: PurchaseOrderDetail, options: PDFExportOptions = {}): Promise<void> {
        const { includeTerms = true, includeSignature = true } = options;

        // Header
        this.addHeader();

        // Company Details
        this.addCompanyDetails();

        // PO Information
        this.addPOInformation(po);

        // Vendor Details
        this.addVendorDetails(po);

        // Line Items / Deliverables
        this.addLineItems(po);

        // Payment Milestones
        if ((po.paymentMilestones && po.paymentMilestones.length > 0) || (po.milestones && po.milestones.length > 0)) {
            this.addPaymentMilestones(po);
        }

        // Acceptance Criteria
        if (po.acceptanceCriteria && po.acceptanceCriteria.length > 0) {
            this.addAcceptanceCriteria(po);
        }

        // Terms & Conditions
        if (includeTerms) {
            this.addTermsAndConditions(po);
        }

        // Signature Section
        if (includeSignature) {
            this.addSignatureSection();
        }

        // Footer with page numbers
        this.addFooter();
    }

    /**
     * Download the generated PDF with proper filename and extension
     */
    download(filename: string): void {
        // Ensure filename has .pdf extension
        const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

        // Use blob download method for better browser compatibility
        const blob = this.doc.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Get PDF as blob for uploading
     */
    getBlob(): Blob {
        return this.doc.output('blob');
    }

    private addHeader(): void {
        // Company Logo placeholder (you can add actual logo later)
        this.doc.setFontSize(20);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('PURCHASE ORDER', this.pageWidth / 2, this.yPos, { align: 'center' });

        this.yPos += 15;
    }

    private addCompanyDetails(): void {
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('From:', this.margin, this.yPos);

        this.doc.setFont('helvetica', 'normal');
        this.yPos += 5;

        // TODO: Replace with actual company details from user profile
        const companyDetails = [
            'Your Company Name',
            'Company Address Line 1',
            'Company Address Line 2',
            'Phone: +91 XXXXXXXXXX',
            'Email: contact@company.com',
            'GST: XXXXXXXXXXXX'
        ];

        companyDetails.forEach(line => {
            this.doc.text(line, this.margin, this.yPos);
            this.yPos += 5;
        });

        this.yPos += 10;
    }

    private addPOInformation(po: PurchaseOrderDetail): void {
        const infoStartY = 50;
        const col1X = this.pageWidth - 90;
        const col2X = this.pageWidth - 20;

        this.doc.setFontSize(10);

        // PO Details in right column
        const poDetails = [
            { label: 'PO Number:', value: po.poNumber || 'N/A' },
            { label: 'PO Date:', value: po.createdAt ? format(new Date(po.createdAt), 'dd-MMM-yyyy') : 'N/A' },
            { label: 'Status:', value: this.formatStatus(po.status) },
            { label: 'Currency:', value: po.currency || 'INR' },
        ];

        let detailY = infoStartY;
        poDetails.forEach(({ label, value }) => {
            this.doc.setFont('helvetica', 'bold');
            this.doc.text(label, col1X, detailY);
            this.doc.setFont('helvetica', 'normal');
            this.doc.text(value, col2X, detailY, { align: 'right' });
            detailY += 6;
        });
    }

    private addVendorDetails(po: PurchaseOrderDetail): void {
        this.yPos += 10;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('To (Vendor):', this.margin, this.yPos);

        this.doc.setFont('helvetica', 'normal');
        this.yPos += 5;

        const vendorDetails = [
            po.vendor?.name || po.vendorName || 'Vendor Name',
            po.vendor?.email || po.vendorEmail || 'vendor@email.com',
            po.vendor?.phone || po.vendorPhone || 'Phone Number',
        ];

        vendorDetails.forEach(line => {
            this.doc.text(line, this.margin, this.yPos);
            this.yPos += 5;
        });

        this.yPos += 10;
    }

    private addLineItems(po: PurchaseOrderDetail): void {
        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Items / Deliverables', this.margin, this.yPos);
        this.yPos += 5;

        const tableData = (po.deliverables || []).map((item, index) => [
            (index + 1).toString(),
            item.description || 'N/A',
            item.quantity?.toString() || '1',
            item.unit || 'unit',
            // Use unitPrice first, fallback to rate for backward compatibility
            this.formatCurrency(item.unitPrice ?? item.rate ?? 0, po.currency),
            // Use totalPrice first, fallback to amount for backward compatibility
            this.formatCurrency(item.totalPrice ?? item.amount ?? 0, po.currency),
        ]);

        autoTable(this.doc, {
            startY: this.yPos,
            head: [['#', 'Description', 'Qty', 'Unit', 'Rate', 'Amount']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66], fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            margin: { left: this.margin, right: this.margin },
            didDrawPage: (data) => {
                this.yPos = data.cursor?.y || this.yPos;
            },
        });

        this.yPos += 10;

        // Totals
        const totalsX = this.pageWidth - 70;
        const amountsX = this.pageWidth - this.margin;

        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Subtotal:', totalsX, this.yPos);
        this.doc.text(this.formatCurrency(po.subtotal || 0, po.currency), amountsX, this.yPos, { align: 'right' });
        this.yPos += 6;

        if (po.taxAmount && po.taxAmount > 0) {
            this.doc.text(`Tax (${po.gstRate || 18}%):`, totalsX, this.yPos);
            this.doc.text(this.formatCurrency(po.taxAmount, po.currency), amountsX, this.yPos, { align: 'right' });
            this.yPos += 6;
        }

        this.doc.setFontSize(11);
        this.doc.text('Total Amount:', totalsX, this.yPos);
        this.doc.text(this.formatCurrency(po.totalValue || 0, po.currency), amountsX, this.yPos, { align: 'right' });
        this.yPos += 10;
    }

    private addPaymentMilestones(po: PurchaseOrderDetail): void {
        if (this.yPos > 220) {
            this.doc.addPage();
            this.yPos = 20;
        }

        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Payment Milestones', this.margin, this.yPos);
        this.yPos += 5;

        const milestones = po.paymentMilestones || po.milestones || [];
        const milestoneData = milestones.map((milestone, index) => [
            (index + 1).toString(),
            milestone.name || milestone.milestoneName || milestone.title || 'N/A',
            milestone.dueDate ? format(new Date(milestone.dueDate), 'dd-MMM-yyyy') : 'TBD',
            `${milestone.percentage || 0}%`,
            this.formatCurrency(milestone.amount || 0, po.currency),
            milestone.status || 'pending',
        ]);

        autoTable(this.doc, {
            startY: this.yPos,
            head: [['#', 'Milestone', 'Due Date', 'Percentage', 'Amount', 'Status']],
            body: milestoneData,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66], fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            margin: { left: this.margin, right: this.margin },
            didDrawPage: (data) => {
                this.yPos = data.cursor?.y || this.yPos;
            },
        });

        this.yPos += 10;
    }

    private addAcceptanceCriteria(po: PurchaseOrderDetail): void {
        if (this.yPos > 220) {
            this.doc.addPage();
            this.yPos = 20;
        }

        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Acceptance Criteria', this.margin, this.yPos);
        this.yPos += 5;

        const criteriaData = (po.acceptanceCriteria || []).map((ac, index) => [
            (index + 1).toString(),
            ac.criteria || 'N/A',
            this.formatStatus(ac.status || 'pending'),
        ]);

        autoTable(this.doc, {
            startY: this.yPos,
            head: [['#', 'Criteria', 'Status']],
            body: criteriaData,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66], fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            margin: { left: this.margin, right: this.margin },
            didDrawPage: (data) => {
                this.yPos = data.cursor?.y || this.yPos;
            },
        });

        this.yPos += 10;
    }

    private addTermsAndConditions(po: PurchaseOrderDetail): void {
        if (this.yPos > 220) {
            this.doc.addPage();
            this.yPos = 20;
        }

        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Terms & Conditions', this.margin, this.yPos);
        this.yPos += 6;

        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');

        const terms = po.termsConditions || this.getDefaultTerms();
        const splitTerms = this.doc.splitTextToSize(terms, this.pageWidth - 2 * this.margin);

        this.doc.text(splitTerms, this.margin, this.yPos);
        this.yPos += (splitTerms.length * 4) + 10;
    }

    private addSignatureSection(): void {
        if (this.yPos > 230) {
            this.doc.addPage();
            this.yPos = 20;
        }

        this.yPos += 20;

        const signatureWidth = 60;
        const vendorSignX = this.margin;
        const companySignX = this.pageWidth - this.margin - signatureWidth;

        // Vendor Signature
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.line(vendorSignX, this.yPos, vendorSignX + signatureWidth, this.yPos);
        this.doc.text('Vendor Signature', vendorSignX, this.yPos + 6);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.text('Date: __________', vendorSignX, this.yPos + 12);

        // Company Signature
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.line(companySignX, this.yPos, companySignX + signatureWidth, this.yPos);
        this.doc.text('Authorized Signatory', companySignX, this.yPos + 6);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.text('Date: __________', companySignX, this.yPos + 12);
    }

    private addFooter(): void {
        const pageCount = this.doc.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            this.doc.setPage(i);
            this.doc.setFontSize(8);
            this.doc.setFont('helvetica', 'italic');

            const footerText = `Page ${i} of ${pageCount}`;
            this.doc.text(
                footerText,
                this.pageWidth / 2,
                this.doc.internal.pageSize.height - 10,
                { align: 'center' }
            );

            this.doc.text(
                'This is a computer-generated document and does not require a physical signature.',
                this.pageWidth / 2,
                this.doc.internal.pageSize.height - 5,
                { align: 'center' }
            );
        }
    }

    private formatStatus(status: string): string {
        return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A';
    }

    private formatCurrency(amount: number, currency: string = 'INR'): string {
        return `${currency} ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    private getDefaultTerms(): string {
        return `1. Payment Terms: Payment shall be made as per the milestone schedule outlined above.
2. Delivery: Vendor shall deliver the goods/services as per the agreed timeline.
3. Quality: All deliverables must meet the quality standards specified in the requirements.
4. Warranty: Vendor warrants that all goods/services will conform to the specifications.
5. Termination: Either party may terminate this PO with written notice as per the agreement.
6. Dispute Resolution: Any disputes shall be resolved through mutual negotiation or arbitration.
7. Confidentiality: Both parties agree to maintain confidentiality of all project-related information.
8. Force Majeure: Neither party shall be liable for delays due to circumstances beyond their control.`;
    }
}

/**
 * Export a Purchase Order as PDF
 */
export async function exportPOToPDF(
    po: PurchaseOrderDetail,
    options: PDFExportOptions = {}
): Promise<void> {
    const generator = new POPDFGenerator();
    await generator.generatePO(po, options);

    // Use orderNumber (display-friendly) or poNumber as fallback
    const poNumber = po.orderNumber || po.poNumber || 'PO';
    // Sanitize filename - remove any invalid characters
    const sanitizedFilename = poNumber.replace(/[^a-zA-Z0-9-_]/g, '-');

    generator.download(`${sanitizedFilename}.pdf`);
}

