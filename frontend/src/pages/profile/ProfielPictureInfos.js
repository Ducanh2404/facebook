import { useState } from "react";
import ProfilePicture from "../../components/profielPicture";
import { useSelector } from "react-redux";
import Friendship from "./Friendship";

export default function ProfielPictureInfos({ profile, setRefresh, eachUserProfile, setOpenEditBox }) {
  const [show, setShow] = useState(false);
  const { user } = useSelector(state=> ({...state}))

  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture setShow={setShow} setRefresh={setRefresh} />}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile?.picture})`,
            }}
          ></div>
          {user.id === eachUserProfile._id && 
            <div className="profile_circle hover1" onClick={() => setShow(true)}>
              <i className="camera_filled_icon"></i>
            </div>
          }
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile?.first_name} {profile?.last_name}
            <div className="othername"></div>
          </div>
          <div className="profile_friend_count"></div>
          <div className="profile_friend_imgs"></div>
        </div>
      </div>
      {user.id === eachUserProfile._id ? 
        (<div className="profile_w_right">
          <div className="gray_btn">
            <i className="edit_icon"></i>
            <span onClick={()=>setOpenEditBox(true)}>Chỉnh sửa thông tin</span>
          </div>
        </div>) : <Friendship friendshipData={profile.friendship} profileId={profile._id} profile={profile}/>
      }
    </div>
  );
}
