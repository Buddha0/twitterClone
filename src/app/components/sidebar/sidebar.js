import styles from "./sidebar.module.css"
import Image from "next/image";
import {auth} from "../../firebaseConfig/firebaseConfig"
import {signOut} from "firebase/auth";
export default function Sidebar({ user }) {

  async function handleSignOut(){
    await signOut(auth)
}
  return (
    <>

      <div className={styles.sidebar}>
        <Image
          src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png"
          width={30}
          height={30}
        />
        
        <div className={styles.sidebar_contents_container}>
        {!user?<>
          <div className={styles.sidebar_content}>Home</div>
          <div className={styles.sidebar_content}>Explore</div>
          </>:
          <>
           <div className={styles.sidebar_content}>Home</div>
          <div className={styles.sidebar_content}>Explore</div>

          <div className={styles.sidebar_content}>Notification</div>
          <div className={styles.sidebar_content}>Messages</div>
          <div className={styles.sidebar_content}>List</div>
          <div className={styles.sidebar_content}>Communities</div>
          <div className={styles.sidebar_content}>Verefied</div>
          <div className={styles.sidebar_content}>Profile</div>
          <div className={styles.sidebar_content}>More</div>
          </>
          }
         

          <button className={styles.btn_post}>Post</button>

          <div className={styles.profileContainer}>
            <Image src={user.photoURL} width={50} height={50} className="profile" onClick={handleSignOut}></Image>
            <div className="profile-info">
              <p>{user.displayName}</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
