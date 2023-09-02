import styles from "./main.module.css"
import Profile from "../profile/profile";
import Posts from "../posts/posts";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilState } from "recoil";
import { postState } from "@/app/recoil/modalAtom";




export default function Main({ user }) {
 
  const [post,setPost] = useRecoilState(postState)

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

        setPost(postsArr)

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

      <AnimatePresence>
        {post.map((post) => {
          return (
            <motion.div
            key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{opacity:0}}
              transition={{ duration: 0.5, delay: 0.3 }}

            >

              <Posts user={user} id = {post.id} post = {post}/>
            </motion.div>

          )
        })}
      </AnimatePresence>



    </div>
  );
}
