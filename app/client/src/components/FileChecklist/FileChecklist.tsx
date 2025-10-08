import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import './FileChecklist.css';

// Define the structure for a file object
interface OssFile {
  name: string;
  isMissing: boolean;
}

// Mock data: In a real app, this would come from props or an API.
const initialFiles: OssFile[] = [
  { name: 'README.md', isMissing: false },
  { name: 'CONTRIBUTING.md', isMissing: true },
  { name: 'LICENSE', isMissing: true },
  { name: 'CODE_OF_CONDUCT.md', isMissing: false },
  { name: '.gitignore', isMissing: true },
];

export const FileChecklist: React.FC = () => {
  const [files] = useState<OssFile[]>(initialFiles);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Handles changes to any checkbox
  const handleCheckboxChange = (fileName: string) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileName)) {
        newSelected.delete(fileName);
      } else {
        newSelected.add(fileName);
      }
      return newSelected;
    });
  };

  // Handles the final submission button click
  const handleSubmit = () => {
    const payload = Array.from(selectedFiles);
    console.log('Making it OSS with:', payload);
    // In a real scenario, you would call your API here
    // e.g., createOssFiles(payload);
    alert(`Payload for downstream flow: ${payload.join(', ')}`);
  };

  // Determine if the button should be disabled
  const isButtonDisabled = selectedFiles.size === 0;

  return (
    <div className="file-checklist-container">
      <ul className="file-list">
        {files.map((file) => (
          <li
            key={file.name}
            // *** THIS IS THE CORRECTED LINE ***
            // Use a template literal (backticks) to combine strings and expressions
            className={`file-item ${!file.isMissing ? 'present' : 'missing'}`}
          >
            <input
              type="checkbox"
              id={file.name}
              value={file.name}
              checked={!file.isMissing || selectedFiles.has(file.name)}
              disabled={!file.isMissing}
              onChange={() => handleCheckboxChange(file.name)}
            />
            <label htmlFor={file.name}>{file.name}</label>
          </li>
        ))}
      </ul>
      <div className="action-footer">
        <span>
          {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
        </span>
        <Button onClick={handleSubmit} disabled={isButtonDisabled}>
          Make it OSS
        </Button>
      </div>
    </div>
  );
};

export default FileChecklist;
