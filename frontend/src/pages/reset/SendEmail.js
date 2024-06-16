import axios from "axios";
import { Link } from "react-router-dom";

export default function SendEmail({ userInfos, email, error, setError, setVisible, setLoading }) {
  const sendEmail = ()=>{
    try {
      setLoading(true)
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/sendResetPasswordCode`,{ email })
      setError('')
      setVisible(2)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }
  return (
    <div className="reset_form dynamic_height">
      <div className="reset_form_header">Đặt lại mật khẩu</div>
      <div className="reset_grid">
        <div className="reset_left">
          <div className="reset_form_text">
            Bạn muốn đặt lại mật khẩu thế nào
          </div>
          <label htmlFor="email" className="hover1">
            <input type="radio" name="" id="email" checked readOnly />
            <div className="label_col">
              <span>Gửi mã code qua email</span>
              <span>{userInfos?.email}</span>
            </div>
          </label>
        </div>
        <div className="reset_right">
          <img src={userInfos?.picture} alt="" />
          <span>{userInfos?.email}</span>
          <span>Người dùng Tvibe</span>
        </div>
      </div>
      {error && (
        <div className="error_text" style={{paddingLeft: '10px'}}>
          ${error}
        </div>
      )}
      <div className="reset_form_btns">
        <Link to="/login" className="gray_btn">
          Trở lại
        </Link>
        <button className="blue_btn" onClick={sendEmail}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
