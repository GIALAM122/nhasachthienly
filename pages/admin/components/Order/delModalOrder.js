import React from 'react';

const DeleteModal = ({ onClose, onDelete, order }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
                <h3 className="text-lg font-bold mb-4">Xác nhận xóa đơn hàng</h3>
                <p>Bạn có chắc chắn muốn xóa đơn hàng của khách {order?.customer_info?.name}?</p>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
