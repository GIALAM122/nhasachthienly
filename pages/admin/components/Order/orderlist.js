import { useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp, FaCalendarAlt, FaTruck, FaCreditCard, FaSyncAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrderList = ({ orders, filteredOrders, handleCardClick, handleDeleteClick, handleStatusChange }) => {
    // State for filter options
    const [filters, setFilters] = useState({
        newest: false,
        priceLowToHigh: false,
        priceHighToLow: false,
        deliveryMethod: null, // New filter for delivery method
        status: null // New filter for order status
    });

    // Handle filter changes (only one active at a time)
    const handleFilterChange = (filterType) => {
        setFilters({
            ...filters,
            newest: filterType === 'newest',
            priceLowToHigh: filterType === 'priceLowToHigh',
            priceHighToLow: filterType === 'priceHighToLow',
            deliveryMethod: null, // Reset delivery method filter when sorting is applied
            status: null // Reset status filter when sorting is applied
        });
    };

    const handleDeliveryFilterChange = (method) => {
        setFilters({
            ...filters,
            deliveryMethod: filters.deliveryMethod === method ? null : method // Toggle delivery filter
        });
    };

    const handleStatusFilterChange = (status) => {
        setFilters({
            ...filters,
            status: filters.status === status ? null : status // Toggle status filter
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

        if (filters.deliveryMethod) {
            sortedOrders = sortedOrders.filter(order => order.payment === filters.deliveryMethod);
        }

        if (filters.status) {
            sortedOrders = sortedOrders.filter(order => order.status === filters.status);
        }

        return sortedOrders;
    };

    const sortedOrders = applyFilters(filteredOrders);

    return (
        <div>
            {/* Filters Section */}
            <div className="flex flex-col space-y-4 mb-4">
                {/* Row 1: Sorting Filters */}
                <div className="flex space-x-4 items-center">
                    <span className="text-sm font-semibold text-gray-600">Sắp xếp theo:</span>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.newest ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleFilterChange('newest')}
                    >
                        <FaCalendarAlt />
                        <span>Mới nhất</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.priceLowToHigh ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleFilterChange('priceLowToHigh')}
                    >
                        <FaSortAmountUp />
                        <span>Giá thấp tới cao</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.priceHighToLow ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleFilterChange('priceHighToLow')}
                    >
                        <FaSortAmountDown />
                        <span>Giá cao tới thấp</span>
                    </button>
                </div>

                {/* Row 2: Delivery Method Filters */}
                <div className="flex space-x-4 items-center">
                    <span className="text-sm font-semibold text-gray-600">Phương thức:</span>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.deliveryMethod === 'delivery' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleDeliveryFilterChange('delivery')}
                    >
                        <FaTruck />
                        <span>Vận chuyển</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.deliveryMethod === 'VNPay' ? 'bg-purple-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleDeliveryFilterChange('VNPay')}
                    >
                        <FaCreditCard />
                        <span>VNPay</span>
                    </button>
                </div>

                {/* Row 3: Order Status Filters */}
                <div className="flex space-x-4 items-center">
                    <span className="text-sm font-semibold text-gray-600 w-[85px]">Trạng thái: </span>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.status === 'Đang xử lý' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleStatusFilterChange('Đang xử lý')}
                    >
                        <FaSyncAlt />
                        <span>Đang xử lý</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.status === 'Đã giao' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleStatusFilterChange('Đã giao')}
                    >
                        <FaCheckCircle />
                        <span>Đã giao</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 p-2 text-sm font-medium rounded-lg ${filters.status === 'Đã hủy' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleStatusFilterChange('Đã hủy')}
                    >
                        <FaTimesCircle />
                        <span>Đã hủy</span>
                    </button>
                </div>
            </div>

            {/* Table Section */}
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
                                    <select
                                        value={item.status || "Đang xử lý"}
                                        onChange={(e) => handleStatusChange(item.orderId, item.total, e.target.value)} // Dùng item.id
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
                                            onClick={() => handleDeleteClick(item)}
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
