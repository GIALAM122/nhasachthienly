import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import Loader from "@/components/loader";
import { formatMoney } from "@/utils";
import TextInput from "@/components/text-input";
import { getPosition } from "@/feature/get-location";
import { MdOutlinePayments, MdPayment } from "react-icons/md";
import { getDate } from "@/utils";
import Modal from "@/components/modal";
import EmptyCart from "@/components/empty-cart";
import { useRouter } from "next/router";
import Delivery from "@/components/delivery";
import { validateOrder } from "@/feature/validation/valiorders";
import Image from "next/image";

export default function Checkout() {
  const router = useRouter();
  const { userInfo, emptyCart } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [home, setHome] = useState("");
  const [wards, setWards] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rule, setRule] = useState(false);
  const [errorOrder, setValidationErrors] = useState(null);
  const [bank, setBank] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (key, value) => {
    const storedData = JSON.parse(localStorage.getItem("checkoutData")) || {};
    storedData[key] = value;
    localStorage.setItem("checkoutData", JSON.stringify(storedData));

    // Cập nhật giá trị state tương ứng
    switch (key) {
      case "home":
        setHome(value);
        break;
      case "wards":
        setWards(value);
        break;
      case "district":
        setDistrict(value);
        break;
      case "city":
        setCity(value);
        break;
      case "name":
        setName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "rule":
        setRule(value === "true");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("checkoutData")) || {};
    setHome(storedData.home || "");
    setWards(storedData.wards || "");
    setDistrict(storedData.district || "");
    setCity(storedData.city || "");
    setName(storedData.name || "");
    setPhone(storedData.phone || "");
    setEmail(storedData.email || "");
    setRule(storedData.rule === true);
  }, []);

  const handlePaymentvn = async () => {
    const orderData = {
      name,
      phone,
      email,
      home,
      wards,
      district,
      city,
      rule,
    };

    // Validate the data
    const validationErrors = validateOrder(orderData);
    setValidationErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const paymentData = {
        action: "payment",
        id_user: userInfo.uid,
        date: getDate(),
        total: total + 10000,
        bankCode: "NCB",
        language: "vn",
        customer_info: {
          name,
          phone,
          email,
        },
        address: {
          home,
          wards,
          district,
          city,
        },
        list_item: data.arrayCart,
        payment: bank ? "delivery" : "VNPay",
      };

      const response = await fetch("/api/vnpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const resData = await response.json();

        // Post order data to Firestore
        const orderResponse = await fetch("/api/vnpay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...paymentData,
            action: "order", // Specify the order action
          }),
        });

        if (orderResponse.ok) {
          window.location.href = resData.url; // Redirect to payment URL
          // console.log("Order data sent:", paymentData);
        } else {
          console.error("Order posting failed");
        }
      } else {
        console.error("Payment request failed");
      }
    } catch (error) {
      console.error("Error during payment request", error);
    }
  };

  const handelPayment = async () => {
    // Thu thập dữ liệu từ các input fields
    const orderData = {
      name,
      phone,
      email,
      home,
      wards,
      district,
      city,
      rule,
    };

    // Gọi hàm validateOrder để kiểm tra dữ liệu
    const validationErrors = validateOrder(orderData);

    // Nếu có lỗi, cập nhật state lỗi và không thực hiện thanh toán
    setValidationErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Tiến hành thanh toán nếu không có lỗi
    const result = {
      id_user: userInfo.uid,
      list_item: data.arrayCart,
      date: getDate(),
      total: total + 10000,
      address: {
        home,
        wards,
        district,
        city,
      },
      payment: bank ? "delivery" : "vnpay",
      customer_info: {
        name,
        phone,
      },
    };

    try {
      const res = await axios.post("/api/payment", result);
      const newData = await res.data;

      if (newData.result) {
        emptyCart();
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  useEffect(() => {
    async function fectchData() {
      const res = await axios.post("/api/item", {
        name: "cart",
        id: userInfo.uid,
      });
      const data = await res.data;
      let value = 0;
      if (data) {
        data.arrayCart.forEach((element) => {
          value += element.quantity * element.price;
        });
        setTotal(value);
        setData(data);
      }
      setLoading(false);
    }
    if (userInfo) {
      fectchData();
    }
  }, [userInfo]);

  const handleGetLocation = async () => {
    await getPosition((value) => {
      const { result, error } = value;
      if (!error) {
        setCity(result.city);
        setDistrict(result.locality);
      }
    });
  };

  if (loading) {
    return <Loader />;
  }
  if (!data) {
    return <EmptyCart />;
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8 ">
      <div className="flex flex-wrap max-w-6xl w-full">
        {/* Left section */}
        <div className="w-full lg:w-3/5 px-4 mb-8 lg:mb-0">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center justify-center mb-6">
              <AiFillLock className="mr-2" /> Thông tin đặt hàng
            </h2>

            {/* Delivery time */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Thời gian giao hàng:</h2>
              <span className="text-gray-600">Giao ngay</span>
            </div>

            {/* Delivery address */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Được giao đến:</h2>
              <button
                onClick={handleGetLocation}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-full mb-4"
              >
                Địa chỉ hiện tại
              </button>
              <TextInput
                value={home}
                callback={(text) => handleInputChange("home", text)}
                name="Số nhà"
                error={errorOrder && errorOrder.home}
              />
              <TextInput
                value={wards}
                callback={(text) => handleInputChange("wards", text)}
                name="Phường/Xã"
                error={errorOrder && errorOrder.wards}
              />
              <TextInput
                value={district}
                callback={(text) => handleInputChange("district", text)}
                name="Quận"
                error={errorOrder && errorOrder.district}
              />
              <TextInput
                value={city}
                callback={(text) => handleInputChange("city", text)}
                name="Thành phố"
                error={errorOrder && errorOrder.city}
              />
            </div>

            {/* Additional details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Thêm thông tin chi tiết:</h2>
              <TextInput
                value={name}
                callback={(text) => handleInputChange("name", text)}
                name="Họ tên của bạn"
                error={errorOrder && errorOrder.name}
              />
              <TextInput
                value={phone}
                callback={(text) => handleInputChange("phone", text)}
                name="Số điện thoại"
                type="number"
                error={errorOrder && errorOrder.phone}
              />
              <TextInput
                value={email}
                callback={(text) => handleInputChange("email", text)}
                name="Địa chỉ email"
                error={errorOrder && errorOrder.email}
              />
            </div>

            {/* Payment method */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Phương thức thanh toán:</h2>
              <div
                onClick={() => setBank(true)}
                className={`${bank ? "bg-cyan-500 text-white border-cyan-500" : "text-gray-700 border-gray-300"
                  } cursor-pointer font-bold flex items-center justify-between py-3 px-4 border rounded-lg mb-4`}
              >
                <span>Thanh toán khi nhận hàng</span>
                <MdOutlinePayments className="w-7 h-7" />
              </div>
              <div
                onClick={() => {
                  setBank(false);
                  // Add Zalo callback functionality here
                }}
                className={`${!bank ? "bg-cyan-500 text-white border-cyan-500" : "text-gray-700 border-gray-300"
                  } cursor-pointer font-bold flex items-center justify-between py-3 px-4 border rounded-lg`}
              >
                Thanh toán VNPAY
                <Image
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                  alt="VNPAY Logo"
                  width={200}
                  height={200}
                  className="ml-2 w-auto h-7"
                />
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-center mb-6">
              <input
                value={rule}
                onChange={() => setRule(!rule)}
                type="checkbox"
                className="h-5 w-5 mr-2"
              />
              <span className="text-gray-600">
                Tôi đã đọc và đồng ý với các{" "}
                <span className="font-bold text-blue-600 underline">Chính Sách Hoạt Động của Nhà sách</span>
              </span>
            </div>

            {/* Buttons */}
            {bank === false ? (
              <div>
                <button
                  onClick={handlePaymentvn}
                  className="w-full max-w-[800px] mx-auto py-4 rounded-full bg-green-500 text-white font-bold"
                >
                  Thanh Toán
                </button>
              </div>
            ) : (
              <div
                onClick={handelPayment}
                className="w-full max-w-[800px] mx-auto py-4 rounded-full bg-green-500 text-white font-bold text-center cursor-pointer"
              >
                Đặt hàng
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="w-full lg:w-2/5 px-4">
          <div className="sticky top-24 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng:</h2>
            <ul className="space-y-2">
              {data.arrayCart.map((item) => (
                <li key={item.id} className="flex justify-between text-gray-700">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </li>
              ))}
            </ul>
            <hr className="my-4" />
            <h2 className="text-lg font-semibold text-gray-800">Thanh toán:</h2>
            <div className="flex justify-between text-gray-700 my-2">
              <span>Tổng đơn hàng:</span>
              <span>{formatMoney(total)}₫</span>
            </div>
            <div className="flex justify-between text-gray-700 my-2">
              <span>Phí giao hàng:</span>
              <span>{formatMoney(10000)}₫</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold text-gray-800 my-2">
              <span>Tổng thanh toán:</span>
              <span>{formatMoney(total + 10000)}₫</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal show={showModal}>
          <Delivery />
        </Modal>
      )}
    </div>

  );
}