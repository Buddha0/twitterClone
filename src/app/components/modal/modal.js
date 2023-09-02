"use client"
import { AiOutlineClose } from "react-icons/ai";
import { modalState } from "@/app/recoil/modalAtom"
import { useRecoilState, } from "recoil"
import styles from "../modal/modal.module.css"
import { postIdState } from "@/app/recoil/modalAtom";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Moment from "react-moment";
import { db } from "@/app/firebaseConfig/firebaseConfig";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { FcGallery } from "react-icons/fc";
import { GrEmoji } from "react-icons/gr";
import { useRouter } from "next/navigation";
export default function Modal({ user }) {

    const [openModal, setOpenModal] = useRecoilState(modalState)
    const [postId] = useRecoilState(postIdState)
    const [postInfo, setPostInfo] = useState([])
    const [inputValue, setInputValue] = useState("")
    const filePickerRef = useRef(null)
    const router = useRouter()
    


    useEffect(() => {

        onSnapshot(doc(db, "posts", postId), (doc) => {
            setPostInfo(doc.data())
        });
    }, [postId])

    async function sendComment() {
        await addDoc(collection(db, "posts", postId, "comment"), {
            text: inputValue,
            id: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            timestamp: serverTimestamp()

        });
        setInputValue("")
        setOpenModal(false)
        router.push(`/pages/comments/${postId}`)
    }

    return (
        <>

            {openModal && <div className={styles.modal_container}>
                <AiOutlineClose className={styles.close_btn} onClick={() => setOpenModal(false)} />
                <div className={styles.modal_container_infos}>

                    <div className={styles.flex}>
                        <div className={styles.container}>
                            <Image src={postInfo?.photo} alt="user_img" width={50} height={50} className="profile"></Image>
                            <p className={styles.line}></p>
                        </div>

                        <div className={styles.column}>
                            <div className={styles.top}>
                                <p>{postInfo?.name}</p>
                                <Moment fromNow>{postInfo?.timestamp?.toDate()}</Moment>
                            </div>
                            <div className={styles.bottom}>
                                <p className={styles.block}>{postInfo?.text}</p>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                    <div className={styles.reply}>

                        <Image src={user?.photoURL} alt="user_img" width={50} height={50} className="profile"></Image>
                        <div className={styles.inputField}>
                            <input
                                type="text"
                                className="input_type_text "
                                placeholder="What is happening?"
                                onChange={(e) => setInputValue(e.target.value)}
                                value={inputValue}
                            ></input>


                            <div className={styles.other_options}>
                                <div className={styles.space_between}>
                                    <div className={styles.options}>
                                        <div>
                                            < FcGallery onClick={() => filePickerRef.current.click()} className="icon" />
                                            <input type="file" hidden ref={filePickerRef}
                                            />

                                        </div>

                                        <GrEmoji className="icon" />
                                    </div>

                                    <button className={styles.btn_post} disabled={!inputValue.trim()}
                                        onClick={sendComment}>Tweet Reply</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>}


        </>

    )
}