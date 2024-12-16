import { useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp, FaCalendarAlt } from 'react-icons/fa';

const OrderList = ({ orders, filteredOrders, handleCardClick, handleDeleteClick, handleStatusChange }) => {
    // State for filter options
    const [filters, setFilters] = useState({
        newest: false,
        priceLowToHigh: false,
        priceHighToLow: false
    });

    // Handle filter changes (only one active at a time)
    const handleFilterChange = (filterType) => {
        setFilters({
            newest: filterType === 'newest',
            priceLowToHigh: filterType === 'priceLowToHigh',
            priceHighToLow: filterType === 'priceHighToLow'
        });
    };

    // Apply filters and sorting logic
    const applyFilters = (orders) => {
        let sortedOrders = [...orders];

        if (filters.newest) {
            sortedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (filters.priceLowToHigh) {
            sortedOrders.sort((a, b) => a.total - b.total);
        }

        if (filters.priceHighToLow) {
            sortedOrders.sort((a, b) => b.total - a.total);
        }

        return sortedOrders;
    };

    const sortedOrders = applyFilters(filteredOrders);

    return (
        <div>
            {/* Filters Section with React Icons */}
            <div className="flex space-x-6 mb-4 items-center">
                <button
                    className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.newest ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handleFilterChange('newest')}
                >
                    <FaCalendarAlt />
                    <span>Mới nhất</span>
                </button>
                <button
                    className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.priceLowToHigh ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handleFilterChange('priceLowToHigh')}
                >
                    <FaSortAmountUp />
                    <span>Giá thấp tới cao</span>
                </button>
                <button
                    className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.priceHighToLow ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handleFilterChange('priceHighToLow')}
                >
                    <FaSortAmountDown />
                    <span>Giá cao tới thấp</span>
                </button>
            </div>

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
                        {sortedOrders.map((item, index) => (
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
                                    {/* Dropdown for status */}
                                    <select
                                        value={item.status || "Đang xử lý"}
                                        onChange={(e) => handleStatusChange(item.orderId, index, e.target.value)}
                                        className="border p-1 text-sm rounded"
                                    >
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đã giao">Đã giao</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleCardClick(item)} 
                                            className="font-semibold text-blue-500 hover:underline"
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item.orderId, index)} 
                                            className="font-semibold text-red-500 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
