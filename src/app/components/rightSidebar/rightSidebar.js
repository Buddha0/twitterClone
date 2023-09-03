
import styles from "../rightSidebar/page.module.css"
import News from "../news/news"
import { useEffect, useState } from "react"





export default function RightSidebar() {
    const [newsData, setNewsData] = useState([])
    const [articleNum, setArtilceNum] = useState(3)
    useEffect(() => {

        async function fetchNews() {
            const response = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/health/in.json")
            const data = await response.json()
            setNewsData(data.articles)
        }
        fetchNews()
    }, [])




    return (
        <div className={styles.rightSidebarContainer}>
            <input type="text" placeholder="Search" className={styles.input}></input>
            <div className={styles.newsContainer}>
                <h1 className={styles.mainHeading}>Whats Happening</h1>
                {newsData?.slice(0, articleNum).map((data) => {
                    return <News news={data} />
                })}
               {articleNum < newsData.length && (
    <p className={styles.showMore} onClick={() => setArtilceNum(articleNum + 3)}>Show More</p>
  )}
            </div>

        </div>
    )
}