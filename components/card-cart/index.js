import { useState, useEffect, useContext } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import CardCartUI from "./cartUI";

export default function CardCart({
  img,
  id,
  description,
  name,
  price,
  quantity,
  initialVisible,
  callback,
}) {
  const { increment, decrement, userInfo } = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const [value, setValue] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(initialVisible);

  const db = getFirestore();

  useEffect(() => {
    const docRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setDisplay(data.visible);
        if (!data.visible) {
          handleDelete();
        }
      }
    });

    return () => unsubscribe();
  }, [id, db]);

  const handleDecrement = async () => {
    setLoading(true);
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: -1,
    };
    const res = await axios.post("/api/cart", data);
    const { result } = await res.data;
    if (result === "success") {
      setLoading(false);
    }
    setValue(value - 1);
    decrement();
    callback({ price: -price });
  };

  const handleIncrement = async () => {
    setLoading(true);
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: 1,
    };
    const res = await axios.post("/api/cart", data);
    const { result } = await res.data;
    if (result === "success") {
      setLoading(false);
    }
    increment();
    setValue(value + 1);
    callback({ price });
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await axios.put("/api/cart", { id, uid: userInfo.uid });
    const data = await res.data;
    if (data.success) {
      decrement(quantity);
      setDisplay(false);
      callback({ price, quantity });
    }
  };

  return (
    <CardCartUI
      img={img}
      name={name}
      id={id}
      description={description}
      price={price}
      value={value}
      show={show}
      display={display}
      loading={loading}
      handleDelete={handleDelete}
      handleIncrement={handleIncrement}
      handleDecrement={handleDecrement}
      setShow={setShow}
    />
  );
}
