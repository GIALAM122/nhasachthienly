import firebase from "@/feature/firebase/firebase";
import { useEffect, useState } from "react";
import CardBook from "@/components/card-book";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const uid = localStorage.getItem("uid"); // Lấy UID của user
      const userRef = firebase.firestore().collection("favorites").doc(uid);
      const doc = await userRef.get();

      if (doc.exists) {
        const productIds = doc.data().products || [];
        // Fetch thông tin sản phẩm yêu thích
        const products = await Promise.all(
          productIds.map(async (id) => {
            const productDoc = await firebase
              .firestore()
              .collection("products")
              .doc(id)
              .get();
            return productDoc.data();
          })
        );
        setFavorites(products);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Sản phẩm yêu thích</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {favorites.map((product, index) => (
          <CardBook key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
