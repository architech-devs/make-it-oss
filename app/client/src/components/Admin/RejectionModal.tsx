import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onReject,
}) => {
  const [reason, setReason] = useState("");

  // Reset reason when the modal opens/closes
  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Submission</DialogTitle>
        </DialogHeader>
        <textarea
          rows={3}
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full mb-4 rounded border bg-muted px-2 py-2 resize-vertical text-foreground"
        />
        <DialogFooter>
          <button
            className="bg-destructive text-destructive-foreground px-4 py-1 rounded hover:bg-destructive/90 disabled:opacity-50"
            onClick={() => {
              onReject(reason);
              setReason("");
            }}
            disabled={!reason.trim()}
            type="button"
          >
            Submit
          </button>
          <button
            className="bg-muted text-foreground px-4 py-1 rounded hover:bg-muted/70"
            onClick={() => {
              setReason("");
              onClose();
            }}
            type="button"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
