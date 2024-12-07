import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa'; // Thêm icon FaFilter
import { BsFilterRight } from "react-icons/bs";


const BookTable = ({ currentProducts, allProducts, handleOpenEditModal, toggleProductVisibility,
  openDeleteModal, setCurrentPage, }) => {
  const [sortOrder, setSortOrder] = useState(''); // Quản lý thứ tự sắp xếp
  const [selectedCategories, setSelectedCategories] = useState([]); // Quản lý danh mục đã chọn
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Quản lý trạng thái hiển thị lọc

  // Các danh mục có thể lọc
  const allCategories = [...new Set(allProducts.flatMap(product => product.categories))];


  // Hàm xử lý sắp xếp sản phẩm theo giá
  const handleSortChange = (order) => {
    setSortOrder(order);

  };
  const handleShowLatestChange = () => {
    setShowLatest((prev) => !prev);
    setCurrentPage(1); // Đặt lại trang về 1
  };

  // Hàm xử lý thay đổi lựa chọn danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category) // Nếu đã chọn thì bỏ chọn
        : [...prev, category] // Nếu chưa chọn thì thêm vào danh sách
    );
    setCurrentPage(1); // Đặt lại trang về 1
  };

  // Hàm sắp xếp sản phẩm
  const sortedProducts = [...currentProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else if (sortOrder === 'desc') {
      return b.price - a.price;
    }
    return 0; // Không thay đổi nếu không chọn lọc
  });

  // Lọc sản phẩm theo các danh mục đã chọn
  const filteredProducts = sortedProducts.filter((product) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.some((category) => product.categories.includes(category));
  });

  return (
    <div className="font-bahnschrift flex flex-col gap-4 bg-white p-4 shadow-md rounded-lg">

      {/* Nút bật/tắt phần lọc */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)} // Thay đổi trạng thái hiển thị lọc
        className="mb-4 flex items-center space-x-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600"
      >
        <BsFilterRight />
        <span>{isFilterVisible ? 'Ẩn lọc' : 'Lọc sản phẩm'}</span>
      </button>

      {/* Lọc sản phẩm theo giá */}
      <div className={`flex justify-between items-center mb-4 ${isFilterVisible ? '' : 'hidden'}`}>
        <div className={`flex justify-between items-center mb-4 ${isFilterVisible ? '' : 'hidden'}`}>
          <div className="flex space-x-4">
            <FaFilter className="text-blue-500" />
            <span className="font-montserrat text-lx">Mặc định</span>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sortOrder === 'asc'}
                onChange={() => handleSortChange('asc')}
                className="mr-2 w-4 h-4"
              />
              <span className="font-montserrat text-lx">Giá thấp đến cao</span>
              <FaArrowUp className="text-green-500" />
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sortOrder === 'desc'}
                onChange={() => handleSortChange('desc')}
                className="mr-2 w-4 h-4"
              />
              <span className="font-montserrat text-lx">Giá cao đến thấp</span>
              <FaArrowDown className="text-red-500" />
            </label>
            {/* Thêm checkbox mặc định */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sortOrder === '' && selectedCategories.length === 0} // Kiểm tra xem đã reset chưa
                onChange={() => {
                  setSortOrder('');
                  setSelectedCategories([]);
                  setCurrentPage(1); // Đặt lại trang về 1
                }}
                className="mr-2 w-4 h-4"
              />
            </label>
          </div>
        </div>

      </div>


      {/* Lọc sản phẩm theo danh mục */}
      <div className={`mb-4 ${isFilterVisible ? '' : 'hidden'}`}>
        <div className="text-lg font-semibold mb-2">Lọc theo danh mục</div>
        <div className="flex flex-wrap gap-4">
          {allCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2 w-4 h-4"
              />
              <span className="font-montserrat text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-4 gap-4 bg-gray-500 text-white py-3 px-4 rounded-lg">
        <div className="font-bold text-left">Tên sản phẩm</div>
        <div className="font-bold text-left">Giá</div>
        <div className="font-bold text-center">Hình ảnh</div>
        <div className="font-bold text-center">Hành động</div>
      </div>

      {/* Các hàng sản phẩm */}
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-4 gap-4 items-center bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 shadow-md"
        >
          {/* Tên sản phẩm */}
          <div className="font-montserrat uppercase text-left font-semibold">{product.name}</div>

          {/* Giá sản phẩm */}
          <div className="text-left text-green-700 font-bold">
            {product.price.toLocaleString('vi-VN')} vn₫
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="flex justify-center">
            <Image
              src={product.img}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover rounded-lg shadow-md w-[auto] h-[125px]"
            />
          </div>

          {/* Hành động */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handleOpenEditModal(product)}
              className="w-20 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
            <button
              onClick={() => toggleProductVisibility(product.id, product.visible)}
              className={`w-20 px-4 py-2 rounded-lg shadow-md ${product.visible ? 'bg-green-500' : 'bg-gray-400'} text-white hover:bg-opacity-90`}
            >
              {product.visible ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookTable;
