import React from 'react';
import Image from 'next/image';

const EditCategoryModal = ({ isOpen, resetForm, handleUpdateCategory, name, setName, imgFile, setImgFile, imgURL, setImgURL }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={resetForm}>
            <div className="modal max-w-none !w-[800px] p-6 bg-white rounded-lg mx-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
                <form onSubmit={handleUpdateCategory} className="grid grid-cols-2 gap-4">
                    {/* Cột 1 */}
                    <div>
                        <label className="block text-gray-700 mb-2">Tên danh mục</label>
                        <input
                            type="text"
                            placeholder="Tên danh mục"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 mb-4 w-full"
                            required
                        />
                        <label className="block text-gray-700 mb-2">Hình ảnh mới</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImgFile(file);

                                // Tạo URL tạm thời để hiển thị ảnh xem trước
                                const newImgURL = URL.createObjectURL(file);
                                setImgURL(newImgURL);
                            }}
                            className="border p-2 w-full"
                        />
                    </div>

                    {/* Cột 2 - Hiển thị ảnh */}
                    <div className="flex flex-col items-center">
                        <label className="block text-gray-700 mb-2">Ảnh hiện tại</label>
                        {imgURL ? (
                            <Image
                                src={imgURL}
                                alt="Hình ảnh danh mục"
                                width={128}
                                height={128}
                                className="object-cover mb-4"
                            />
                        ) : (
                            <p className="text-gray-500">Chưa có hình ảnh</p>
                        )}
                    </div>

                    {/* Nút hành động */}
                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Cập nhật
                        </button>
                        <button type="button" onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded">
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
