import React, { useState, useEffect } from "react";
import { useRequirement } from "@/contexts/RequirementContext";
import { useRequirementDraft } from "@/hooks/useRequirementDraft";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RequirementDocumentUploadField } from "@/components/requirement/RequirementDocumentUploadField";

interface DocumentsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData, draftId } = useRequirement();
  const { uploadDocs, deleteDoc } = useRequirementDraft();
  const [isUploading, setIsUploading] = useState(false);

  // Helper to get document by type
  const getDocumentByType = (type: string) => {
    return formData.documents?.find(doc => doc.documentType === type);
  };

  // Upload handler
  const handleUpload = async (file: File, documentType: string) => {
    if (!draftId) {
      toast.error("Unable to upload. Please save your requirement first.");
      throw new Error("No draft ID");
    }

    try {
      setIsUploading(true);
      const uploadedDocs = await uploadDocs([file], [documentType]);
      
      // Validate uploadedDocs before mapping
      if (!uploadedDocs || !Array.isArray(uploadedDocs)) {
        throw new Error("Invalid response from upload service");
      }
      
      const docsWithDateObjects = uploadedDocs.map(doc => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt)
      }));
      
      // Ensure formData.documents is an array before filtering
      const existingDocs = formData.documents || [];
      const updatedDocs = existingDocs.filter(d => d.documentType !== documentType);
      updateFormData({
        documents: [...updatedDocs, ...docsWithDateObjects]
      });

      return docsWithDateObjects[0];
    } catch (error: any) {
      console.error("Upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete handler
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDoc(documentId);
      updateFormData({
        documents: formData.documents.filter(d => d.id !== documentId)
      });
      toast.success("Document deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete document");
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Supporting Documents</h2>
        <p className="text-muted-foreground mt-2">
          Upload documents to support your requirement. All documents are optional.
        </p>
      </div>

      {/* Document Upload Fields - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <RequirementDocumentUploadField
          label="Technical Specs"
          documentType="specification"
          helperText="Technical requirements or product specs"
          currentDocument={getDocumentByType('specification')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Drawings"
          documentType="drawing"
          helperText="CAD files or blueprints"
          currentDocument={getDocumentByType('drawing')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Reference"
          documentType="reference"
          helperText="Standards or guidelines"
          currentDocument={getDocumentByType('reference')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Compliance"
          documentType="compliance"
          helperText="Certifications or regulatory docs"
          currentDocument={getDocumentByType('compliance')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Other"
          documentType="other"
          helperText="Additional supporting documents"
          currentDocument={getDocumentByType('other')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />
      </div>

    </div>
  );
};

export default DocumentsStep;
