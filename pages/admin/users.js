// pages/UsersPage.js
import React, { useEffect, useState } from "react";
import { db } from "@/feature/firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Admin from "./layouts/Admin";
import withAdminCheck from "@/feature/admincheck";
import UserList from "./components/users/UserList";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

      <UserList users={users} searchTerm={searchTerm} onDelete={handleDeleteUser} />
    </div>
  );
};

export default UsersPage;
UsersPage.layout = Admin;
