import { Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginInput from "../../components/inputs/loginInput";
import * as Yup from "yup";
import axios from "axios";
export default function ChangePassword({
  password,
  setPassword,
  conf_password,
  setConf_password,
  error,
  setLoading,
  setError,
  userInfos,
  setSuccess,
  success
}) {
  const validatePassword = Yup.object({
    password: Yup.string()
      .required(
        "Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &)."
      )
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),

    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });
  const navigate = useNavigate()
  const changePassword = async ()=>{
    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`,{
        email: userInfos.email,
        password
      })
      setError('')
      setSuccess("Đổi mật khẩu thành công")
      setLoading(false)
      setTimeout(()=>{
        navigate('/login')
      },3000)
    } catch (error) {
      console.log(error)
      setLoading(false);
      setError(error.response.data.message)
    }
  }

  return (
    <div className="reset_form" style={{ height: "310px" }}>
      <div className="reset_form_header">Đổi mật khẩu</div>
      <div className="reset_form_text">Tạo lại mật khẩu</div>
      <Formik
        enableReinitialize
        initialValues={{
          password,
          conf_password,
        }}
        validationSchema={validatePassword}
        onSubmit={changePassword}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            <LoginInput
              type="password"
              name="conf_password"
              onChange={(e) => setConf_password(e.target.value)}
              placeholder="Confirm new password"
              bottom
            />
            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Hủy
              </Link>
              <button type="submit" className="blue_btn">
                Tiếp tục
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
