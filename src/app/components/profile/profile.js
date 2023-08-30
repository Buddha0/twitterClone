"use client"

import Image from "next/image"
import styles from "./profile.module.css"
import { useRef, useState } from "react"
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig"
import { storage } from "../../firebaseConfig/firebaseConfig"
import { ref, getDownloadURL, uploadString } from "firebase/storage";




export default function Profile({ user }) {

    const [inputValue, setInputValue] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const filePickerRef = useRef(null)



    async function sendPost() {

        try {
            // adding data to the posts . includes the user message and user infos which i got from auth.
            const docRef = await addDoc(collection(db, "posts"), {
                text: inputValue,
                id: user.uid,
                name: user.displayName,
                photo: user.photoURL,
                timestamp: serverTimestamp()

            });

         // adding image to the storage 
            const imagesRef = ref(storage, `posts/${docRef.id}/image`);
            //if the image is selected then only i want to send it 
            if (selectedFile) {
                uploadString(imagesRef, selectedFile, 'data_url').then(async () => {
                    const downloadURL = await getDownloadURL(imagesRef);
                    await updateDoc(doc(db, "posts", docRef.id), {
                        image: downloadURL,
                    });
                })

            }

            setInputValue("")
            setSelectedFile(null)

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function sendFileToPost(e) {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])

        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }

    }

    return (
        <>
            <div className={styles.post_container}>
                <div className={styles.profile}>
                    <Image
                        src={user?.photoURL}
                        width={50}
                        height={50}
                        className="profile"

                    ></Image>
                </div>
                <div className={styles.inputField}>
                    <input
                        type="text"
                        className="input_type_text"
                        placeholder="What is happening?"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                    ></input>
                    <div className={styles.imagePreviewContainer}>
                        {selectedFile && <Image src={selectedFile}
                            width={300}
                            height={300} className={styles.imagePreview}></Image>}
                           {selectedFile &&<p onClick={()=>setSelectedFile(null)}> Close</p> } 
                    </div>

                    <div className={styles.other_options}>
                        <div className={styles.options}>
                            <div>
                                <p onClick={() => filePickerRef.current.click()}>Gallery</p>
                                <input type="file" hidden ref={filePickerRef}
                                    onChange={sendFileToPost} />

                            </div>

                            <p>Emoji</p>
                        </div>

                        <button className={styles.btn_post} disabled={!inputValue.trim()}
                            onClick={sendPost}>Post</button>
                    </div>
                </div>
            </div>
        </>
    )
}