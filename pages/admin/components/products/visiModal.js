import React from 'react';

const ModalVisi = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ModalVisi;
