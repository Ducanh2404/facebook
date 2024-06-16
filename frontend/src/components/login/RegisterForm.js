import { Form, Formik } from "formik";
import { useState } from "react";
import RegisterInput from "../inputs/registerInput";
import * as Yup from "yup";
import DateOfBirthSelect from "./DateOfBirthSelect";
import GenderSelect from "./GenderSelect";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios"
import { useDispatch } from'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
export default function RegisterForm({setVisible}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    bYear: new Date().getFullYear(),
    bMonth: new Date().getMonth() + 1,
    bDay: new Date().getDate(),
    gender: "",
  };
  const [user, setUser] = useState(userInfos);
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user;
  const yearTemp = new Date().getFullYear();
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const years = Array.from(new Array(108), (val, index) => yearTemp - index);
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate();
  };
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);
  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required("Tên của bạn là gì?")
      .min(2, "Tên của bạn phải có độ dài từ 2 đến 16 ký tự.")
      .max(16, "Tên của bạn phải có độ dài từ 2 đến 16 ký tự.")
      .matches(/^[aA-zZ]+$/, "Số và kí tự đặc biệt không được cho phép."),
    last_name: Yup.string()
      .required("Họ của bạn là gì?")
      .min(2, "Họ của bạn phải có độ dài từ 2 đến 16 ký tự.")
      .max(16, "Họ của bạn phải có độ dài từ 2 đến 16 ký tự.")
      .matches(/^[aA-zZ]+$/, "Số và kí tự đặc biệt không được cho phép."),
    email: Yup.string()
      .required(
        "Bạn sẽ cần trường này nếu sau này bạn cần tìm lại mật khẩu của mình."
      )
      .email("Nhập 1 địa chỉ email hợp lệ."),
    password: Yup.string()
      .required(
        "Không được để trống mật khẩu"
      )
      .min(6, "Mật khẩu phải có độ dài tối thiếu là 6 ký tự.")
      .max(36, "Mật khẩu không được dài hơn 36 ký tự"),
  });
  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const registerSubmit = async ()=>{
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        first_name,
        last_name,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
      })
      if(data.message.code){
        return setError("This user name already in used")
      }
      setError('')
      setSuccess(data.message)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setSuccess('')
      setError(error.response.data.message)
    }
  }
  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={()=> setVisible(false)}></i>
          <span>Đăng ký</span>
          <span>Điền thông tin của bạn vào các trường bên dưới</span>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            first_name,
            last_name,
            email,
            password,
            bYear,
            bMonth,
            bDay,
            gender,
          }}
          validationSchema={registerValidation}
          onSubmit={() => {
            let current_date = new Date();
            let picked_date = new Date(bYear, bMonth - 1, bDay);
            let atleast14 = new Date(1970 + 14, 0, 1);
            let noMoreThan70 = new Date(1970 + 70, 0, 1);
            if (current_date - picked_date < atleast14) {
              setDateError(
                "it looks like you(ve enetered the wrong info.Please make sure that you use your real date of birth."
              );
            } else if (current_date - picked_date > noMoreThan70) {
              setDateError(
                "it looks like you(ve enetered the wrong info.Please make sure that you use your real date of birth."
              );
            } else if (gender === "") {
              setDateError("");
              setGenderError(
                "Please choose a gender. You can change who can see this later."
              );
            } else {
              setDateError("");
              setGenderError("");
              registerSubmit()
            }
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Tên"
                  name="first_name"
                  onChange={handleRegisterChange}
                />
                <RegisterInput
                  type="text"
                  placeholder="Họ"
                  name="last_name"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Địa chỉ email"
                  name="email"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="Mật khẩu"
                  name="password"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Ngày sinh <i className="info_icon"></i>
                </div>
                <DateOfBirthSelect
                  bDay={bDay}
                  bMonth={bMonth}
                  bYear={bYear}
                  days={days}
                  months={months}
                  years={years}
                  handleRegisterChange={handleRegisterChange}
                  dateError={dateError}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Giới tính <i className="info_icon"></i>
                </div>

                <GenderSelect
                  handleRegisterChange={handleRegisterChange}
                  genderError={genderError}
                />
              </div>
              <div className="reg_infos">
                Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
                <span>Điều khoản, Chính sách dữ liệu &nbsp;</span>
                và <span>Chính sách Cookie.</span>
              </div>
              <div className="reg_btn_wrapper">
                <button className="blue_btn open_signup">Sign Up</button>
              </div>
              <DotLoader
                color="#1876f2"
                loading={loading}
                size={30}
              />
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
