import LeftLink from "./LeftLink";
import "./style.css";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
export default function LeftHome({ user }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="left_home scrollbar">
      <Link to="/profile" className="left_link hover1">
        <img src={user?.picture} alt="" />
        <span>
          {user?.first_name} {user?.last_name}
        </span>
      </Link>
      {left.slice(0, 8).map((link, i) => (
        <LeftLink
          key={i}
          img={link.img}
          text={link.text}
          notification={link.notification}
        />
      ))}
      { !visible && <div className="left_link hover1" onClick={()=> setVisible(true)}>
        <div className="small_circle">
          <ArrowDown1 />
        </div>
        <span>Xem thêm</span>
      </div>}
      {visible && left.slice(8).map((link, i) => (
        <LeftLink
          key={i}
          img={link.img}
          text={link.text}
          notification={link.notification}
        />
      ))}
      {visible && <div className="left_link hover1" onClick={()=> setVisible(false)}>
        <div className="small_circle rotate180">
          <ArrowDown1 />
        </div>
        <span>Show less</span>
      </div>}
    </div>
  );
}
