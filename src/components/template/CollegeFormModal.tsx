import React, { useState } from "react";

interface CollegeFormModalProps {
  onClose: () => void;
  onSave: (college: { name: string; admissionId: string; collegeName: string; branch: string; year: string }) => void;
}

const CollegeFormModal: React.FC<CollegeFormModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [admissionId, setAdmissionId] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!name || !admissionId || !collegeName || !branch || !year) {
      alert("Please fill all fields");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    onSave({ name, admissionId, collegeName, branch, year });
    setTimeout(() => setIsSubmitting(false), 500);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Enter College Details</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Admission ID"
          value={admissionId}
          onChange={(e) => setAdmissionId(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="College Name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeFormModal;
