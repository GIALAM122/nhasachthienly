import React, { useEffect, useState, useMemo  } from 'react';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Admin from './layouts/Admin';
import OrderModal from './components/Order/ordermodal';
import OrderList from './components/Order/orderlist';
import DeleteModal from './components/Order/delModalOrder';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // State điều khiển modal xóa
    const [orderToDelete, setOrderToDelete] = useState(null);  // Lưu đơn hàng cần xóa

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
    const handleStatusChange = async (orderId, itemIndex, status) => {
        const orderRef = doc(db, 'previous-order', orderId);
        const order = orders.find(order => order.id === orderId);
    
        if (order) {
            const updatedItems = order.items.map((item, index) => {
                if (index === itemIndex) {
                    return { ...item, status };
                }
                return item;
            });
    
            // Cập nhật Firestore
            await updateDoc(orderRef, { items: updatedItems });
    
            // Cập nhật lại state
            setOrders(orders.map(o => (o.id === orderId ? { ...o, items: updatedItems } : o)));
        }
    };
    
    

    // Hàm mở modal xóa
    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    // Hàm xóa đơn hàng
    const handleDeleteOrder = async (orderId, itemIndex) => {
        const orderRef = doc(db, 'previous-order', orderId);

        // Lấy đơn hàng hiện tại
        const order = orders.find(order => order.id === orderId);
    
        if (order && Array.isArray(order.items)) { // Kiểm tra nếu order.items là mảng
            // Loại bỏ item tại itemIndex
            const updatedItems = order.items.filter((_, index) => index !== itemIndex);
    
            // Cập nhật Firestore   
            await updateDoc(orderRef, { items: updatedItems });
    
            // Cập nhật lại state
            setOrders(orders.map(o => (o.id === orderId ? { ...o, items: updatedItems } : o)));
        } else {
            console.error("Không tìm thấy đơn hàng hoặc items không phải là mảng");
        }
    };
    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-6 transition-all duration-300 ease-in-out hover:text-blue-600">
                Danh sách đơn hàng
            </h1>

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
                handleDeleteClick={handleDeleteClick}  // Truyền hàm xóa vào OrderList
                handleStatusChange={handleStatusChange}
            />

            {/* Modal hiển thị chi tiết đơn hàng */}
            {selectedOrder && <OrderModal selectedOrder={selectedOrder} onClose={handleCloseModal} />}

            {/* Modal xác nhận xóa */}
            {showDeleteModal && (
                <DeleteModal
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDeleteOrder}
                    order={orderToDelete}
                />
            )}
        </div>
    );
};

export default OrdersPage;
OrdersPage.layout = Admin;
