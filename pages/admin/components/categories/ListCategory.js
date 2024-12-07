import React from 'react';
import Image from 'next/image';
import { IoPencil, IoTrash } from "react-icons/io5";

const CategoryCard = ({ categories, handleOpenEditModal, confirmDeleteCategory }) => {
    return (
        <div className="space-y-4">
            {categories.map((category, index) => (
                <div
                    key={category.id}
                    className="flex flex-col md:flex-row items-center bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-200"
                >
                    {/* Phần Hình Ảnh */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                        <Image
                            src={category.img}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="object-cover w-28 h-28 rounded-lg shadow-md"
                        />
                    </div>

                    {/* Phần Thông Tin */}
                    <div className="flex-grow text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-700">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">STT: {index + 1}</p>
                    </div>

                    {/* Phần Hành Động */}
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                            onClick={() => handleOpenEditModal(category)}
                            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-400 transition"
                        >
                            <IoPencil className="mr-2" />
                            Sửa
                        </button>
                        <button
                            onClick={() => confirmDeleteCategory(category.id)}
                            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-400 transition"
                        >
                            <IoTrash className="mr-2" />
                            Xóa
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryCard;
