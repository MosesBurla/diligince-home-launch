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
    return formData.documents?.find(doc => doc.type === type);
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
      
      const docsWithDateObjects = uploadedDocs.map(doc => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt)
      }));
      
      // Replace existing document of this type or add new
      const updatedDocs = formData.documents.filter(d => d.type !== documentType);
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

      {/* Document Upload Fields */}
      <div className="space-y-4">
        <RequirementDocumentUploadField
          label="Technical Specifications"
          documentType="specification"
          helperText="Upload technical requirements, product specs, or detailed specifications"
          currentDocument={getDocumentByType('specification')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Engineering Drawings"
          documentType="drawing"
          helperText="Upload CAD files, blueprints, or technical drawings"
          currentDocument={getDocumentByType('drawing')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Reference Documents"
          documentType="reference"
          helperText="Upload standards, guidelines, or reference materials"
          currentDocument={getDocumentByType('reference')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Compliance Documents"
          documentType="compliance"
          helperText="Upload certifications, compliance requirements, or regulatory documents"
          currentDocument={getDocumentByType('compliance')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />

        <RequirementDocumentUploadField
          label="Other Documents"
          documentType="other"
          helperText="Upload any additional supporting documents"
          currentDocument={getDocumentByType('other')}
          onUpload={handleUpload}
          onDelete={handleDeleteDocument}
          isUploading={isUploading}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isUploading}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isUploading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DocumentsStep;
