import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutside";
import { search } from "../../function/user";
import { Link } from "react-router-dom";
export default function SearchMenu({ color, setShowSearchMenu, token }) {
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  const menu = useRef(null);
  const input = useRef(null);
  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });
  useEffect(() => {
    input.current.focus();
  }, []);

  const searchHandler = async ()=>{
    if(searchTerm.trim() === ''){
      setResults('')
    }else{
      const res = await search(searchTerm,token)
      setResults(res)
    }
  }

  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Tìm kiếm"
            ref={input}
            value={searchTerm}
            onChange={(e)=>{setSearchTerm(e.target.value)}}
            onKeyUp={searchHandler}
            onFocus={() => {
              setIconVisible(false);
            }}
            onBlur={() => {
              setIconVisible(true);
            }}
          />
        </div>
      </div>
      <div className="search_history_header">
        <span>Tìm kiếm gần đây</span>
        <a>Chỉnh sửa</a>
      </div>
      <div className="search_history"></div>
      <div className="search_results scrollbar">
        {
          results && results.map((user,index)=>{
            return <Link to={`profile/${user.username}`} key={index} className="search_user_item hover3">
              <img src={user.picture} alt="" />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link> 
          })
        }
      </div>
      <div className="search_results scrollbar"></div>
    </div>
  );
}
