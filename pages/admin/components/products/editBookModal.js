// EditProductModal.js
import React from 'react';
import Image from 'next/image';
const EditProductModal = ({
  isEditModalOpen,
  currentProduct,
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
  description,
  setDescription,
  categories,
  selectedCategories,
  setSelectedCategories,
  imageURL,
  setImageFile,
  setImageURL,
  handleUpdateProduct,
  resetForm
}) => {
  if (!isEditModalOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
        <h2 className="text-xl font-bold mb-4">Sửa sản phẩm</h2>
        <form onSubmit={handleUpdateProduct}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-bold">Tên sản phẩm</label>
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
                  <label className="block mb-1 font-bold">Giá</label>
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
                  <label className="block mb-1 font-bold">Tác giả</label>
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
                  <label className="block mb-1 font-bold">Nhà xuất bản</label>
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
                  <label className="block mb-1 font-bold">Năm phát hành</label>
                  <input
                    type="text"
                    placeholder="Năm phát hành"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategories((prev) =>
                        prev.includes(category.name)
                          ? prev.filter((cat) => cat !== category.name)
                          : [...prev, category.name]
                      );
                    }}
                    className={`px-4 py-2 rounded ${selectedCategories.includes(category.name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="block mb-1">
                <label className="block mb-1 font-bold">Mô tả</label>
                <textarea
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 w-full mb-4 h-[200px]"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">Tải lên hình ảnh mới</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImageURL(url);
                    }
                  }}
                  className="border p-2 w-full"
                />
              </div>
            </div>

            {/* Cột hiển thị hình ảnh sản phẩm */}
            <div className="flex justify-center items-center">
              {imageURL && (
                <Image
                  src={imageURL}
                  alt="Hình ảnh sản phẩm"
                  width={1000} // Để Next.js tính toán chiều rộng tự động
                  height={300} // h-300 tương đương với 300px cho chiều cao
                  className="max-w-full max-h-[300px] object-contain rounded"
                 
                />)}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              Cập nhật
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

export default EditProductModal;
