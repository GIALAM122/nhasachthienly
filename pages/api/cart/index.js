import {
  addDataWithID,
  getItem,
  deleData,
} from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    const { uid } = req.body;
    let add = false;
    const data = req.body;
    let arrayCart = [];
    const listCart = await getItem("cart", uid);
    if (listCart) {
      arrayCart = listCart.arrayCart;
      for (const key in arrayCart) {
        if (arrayCart[key].id === data.id) {
          arrayCart[key].quantity = arrayCart[key].quantity + data.quantity;
          add = true;
          break;
        }
      }
      if (add === false) {
        arrayCart.push({ ...data });
      }
    } else {
      arrayCart.push({ ...data });
    }
    try {
      await addDataWithID("cart", uid, { arrayCart });
      res.status(200).json({ result: "success", output: arrayCart });
    } catch (error) {
      console.error(error);
      res.status(500).json(arrayCart, { message: "Something went wrong" });
    }
  }
  if (method === "GET") {
    try {
      const { uid } = req.body;
      const data = await getItem("cart", uid);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "DELETE") {
    try {
      await deleData("products", { ...req.body });
      res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
