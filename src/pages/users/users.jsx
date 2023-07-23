// import React, { useEffect } from 'react';
import React, { useEffect, useState } from "react";
import Loading from "../loader/loading";
import { useParams } from "react-router-dom";
import styles from "./users.module.css";
import  {toast} from "react-toastify"
const User = () => {
  const { userId } = useParams(); // Access the specific 'id' value from 'useParams'
  console.log(userId);

  // showing the useralbum state
  const [userAlbums, setUserAlbums] = useState([]);
  // post state
  const [post, setPost] = useState("");
  // id of the album that needs to be updated
  const [idOfUpdatedPost, setIdOfUpdatedPost] = useState(null);
  // state to tell weathr the id should be updated or not
  const [isPostUpdated, setIsPostUpdated] = useState(false);
  // loading state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserAlbums(data);
        setLoading(false)
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.trim() === "") {
      // If the post is empty or contains only whitespace characters
      return;
    }
    // making a post request
    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify({
        title: post,
        userId: userId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setUserAlbums((prevAlbums) => [...prevAlbums, json]);
        setPost(" ");
        toast.success("Post created successfully")
      });
  };

  const updateClick = (id, title) => {
    setIsPostUpdated(true);
    setIdOfUpdatedPost(id);
    setPost(title);
  };

  // making the put request
  const editPost = (e, id) => {
    e.preventDefault();
    fetch(`https://jsonplaceholder.typicode.com/albums?id=${id}`, {
      method: "put",
      body: JSON.stringify({
        id: id,
        title: post,
        userId: userId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setUserAlbums((prevAlbums) => {
          return prevAlbums.map((album) => {
            if (album.id === id) {
              // Replace the album with updated data
              album.title = post;
              return album;
            } else {
              return album;
            }
          });
        });
        setPost("");
        setIsPostUpdated(false);
        toast.success(`Album updated successfully at ${id}`)
      });
  };
  // making delete request
  const deleteAlbum = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/albums?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => {
        setUserAlbums((prevState) => {
          return prevState.filter((a) => {
            return a.id !== id;
          });
        });
        toast.success(`Post deleted successfully of id: ${id}`)
      });
  };
  return (
    <div>
      <div className={styles.formContainer}>
        <form
          className="row g-3"
          // showing the edit or post button on the return value of isPostUpdated
          onSubmit={
            isPostUpdated ? (e) => editPost(e, idOfUpdatedPost) : handleSubmit
          }
        >
          <div className="col-auto">
            <label for="inputPassword2" className="visually-hidden">
              Password
            </label>
            <input
              type="text"
              className="form-control"
              id="inputPassword2"
              placeholder="Make a post"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              required
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-success mb-3">
              {isPostUpdated ? "Edit Post" : "Post"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <div>
          <h2>Albums of User {userId}</h2>
          {loading ? <Loading/> :
          <ul className={styles.cardList}>
            {userAlbums.map((album) => (
              <li key={album.id} className={styles.cardListitem}>
                <div className="card" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">{album.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      ID: {album.id}
                    </h6>
                    <span className={styles.btnSpan}>
                      <button
                        className="btn btn-primary mb-3"
                        onClick={() => updateClick(album.id, album.title)}
                      >
                        Update
                      </button>
                    </span>
                    <span>
                      <button
                        className="btn btn-danger mb-3"
                        onClick={() => deleteAlbum(album.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>}
        </div>
      </div>
    </div>
  );
};

export default User;
