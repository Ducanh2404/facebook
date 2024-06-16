import { Feeling, LiveVideo, Photo } from "../../svg";
import UserMenu from "../header/userMenu";
import "./style.css";
export default function CreatePost({user, setVisible, eachUserProfile, margin }) {
  return (
    eachUserProfile && user.id === eachUserProfile._id ? (
      <div className={`createPost ${margin ? 'fix_margin' : ''}`}>
        <div className="createPost_header">
          <img src={eachUserProfile?.picture || user?.picture} alt="error" />
          <div className="open_post hover2" onClick={ ()=> setVisible(true) }>
            Hãy đăng gì đó đi, {eachUserProfile?.first_name}
          </div>
        </div>
        <div className="create_splitter"></div>
        <div className="createPost_body">
          <div className="createPost_icon hover3">
            <LiveVideo color="#f3425f" />
            Live Video
          </div>
          <div className="createPost_icon hover3">
            <Photo color="#4bbf67" />
            Ảnh/Video
          </div>
          <div className="createPost_icon hover3">
            <Feeling color="#f7b928" />
            Cảm giác/Hoạt động
          </div>
        </div>
      </div>
    ):eachUserProfile && user.id !== eachUserProfile._id ? "":(
      <div className={`createPost ${margin ? 'fix_margin' : ''}`}>
        <div className="createPost_header">
          <img src={eachUserProfile?.picture || user?.picture} alt="error" />
          <div className="open_post hover2" onClick={ ()=> setVisible(true) }>
            Hãy đăng gì đó đi, {user?.first_name}
          </div>
        </div>
        <div className="create_splitter"></div>
        <div className="createPost_body">
          <div className="createPost_icon hover3">
            <LiveVideo color="#f3425f" />
            Live Video
          </div>
          <div className="createPost_icon hover3">
            <Photo color="#4bbf67" />
            Ảnh/Video
          </div>
          <div className="createPost_icon hover3">
            <Feeling color="#f7b928" />
            Cảm giác/Hoạt động
          </div>
        </div>
      </div>
    )
  );
}
