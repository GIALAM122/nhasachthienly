import { useState } from "react";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/feature/firebase/firebase";

const StarRating = ({ productId, userInfo, ratings }) => {
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(
    ratings?.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0
  );

  const handleRating = async (rating) => {
    if (!userInfo) {
      alert("Bạn cần đăng nhập để đánh giá!");
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
