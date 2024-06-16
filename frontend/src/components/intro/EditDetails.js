import { useState } from "react";
import Detail from "./Detail";
import { saveProfileDetail } from "../../function/user";
import { useSelector } from "react-redux";

export default function EditDetails({ setOpenEditBox, setRefreshDetails}) {
  const [inputValue, setInputvalue] = useState({
    bio:'',
    otherName:'',
    job:'',
    workplace:'',
    highschool:'',
    living:'',
    hometown:'',
    relationship:'',
  })

  const { user } = useSelector(state=> ({...state}))

  const cancelHandler = async ()=>{
    setOpenEditBox(false)
  }
  const saveHandler = async ()=>{
    saveProfileDetail(inputValue,user.token)
    setTimeout(()=>{
      setRefreshDetails(prev => !prev)
    },500)
    setOpenEditBox(false)
  }

  const inputHandler = async (e)=>{
    setInputvalue({...inputValue, [e.target.name]: e.target.value})
  }

  return (
    <div className="blur">
      <div className="postBox infosBox">
        <div className="box_header">
          <div className="small_circle" onClick={cancelHandler}>
            <i className="exit_icon"></i>
          </div>
          <span>Chỉnh sửa chi tiết</span>
        </div>
        <div className="details_wrapper scrollbar">
          <div className="details_col">
            <span>Chỉnh sửa thông tin cá nhân của bạn</span>
            <span>Thông tin của bạn sẽ được công khai</span>
          </div>
          <Detail
            header="Giới thiệu"
            img="studies"
            placeholder="Giới thiệu"
            name="bio"
            inputHandler={inputHandler}
          />
          <Detail
            header="Tên khác"
            img="studies"
            placeholder="Tên khác"
            name="otherName"
            inputHandler={inputHandler}
          />
          <Detail
            header="Công việc"
            img="studies"
            placeholder="Công việc"
            name="job"
            inputHandler={inputHandler}
          />
          <Detail
            header="Nơi làm việc"
            img="studies"
            placeholder="Nơi làm việc"
            name="workplace"
            inputHandler={inputHandler}
          />
          <Detail
            header="Trường học"
            img="studies"
            placeholder="Trường học"
            name="highschool"
            inputHandler={inputHandler}
          />
          <Detail
            header="Mối quan hệ"
            img="studies"
            placeholder="Mối quan hệ"
            name="relationship"
            inputHandler={inputHandler}
          />
          <Detail
            header="sinh sống"
            img="studies"
            placeholder="sinh sống"
            name="living"
            inputHandler={inputHandler}
          />
          <Detail
            header="Quê nhà"
            img="studies"
            placeholder="Quê nhà"
            name="hometown"
            inputHandler={inputHandler}
          />
          <div className="flex flex_right">
            <button className="gray_btn" onClick={ cancelHandler }>Hủy</button>
            <button className="blue_btn" onClick={ saveHandler }>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
