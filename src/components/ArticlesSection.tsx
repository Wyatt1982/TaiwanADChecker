import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedArticles } from '@/data/articles'
import styles from './ArticlesSection.module.css'

// 文章縮圖對應
const thumbnailMap: Record<string, string> = {
    'kol-penalty-cases-2025': '/images/articles/penalty-cases.png',
    'how-to-write-compliant-health-food-ads': '/images/articles/health-food-ads.png',
    'cosmetic-ad-regulations-guide': '/images/articles/cosmetic-ads.png',
    'brand-kol-collaboration-checklist': '/images/articles/health-food-ads.png',
    'fda-penalty-how-much': '/images/articles/penalty-cases.png',
    // 新增文章
    'private-message-is-not-private': '/images/articles/penalty-cases.png',
    'how-to-reply-product-inquiry-safely': '/images/articles/health-food-ads.png',
    'wellness-beauty-industry-compliance-landmines': '/images/articles/cosmetic-ads.png',
}

export function ArticlesSection() {
    const articles = getFeaturedArticles()

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>📚 法規新知與教學</h2>
                    <p className={styles.subtitle}>
                        掌握最新廣告法規動態，學會怎麼寫得更安全，也看懂常見誇大話術
                    </p>
                </div>

                <div className={styles.grid}>
                    {articles.map((article) => (
                        <article key={article.id} className={styles.card}>
                            <div className={styles.thumbnail}>
                                <Image
                                    src={thumbnailMap[article.slug] || '/images/articles/penalty-cases.png'}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className={styles.thumbnailImage}
                                />
                                <span className={styles.category}>{article.category}</span>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.cardTitle}>{article.title}</h3>
                                <p className={styles.excerpt}>{article.excerpt}</p>
                                <div className={styles.meta}>
                                    <span className={styles.date}>
                                        📅 {article.publishDate}
                                    </span>
                                    <span className={styles.readTime}>
                                        ⏱️ {article.readTime} 分鐘
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={styles.cta}>
                    <Link href="/articles" className={styles.ctaBtn}>
                        查看更多文章 →
                    </Link>
                </div>
            </div>
        </section>
    )
}
