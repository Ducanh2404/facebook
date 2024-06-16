import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactPopup from "./ReactPopup";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import Picker  from "emoji-picker-react";
import PostMenu from "./PostMenu";
import { useSelector } from "react-redux";
import { comment, getCommentsBelongToPost, getReacts, totalComment, getTotalReact } from '../../function/post'
import Comment from "./Comment";

export default function Post({ post, setRefresh }) {
  const [visible, setVisible] = useState(false)
  const [visibleComment, setVisibleComment] = useState(false)
  const [visibleEmoji, setVisibleEmoji] = useState(false)
  const [cursorPosition, setCursorPosition] = useState();
  const [text, setText] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [comments, setComments] = useState(post?.comments)
  const [react, setReact] = useState()
  const [check, setCheck] = useState()
  const [commentAmount, setCommentAmount] = useState(0)
  const [reactInfo ,setReactInfo] = useState()
  const textRef = useRef(null)

  const { user } = useSelector(state=> ({...state}))
  const getComment = async ()=>{
    const commentAmmount = await totalComment(post._id, user.token)
    setCommentAmount(commentAmmount.totalComment)
  }

  const getPostReacts = async ()=>{
    const res = await getReacts(post._id, user.token)
    setReact(res.reacts)
    setCheck(res.check)
  }

  const getTotalPostReact = async ()=>{
    const res = await getTotalReact(post._id, user.token)
    setReactInfo(res.totalReact.length)
  }

  useEffect(()=>{
    getPostReacts()
  },[])

  useEffect(() => {
    setComments(post?.comments);
  }, [post]);

  useEffect(()=>{
    getComment()
  },[comments])

  useEffect(()=>{
    getTotalPostReact()
  },[check])

  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const handleComment = async (e)=>{
    if(e.key === "Enter"){
      setText('')
      const data = await comment(post._id, text, user.token)
      setComments(data)
    }
  }

  return (
    <div className="post">
      <div className="post_header">
        <Link
          to={`/profile/${post?.user?.username}`}
          className="post_header_left"
        >
          <img src={post?.user?.picture} alt="" />
          <div className="header_col">
            <div className="post_profile_name">
              {post?.user?.first_name} {post?.user?.last_name}
              <div className="updated_p">
                {post?.type == "profilePicture" &&
                  `đã cập nhật ảnh cá nhân của ${
                    post?.user?.gender === "male" ? "anh ấy" : "cô ấy"
                  }`}
                {post?.type == "cover" &&
                  `updated ${
                    post?.user?.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post?.createdAt}
              </Moment>
              . <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div className="post_header_right hover1" onClick={()=>setShowMenu(prev => !prev)}>
          <Dots color="#828387" />
        </div>
      </div>
      <div className="post_body">
        <div className="post_text">
          {post?.text}
        </div>
        <div className={
                post?.images?.length === 1
                  ? "grid_1"
                  : post?.images?.length === 2
                  ? "grid_2"
                  : post?.images?.length === 3
                  ? "grid_3"
                  : post?.images?.length === 4
                  ? "grid_4"
                  : post?.images?.length >= 5 && "grid_5"
              }
          >
          {post?.images?.map((image, index)=>{
            return <img src={image.url} className={`img-${index}`} alt=""/>
          })}                 
        </div>
      </div>
      <div className="post_bottom">
          <div className="post_info">
            <div className="react_total">{reactInfo} react</div>
            <div className="comment">{commentAmount} bình luận</div>
            <div className="share">0 chia sẻ</div>
          </div>
          <div className="post_react">
            {/* <ReactPopup visible={visible} setVisible={setVisible}/> */}
            <div className="post_action" onMouseOver={()=>{
              setTimeout(()=>{
                setVisible(true)
              },500)
            }} onMouseLeave={()=>{
              setTimeout(()=>{
                setVisible(false)
              },500)
            }}>
              <ReactPopup visible={visible} setVisible={setVisible} postId={post?._id} user={user} check={check} setCheck={setCheck} />
              {check ? <img src={`../../../reacts/${check}.svg`} alt='' className="react_icon"/>:<i className="like_icon"></i>}
              {check ? <span>{check}</span> :<span>Thích</span>}
            </div>
            <div className="post_action" onClick={()=>{
                setVisibleComment(prev => !prev)
              }}>
              <i className="comment_icon"></i>
              <span>Bình luận</span>
            </div>
            <div className="post_action">
              <i className="share_icon"></i>
              <span>Chia sẻ</span>
            </div>
          </div>
          {visibleComment && (<div className="post_comment">
            <div className="comment_box">
              <div className="img_user">
                <img src={user?.picture} />
              </div>
              <div className="box_chat">
                <textarea onKeyUp={handleComment} type="text" className="input_chat" placeholder="Bạn đang nghĩ gì..." ref={textRef} value={text} onChange={(e) => setText(e.target.value)}/>
                <div className="list-icon">
                  <div className="comment-circle-icon">
                    <i className="emoji_icon" onClick={()=>setVisibleEmoji(prev => !prev)}></i>
                    <div className="emoji_picker">
                      {visibleEmoji && <Picker onEmojiClick={handleEmoji}/>}
                    </div>
                  </div>       
                  <div className="comment-circle-icon">
                    <i className="camera_icon"></i>
                  </div>    
                  <div className="comment-circle-icon">
                    <i className="gif_icon"></i>
                  </div>    
                  <div className="comment-circle-icon">
                    <i className="sticker_icon"></i>
                  </div>        
                </div>
                <div className="send_button">
                  <IoMdSend color="#1876f2" fontSize="1.5em"/>
                </div>
              </div>
            </div>
          </div>)}
      </div>
      {comments && visibleComment && comments.map((comment,i)=> <Comment comment={comment} key={i} />)} 
      {showMenu && <PostMenu userId={user.id} postUserId={post.user._id} imagesLength={post?.images?.length} postId={post._id} userToken = {user.token} setShowMenu={setShowMenu} setRefresh={setRefresh} />}
    </div>
  );
}
