// components/UserList.js
import React from "react";

const UserList = ({ users, searchTerm, onDelete }) => {
  const filteredUsers = users.filter(
    (user) =>
      (user.account &&
        user.account.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full table-fixed text-sm text-gray-700">
        <thead className="bg-cyan-500 text-white text-center">
          <tr>
            <th className="py-3 px-6 font-semibold text-lg w-1/4">Tài khoản</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/4">Tên</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/4">Số điện thoại</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="transition duration-300 ease-in-out hover:bg-indigo-100">
              <td className="font-bold py-4 px-6 border-b border-gray-200 text-left">{user.account}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">{user.name}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">{user.phone}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">
                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
