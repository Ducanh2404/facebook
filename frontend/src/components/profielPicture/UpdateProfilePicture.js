import axios from "axios";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useSelector } from "react-redux";
import { createPost } from "../../function/post";
import getCroppedImg from "../../helpers/getCroppedImg";
import { uploadImages } from "../../function/uploadImages";
import { updateprofilePicture } from "../../function/user";
import PulseLoader from "react-spinners/PulseLoader";
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

export default function UpdateProfilePicture({ setImage, image, setError, setShow, setRefresh }) {
  const [description, setDescription] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const slider = useRef(null);
  const dispatch = useDispatch()

  const { user } = useSelector((state) => ({ ...state }));

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(slider.current.value);
  };

  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(slider.current.value);
  };

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
          console.log("just show");
        } else {
          console.log("not show");
          console.log(img);

          return img;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [croppedAreaPixels]
  );

  const updateProfielPicture = async () => {
    try {
      setLoading(true)
      let img = await getCroppedImage();
      let blob = await fetch(img).then((b) => b.blob());
      const path = `${user.username}/profile_pictures`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      const res = await uploadImages(formData, path, user.token);
      const updated_picture = await updateprofilePicture(
        res[0].url,
        user.token
      );
      if (updated_picture === "ok") {
        const new_post = await createPost(
          "profilePicture",
          description,
          res,
          user.id,
          user.token
        );
        if (new_post === "ok") {
          setLoading(false)
          setImage("")
          dispatch({
            type: 'UPDATE_PROFILE_PICTURE',
            payload: {
              picture: res[0].url
            }
          })
          Cookies.set('user',JSON.stringify({
            ...user,
            picture: res[0].url
          }))
          setRefresh(prev =>!prev)
          setShow(false)
        } else {
          setLoading(false)
          setError(new_post);
        }
      } else {
        setLoading(false)
        setError(updated_picture);
      }
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message);
    }
  };

  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div className="small_circle" onClick={() => setImage("")}>
          <i className="exit_icon"></i>
        </div>
        <span>Cập nhật ảnh cá nhân</span>
      </div>
      <div className="update_image_desc">
        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea_blue details_input"
        ></textarea>
      </div>

      <div className="update_center">
        <div className="crooper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            cropShape="round"
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>
        <div className="slider">
          <div className="slider_circle hover1" onClick={() => zoomOut()}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.2}
            ref={slider}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
          <div className="slider_circle hover1" onClick={() => zoomIn()}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>
      <div className="flex_up">
        <div className="gray_btn" onClick={() => getCroppedImage("show")}>
          <i className="crop_icon"></i>Cắt ảnh
        </div>
      </div>
      <div className="flex_p_t">
        <i className="public_icon"></i>
        Ảnh đại diện của bạn sẽ đăng công khai
      </div>
      <div className="update_submit_wrap">
        <div className="blue_link" onClick={() => setImage("")}>Hủy</div>
        <button className="blue_btn" onClick={() => updateProfielPicture()} disable={loading}>
          {loading ? <PulseLoader color="#fff" size={5} /> : "Lưu"}
        </button>
      </div>
    </div>
  );
}
