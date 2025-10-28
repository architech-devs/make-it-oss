import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    repoName: string;
    submittedBy: string;
    submittedAt: string;
    status: string;
  } | null;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
}) => {
  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repository Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mb-3">
          <div>
            <span className="font-semibold">Repository:</span> {submission.repoName}
          </div>
          <div>
            <span className="font-semibold">Submitted By:</span> {submission.submittedBy}
          </div>
          <div>
            <span className="font-semibold">Submitted At:</span> {submission.submittedAt}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {submission.status}
          </div>
        </div>
        <DialogFooter>
          <button
            className="rounded bg-primary text-primary-foreground px-4 py-1 hover:bg-primary/90 focus:outline-none"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionModal;
