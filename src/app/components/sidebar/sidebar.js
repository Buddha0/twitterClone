import styles from "./sidebar.module.css"
import Image from "next/image";
import { auth } from "../../firebaseConfig/firebaseConfig"
import { signOut } from "firebase/auth";
import { AiFillHome, AiFillNotification, AiOutlineSearch, AiOutlineUser, AiOutlineOrderedList } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi"
import { FiMessageSquare, FiMoreHorizontal } from "react-icons/fi"

export default function Sidebar({ user }) {

  async function handleSignOut() {
    await signOut(auth)
  }
  const siderBarList = [
    {
      name: "Home",
      icon: <AiFillHome />
    },
    {
      name: "Notificaition",
      icon: <AiFillNotification />
    },
    {
      name: "Search",
      icon: <AiOutlineSearch />
    },
    {
      name: "User",
      icon: <AiOutlineUser />
    },
    {
      name: "Communities",
      icon: < HiOutlineUserGroup />
    },
    {
      name: "Message",
      icon: <FiMessageSquare />
    },
    {
      name: "List",
      icon: <AiOutlineOrderedList />
    },
    {
      name: "More",
      icon: <FiMoreHorizontal/>
    },
  ]
  return (
    <>

      <div className={styles.sidebar}>
        <Image
          src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png"
          width={30}
          height={30}
        />

        <div className={styles.sidebar_contents_container}>
          {!user ? <>
            <div className={styles.sidebar_content}><AiFillHome />Home</div>
            <div className={styles.sidebar_content}>Explore</div>
          </> :
            <>
              {siderBarList.map((data) => {
                return (
                  <div className={styles.sidebar_content}>
                    <p>{data.name}</p>
                    {data.icon}
                  </div>
                )
              })}


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
