import React from "react";

const UserList = ({ users, searchTerm, onDelete, onToggleBlock }) => {
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
            <th className="py-3 px-6 font-semibold text-lg w-1/5">Tài khoản</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/5">Tên</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/5">Số điện thoại</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/5">Trạng thái</th>
            <th className="py-3 px-6 font-semibold text-lg w-1/5">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="transition duration-300 ease-in-out hover:bg-indigo-100">
              <td className="font-bold py-4 px-6 border-b border-gray-200 text-left">{user.account}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">{user.name}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">{user.phone}</td>
              <td className="py-4 px-6 border-b border-gray-200 text-center">
                {user.isBlocked ? "Bị khóa" : "Hoạt động"}
              </td>
              <td className="py-4 px-6 border-b border-gray-200 text-center space-x-2">
              <button
                  onClick={() => onToggleBlock(user.id, !user.isBlocked)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    user.isBlocked
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                  }`}
                >
                  {user.isBlocked ? "Mở khóa" : "Khóa"}
                </button>
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
