// src/components/AddProductModal.js

import React from 'react';
import Image from 'next/image';

const AddProductModal = ({
  isAddModalOpen,
  handleAddProduct,
  name,
  setName,
  price,
  setPrice,
  author,
  setAuthor,
  publisher,
  setPublisher,
  releaseDate,
  setReleaseDate,
  categories,
  selectedCategories,
  setSelectedCategories,
  imageFile,
  setImageFile,
  previewImage,
  setPreviewImage,
  description,
  setDescription,
  resetForm
}) => {
  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h2>
        <form onSubmit={handleAddProduct}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="number"
                  placeholder="Giá"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tác giả</label>
                <input
                  type="text"
                  placeholder="Tác giả"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nhà xuất bản</label>
                <input
                  type="text"
                  placeholder="Nhà xuất bản"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Năm phát hành</label>
                <input
                  type="text"
                  placeholder="Năm phát hành"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(category.name)
                          ? prev.filter((cat) => cat !== category.name)
                          : [...prev, category.name]
                      );
                    }}
                    className={`px-4 py-2 rounded ${selectedCategories.includes(category.name)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
                className="border p-2 w-full mb-2"
                required
              />
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={500} // Chỉnh sửa chiều rộng theo nhu cầu của bạn
                  height={300} // Bạn có thể tính toán chiều cao tự động dựa trên tỷ lệ ảnh
                  className="w-full h-auto rounded-lg mt-2"
                />
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => resetForm()}
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition ml-2"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
