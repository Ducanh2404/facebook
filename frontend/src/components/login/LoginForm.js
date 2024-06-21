import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import LoginInput from "../inputs/loginInput";
import { useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios"
import { useDispatch } from'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const loginInfos = {
  email: "",
  password: "",
};

export default function LoginForm({setVisible}) {
  const [login, setLogin] = useState(loginInfos);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { email, password } = login;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Không được bỏ trống trường này")
      .email("Email không hợp lệ")
      .max(100),
    password: Yup.string().required("Không được bỏ trống trường này"),
  });

  const loginSubmit = async()=>{
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`,login)
      dispatch({type:'LOGIN', payload: data})
      Cookies.set('user',JSON.stringify(data))
      navigate('/')
    } catch (error) {
      setLoading(false)
      console.log(error)
      setError(error.response.data.message)
    }
  }

  return (
    <div className="login_wrap">
      <div className="login_1" style={{marginTop:"30px"}}>
        {/* <img src="../../icons/facebook.svg" alt="" /> */}
        <img src="../../../images/my_logo.png" className="format_image"/>
        <span style={{marginLeft:"66px",marginTop:"10px"}}>
          TVIBE,Think your way 123
        </span>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={loginSubmit}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  placeholder="Nhập email của bạn"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="blue_btn">
                  Đăng nhập
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/reset" className="forgot_password">
            Quên mật khẩu ?
          </Link>
          <div className="sign_splitter"></div>
          {error && <div className='error_text'>{error}</div>}
          <button className="blue_btn open_signup" onClick={()=>setVisible(true)}>Tạo tài khoản</button>
        </div>
        <Link to="/" className="sign_extra">
          <b>Tvibe</b> hãy nghĩ theo cách của bạn
        </Link>
      </div>
    </div>
  );
}