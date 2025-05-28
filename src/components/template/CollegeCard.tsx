import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaTrash, FaStar, FaEdit } from "react-icons/fa";

interface CollegeCardProps {
  id: string;
  name: string;
  admissionId: string;
  about: string;
  courses: string;
  branch: string;
  year: string;
  likes: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedCourses: string) => void;
}

const CollegeCard: React.FC<CollegeCardProps> = ({
  id,
  name,
  admissionId,
  about,
  courses,
  branch,
  year,
  likes: initialLikes,
  onDelete,
  onEdit,
}) => {
  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem(`college-${id}-likes`);
    return storedLikes ? parseInt(storedLikes, 10) : initialLikes;
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedCourses, setUpdatedCourses] = useState(courses);

  useEffect(() => {
    localStorage.setItem(`college-${id}-likes`, likes.toString());
  }, [id, likes]);

  const handleDelete = async () => {
    try {
      console.log("Deleting college with ID:", id);
      onDelete(id);
      localStorage.removeItem(`college-${id}-likes`);
    } catch (error) {
      console.error("Error deleting college:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await onEdit(id, updatedCourses);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  return (
    <div className="p-6 border border-blue-300 rounded-2xl shadow-lg bg-white flex flex-col justify-between h-80 hover:shadow-blue-400 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 mt-6 cursor-pointer">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center mb-4">
            <FaGraduationCap className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLikes((prevLikes) => prevLikes + 1);
            }}
            className="text-gray-500 hover:text-yellow-500 transition-all duration-300"
          >
            <FaStar className={`w-6 h-6 ${likes > 0 ? "text-yellow-500" : "text-gray-400"}`} />
            <span className="ml-2 text-sm font-bold">{likes}</span>
          </button>
        </div>

        <p className="text-gray-700 mb-2">
          <strong>College Name:</strong> {about.replace("College Name: ", "")}
        </p>
        <p className="text-gray-700">
          <strong>Admission ID:</strong> {admissionId}
        </p>
        <p className="text-gray-700">
          <strong>Branch:</strong> {branch}
        </p>
        <p className="text-gray-700">
          <strong>Year:</strong> {year}
        </p>
        <p className="text-gray-700">
          <strong>Courses:</strong> {courses || "Not specified"}
        </p>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEditModal(true);
          }}
          className="text-gray-500 hover:text-blue-500 bg-gray-200 p-2 rounded-full transition-all duration-300 hover:bg-gray-300"
        >
          <FaEdit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="text-gray-500 hover:text-gray-700 bg-gray-200 p-2 rounded-full transition-all duration-300 hover:bg-gray-300"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Courses</h2>
            <textarea
              placeholder="Enter courses"
              value={updatedCourses}
              onChange={(e) => setUpdatedCourses(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
              rows={2}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeCard;
