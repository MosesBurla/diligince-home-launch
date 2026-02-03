import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Upload, FileText, X, Loader2, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PurchaseOrderFormData, SOWDocument } from '@/schemas/purchase-order-form.schema';

interface AcceptanceCriteriaDocUploadProps {
  form: UseFormReturn<PurchaseOrderFormData>;
  criteriaIndex: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_CRITERIA = 3;

export const AcceptanceCriteriaDocUpload: React.FC<AcceptanceCriteriaDocUploadProps> = ({
  form,
  criteriaIndex,
  isExpanded,
  onToggleExpand,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const documents = form.watch(`acceptanceCriteria.${criteriaIndex}.documents`) || [];
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentDocs = form.getValues(`acceptanceCriteria.${criteriaIndex}.documents`) || [];
    
    if (currentDocs.length + files.length > MAX_FILES_PER_CRITERIA) {
      return;
    }

    const newDocs: SOWDocument[] = [];

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        return;
      }

      const doc: SOWDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'success',
      };
      newDocs.push(doc);
    });

    form.setValue(
      `acceptanceCriteria.${criteriaIndex}.documents`,
      [...currentDocs, ...newDocs]
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (docId: string) => {
    const currentDocs = form.getValues(`acceptanceCriteria.${criteriaIndex}.documents`) || [];
    form.setValue(
      `acceptanceCriteria.${criteriaIndex}.documents`,
      currentDocs.filter((d) => d.id !== docId)
    );
  };

  return (
    <div className="mt-2">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Paperclip className="h-3 w-3" />
        <span>
          {documents.length > 0
            ? `${documents.length} document${documents.length > 1 ? 's' : ''} attached`
            : 'Attach documents (optional)'}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {/* Expanded Upload Section */}
      {isExpanded && (
        <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/40">
          {/* Uploaded Files List */}
          {documents.length > 0 && (
            <div className="space-y-2 mb-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-background rounded-lg border border-border/60"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveFile(doc.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {documents.length < MAX_FILES_PER_CRITERIA && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border border-dashed border-border/60 rounded-lg p-4 text-center cursor-pointer",
                "hover:border-primary/50 hover:bg-primary/5 transition-colors"
              )}
            >
              <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Click to upload (max {MAX_FILES_PER_CRITERIA} files, 10MB each)
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
};
