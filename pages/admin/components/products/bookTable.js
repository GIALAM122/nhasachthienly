import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa'; // Updated icons
import { BsFilterRight } from 'react-icons/bs';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Added additional icons for better clarity

const BookTable = ({ currentProducts, allProducts, handleOpenEditModal, toggleProductVisibility, setCurrentPage }) => {
  const [sortOrder, setSortOrder] = useState(''); // Sort order state
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories state
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filter visibility
  // Categories to filter
  const allCategories = [...new Set(allProducts.flatMap(product => product.categories))];

  // Handle sorting change
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to the first page after applying the filter
  };

  // Sorting products based on the price
  const sortedProducts = [...currentProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else if (sortOrder === 'desc') {
      return b.price - a.price;
    }
    return 0; // No sorting if no order is specified
  });

  // Filtering products by selected categories
  const filteredProducts = sortedProducts.filter((product) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.some((category) => product.categories.includes(category));
  });

  return (
    <div className="font-bahnschrift flex flex-col gap-4 bg-white p-4 shadow-md rounded-lg">

      {/* Toggle filter visibility */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="mb-4 flex items-center space-x-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600"
      >
        <BsFilterRight />
        <span>{isFilterVisible ? 'Ẩn lọc' : 'Lọc sản phẩm'}</span>
      </button>

      {/* Filter by price */}
      <div className={`flex flex-col gap-4 ${isFilterVisible ? '' : 'hidden'}`}>
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600 text-2xl" />
            <span className="font-semibold text-lg">Lọc theo giá</span>
          </div>

          {/* Default price filter */}
          <button
            onClick={() => handleSortChange('')}
            className={`px-6 py-2 rounded-lg font-medium text-md transition-all ${sortOrder === '' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-cyan-600`}
          >
            Mặc định
          </button>

          {/* Price low to high */}
          <button
            onClick={() => handleSortChange('asc')}
            className={`px-6 py-2 rounded-lg font-medium text-md transition-all ${sortOrder === 'asc' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600`}
          >
            Giá thấp đến cao
            <FiChevronUp className="inline ml-2 text-green-600" />
          </button>

          {/* Price high to low */}
          <button
            onClick={() => handleSortChange('desc')}
            className={`px-6 py-2 rounded-lg font-medium text-md transition-all ${sortOrder === 'desc' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-red-600`}
          >
            Giá cao đến thấp
            <FiChevronDown className="inline ml-2 text-red-600" />
          </button>
        </div>
      </div>

      {/* Filter by category */}
      <div className={`mb-6 ${isFilterVisible ? '' : 'hidden'}`}>
        <div className="text-lg font-semibold text-gray-800 mb-3">Lọc theo danh mục</div>
        <div className="flex flex-wrap gap-4">
          {allCategories.map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium ${selectedCategories.includes(category) ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-cyan-600 transition-all`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 bg-gray-500 text-white py-3 px-4 rounded-lg">
        <div className="font-bold text-left">Tên sản phẩm</div>
        <div className="font-bold text-left">Giá</div>
        <div className="font-bold text-center">Hình ảnh</div>
        <div className="font-bold text-center">Hành động</div>
      </div>

      {/* Products List */}
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-4 gap-4 items-center bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 shadow-md"
        >
          {/* Product Name */}
          <div className="font-montserrat uppercase text-left font-semibold">{product.name}</div>

          {/* Product Price */}
          <div className="text-left text-green-700 font-bold">
            {product.price.toLocaleString('vi-VN')} vn₫
          </div>

          {/* Product Image */}
          <div className="flex justify-center">
            <Image
              src={product.img}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover rounded-lg shadow-md w-[auto] h-[125px]"
            />
          </div>

          {/* Actions */}
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
