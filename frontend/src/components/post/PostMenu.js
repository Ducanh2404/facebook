import React, { useRef, useState } from 'react'
import MenuItem from './MenuItem'
import useClickOutSide from "../../helpers/clickOutside";
import { deletPost } from '../../function/post';

const PostMenu = ({userId, postUserId, imagesLength, setShowMenu, postId, userToken, setRefresh }) => {
    const [myPost, setMyPost] = useState(userId === postUserId)
    const menu = useRef(null)
    useClickOutSide(menu, ()=>setShowMenu(false))
    
    const removePost = async () => {
        const data = await deletPost(postId, userToken);
        setRefresh(prev => !prev)
    };

    return (
        <ul className="post_menu" ref={menu}>
            {myPost && <MenuItem icon="pin_icon" title="Ghim bài" />}
            <MenuItem icon="save_icon" title="Lưu bài" />
            <div className="line"></div>
            {myPost && <MenuItem icon="edit_icon" title="Sửa bài" />}
            {imagesLength && <MenuItem icon="download_icon" title="Tải về" />}
            {myPost && (
                <MenuItem
                icon="trash_icon"
                title="Xóa bài"
                removePost={removePost}
                />
            )}
            {!myPost && <div className="line"></div>}
            {!myPost && (
                <MenuItem
                img="../../../icons/report.png"
                title="Báo cáo bài viết"
                subtitle="Tôi lo ngại về bài viết này"
                />
            )}            
        </ul>
    )
}

export default PostMenu
