import React from 'react';

const ProfileModal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30">
      <div className="relative bg-white border-[4px] border-blue-500 rounded-xl shadow-2xl w-[50%] max-w-xl px-9 py-8 overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};



export default ProfileModal;

