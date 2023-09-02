"use client"
import Sidebar from '@/app/components/sidebar/sidebar'
import UserComment from '@/app/components/userComment/userComment'
import News from '@/app/components/news/news'
import { IoMdArrowRoundBack } from "react-icons/io";
import styles from "@/app/components/main/main.module.css"
import Auth from '../../Auth/page'
import Modal from '@/app/components/modal/modal'
import Posts from '@/app/components/posts/posts'
import { useState, useEffect } from 'react'
import { auth, db } from '@/app/firebaseConfig/firebaseConfig'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation';






export default function Comments({ params }) {
    const router = useRouter()
    const [post, setPost] = useState(null)
    const { id } = params
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState("")
    const [allComments, setAllComments] = useState([])


    //fetch the post 
    useEffect(() => {

        onSnapshot(doc(db, "posts", id), (doc) => {

            setPost(
                {
                    data: doc.data(),
                    id: doc.id
                })

        });

    }, [db, id])


    //fetch the comments

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts", id, "comment"), orderBy("timestamp", "desc")),
            (snapshot) => {
                const commentArr = [];
                snapshot.forEach((doc) => {

                    commentArr.push({
                        data: doc.data(),
                        id: doc.id
                    });

                });

                setAllComments(commentArr)
                console.log("comments, ", commentArr)

            }
        );

        // Return a cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
    }, [db, id]);




    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((user) => {

            if (user) {
                setIsAuth(true);
                setUser(user)

            } else {
                setIsAuth(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <>
            {isAuth ?
                <>
                    <div className='container'>
                        <Sidebar user={user} />
                        <div className="flex">
                            <div className={styles.main}>
                                <div className={styles.title}>
                                    <div className='row'>
                                        <h1>Comments</h1>
                                        < IoMdArrowRoundBack className='arrow-back' onClick={()=>router.push("/")} />
                                    </div>



                                </div>





                                <Posts post={post} id={post?.id} user={user} />
                                {allComments.map((comment) => {
                                    return (

                                        <>
                                            <UserComment comment={comment}
                                                commentId={comment.id}
                                                originalPostId={id}
                                                user={user}
                                            />


                                        </>
                                    )


                                })}





                            </div>
                            <News />
                            <Modal user={user} />
                        </div>
                    </div>
                </>
                : <Auth />}
        </>
    )
}
