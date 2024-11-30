// OrdersPage.js
import React, { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Admin from './layouts/Admin';
import OrderModal from './components/Order/ordermodal';
import OrderList from './components/Order/orderlist';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, 'previous-order'));
            const ordersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersList);
        };

        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOrders = orders.flatMap(order =>
        order.items
            .filter(item =>
                (item.customer_info?.name && item.customer_info.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.customer_info?.phone && item.customer_info.phone.includes(searchTerm)) ||
                (item.address?.city && item.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map(item => ({
                ...item,
                orderId: order.id,
            }))
    );

    const handleCardClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const orderRef = doc(db, 'previous-order', orderId);
        await updateDoc(orderRef, {
            status: newStatus,  // Thêm trường trạng thái
        });
        // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-2xl font-bold mb-4 uppercase">Danh sách đơn hàng</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc thành phố"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 mb-4 w-full"
            />

            {/* Tách phần giao diện vào OrderList */}
            <OrderList
                orders={orders}
                filteredOrders={filteredOrders}
                handleCardClick={handleCardClick}
                handleStatusChange={handleStatusChange}  // Truyền hàm này vào OrderList
            />

            {/* Modal */}
            {selectedOrder && <OrderModal selectedOrder={selectedOrder} onClose={handleCloseModal} />}
        </div>
    );
};

export default OrdersPage;
OrdersPage.layout = Admin;
