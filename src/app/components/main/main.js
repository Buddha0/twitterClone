import styles from "./main.module.css"
import Profile from "../profile/profile";
import Posts from "../posts/posts";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"
import { useEffect, useState } from "react";



export default function Main({ user }) {
  const [posts, setPosts] = useState([])

  //getting realtime update of the posts. if i post something it will show up right away.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const postsArr = [];
        snapshot.forEach((doc) => {

          postsArr.push({
            data: doc.data(),
            id: doc.id
          });

        });
        setPosts(postsArr);

      }
    );

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <h1>Home</h1>
      </div>

      <Profile user={user} />
      {posts.map((post) => {
        return <Posts post={post} user={user} />
      })}


    </div>
  );
}
