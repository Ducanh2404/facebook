import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import "./style.css";
import CreatePost from "../../components/createPost";
import Post from "../../components/post";
import { Following } from "../../components/home/following";

export default function Home({ setVisible, posts, setRefresh, setIsFollowing, isFollowing }) {
  const { user } = useSelector((user) => ({ ...user }));

  return (
    <div className="home">
      <Header page="home" />
      <LeftHome user={user} />
      <div className="home_middle">
        {/* <Stories /> */}
        <Following user={user} setIsFollowing={setIsFollowing} isFollowing={isFollowing} />
        <CreatePost user={user} setVisible={setVisible}/>
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} setRefresh={setRefresh}/>
          ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  );
}
