"use client"
import styles from "./posts.module.css";
import Image from "next/image";
import Moment from "react-moment";
import { AiFillHeart, AiFillDelete, AiOutlineComment } from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi"
import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebaseConfig/firebaseConfig"
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/app/recoil/modalAtom";



export default function Posts({ user, post, id }) {


    const [openModal, setOpenModal] = useRecoilState(modalState)
    const [postId, setPostId] = useRecoilState(postIdState)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])



    useEffect(() => {
        if (id) {
            console.log("fukcccccc", id)
            const unsubscribe = onSnapshot(
                collection(db, "posts", id, "likes"),
                (snapshot) => {
                    const likesArr = [];
                    snapshot.forEach((doc) => {
                        likesArr.push({ ...doc.data(), id: doc.id });
                    });

                    // Update the likes state outside the loop
                    setLikes(likesArr);
                }
            );

            return () => {
                unsubscribe();
            };
        }



    }, [db, id]);

    useEffect(() => {
        if (id) {
            const unsubscribe = onSnapshot(
                collection(db, "posts", id, "comment"), (snapshot) => {
                    const commentArr = [];
                    snapshot.forEach((doc) => {
                        commentArr.push({ ...doc.data(), id: doc.id });
                    });

                    // Update the likes state outside the loop
                    setComments(commentArr);
                }
            );

            // Cleanup the subscription when the component unmounts
            return () => {
                unsubscribe();
            };
        }

    }, [db, id]);

    useEffect(() => {
        const isLiked = likes.map(like => like.id).includes(user?.uid);
        setLiked(isLiked);
    }, [likes]);


    async function likePost() {
        const likeRef = doc(db, "posts", id, "likes", user?.uid);

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

    async function handleDelete() {
        if (window.confirm("Are you sure you want to delete this? ")) {
            deleteDoc(doc(db, "posts", id))
            if (post.data.iamge) {
                deleteObject(ref(storage, `posts/${post?.id}/image`))
            }
        }
    }

    function openComment() {
        setPostId(id)
        setOpenModal(true)
    }


    return (
        <>
            <div className={styles.posts}>
                <div className={styles.post_card}>
                    <div className={styles.left}>
                        <Image
                            src={post?.data?.photo}
                            width={50}
                            height={50}
                            className="profile"
                        ></Image>
                    </div>

                    <div className={styles.right}>

                        <div className={styles.post_infos_container}>
                            <div className={styles.usernames}>
                                <p>{post?.data?.name} ~</p>
                                <p> <Moment fromNow>{post?.data?.timestamp?.toDate()}</Moment>
                                </p>


                            </div>
                            < FiMoreHorizontal />
                        </div>


                        <div className={styles.caption}>
                            <p>{post?.data?.text}</p>
                        </div>
                        {post?.data?.image && <div className={styles.thePost}>
                            <div className={styles.image_container}>
                                <Image
                                    src={post?.data?.image}
                             
                                    layout="fill"
                                    className={styles.post_img}
                                />
                            </div>

                        </div>}
                        <div className={styles.likeOptions}>
                            <div className={styles.likeOnlyContainer}>
                                <AiFillHeart className={liked ? styles.heartClicked : styles.heart} onClick={likePost} />
                                {<p className={liked && styles.red}>{likes.length}</p>}
                            </div>
                            {user?.uid === post?.data?.id && <AiFillDelete className={styles.delete} onClick={handleDelete} />}


                            <div className={styles.likeOnlyContainer}>
                                <AiOutlineComment onClick={openComment} className={styles.comment} />
                                {<p>{comments.length}</p>}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
