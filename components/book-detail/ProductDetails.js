import Counter from "@/components/counter";

const ProductDetails = ({ product, quantity, setQuantity, handleAddItem }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Tên sách */}
      <h2
        className="text-4xl md:text-5xl font-bold pd-2 uppercase oswald mb-4"
        style={{ lineHeight: "1.5" }}
      >
        {product.name}
      </h2>
      {/* Mô tả sách */}
      {/* <p className="text-lg md:text-xl text-gray-700 mb-6">{product.description}</p> */}

      {/* Thông tin chi tiết */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-2xl font-semibold uppercase mb-2">Thông tin chi tiết</h3>
        <ul className="text-gray-600 text-lg leading-8 capitalize">
          <li><strong>Tên sách:</strong> {product.name}</li>
          <li className="capitalize">
            <strong>Tác giả:</strong> {product.author || "Đang cập nhật"}
          </li>
          <li>
            <strong>Giá:</strong>
            <span className="text-red-600 text-xl ml-2 font-bold">
              {product.price ? product.price.toLocaleString("vi-VN") : "Đang cập nhật"}₫
            </span>
          </li>
        </ul>
      </div>


      {/* Nút thêm vào giỏ và bộ đếm số lượng */}
      <div className="mt-6 flex items-center justify-between">
        <Counter
          decrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          increment={() => setQuantity(quantity + 1)}
          quantity={quantity}
          block={true}
        />
        <button
          onClick={handleAddItem}
          className="bg-red-600 py-3 px-6 rounded-lg text-white text-sm uppercase font-bold hover:bg-red-700 transition"
        >
          Thêm vào giỏ ({(quantity * product.price).toLocaleString("vi-VN")}₫)
        </button>
      </div>
    </div>

  );
};

export default ProductDetails;
