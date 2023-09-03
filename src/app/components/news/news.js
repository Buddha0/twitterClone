import Link from "next/link"
import styles from "../news/news.module.css"
export default function News({ news }) {

    return (
        <Link href={news.url} className={styles.link}>
            <div className={styles.news}>
                <h1 className={styles.title}>{news.title}</h1>

            </div>
        </Link>


    )
}