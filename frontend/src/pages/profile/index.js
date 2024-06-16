import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { profileReducer } from "../../function/reducers";
import Header from "../../components/header";
import Cover from "./Cover";
import "./style.css"
import ProfielPictureInfos from "./ProfielPictureInfos";
import ProfileMenu from "./ProfileMenu";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";
import CreatePostPopup from "../../components/createPostPopup";
import { useState } from "react";
import Post from "../../components/post";
import { getUserPosts } from "../../function/post";
import Intro from "../../components/intro";

export default function Profile() {
  const [visible, setVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [refreshDetails, setRefreshDetails] = useState(false)
  const [openEditBox, setOpenEditBox] = useState(false)
  const [eachUserProfile, setEachUserProfile] = useState({})
  
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [posts, setPosts] = useState([])
  var userName = username === undefined ? user.username : username;
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });

  useEffect(() => {
    getProfile();
  }, [userName,refresh]);
  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (data.ok === false) {
        navigate("/profile");
      } else {
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  const userPosts = async ()=>{
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setEachUserProfile(data)
      const listPosts = await getUserPosts(data._id, user.token)
      setPosts(listPosts)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    userPosts()
  },[refresh])

  return (
    <div className="profile">
      <Header page="profile" setRefresh={setRefresh} />
      {openEditBox && <Intro openEditBox={openEditBox} setOpenEditBox={setOpenEditBox} setRefreshDetails={setRefreshDetails} />}
      <div className="profile_container">
        <div className="profile_top">
          <div className="profile_container">
            <Cover cover={profile.cover} user={user} eachUserProfile={eachUserProfile}/>
            <ProfielPictureInfos profile={profile} setRefresh={setRefresh} eachUserProfile={eachUserProfile} getProfile={getProfile} setOpenEditBox={setOpenEditBox} />
            <ProfileMenu />
          </div>
        </div>
        <div className="profile_body">
          {visible && <CreatePostPopup user={user} setVisible={setVisible} setRefresh={setRefresh}/>}
          <div className="body_left">
            <ProfileLeft user={user} refreshDetails={refreshDetails} profileId = {profile._id} />
          </div>
          <div className="body_right">
            <ProfileRight setVisible={setVisible} eachUserProfile={eachUserProfile}/>
            {posts.map(post=>{
              return <Post key={post._id} post={post} setRefresh={setRefresh}/>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
