"use client"
import styles from "../posts/posts.module.css";
import Image from "next/image";
import Moment from "react-moment";
import { AiFillHeart,AiFillDelete,AiOutlineComment } from "react-icons/ai";
import {  FiMoreHorizontal } from "react-icons/fi"
import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"
import { useRecoilState } from "recoil";
import { modalState, postIdState} from "@/app/recoil/modalAtom";



export default function Posts({ comment,commentId,originalPostId,user}) {


    const [openModal, setOpenModal] = useRecoilState(modalState)
    const [postId, setPostId] = useRecoilState(postIdState)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState([])
    
  


    useEffect(() => {
        if(originalPostId){
         
            const unsubscribe = onSnapshot(
                collection(db, "posts", originalPostId, "comment",commentId,"likes"),
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
   
      
        
      }, [db,originalPostId,commentId]);

 

    useEffect(() => {
        const isLiked = likes.map(like => like.id).includes(user?.uid);
        setLiked(isLiked);
    }, [likes]);


    async function likePost() {
        const likeRef = doc(db, "posts", originalPostId,"comment",commentId, "likes", user?.uid);

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
        if (window.confirm("Are you sure you want to delete this comment? ")) {
            deleteDoc(doc(db, "posts", originalPostId,"comment",commentId))
        }
    }

    function openComment(){
        setPostId(originalPostId)
        setOpenModal(true)
    }


    return (
        <>
            <div className={styles.comments}>
                <div className={styles.post_card}>
                    <div className={styles.left}>
                        <Image
                            src={comment?.data?.photo}
                            width={50}
                            height={50}
                            className="profile"
                        ></Image>
                    </div>

                    <div className={styles.right}>

                        <div className={styles.post_infos_container}>
                            <div className={styles.usernames}>
                                <p>{comment?.data?.name} ~</p>
                                <p> <Moment fromNow>{comment?.data?.timestamp?.toDate()}</Moment>
                                </p>


                            </div>
                        < FiMoreHorizontal/>
                        </div>


                        <div className={styles.caption}>
                            <p>{comment?.data?.text}</p>
                        </div>
                        {comment?.data?.image && <div className={styles.thePost}>
                            <Image
                                src={comment?.data?.image}
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
                            {user?.uid === comment?.data?.id && <AiFillDelete className={styles.delete} onClick={handleDelete} />}
                        

                            <div className={styles.likeOnlyContainer}>
                            <AiOutlineComment onClick={openComment} className={styles.comment} />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
