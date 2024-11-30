import React from 'react';

const OrderList = ({ orders, filteredOrders, handleCardClick, handleStatusChange }) => {
    const orderStatusOptions = ['Đang xử lý', 'Đã giao', 'Đã hủy'];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">SĐT</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Ngày</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Phương thức</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((item, index) => (
                        <tr
                            key={index}

                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="py-4 px-6 text-sm text-gray-700">{item.customer_info?.name || "Chưa rõ"}</td>
                            <td className="py-4 px-6 text-sm text-gray-500">{item.customer_info?.phone || "Chưa rõ"}</td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                                {`${item.address?.home || "Chưa rõ"}, ${item.address?.wards || "Chưa rõ"}, ${item.address?.district || "Chưa rõ"}, ${item.address?.city || "Chưa rõ"}`}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500">{item.date || "Chưa rõ"}</td>
                            <td className="py-4 px-6 text-sm text-gray-500">{item.payment === 'delivery' ? 'Vận chuyển' : item.payment || "Chưa rõ"}</td>
                            <td className="py-4 px-6 text-sm text-green-600 font-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                                <select
                                    value={item.status || 'Đang xử lý'}
                                    onChange={(e) => handleStatusChange(item.orderId, e.target.value)}
                                    className="border px-2 py-1 rounded-md"
                                >
                                    {orderStatusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                            <td key={index}
                                onClick={() => handleCardClick(item)} className="py-4 px-6 text-sm text-blue-500">
                                <button className="font-semibold hover:underline">Chi tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
