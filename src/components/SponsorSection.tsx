import Link from 'next/link'
import { sponsors, sponsorTiers, supporters } from '@/data/sponsors'
import styles from './SponsorSection.module.css'

export function SponsorSection() {
    const goldSponsors = sponsors.filter(s => s.tier === 'gold' && s.isActive)
    const silverSponsors = sponsors.filter(s => s.tier === 'silver' && s.isActive)
    const bronzeSponsors = sponsors.filter(s => s.tier === 'bronze' && s.isActive)

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>💝 感謝贊助</h2>
                    <p className={styles.subtitle}>
                        感謝以下夥伴的支持，讓這個工具能持續免費運作
                    </p>
                </div>

                {/* 金級贊助 */}
                {goldSponsors.length > 0 && (
                    <div className={styles.tierSection}>
                        <div className={styles.tierLabel}>
                            <span className={styles.tierIcon}>{sponsorTiers.gold.icon}</span>
                            <span>{sponsorTiers.gold.label}</span>
                        </div>
                        <div className={styles.goldGrid}>
                            {goldSponsors.map(sponsor => (
                                <a
                                    key={sponsor.id}
                                    href={sponsor.url || '#become-sponsor'}
                                    target={sponsor.url ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className={styles.goldCard}
                                >
                                    <div className={styles.sponsorLogo}>
                                        {sponsor.logo ? (
                                            <img src={sponsor.logo} alt={sponsor.name} />
                                        ) : (
                                            <span className={styles.placeholderLogo}>🏢</span>
                                        )}
                                    </div>
                                    <div className={styles.sponsorInfo}>
                                        <h3 className={styles.sponsorName}>{sponsor.name}</h3>
                                        {sponsor.description && (
                                            <p className={styles.sponsorDesc}>{sponsor.description}</p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* 銀級贊助 */}
                {silverSponsors.length > 0 && (
                    <div className={styles.tierSection}>
                        <div className={styles.tierLabel}>
                            <span className={styles.tierIcon}>{sponsorTiers.silver.icon}</span>
                            <span>{sponsorTiers.silver.label}</span>
                        </div>
                        <div className={styles.silverGrid}>
                            {silverSponsors.map(sponsor => (
                                <a
                                    key={sponsor.id}
                                    href={sponsor.url || '#become-sponsor'}
                                    target={sponsor.url ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className={styles.silverCard}
                                >
                                    <div className={styles.silverLogo}>
                                        {sponsor.logo ? (
                                            <img src={sponsor.logo} alt={sponsor.name} />
                                        ) : (
                                            <span className={styles.placeholderLogoSm}>🏢</span>
                                        )}
                                    </div>
                                    <span className={styles.silverName}>{sponsor.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* 感謝名單 */}
                {supporters.length > 0 && (
                    <div className={styles.supporterSection}>
                        <div className={styles.tierLabel}>
                            <span className={styles.tierIcon}>☕</span>
                            <span>咖啡贊助者</span>
                        </div>
                        <div className={styles.supporterList}>
                            {supporters.map((name, idx) => (
                                <span key={idx} className={styles.supporterName}>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 成為贊助商 CTA */}
                <div className={styles.ctaBox} id="become-sponsor">
                    <div className={styles.ctaContent}>
                        <h3 className={styles.ctaTitle}>🎯 想讓你的品牌出現在這裡？</h3>
                        <p className={styles.ctaDesc}>
                            贊助本工具，獲得品牌曝光，同時支持免費法規資訊服務
                        </p>
                        <div className={styles.ctaPricing}>
                            <div className={styles.priceCard}>
                                <span className={styles.priceIcon}>🥇</span>
                                <span className={styles.priceLabel}>金級</span>
                                <span className={styles.priceAmount}>NT$ 3,000/月</span>
                            </div>
                            <div className={styles.priceCard}>
                                <span className={styles.priceIcon}>🥈</span>
                                <span className={styles.priceLabel}>銀級</span>
                                <span className={styles.priceAmount}>NT$ 1,500/月</span>
                            </div>
                            <div className={styles.priceCard}>
                                <span className={styles.priceIcon}>🥉</span>
                                <span className={styles.priceLabel}>銅級</span>
                                <span className={styles.priceAmount}>NT$ 500/月</span>
                            </div>
                        </div>
                        <a href="mailto:sponsor@kol-helper.tw" className={styles.ctaButton}>
                            📧 洽詢贊助方案
                        </a>
                        <Link href="/sponsor" className={styles.ctaSecondary}>
                            📊 查看平台數據與贊助方案
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
