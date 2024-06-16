import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import PulseLoader from 'react-spinners/PulseLoader'
import useClickOutSide from "../../helpers/clickOutside";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { createPost } from "../../function/post";
import { uploadImages } from "../../function/uploadImages";

export default function CreatePostPopup({ user, setVisible, setRefresh }) {
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false)
  const popup = useRef(null)

  useClickOutSide(popup, ()=>{
    setVisible(false)
  })

  const postSubmit = async ()=>{
    if(images && images.length){
      setLoading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });

      const path = `${user.username}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });

      const response = await uploadImages(formData, path, user.token); 
      await createPost(null, text, response, user.id, user.token);

      setLoading(false);
      setText("");
      setImages("");
      setVisible(false);
    }
    else if (text) {
      setLoading(true);
      const response = await createPost(
        null,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (response === "ok") {
        setText("");
        setVisible(false);
      }
    }
    else {
      console.log("nothing");
    }
    setRefresh(prev=>!prev)
  }

  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        <div className="box_header">
          <div className="small_circle" onClick={()=>setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Công khai</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev}/>
        <button className="post_submit" onClick={postSubmit} disabled={loading}>
          {loading ? <PulseLoader color="#fff" size={5} /> : "Đăng bài"}
        </button>
      </div>
    </div>
  );
}
