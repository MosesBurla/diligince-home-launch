import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Paperclip, 
  FileText, 
  Download, 
  Eye,
  FileImage,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id?: string;
  name: string;
  type?: string;
  documentType?: string;
  size?: number;
  url?: string;
  uploadedAt?: string | Date;
}

interface ViewDocumentsSectionProps {
  documents?: Document[];
}

export const ViewDocumentsSection: React.FC<ViewDocumentsSectionProps> = ({ documents = [] }) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FileImage className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'dd MMM yyyy, HH:mm');
    } catch {
      return '';
    }
  };

  const getDocumentTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'specification': return 'Specification';
      case 'drawing': return 'Drawing';
      case 'reference': return 'Reference';
      case 'compliance': return 'Compliance';
      case 'other': return 'Other';
      default: return type || 'Document';
    }
  };

  const handlePreview = (doc: Document) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.url) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.click();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-primary" />
            Attached Documents
            {documents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {documents.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <Paperclip className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No documents attached</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div 
                  key={doc.id || index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(doc.name)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.size)}</span>
                        {doc.documentType && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs py-0">
                              {getDocumentTypeLabel(doc.documentType)}
                            </Badge>
                          </>
                        )}
                        {doc.uploadedAt && (
                          <>
                            <span>•</span>
                            <span>{formatDate(doc.uploadedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePreview(doc)}
                      disabled={!doc.url}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(doc)}
                      disabled={!doc.url}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDocumentsSection;
