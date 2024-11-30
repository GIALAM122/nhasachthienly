// BookTable.js
import React from 'react';
import Image from 'next/image';


const BookTable = ({ currentProducts, handleOpenEditModal, toggleProductVisibility, openDeleteModal }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg table-auto">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="py-4 px-6 border-b text-left whitespace-nowrap w-1/3">Tên sản phẩm</th>
          <th className="py-4 px-6 border-b text-left whitespace-nowrap w-1/4">Giá</th>
          <th className="py-4 px-6 border-b text-center whitespace-nowrap w-1/4">Hình ảnh</th>
          <th className="py-4 px-6 border-b text-center whitespace-nowrap w-1/4">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product, index) => (
          <tr
            key={product.id}
            className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <td className="py-4 px-6 border-b text-left font-semibold">{product.name}</td>
            <td className="py-4 px-6 border-b text-left text-red-500 font-bold">
              {product.price.toLocaleString("vi-VN")} vn₫
            </td>
            <td className="py-4 px-14 border-b text-center">
              <Image
                src={product.img}
                alt={product.name}
                width={100} 
                height={100}
                className="object-cover rounded-lg shadow-md w-16 "
              />            </td>
            <td className="py-4 px-6 border-b text-center">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition w-24"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  onClick={() => toggleProductVisibility(product.id, product.visible)}
                  className={`px-4 py-2 rounded-lg shadow-md w-24 ${product.visible ? "bg-green-500" : "bg-gray-400"} text-white hover:bg-opacity-90`}
                >
                  {product.visible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </button>
                <button
                  onClick={() => openDeleteModal(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition w-24"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;
