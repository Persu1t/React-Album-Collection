import React, { useEffect, useState } from "react";
import Loading from "../loader/loading";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
const Home = () => {
  // initilization of state
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetching all the users on initial render
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((response) => response.json())
      .then((data) => {
        // filtering the userId 1-10
        const uniqueUsers = [...new Set(data.map((item) => item.userId))].slice(
          0,
          10
        );
        const filteredData = data.filter(
          (item, index, array) =>
            uniqueUsers.includes(item.userId) &&
            array.findIndex((el) => el.userId === item.userId) === index
        );
        setUsersData(filteredData);
        setLoading(false);
      })
      // error if any
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <h1>React Album Collection</h1>
      {/* if loding true showing loding else showing the users */}
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          <div className={styles.linkContainer}>
            {usersData.map((album) => (
              <div key={album.userId}>
                <h2>
                  <Link className={styles.links} to={`${album.userId}`}>
                    User: {album.userId}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
