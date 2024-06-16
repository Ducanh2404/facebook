import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { acceptRequest, addFriend, cancelRequest, deleteRequest, follow, unfollow, unfriend } from "../../function/user";
import { useSelector } from "react-redux";
import ChatBox from "./ChatBox";

export default function Friendship({ friendshipData, profileId, profile }) {
  const [friendship, setFriendship] = useState(friendshipData)
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const { user } = useSelector(state=> ({...state}))
  const menu = useRef(null);
  const menu1 = useRef(null);
  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));

  const openChatBox = () => {
    setShowChatBox(true);
  };

  const closeChatBox = () => {
    setShowChatBox(false);
  };

  useEffect(()=>{
    setFriendship(friendshipData)
  },[friendshipData])
  
  const addFriendHandler = async ()=>{
    setFriendship({...friendship, following:true, requestSent: true})
    await addFriend(profileId,user.token)
  }

  const cancelRequestHandler = async ()=>{
    setFriendship({...friendship, following:false, requestSent: false})
    await cancelRequest(profileId,user.token)
  }

  const followHandler = async ()=>{
    setFriendship({...friendship, following:true})
    await follow(profileId,user.token)
  }
  
  const unfollowHandler = async ()=>{
    setFriendship({...friendship, following:false})
    await unfollow(profileId,user.token)
  }

  const conFirmRequestHandler = async ()=>{
    setFriendship({...friendship, friends:true, requestReceived:false, following:true})
    await acceptRequest(profileId,user.token)
  }

  const unfriendHandler = async ()=>{
    setFriendship({...friendship, friends:false, following:false})
    await unfriend(profileId,user.token)
  }

  const deleteRequestHandler = async ()=>{
    setFriendship({...friendship, friends:false, following:false, requestReceived:false})
    await deleteRequest(profileId,user.token)
  }

  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <img src="../../../icons/friends.png" alt="" />
            <span>Bạn bè</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={menu}>
              {friendship?.following ? (
                <div className="open_cover_menu_item hover3" onClick={unfollowHandler}>
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Bỏ theo dõi
                </div>
              ) : (
                <div className="open_cover_menu_item hover3" onClick={followHandler}>
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div className="open_cover_menu_item hover3" onClick={unfriendHandler}>
                <i className="unfriend_outlined_icon"></i>
                Xóa bạn bè
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={addFriendHandler}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Kết bạn</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={cancelRequestHandler}>
          <img
            src="../../../icons/cancelRequest.png"
            className="invert"
            alt=""
          />
          <span>Hủy yêu cầu kết bạn</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="" />
              <span>Phản hồi</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={menu1}>
                <div className="open_cover_menu_item hover3" onClick={conFirmRequestHandler}>Đồng ý</div>
                <div className="open_cover_menu_item hover3" onClick={deleteRequestHandler}>Xóa yêu cầu</div>
              </div>
            )}
          </div>
        )
      )}
      {friendship?.following ? (
        <button className="gray_btn" onClick={unfollowHandler}>
          <img src="../../../icons/follow.png" alt=""/>
          <span>Đang Theo dõi</span>
        </button>
      ) : (
        <button className="blue_btn" onClick={followHandler}>
          <img src="../../../icons/follow.png" className="invert" alt="" />
          <span>Theo dõi</span>
        </button>
      )}
      <button className={friendship?.friends ? "blue_btn" : "gray_btn"} onClick={openChatBox}>
        <img
          src="../../../icons/message.png"
          className={friendship?.friends && "invert"}
          alt=""
        />
        <span>Nhắn tin</span>
      </button>
      {showChatBox && (
        <ChatBox user={user} friendUserId={profileId} onClose={closeChatBox} profile={profile} />
      )}
    </div>
  );
}
