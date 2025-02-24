import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUniversity, FaGraduationCap, FaPlus } from 'react-icons/fa'; 

// Define the college data for each template
const collegesData = {
  iits: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur'],
  nits: ['NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'NIT Rourkela'],
  iiits: ['IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Delhi', 'IIIT Allahabad', 'IIIT Jabalpur'],
  other: [], // For user-added colleges
};

// TemplateCard component
interface TemplateCardProps {
  name: string;
  route: string;
  description?: string;
  isAddCard?: boolean; // For the "Add College" card
  onAddCollege?: (collegeName: string) => void; // Function to add a college
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, route, description, isAddCard, onAddCollege }) => {
  const [newCollegeName, setNewCollegeName] = useState('');

  const handleAddCollege = () => {
    if (newCollegeName.trim() && onAddCollege) {
      onAddCollege(newCollegeName);
      setNewCollegeName('');
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transform hover:-translate-y-2 hover:scale-105 transition-transform duration-300 flex flex-col justify-between h-64"> {/* Adjusted height */}
      {isAddCard ? (
        <div className="flex flex-col items-center justify-center h-full">
          <FaPlus className="w-12 h-12 text-blue-500 mb-4" />
          <input
            type="text"
            placeholder="Enter college name"
            value={newCollegeName}
            onChange={(e) => setNewCollegeName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            onClick={handleAddCollege}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Add College
          </button>
        </div>
      ) : (
        <Link href={route} legacyBehavior>
          <a className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center mb-4">
                <FaUniversity className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
              </div>
              {description && (
                <p className="text-gray-600 mb-6">{description}</p>
              )}
            </div>
            <div className="text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-center">
              <span>View {name}</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </a>
        </Link>
      )}
    </div>
  );
};

// CollegeCard component
interface CollegeCardProps {
  name: string;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ name }) => {
  return (
    <div className="p-6 border rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transform hover:-translate-y-2 hover:scale-105 transition-transform duration-300 flex flex-col justify-between h-64"> {/* Adjusted height */}
      <div>
        <div className="flex items-center mb-4">
          <FaGraduationCap className="w-8 h-8 text-blue-500 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        </div>
        <p className="text-gray-600 mb-6">Explore courses, notes, and PYQs for {name}.</p>
      </div>
      <div className="text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-center">
        <span>Learn More</span>
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </div>
  );
};

// CollegeList component
interface CollegeListProps {
  colleges: string[];
  onAddCollege?: (collegeName: string) => void; // Function to add a college
}

const CollegeList: React.FC<CollegeListProps> = ({ colleges, onAddCollege }) => {
  const router = useRouter();

  return (
    <div className="p-4 pt-32 md:pt-40"> {/* Increased top padding to move cards down */}
      <button
        onClick={() => router.push('/template')}
        className="mb-6 text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-300"
      >
        &larr; Back to Templates
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Colleges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {colleges.map((college, index) => (
          <CollegeCard key={index} name={college} />
        ))}
        <TemplateCard
          name="Add College"
          route="#"
          isAddCard
          onAddCollege={onAddCollege}
        />
      </div>
    </div>
  );
};

// SkeletonCard component (for loading state)
const SkeletonCard = () => {
  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-gray-100 animate-pulse flex flex-col justify-between h-64"> {/* Adjusted height */}
      <div>
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

// Main TemplatePage component
const TemplatePage = () => {
  const router = useRouter();
  const { template } = router.query;
  const [isLoading, setIsLoading] = useState(true); // Simulate loading state
  const [colleges, setColleges] = useState(collegesData); // State for colleges

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  // Function to add a college to a specific category
  const handleAddCollege = (category: keyof typeof colleges, collegeName: string) => {
    setColleges((prev) => ({
      ...prev,
      [category]: [...prev[category], collegeName],
    }));
  };

  // If a template is selected, show the list of colleges
  if (template) {
    const selectedColleges = colleges[template as keyof typeof colleges] || [];
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
        <CollegeList
          colleges={selectedColleges}
          onAddCollege={(collegeName) => handleAddCollege(template as keyof typeof colleges, collegeName)}
        />
      </div>
    );
  }

  // Otherwise, show the list of templates
  const templates = [
    {
      id: 1,
      name: 'IITs',
      route: '/template?template=iits',
      description: 'Indian Institutes of Technology - Premier engineering institutes in India.',
    },
    {
      id: 2,
      name: 'NITs',
      route: '/template?template=nits',
      description: 'National Institutes of Technology - Top engineering colleges in India.',
    },
    {
      id: 3,
      name: 'IIITs',
      route: '/template?template=iiits',
      description: 'Indian Institutes of Information Technology - Focused on IT and computer science.',
    },
    {
      id: 4,
      name: 'Other',
      route: '/template?template=other',
      description: 'Add your college here.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
      <div className="p-4 pt-32 md:pt-40"> {/* Increased top padding to move cards down */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">College Templates</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                name={template.name}
                route={template.route}
                description={template.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePage;
