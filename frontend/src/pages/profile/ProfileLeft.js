import { useEffect, useState } from "react";
import { FaHeart, FaFlag  } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { getProfileDetail } from "../../function/user";

export default function ProfileLeft({ user, refreshDetails, profileId }){
    const [details, setDetails] = useState({})

    const getDetailsData = async ()=>{
        const data = await getProfileDetail(profileId,user.token)
        setDetails(data)
    }

    useEffect(()=>{
        getDetailsData()
    },[refreshDetails, profileId])

    return (
        <div className="left_container">
            <div className="introduce">
                <span class="introduce_title">Giới thiệu</span>
                <div className="detail">
                    <span>{!details?.bio ? 'Chưa có thông tin về Bio' : details.bio}</span>
                </div>
                <div className="button_edit">
                    <button>Chỉnh sửa</button>
                </div>
                <div className="info_profile">
                    <img src="../../../icons/job.png" />
                    <span>{!details?.job ? 'Chưa có thông tin về công việc' : `Công việc: ${details.job}`}</span>
                </div>
                <div className="info_profile">
                    <BsPersonWorkspace style={{ color: "#666666" }} size={20} />
                    <span>{!details?.workplace ? 'Chưa có thông tin về nơi làm việc' : `Đang làm việc tại ${details.workplace}`}</span>
                </div>
                <div className="info_profile">
                    <img src="../../../icons/studies.png" />
                    <span>{!details?.highschool ? 'Chưa có thông tin về trường' : `Đã học tại ${details.highschool}`}</span>
                </div>
                <div className="info_profile">
                    <img src="../../../icons/home.png" />
                    <span>{!details?.living ? 'Chưa có thông tin về nơi ở' : `Sinh sống tại ${details.living}`}</span>
                </div>
                <div className="info_profile">
                    <FaFlag style={{ color: "#666666" }} size={20} />
                    <span>{!details?.hometown ? 'Chưa có thông tin về đất nước' : `Quê hương: ${details.hometown}`}</span>
                </div>
                <div className="info_profile">
                    <MdOutlineDriveFileRenameOutline style={{ color: "#666666" }} size={20} />
                    <span>{!details?.otherName ? 'Chưa có thông tin về tên phụ' : `Tên phụ: ${details.otherName}`}</span>
                </div>
                <div className="info_profile">
                    <FaHeart style={{ color: "#666666" }} size={20} />
                    <span className="married">{!details?.relationship ? 'Chưa có thông tin tình trạng quan hệ' : details.relationship}</span>
                </div>
            </div>
            <div className="picture">

            </div>
        </div>
    )
}