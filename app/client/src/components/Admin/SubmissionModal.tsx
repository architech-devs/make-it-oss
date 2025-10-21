import React from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any; // Replace 'any' with a proper type in the future if needed
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, submission }) => {
  if (!isOpen || !submission) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#18181b",
          color: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 400,
          maxWidth: "90vw"
        }}
      >
        <h3>Repository Details</h3>
        <p><strong>Repository:</strong> {submission.repoName}</p>
        <p><strong>Submitted By:</strong> {submission.submittedBy}</p>
        <p><strong>Submitted At:</strong> {submission.submittedAt}</p>
        <p><strong>Status:</strong> {submission.status}</p>
        {/* Add more fields as needed */}
        <button onClick={onClose} style={{ marginTop: 16 }}>Close</button>
      </div>
    </div>
  );
};

export default SubmissionModal;
