import React from 'react'
import { deletPost } from '../../function/post';

const MenuItem = ({ icon, title, subtitle, img, removePost  }) => {
  return (
    <li className="hover3" onClick={removePost}>
        {
          img ? <img src={img} /> : <i className={icon}></i>
        }
        <div className="post_menu_text">
            <span>{title}</span>
            {subtitle && <span className='menu_post_col'> {subtitle} </span>}
        </div>
    </li>
  )
}

export default MenuItem
