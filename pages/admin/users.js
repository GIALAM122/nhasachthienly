import React, { useEffect, useState } from "react";
import { db } from "@/feature/firebase/firebase";
import { collection, updateDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import Admin from "./layouts/Admin";
import withAdminCheck from "@/feature/admincheck";
import UserList from "./components/users/UserList";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      setUsers(users.filter((user) => user.id !== userToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleToggleBlock = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "users", id), { isBlocked: newStatus });
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, isBlocked: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="relative container mx-auto p-4 mb-6 top-[100px]">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-6 transition-all duration-300 ease-in-out hover:text-blue-600">
        DANH SÁCH NGƯỜI DÙNG
      </h1>

      <input
        type="text"
        placeholder="Tìm kiếm theo tài khoản, tên hoặc số điện thoại"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 mb-4 w-full"
      />

      <UserList
        users={users}
        searchTerm={searchTerm}
        onDelete={openModal} // Thay đổi để mở modal thay vì xóa trực tiếp
        onToggleBlock={handleToggleBlock}
      />

      {/* Modal Xác nhận xóa */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa người dùng</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
UsersPage.layout = Admin;
