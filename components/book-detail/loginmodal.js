import { useRouter } from "next/router";

const LoginModal = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
        <p className="mb-6">Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-4 hover:bg-gray-600"
          >
            Đóng
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
