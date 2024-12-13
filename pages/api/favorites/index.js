import { db } from "@/feature/firebase/firebase"; // Import Firestore

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid, productId, isFavorite } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!uid || !productId || typeof isFavorite !== "boolean") {
      return res.status(400).json({ error: "Invalid data" });
    }

    try {
      // Lưu vào Firestore
      await db.collection("favorites").doc(`${uid}_${productId}`).set({
        uid,
        productId,
        isFavorite,
      });

      return res.status(200).json({ result: "success" });
    } catch (error) {
      console.error("Error saving to database:", error.message);
      return res.status(500).json({ error: "Failed to save data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
