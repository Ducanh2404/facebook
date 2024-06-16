import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/login";
import Profile  from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useSelector } from "react-redux";
import { useEffect, useReducer, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { postsReducer } from "./function/reducers";
import FriendRequest from "./pages/friend/FriendRequest";

function App() {
  const [visible, setVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false);

  const { user } = useSelector(state=> ({...state}))
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  const socket = io(process.env.REACT_APP_BACKEND_URL);
  
  useEffect(() => {
    if(isFollowing){
      getFollowingPost()
    }else{
      getAllPosts();
    }

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [user, refresh, isFollowing]);

  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllposts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };

  const getFollowingPost = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getFollowingPost`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <div>
      {visible && <CreatePostPopup user={user} setVisible={setVisible} setRefresh={setRefresh}/>}
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element = {<LoggedInRoutes />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile setRefresh={setRefresh} />} />
          <Route path="/" element={<Home setVisible={setVisible} posts={posts} setRefresh={setRefresh} setIsFollowing={setIsFollowing} isFollowing={isFollowing} />} />
          <Route path="/friendRequest" element={<FriendRequest />} />
        </Route>
        <Route path='/activate/:token' element={<Activate />}/>
        <Route path='/reset' element={<Reset />}/>
      </Routes>
    </div>
  );
}

export default App;
