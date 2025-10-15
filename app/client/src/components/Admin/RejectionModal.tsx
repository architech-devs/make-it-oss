import React, { useState } from "react";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ isOpen, onClose, onReject }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.4)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#18181b",
          color: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 300,
          maxWidth: "95vw"
        }}
      >
        <h3>Reject Submission</h3>
        <textarea
          rows={3}
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ width: "100%", marginBottom: 12, resize: "vertical" }}
        />
        <div>
          <button
            onClick={() => {
              onReject(reason);
              setReason("");
            }}
            style={{ marginRight: 12 }}
            disabled={!reason.trim()}
          >
            Submit
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
