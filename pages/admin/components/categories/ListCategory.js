// components/CategoryTable.js
import React from 'react';
import Image from 'next/image';
import { IoIosAddCircle } from "react-icons/io";

const CategoryTable = ({ categories, filteredCategories, handleOpenEditModal, confirmDeleteCategory }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-black">
                        <th className="py-3 px-6 border-b font-bold text-center">STT</th>
                        <th className="py-3 px-6 border-b font-bold text-center">Tên danh mục</th>
                        <th className="py-3 px-6 border-b font-bold text-center">Hình ảnh</th>
                        <th className="py-3 px-6 border-b font-bold text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((category, index) => (
                        <tr key={category.id} className="hover:bg-gray-100 transition-colors">
                            <td className="py-4 px-6 border-b text-center">{index + 1}</td>
                            <td className="py-4 px-6 border-b text-center font-medium">{category.name}</td>
                            <td className="py-4 px-6 border-b text-center">
                                <div className="flex justify-center">
                                    <Image
                                        src={category.img}
                                        alt={category.name}
                                        width={100}
                                        height={100}
                                        className="object-cover w-16 h-16 rounded-full"
                                    />
                                </div>
                            </td>
                            <td className="py-4 px-6 border-b text-center">
                                <button onClick={() => handleOpenEditModal(category)} className="bg-yellow-500 text-white w-[90px] px-4 py-2 rounded mx-1 transition-colors hover:bg-yellow-400">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => confirmDeleteCategory(category.id)} className="bg-red-500 text-white w-[90px] px-4 py-2 rounded mx-1 transition-colors hover:bg-red-400">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
