import React, { useState, useEffect } from "react";
import CollegeCard from "../components/template/CollegeCard";
import CollegeFormModal from "../components/template/CollegeFormModal";

const TemplatePage: React.FC = () => {
  const [colleges, setColleges] = useState<
    { id: string; name: string; admissionId: string; collegeName: string; courses: string; branch: string; year: string }[]
  >([]);
  const [showModal, setShowModal] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/db/college", {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          const formattedColleges = data.colleges.map((college: any) => ({
            id: college.id,
            name: college.name,
            admissionId: college.admissionId,
            collegeName: college.collegeName,
            courses: college.courses || "",
            branch: college.branch || "",
            year: college.year || "",
          }));
          setColleges(formattedColleges);
        } else {
          console.error("Failed to fetch colleges:", data.error);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

 
  const getSortedColleges = () => {
    return colleges
      .map((college) => {
        
        const storedLikes = localStorage.getItem(`college-${college.id}-likes`);
        const likes = storedLikes ? parseInt(storedLikes, 10) : 0;
        return { ...college, likes };
      })
      .sort((a, b) => b.likes - a.likes); 
  };

  const addCollege = async (college: { name: string; admissionId: string; collegeName: string; branch: string; year: string }) => {
    try {
      const response = await fetch("/api/db/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...college, courses: "" }),
      });
      const data = await response.json();
      if (response.ok) {
        setColleges([...colleges, { ...college, id: data.id, courses: "" }]);
        setShowModal(false);
      } else {
        console.error("Failed to add college:", data.error);
      }
    } catch (error) {
      console.error("Error adding college:", error);
    }
  };

  const handleDeleteCollege = async (id: string) => {
    try {
      const response = await fetch("/api/db/college", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setColleges((prevColleges) => prevColleges.filter((college) => college.id !== id));
      } else {
        console.error("Failed to delete college");
      }
    } catch (error) {
      console.error("Error deleting college:", error);
    }
  };

  const handleEditCourses = async (id: string, updatedCourses: string) => {
    try {
      const collegeToUpdate = colleges.find((college) => college.id === id);

      if (!collegeToUpdate) {
        console.error("College not found");
        return;
      }

      const response = await fetch("/api/db/college", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, courses: updatedCourses }),
      });

      if (response.ok) {
        setColleges((prevColleges) =>
          prevColleges.map((college) =>
            college.id === id ? { ...college, courses: updatedCourses } : college
          )
        );
      } else {
        console.error("Failed to update courses");
      }
    } catch (error) {
      console.error("Error updating courses:", error);
    }
  };

  const filteredColleges = getSortedColleges().filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.courses.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      {showModal && <CollegeFormModal onClose={() => setShowModal(false)} onSave={addCollege} />}
      <h1 className="text-3xl font-bold mb-4 mt-40 text-gray-800">🎓 TEMPLATES</h1>
      <input
        type="text"
        placeholder="Search by name, admission ID, or college..."
        className="mb-6 p-3 w-full max-w-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        ➕ Add
      </button>
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <CollegeCard
              key={college.id}
              id={college.id}
              name={college.name}
              admissionId={college.admissionId}
              about={`College Name: ${college.collegeName}`}
              courses={college.courses}
              branch={college.branch}
              year={college.year}
              likes={college.likes} 
              onEdit={handleEditCourses}
              onDelete={handleDeleteCollege}
            />
          ))
        ) : (
          <p className="text-gray-500">No colleges found.</p>
        )}
      </div>
    </div>
  );
};

export default TemplatePage;
