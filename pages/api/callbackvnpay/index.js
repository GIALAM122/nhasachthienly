import crypto from "crypto";
import qs from "qs";


// Sort an object by its keys alphabetically
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

const config = {
    vnp_TmnCode: "ZKO72IDD",
    vnp_HashSecret: "R8KYWZS2Q45IZIDAA3Y5UDZRWIV6O5F3",
};

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        // Xử lý callback từ API bên thứ ba
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params["vnp_SecureHash"];

            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            // Sắp xếp và mã hóa tham số
            vnp_Params = sortObject(vnp_Params);

            const signData = qs.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

            if (secureHash === signed) {
                console.log("Xác minh thanh toán thành công.");

                // Trả về phản hồi thành công
                return res.redirect(302, "http://localhost:3000");
            } else {
                console.error("Secure hash không hợp lệ.");
                return res.status(400).json({ code: "97" }); // Mã lỗi xác minh thất bại
            }
        } catch (error) {
            console.error("Lỗi trong quá trình xử lý GET:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ message: "Phương thức không được hỗ trợ" });
    }
}