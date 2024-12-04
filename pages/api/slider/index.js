import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/feature/firebase/firebase"; // Đảm bảo đường dẫn đúng

const db = getFirestore(firebaseApp);

async function getData(collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data;
}

export default async function handle(req, res) {
  const { method } = req;
  if (method === "GET") {
    try {
      const data = await getData("slider");
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
