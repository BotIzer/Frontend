import { useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, ToggleButton } from "react-bootstrap";
import { DaysDifference } from "./ForumCard"; //<-- idk where to put this
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MyCarousel from "../components/MyCarousel";
export default function PostCard(post) {
  const navigate = useNavigate();
  const [opinion,setOpinion] = useState({isLiked: false, isDisLiked: false})
  const socket = io('http://localhost:3000', {
  withCredentials: true
});
  useEffect(()=> {
    socket.on('onOpinionChanged',(data)=>{
      console.log('Something changed');
      console.log(post.post);
    })
    return() =>{
      socket.disconnect();
      socket.removeAllListeners();
    }
  },[opinion,socket])
  useEffect(()=>{
    socket.emit('onOpinionChanged',{threadId: post.post._id.thread_id, 
      isLiked: opinion.isLiked, isDisLiked: opinion.isDisLiked, userToken: localStorage.getItem('token')})
    
  },[opinion])
  const LikedThread = (()=>{
    setOpinion({isLiked: !opinion.isLiked, isDisLiked: false})
  })
  const DislikedThread = (()=>{
    setOpinion({isLiked: false, isDisLiked: !opinion.isDisLiked})
  })
  return (
    <Card className="text-center p-0 m-3" data-bs-theme="dark" xs={12} md={6}>
      <Card.Header className="primary">{post.post.name}</Card.Header>
      <Card.Body className="secondary h-auto" style={{ minHeight: "200px" }}>
        <Card.Text>{post.post.content}</Card.Text>{" "}
        {/* TODO: DO SOMETHING WHEN IT'S EMPTY */}
        <MyCarousel images={post.post.image_array ? post.post.image_array : ['Nothing']}></MyCarousel>
        {/*TODO make text cut out if longer than space provided or make it scrollable?*/}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col xs={3}>
            <ToggleButton
              id={post.post._id && post.post._id.thread_id + "like"}
              className="image-checkbox position-relative"
              type="checkbox"
              variant="secondary"
              checked={opinion.isLiked}
              value="1"
              onChange={() => LikedThread()}
            >
              <img
                src="/src/assets/icons/fist_bump_64.png"
                alt="fist-bump"
                className={opinion.isLiked ? "filter-gold" : "filter-grey"}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {post.post.likes.count}
              </span>{" "}
            </ToggleButton>

            </Col>
            <Col xs={3}>
              <ToggleButton
                id={post.post._id && post.post._id.thread_id + "dislike"}
                className="image-checkbox position-relative"
                type="checkbox"
                variant="secondary"
                checked={opinion.isDisLiked}
                value="1"
                onChange={() => DislikedThread()}
              >
                <img
                  src="/src/assets/icons/lightning_64.png"
                  alt="skull"
                  className={opinion.isDisLiked ? "filter-red" : "filter-grey"}
                />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                  {post.post.dislikes.count}
                </span>
              </ToggleButton>
            </Col>
          <Col xs={6} className="text-end">
            <Button
              className="comments-button tertiary position-relative h-100" /*onClick={() => navigate("/post/comments")} TODO make this navigate to comment section*/
            >
              Comments
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {/* TODO: ADD THIS TO DATABASE */}
                {post.post.comment_count}
              </span>
            </Button>
          </Col>
        </Row>
      </Card.Footer>
      <Card.Footer className="text-muted">
        Posted {DaysDifference(new Date(),post.post.creation_date)} days ago
      </Card.Footer>
    </Card>
  );
}
