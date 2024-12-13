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

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!userInfo) return;
      
      // Kiểm tra nếu người dùng đã mua sản phẩm từ collection "previous-order"
      const previousOrderRef = doc(db, "previous-order", userInfo.uid);
      const previousOrderSnapshot = await getDoc(previousOrderRef);
      const previousOrderData = previousOrderSnapshot.data();

      // Kiểm tra nếu sản phẩm đã có trong đơn hàng
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
    if (!userInfo) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    if (!hasPurchased) {
      alert("Bạn phải mua sản phẩm trước khi đánh giá!");
      return;
    }

    const productRef = doc(db, "products", productId);
    const productSnapshot = await getDoc(productRef);
    const productData = productSnapshot.data();

    // Kiểm tra nếu user đã đánh giá
    const userAlreadyRated = productData.ratings?.some(
      (r) => r.userId === userInfo.uid
    );

    if (userAlreadyRated) {
      alert("Bạn đã đánh giá sản phẩm này!");
      return;
    }

    setUserRating(rating);

    // Thêm đánh giá mới vào Firebase
    await updateDoc(productRef, {
      ratings: arrayUnion({ userId: userInfo.uid, rating }),
    });

    // Tính lại trung bình và cập nhật UI
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
      <p className="mt-2 text-gray-600">
        Trung bình: {averageRating.toFixed(1)} / 5 ({ratings?.length || 0} đánh giá)
      </p>
    </div>
  );
};

export default StarRating;
