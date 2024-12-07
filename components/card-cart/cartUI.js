import Image from "next/image";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import Counter from "../counter";
import { formatMoney } from "@/utils";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function CardCartUI({
    img,
    name,
    id,
    description,
    price,
    value,
    show,
    display,
    loading,
    handleDelete,
    handleIncrement,
    handleDecrement,
    setShow,
}) {
    if (!display) return null; // Không render nếu `display` là `false`

    return (
        <div
            className={`${display ? "grid" : "hidden"} grid-cols-[100px_1fr_150px_200px_50px] items-center gap-4 my-4 p-4 bg-white shadow-lg relative rounded`}
        >
            {/* Hình ảnh sản phẩm */}
            <div className="w-[100px] h-[160px]">
                <Image src={img} alt={name} width={500} height={500} className="object-cover" />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="relative pr-4">
                <h2 className="font-bold text-ml text-black">
                    <Link href={`/kham-pha/order/${id}`} className="hover:text-cyan-500">
                        {name}
                    </Link>
                </h2>

                {/* Mô tả sản phẩm */}
                <p className={`${show ? "hidden" : "block"} text-[#999] text-sm mt-2`}>
                    {description}
                </p>
            </div>

            {/* Giá sản phẩm */}
            <div className="text-left">
                <p className="font-bold text-red-500 text-black">
                    {formatMoney(price)}₫
                </p>
            </div>

            {/* Điều khiển số lượng */}
            <div>
                <Counter
                    price={price}
                    quantity={value}
                    decrement={handleDecrement}
                    increment={handleIncrement}
                />
            </div>

            {/* Nút xóa sản phẩm */}
            <div className="relative justify-self-start">
                <span
                    onClick={handleDelete}
                    className="cursor-pointer hover:text-cyan-500 text-black-600 text-2xl"
                >
                    <RiDeleteBin6Line />
                </span>
            </div>

            {/* Hiển thị loading */}
            <div
                className={`${!loading ? "hidden" : "block"} absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-white`}
            >
                <AiOutlineLoading className="animate-spin w-10 h-10 text-red-500" />
            </div>
        </div>
    );
}
