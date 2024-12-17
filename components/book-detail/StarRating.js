import { useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/feature/firebase/firebase";
import AuthContext from "@/feature/auth-context";

const StarRating = ({ productId, ratings }) => {
  const { userInfo } = useContext(AuthContext);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(
    ratings?.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0
  );
  const [hasPurchased, setHasPurchased] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!userInfo) return;

      const previousOrderRef = doc(db, "previous-order", userInfo.uid);
      const previousOrderSnapshot = await getDoc(previousOrderRef);
      const previousOrderData = previousOrderSnapshot.data();

      if (previousOrderData?.items) {
        const purchased = previousOrderData.items.some(item =>
          item.list_item.some(product => product.id === productId)
        );
        setHasPurchased(purchased);
      }
    };

    checkPurchaseStatus();
  }, [userInfo, productId]);

  const handleRating = async (rating) => {
    setErrorMessage(""); // Reset lỗi trước khi kiểm tra mới

    if (!userInfo) {
      setErrorMessage("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    if (!hasPurchased) {
      setErrorMessage("Bạn phải mua sản phẩm trước khi đánh giá!");
      return;
    }

    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);
    const productData = productSnapshot.data();

    const userAlreadyRated = productData.ratings?.some(
      (r) => r.userId === userInfo.uid
    );

    if (userAlreadyRated) {
      setErrorMessage("Bạn đã đánh giá sản phẩm này!");
      return;
    }

    setUserRating(rating);

    await updateDoc(productRef, {
      ratings: arrayUnion({ userId: userInfo.uid, rating }),
    });

    const newAverage =
      (averageRating * (ratings?.length || 0) + rating) / ((ratings?.length || 0) + 1);
    setAverageRating(newAverage);
  };

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold">Đánh giá sản phẩm</h3>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-2xl ${
              star <= (userRating || averageRating)
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {errorMessage && (
        <p className="mt-2 text-red-500">{errorMessage}</p>
      )}
      <p className="mt-2 text-gray-600">
        Trung bình: {averageRating.toFixed(1)} / 5 ({ratings?.length || 0} đánh giá)
      </p>
    </div>
  );
};

export default StarRating;
