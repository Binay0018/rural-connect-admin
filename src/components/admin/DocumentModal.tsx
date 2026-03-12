import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileText, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'medical-cert' | 'govt-id' | null;
  doctorName: string;
}

export function DocumentModal({ isOpen, onClose, documentType, doctorName }: DocumentModalProps) {
  if (!documentType) return null;

  const title = documentType === 'medical-cert' ? 'Medical Certificate' : 'Government ID';
  const description = `Reviewing submitted document for ${doctorName}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10 shadow-elevated">
        <DialogHeader className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
            {/* Close button handled by Dialog primitive, but we can add download */}
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border hover:bg-muted">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/50 p-6 flex items-center justify-center overflow-auto relative">
          {/* Mock Document Content */}
          <div className="bg-white w-full max-w-2xl min-h-[500px] rounded-lg shadow-sm border border-border p-12 relative flex flex-col items-center justify-center text-center space-y-4">
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <FileText className="w-64 h-64" />
            </div>

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800">
              Mock {title}
            </h3>
            <div className="space-y-2 text-sm text-slate-500 max-w-sm">
              <p>This is a simulated document viewer for the SwastyaConnect admin panel.</p>
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100 text-left mt-6 space-y-2 w-full">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">Doctor Name:</span>
                  <span className="text-slate-900">{doctorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">Document Type:</span>
                  <span className="text-slate-900">{title}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-semibold text-slate-700">Verification Status:</span>
                  <span className="text-success font-medium">Clear / Legible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
