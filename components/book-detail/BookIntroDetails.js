const BookIntroDetails = ({ product }) => {
    return (
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        {/* Giới thiệu về sách */}
        <div className="w-full md:w-1/2">
          <h3 className="text-3xl font-bold uppercase mb-6">Giới thiệu về sách</h3>
          <p className="text-base font-civil text-gray-700 mb-4">
            {product.mota || "Đang cập nhật nội dung giới thiệu cho sách này."}
          </p>
        </div>
  
        {/* Thông tin chi tiết */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-bold uppercase mb-4">Thông tin chi tiết</h3>
          <div className="border border-gray-300 p-6 rounded-lg shadow-md">
            <ul className="list-disc list-inside text-gray-600 text-lg capitalize">
              <li><strong>Tác giả:</strong> {product.author || "Đang cập nhật"}</li>
              <li><strong>Nhà xuất bản:</strong> {product.publisher || "Đang cập nhật"}</li>
              <li><strong>Ngày phát hành:</strong> {product.releaseDate || "Đang cập nhật"}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookIntroDetails;
  