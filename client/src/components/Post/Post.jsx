import React, { useState,useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length)
  const [userName,setUserName]=useState("")
  let dateObject=new Date(data.createdAt);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
  const day = dateObject.getDate();
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked? setLikes((prev)=>prev-1): setLikes((prev)=>prev+1)
  };
  const getUserName=async()=>{
    const url = `http://localhost:5000/user/getUserName/${data.userId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const userData = await response.json();
    
    setUserName(userData.firstname+" "+userData.lastname)
  }
  useEffect(()=>{
    getUserName();
  },[])
  return (
    <div className="Post">
      <div className="detail">
      <span><img src="http://localhost:5000/images/defaultProfile.png" alt="Profile" style={{width:"30px",height:"30px",borderRadius:"50%"}} />
      <span style={{position:"relative",top:"-8px",left:"6px"}}>{userName}</span>
      </span><br/>
        <br/>
        <span>
          <b>{data.name} </b>
        </span>
        <span><b>{data.title}</b></span>
        <br/>
        <span>{data.desc}</span>
      </div>
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="" />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      <span style={{ color: "var(--gray)", fontSize: "12px",float:"right" }}>Posted On: {day}-{month}-{year} ({dateObject.toLocaleTimeString()})</span>
      </span>
      
    </div>
  );
};

export default Post;
