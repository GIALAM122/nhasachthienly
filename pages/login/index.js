import { useContext, useEffect, useState } from "react";
import TextInput from "@/components/text-input";
import LayoutForm from "@/components/layout-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signOut, signInGoogle, getItem, addDataWithID } from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";

export default function Login() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const closePopup = () => setPopupVisible(false);

  const handleLogin = async () => {
    setLoading(true);
    setLoginError(""); // Reset lỗi đăng nhập trước khi kiểm tra

    const listInput = [
      { type: "password", input: password },
      { type: "account", input: account },
    ];
    const errors = validate(listInput);
    setErrorInput(errors);

    if (Object.keys(errors).length === 0) {
      const { result, error } = await signInWithEmailAndPassword(account, password);
      setLoading(false);

      if (!error) {
        const id = result.user.uid;
        const user = await getItem("users", id).catch((error) => {
          console.error("Error fetching user data:", error);
          return null;
        });

        if (!user) {
          await signOut();
        } else if (user.isBlocked) {
          setPopupVisible(true);
          await signOut();
        } else {
          router.push(user.role === "admin" ? "/admin" : "/");
        }
      } else {
        setLoginError("Thông tin tài khoản hoặc mật khẩu không chính xác");
      }
    } else {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const { result, error } = await signInGoogle();
    setLoading(false);

    if (!error) {
      const uid = result.uid;
      const user = await getItem("users", uid);

      if (!user) {
        const data = {
          account: result.email,
          password: "", // Mặc định để trống
          phone: result.phoneNumber,
          name: result.displayName,
          role: "user",
          isBlocked: false, // Trường mặc định
        };
        await addDataWithID("users", uid, data);
      } else if (user.isBlocked) {
        setPopupVisible(true);
        await signOut();
        return;
      }

      router.push(user && user.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <LayoutForm>
      <h2 className="oswald uppercase text-4xl mt-10">Đăng nhập</h2>
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        callback={(text) => setAccount(text)}
        error={errorInput.account}
      />
      <TextInput
        name="Nhập mật khẩu"
        value={password}
        callback={(text) => setPassword(text)}
        type="password"
        error={errorInput.password}
      />
      {loginError && <div className="text-red-500 text-sm mt-2">{loginError}</div>}
      <div className="text-right mt-10 text-sm cursor-pointer">Bạn quên mật khẩu ?</div>
      <button
        onClick={handleLogin}
        className="w-[100%] p-4 bg-[#28a745] rounded-full text-white font-bold roboto btn-shadow my-4"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <div className="font-bold oswald text-[18px]">Hoặc tiếp tục với</div>
      <button
        onClick={loginWithGoogle}
        className="w-[100%] p-4 border border-[#999] rounded-full text-black justify-center font-bold roboto btn-shadow my-4 flex"
        disabled={loading}
      >
        <FcGoogle className="w-5 h-5 mr-2" /> Đăng nhập bằng Google
      </button>
      <div className="text-center">
        <span className="text-sm">Chưa có tài khoản ?</span>
        <Link className="font-semibold text-sm hover:underline" href={"/register"}>
          Tạo tài khoản
        </Link>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Thông báo</h3>
            <p className="mb-6">Tài khoản của bạn đã bị khóa.</p>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </LayoutForm>
  );
}