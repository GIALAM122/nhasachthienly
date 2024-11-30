/* eslint-disable @next/next/no-img-element */
// components/OrderModal.js
import React from 'react';
const OrderModal = ({ selectedOrder, onClose }) => {
    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleModalClick}
        >
            <div className="bg-white rounded-lg p-6 max-w-5xl w-full overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl font-bold text-gray-500"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="flex flex-col space-y-4 border p-4 rounded-lg shadow-sm bg-gray-50">
                        <p className="font-bold text-lg">Thông tin khách hàng:</p>
                        <p className="text-md font-semibold">Tên: {selectedOrder.customer_info?.name || "Chưa rõ"}</p>
                        <p className="text-md font-semibold">Số điện thoại: {selectedOrder.customer_info?.phone || "Chưa rõ"}</p>
                        <p className="text-md font-semibold capitalize">Địa chỉ: {`${selectedOrder.address?.home}, ${selectedOrder.address?.wards}, ${selectedOrder.address?.district}, ${selectedOrder.address?.city}`}</p>
                        <p className="text-md font-semibold">Ngày đặt hàng: {selectedOrder.date || "Chưa rõ"}</p>
                        <p className="text-md font-semibold">
                            Phương thức thanh toán: {selectedOrder.payment === 'delivery' ? 'Vận chuyển' : selectedOrder.payment}
                        </p>
                    </div>

                    {/* Product List */}
                    <div className="flex flex-col space-y-4 border p-4 rounded-lg shadow-sm bg-gray-50">
                        <h3 className="text-xl font-semibold">Danh sách sản phẩm:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedOrder.list_item.map((product, index) => (
                                <div key={index} className="flex flex-col items-center bg-white border p-4 rounded-lg shadow-md">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-full h-48 object-cover mb-4 rounded-md"
                                    />
                                    <p className="font-semibold uppercase">{product.name}</p>
                                    <p className="font-bold text-lg text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-xl font-bold text-green-600 text-right">
                    Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
