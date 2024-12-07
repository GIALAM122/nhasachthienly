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

            <div className="w-[28%]">
              <div className="sticky top-[150px] my-4 box-shadow p-6 rounded-xl ">
                <h2 className="oswald text-3xl uppercase border-b pb-4 border-[#ccc]">
                  {totalBook} Sách
                </h2>
                <div className="my-2 flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{formatMoney(total)}</span>
                </div>
                <div className="my-2 flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{formatMoney(10000)}₫</span>
                </div>
                <div className="my-2 font-bold roboto flex justify-between border-b border-[#ccc] pb-4">
                  <span>Tổng thanh toán</span>
                  <span>{formatMoney(parseInt(total) + 10000)}₫</span>
                </div>
                <Link href="/checkout">
                  <div className="flex p-4 roboto mt-6 btn-shadow cursor-pointer bg-red-500 text-white rounded-full justify-between">
                    <span>Thanh toán</span>
                    <span>{formatMoney(parseInt(total) + 10000)}₫</span>
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
