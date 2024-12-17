import React, { useEffect, useState, useMemo } from 'react';
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
    const handleStatusChange = async (orderId, itemTotal, status) => {
        const orderRef = doc(db, 'previous-order', orderId);
        const order = orders.find(order => order.id === orderId);

        if (order) {
            const updatedItems = order.items.map(item =>
                item.total === itemTotal ? { ...item, status } : item
            );

            // Cập nhật Firestore
            await updateDoc(orderRef, { items: updatedItems });

            // Cập nhật lại state
            setOrders(orders.map(o =>
                o.id === orderId ? { ...o, items: updatedItems } : o
            ));
        }
    };




    // Trong component OrdersPage
    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };
    // Hàm xóa đơn hàng
    const handleDeleteOrder = async () => {
        // Kiểm tra nếu orderToDelete và orderToDelete.items không phải undefined
        if (!orderToDelete || !Array.isArray(orderToDelete.items)) {
            console.error("Dữ liệu đơn hàng không hợp lệ");
            return;
        }

        // Lấy tham chiếu tài liệu đơn hàng trong Firestore
        const orderRef = doc(db, 'previous-order', orderToDelete.id);

        // Cập nhật Firestore: Loại bỏ item tại itemIndex
        const updatedItems = orderToDelete.items.filter((_, index) => index !== itemIndex);

        // Cập nhật Firestore
        try {
            await updateDoc(orderRef, { items: updatedItems });

            // Cập nhật lại state orders sau khi xóa
            // Chỉ cập nhật lại đơn hàng có id tương ứng
            setOrders(orders.map(order =>
                order.id === orderToDelete.id
                    ? { ...order, items: updatedItems } // Cập nhật đơn hàng đã xóa item
                    : order // Giữ nguyên các đơn hàng còn lại
            ));
        } catch (error) {
            console.error("Lỗi khi cập nhật Firestore: ", error);
        }
    };



    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-4xl uppercase oswald font-extrabold text-cyan-900 tracking-wide mb-6 transition-all duration-300 ease-in-out hover:text-blue-600">
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
