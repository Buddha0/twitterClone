"use client"
import styles from "./posts.module.css";
import Image from "next/image";
import Moment from "react-moment";
import { AiFillHeart } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai"
import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"



export default function Posts({ post, user }) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState([])
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "posts", post.id, "likes"),
            (snapshot) => {
                const likesArr = [];
                snapshot.forEach((doc) => {

                    likesArr.push({ ...doc.data(), id: doc.id });
                    setLikes(likesArr)
                });

                console.log("likes array:", likesArr);
            }
        );



    }, [db]);

    useEffect(() => {
        const isLiked = likes.map(like => like.id).includes(user?.uid);
        console.log(isLiked)
        setLiked(isLiked);
    }, [likes]);


    async function likePost() {
        const likeRef = doc(db, "posts", post.id, "likes", user.uid);

        if (liked) {
            await deleteDoc(likeRef).then(() => {
                setLiked(false); // Update state immediately after successful deletion
            });
        } else {
            await setDoc(likeRef, {
                name: user.displayName
            });
            setLiked(true); // Update state immediately after successful addition
        }
    }


    useEffect(() => {
        console.log(likes)
    }, [likes])

    return (
        <>
            <div className={styles.posts}>
                <div className={styles.post_card}>
                    <div className={styles.left}>
                        <Image
                            src={post?.photo}
                            width={50}
                            height={50}
                            className="profile"
                        ></Image>
                    </div>

                    <div className={styles.right}>

                        <div className={styles.post_infos_container}>
                            <div className={styles.usernames}>
                                <p>{post.name} ~</p>
                                <p> <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                                </p>


                            </div>
                            <div className="options">Options</div>
                        </div>


                        <div className={styles.caption}>
                            <p>{post.text}</p>
                        </div>
                        {post.image && <div className={styles.thePost}>
                            <Image
                                src={post?.image}
                                width={400}
                                height={400}
                                className={styles.post_img}
                            />
                        </div>}
                        <div className={styles.likeOptions}>
                            <div className={styles.likeOnlyContainer}>
                                <AiFillHeart className={liked ? styles.heartClicked : styles.heart} onClick={likePost} />
                                {<p className={liked && styles.red}>{likes.length}</p>}
                            </div>

                            <AiFillDelete className={styles.delete} />
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
}
