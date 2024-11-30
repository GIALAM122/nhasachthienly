import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "@/components/loader";
import Image from "next/image";
import AuthContext from "@/feature/auth-context";
import LoginModal from "@/components/book-detail/loginmodal";
import ProductDetails from "@/components/book-detail/ProductDetails";
import RelatedProductsSlider from "@/components/book-detail/SameDetail";
import StarRating from "@/components/book-detail/StarRating";
import BookIntroDetails from "@/components/book-detail/BookIntroDetails";


export default function Order() {
  const { userInfo, increment } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fecthData = async () => {
    const res = await axios.post("/api/item", { id, name: "products" });
    const data = await res.data;
    setProduct(data);
    setLoading(true);
    fecthRelatedProducts(data.categories);
  };

  const fecthRelatedProducts = async (categories) => {
    const res = await axios.get("/api/product");
    const data = res.data;

    const filteredProducts = data.filter(
      (item) =>
        Array.isArray(item.categories) &&
        item.categories.some((category) => categories.includes(category)) &&
        item.id !== id
    );

    setRelatedProducts(filteredProducts);
  };

  const handleAddItem = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }
    const data = { ...product, id, quantity, uid: userInfo.uid };
    const res = await axios.post("/api/cart", data);
    const { result } = res.data;
    if (result === "success") {
      increment(quantity);
    }
  };

  useEffect(() => {
    fecthData();
  }, [id]);

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="flex flex-col md:flex-row items-start gap-10">
        <div
          className="w-full md:w-1/3 flex justify-center p-4 rounded-lg border border-gray-300 shadow-md"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <Image
            src={product.img}
            className="rounded-lg object-cover"
            width={300}
            height={400}
            alt={product.name}
          />
        </div>



        <div className="w-full md:w-2/3">
          <ProductDetails
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddItem={handleAddItem}

          />
    
        </div>
      </div>
      <BookIntroDetails product={product} />
      <StarRating
            productId={id}
            userInfo={userInfo}
            ratings={product.ratings || []}
          />
      <RelatedProductsSlider products={relatedProducts} />
    </div>
  );
}
