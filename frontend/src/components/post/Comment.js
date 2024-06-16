import React from 'react'
import Moment from 'react-moment'

const Comment = ({ comment }) => {
  return (
    <div className='comment'>
      <div className="comment_col">
        <img src={comment.commentBy.picture} alt="" className="comment_img"/>
        <div className="comment_wrap">
            <div className="comment_name">
                {comment.commentBy.first_name} {comment.commentBy.last_name}
            </div>
            <div className="comment_text">{comment.comment}</div>
        </div>
      </div>
        <div className="comment_actions">
            <span>Like</span>
            <span>Reply</span>
            <span>
                <Moment fromNow interval={30}>
                {comment.commentAt}
                </Moment>
            </span>
        </div>
    </div>
  )
}

export default Comment
