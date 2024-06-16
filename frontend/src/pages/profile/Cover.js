import { useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";

export default function Cover({ cover, user, eachUserProfile }) {
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setShowCoverMenu(false));
  return (
    <div className="profile_cover">
      {cover && <img src={cover} className="cover" alt="" />}
      {user.id === eachUserProfile._id &&
        <div className="udpate_cover_wrapper">
          <div
            className="open_cover_update"
            onClick={() => setShowCoverMenu((prev) => !prev)}
          >
            <i className="camera_filled_icon"></i>
            Thêm ảnh bìa
          </div>
          {showCoverMenu && (
            <div className="open_cover_menu" ref={menuRef}>
              <div className="open_cover_menu_item hover3">
                <i className="photo_icon"></i>
                Chọn ảnh
              </div>
              <div className="open_cover_menu_item hover3">
                <i className="upload_icon"></i>
                Tải ảnh lên
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
}
