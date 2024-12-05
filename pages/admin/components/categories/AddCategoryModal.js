import React, { useState } from 'react';
import Image from 'next/image';

const AddCategoryModal = ({ isOpen, resetForm, handleAddCategory, name, setName, imgFile, setImgFile, imgURL, setImgURL }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={resetForm}>
            <div
                className="modal max-w-none !w-[800px] flex flex-col md:flex-row space-x-4 p-6 bg-white rounded-lg mx-auto"
                style={{ maxWidth: '90vw',  }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="md:w-1/2 flex flex-col justify-between">
                    <h2 className="text-xl font-bold mb-2">Thêm danh mục mới</h2>
                    <form onSubmit={handleAddCategory} className="w-full">
                        <input
                            type="text"
                            placeholder="Tên danh mục"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setImgFile(e.target.files[0]);
                                const url = URL.createObjectURL(e.target.files[0]);
                                setImgURL(url);
                            }}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <div className="flex justify-between">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">
                                Thêm
                            </button>
                            <button type="button" onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto">
                                Đóng
                            </button>
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    {imgURL && (
                        <div className="w-40 h-40 relative">
                            <Image
                                src={imgURL}
                                alt="Preview"
                                width={160}
                                height={160}
                                className="object-cover border"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;
