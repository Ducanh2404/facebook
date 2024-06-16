import { useEffect, useState } from "react";
import { listFriend } from "../../../function/user";
import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import "./style.css";
export default function RightHome({ user }) {
  const [listOfFriend, setListOfFriend] = useState([])
  const getListFriend = async ()=>{
    const friends = await listFriend(user.id,user.token)
    setListOfFriend(friends)
  }

  useEffect(()=>{
    getListFriend()
  },[])
  const color = "#65676b";
  return (
    <div className="right_home">
      <div className="heading">TVIBE</div>
      <div className="splitter1"></div>
      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contacts_header_left">Bạn bè</div>
          <div className="contacts_header_right">
            <div className="contact_circle hover1">
              <NewRoom color={color} />
            </div>
            <div className="contact_circle hover1">
              <Search color={color} />
            </div>
            <div className="contact_circle hover1">
              <Dots color={color} />
            </div>
          </div>
        </div>
        <div className="contacts_list">
          {listOfFriend.length > 0 && listOfFriend[0] !== null && listOfFriend.map((userFriend,index)=>{
            return <Contact key={index} user={userFriend} />
          })}
        </div>
      </div>
    </div>
  );
}
