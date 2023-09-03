"use client"
import Sidebar from './components/sidebar/sidebar'
import RightSidebar from './components/rightSidebar/rightSidebar'
import Main from './components/main/main'
import Auth from './pages/Auth/page'
import Modal from './components/modal/modal'
import styles from './page.module.css'
import { auth } from "./firebaseConfig/firebaseConfig"
import { useState, useEffect } from 'react'



export default function Home() {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState("")

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
        <div className={styles.container}>
          <Sidebar user = {user} />
          <div className={styles.flex}>
            <Main user = {user} />
            <RightSidebar  />
            <Modal user = {user} />
          </div>
        </div>
        </> 
        :<Auth />}
    </>
  )
}
