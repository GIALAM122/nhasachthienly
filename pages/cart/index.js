import { useState, useEffect, useContext } from "react";
import AuthContext from "@/feature/auth-context";
import Loader from "@/components/loader";
import CardCart from "@/components/card-cart";
import EmptyCart from "@/components/empty-cart";
import axios from "axios";
import { formatMoney } from "@/utils";
import Link from "next/link";

export default function Cart() {
  const { userInfo } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalBook, setTotalBook] = useState(0);

  const fecthData = async () => {
    let value = 0;
    const res = await axios.post("/api/item", {
      id: userInfo.uid,
      name: "cart",
    });
    const data = res.data;

    if (data) {
      const updatedCart = data.arrayCart.filter(item => item.visible); // Lọc sản phẩm có visible là true
      setTotalBook(updatedCart.length);

      updatedCart.forEach((element) => {
        value += element.quantity * element.price;
      });
      setTotal(value);
      setCart(updatedCart);
    }
    setLoading(true);
  };

  const handleCounter = (data) => {
    if (!data.quantity) {
      setTotal(parseInt(total) + parseInt(data.price));
    } else {
      setTotal(parseInt(total) - parseInt(data.price * data.quantity));
      setTotalBook(totalBook - 1);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fecthData();
    }
  }, [userInfo]);

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container m-auto ">
      <div className=" before:left-[17px] ">
        <h2 className="oswald text-4xl py-4 block">Giỏ hàng của tôi</h2>
      </div>
      <div className="flex justify-between">
        {totalBook === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="w-[70%] border border-gray-300 rounded-lg">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 bg-white text-black py-3 px-4 rounded-t-lg border-b border-gray-300">
                <div className="font-bold text-left">Thông tin sản phẩm</div>
                <div className="relative font-bold left-[190px] text-left">Giá</div>
                <div className="relative font-bold left-[75px] text-center">Số lượng</div>
                <div className="font-bold mr-10 text-center">Thành tiền</div>
              </div>

              {/* Các sản phẩm */}
              {cart.map((item) => (
                <CardCart
                  callback={(value) => handleCounter(value)}
                  key={item.id}
                  {...item}
                />
              ))}
            </div>

            <div className="w-[28%] border border-gray-300 rounded-lg shadow-lg">
              <div className="bg-cyan-500 text-black py-4 px-6 rounded-t-lg">
                <h2 className="oswald text-xl uppercase">Chi tiết thanh toán</h2>
                <p className="text-sm mt-2">Tổng số sách: <span className="font-bold">{totalBook} sách</span></p>
              </div>
              <div className="py-6 px-6 space-y-4 bg-white">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">Tổng đơn hàng</span>
                  <span className="font-medium text-lg">{formatMoney(total)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">Phí giao hàng</span>
                  <span className="font-medium text-lg">{formatMoney(10000)}₫</span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl text-gray-800 border-b pb-3">
                  <span>Tổng thanh toán</span>
                  <span>{formatMoney(parseInt(total) + 10000)}₫</span>
                </div>
                <Link href="/checkout">
                  <div className="flex justify-center items-center bg-red-500 text-white rounded-full py-3 px-6 mt-[70px] cursor-pointer hover:scale-105 transform transition-all duration-300">
                    <span className="font-bold text-base">Thanh toán</span>
                  </div>
                </Link>


              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
