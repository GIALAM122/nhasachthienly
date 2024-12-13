import moment from "moment";
import crypto from "crypto";
import querystring from "qs";
import {
  addDataWithID,
  addToFirebaseArray,
  getItem,
  deleData,
} from "@/feature/firebase/firebaseAuth";

// Function to sort query parameters
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const {
        action,
        total,
        bankCode,
        language,
        id_user,
        list_item,
        address,
        date,
        payment,
        customer_info,
      } = req.body;

      if (action === "payment") {
        // Generate the payment URL
        process.env.TZ = "Asia/Ho_Chi_Minh";
        const createDate = moment().format("YYYYMMDDHHmmss");
        const ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        const tmnCode = "ZKO72IDD";
        const secretKey = "R8KYWZS2Q45IZIDAA3Y5UDZRWIV6O5F3";
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = "http://localhost:3000/api/callbackvnpay";

        const orderId = moment().format("DDHHmmss");
        const locale = language && language.trim() ? language : "vn";
        const currCode = "VND";

        let vnp_Params = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: tmnCode,
          vnp_Locale: locale,
          vnp_CurrCode: currCode,
          vnp_TxnRef: id_user + orderId,
          vnp_OrderInfo: list_item,
          vnp_OrderType: "other",
          vnp_Amount: total * 100,
          vnp_ReturnUrl: returnUrl,
          vnp_IpAddr: ipAddr,
          vnp_CreateDate: createDate,
        };

        if (bankCode) {
          vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac
          .update(Buffer.from(signData, "utf-8"))
          .digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({ url: vnpUrl });
      } else if (action === "order") {
        // Post the order data to Firestore

        const check = await getItem("previous-order", id_user);
        if (check) {
          await addToFirebaseArray("previous-order", id_user, {
            list_item,
            date,
            total,
            address,
            payment,
            customer_info,
          });
        } else {
          const items = [];
          items.push({
            list_item,
            date,
            total,
            address,
            payment,
            customer_info,
          });
          await addDataWithID("previous-order", id_user, { items });
        }
        await deleData("cart", id_user);
        res.status(200).json({ result: true });
      } else {
        res.status(400).json({ message: "Invalid action specified" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: null });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}