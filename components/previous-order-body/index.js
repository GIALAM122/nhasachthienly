import Image from "next/image";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function PreviousOrderBody({ customer_info, status, date, address, list_item }) {
  const [show, setShow] = useState(false);

  // Define status colors based on the order status
  const statusColors = {
    "Đã giao": "text-green-600", // green for delivered
    "Đã hủy": "text-red-600",   // red for cancelled
    "Đang xử lý": "text-blue-600", // blue for processing
  };

  return (
    <div className="border border-gray-300 rounded-lg mb-6 bg-white">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="space-y-1">
          <span className="text-lg font-semibold text-gray-700">Tên: {customer_info.name}</span>
          <br />
          <span className="text-sm text-gray-500">Ngày: {date}</span>
          <br />
          <span className="text-sm text-gray-500">
            Địa chỉ: {address.home}, {address.wards}, {address.district}, {address.city}
          </span>
        </div>

        <IoIosArrowDown
          className={`text-gray-600 transition-transform duration-200 ease-in-out cursor-pointer transform ${show ? "rotate-180" : ""}`}
          onClick={() => setShow(!show)}
        />
      </div>

      {/* Display order status with dynamic color */}
      <div className="px-6 my-2">
        <span className="text-md font-semibold text-gray-800">Trạng thái đơn hàng: </span>
        <span className={`text-md uppercase font-medium ${statusColors[status] || "text-gray-600"}`}>
          {status}
        </span>
      </div>

      {/* Toggleable list of items */}
      <ul className={`${!show ? "hidden" : "block"} px-6 py-4`}>
        {list_item.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between border p-4 rounded-lg bg-gray-50 my-3 transition-all hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Image src={item.img} width={100} height={100} alt={item.name} className="rounded-lg shadow-md" />
              <span className="ml-4 font-medium text-gray-700">{item.name}</span>
            </div>
            <span className="font-medium text-gray-600">Số lượng: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
