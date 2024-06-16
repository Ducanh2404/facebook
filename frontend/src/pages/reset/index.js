import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Form, Formik } from "formik";
import { useState } from "react";
import LoginInput from "../../components/inputs/loginInput";
import SearchAccount from "./SearchAccount";
import SendEmail from "./SendEmail";
import CodeVerification from "./CodeVerification";
import Footer from "../../components/login/Footer";
import ChangePassword from "./ChangePassword";
export default function Reset() {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setConf_password] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('')
  const [userInfos, setUserInfos] = useState("")

  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };
  return (
    <div className="reset">
      <div className="reset_header">
        <img src="../../../images/my_logo.png" alt="" style={{width:"40px", height:"40px", borderRadius:"50%"}}/>
        {user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user?.picture} alt="" />
            </Link>
            <button
              className="blue_btn"
              onClick={() => {
                logout();
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Đăng nhập</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
        {visible === 0 && (
          <SearchAccount 
            email={email} 
            setEmail={setEmail} 
            error={error} 
            setError={setError} 
            setLoading={setLoading}
            setUserInfos={setUserInfos}
            setVisible={setVisible}
          />
        )}
        {visible === 1 && userInfos && (
          <SendEmail
            userInfos={userInfos}
            email={email}
            error={error} 
            setError={setError} 
            setLoading={setLoading}
            setVisible={setVisible}
          />
        )}
        {visible === 2 && (
          <CodeVerification
            userInfos={userInfos}
            user={user}
            code={code}
            setCode={setCode}
            error={error}
            setError={setError} 
            setLoading={setLoading}
            setVisible={setVisible}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            userInfos={userInfos}
            password={password}
            conf_password={conf_password}
            setConf_password={setConf_password}
            error={error}
            setPassword={setPassword}
            setError={setError} 
            setLoading={setLoading}
            setVisible={setVisible}
            setSuccess={setSuccess}
            success={success}
          />
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
