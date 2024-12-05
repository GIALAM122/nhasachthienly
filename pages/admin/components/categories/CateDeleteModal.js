import React from 'react';

const DeleteCategoryModal = ({ isOpen, handleDeleteCategory, setIsDeleteConfirmOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => setIsDeleteConfirmOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-2">Xác nhận xóa danh mục</h2>
                <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleDeleteCategory}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
