import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SponsorSection } from '@/components/SponsorSection'
import { ArticlesSection } from '@/components/ArticlesSection'
import { consumerEvidenceChecklist, reportingDisclaimer, reportingResources } from '@/data/reporting'
import { reviewModeConfigs, type ReviewAudienceMode } from '@/data/reviewModes'
import styles from './page.module.css'

const modeCards: Array<{
  mode: ReviewAudienceMode
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}> = [
  {
    mode: 'business',
    eyebrow: 'FOR BRANDS, CLINICS, CREATORS',
    title: '發布前送審，讓內容更像作品，不像風險來源',
    description: '適合美業品牌、小編、KOL、保健團隊與客服，先把療效暗示、誇大用語與危險句型收乾淨再上線。',
    bullets: [
      '看到高風險句、法規依據與較安全的改寫方向',
      '適合商品頁、社群貼文、私訊回覆、案例分享與合作腳本',
      '把審核結果整理成可交付、可留存的內部檢查流程',
    ],
  },
  {
    mode: 'consumer',
    eyebrow: 'FOR SHOPPERS, FOLLOWERS, FAMILIES',
    title: '下單前辨識，先判斷這則廣告值不值得相信',
    description: '適合一般消費者、團購跟單者與美業潛在客戶，快速看出是否有誇大、保證效果或其他高風險違規特徵。',
    bullets: [
      '用白話方式指出可疑重點，不把人丟進艱澀法條',
      '直接告訴你該先保留什麼證據、該去哪裡查證',
      '把衝動下單前最該看的風險整理在同一頁',
    ],
  },
]

const beautyMoments = [
  {
    step: '01',
    title: 'Before / After 與見證語，是美業最常踩雷的地方',
    description: '很多風險不是出在正式廣告，而是案例照、心得分享、術後描述和客服回覆的語氣。',
  },
  {
    step: '02',
    title: '私訊、限動、商品頁與合作腳本，全部都可能被截圖',
    description: '你以為只是臨場回覆，實際上在主管機關眼中，它一樣可能是宣傳內容的一部分。',
  },
  {
    step: '03',
    title: '真正好用的工具，不只找錯，也要幫你交代得出去',
    description: '風險分數、可疑句、修正方向與後續動作要放在一起，才像專業審核，不像一次性的 AI 對話。',
  },
]

const riskSignals = [
  '七天有感',
  '立即見效',
  '不用運動也能瘦',
  '改善睡眠問題',
  '逆轉老化',
  '醫師都在用',
  '保證有效',
  '完全無副作用',
  '比藥還有效',
  '術後效果超明顯',
  '三天粉刺代謝乾淨',
  '根治、治療、修復',
]

const proofMetrics = [
  { value: '3 秒', label: '完成初步風險判讀' },
  { value: '雙模式', label: '經營者送審 / 消費者辨識' },
  { value: '台灣法規', label: '食安法、藥事法、化粧品與公平法重點' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroAuraLeft}></div>
          <div className={styles.heroAuraRight}></div>
          <div className={`${styles.container} ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Aesthetic Compliance Studio</span>
              <h1 className={styles.heroTitle}>
                為美業網站、創作者文案與消費決策
                <span className={styles.heroTitleAccent}>重新設計的一套廣告風險體驗</span>
              </h1>
              <p className={styles.heroLead}>
                不是冷冰冰的法規資料站，而是一個更像品牌顧問的入口。
                你可以在發布前先送審，也可以在下單前先辨識，讓美感、專業與信任放在同一個頁面上。
              </p>

              <div className={styles.heroActions}>
                <Link href="/review?mode=business" className={styles.primaryBtn}>
                  {reviewModeConfigs.business.ctaLabel}
                </Link>
                <Link href="/review?mode=consumer" className={styles.secondaryBtn}>
                  {reviewModeConfigs.consumer.ctaLabel}
                </Link>
                <Link href="/cases" className={styles.ghostBtn}>
                  看真實開罰案例
                </Link>
              </div>

              <div className={styles.proofRow}>
                {proofMetrics.map((metric) => (
                  <div key={metric.label} className={styles.proofCard}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewTag}>PREVIEW REPORT</span>
                  <span className={styles.previewTime}>即時分析中</span>
                </div>

                <div className={styles.sampleBlock}>
                  <span className={styles.sampleLabel}>文案片段</span>
                  <p className={styles.sampleText}>
                    「術後三天超有感，粉刺直接代謝乾淨，客人都說像換了一張臉。」
                  </p>
                </div>

                <div className={styles.previewSignals}>
                  <span className={styles.signalPill}>療效暗示</span>
                  <span className={styles.signalPill}>結果保證</span>
                  <span className={styles.signalPill}>案例分享風險</span>
                </div>

                <div className={styles.previewStats}>
                  <div className={styles.previewStatCard}>
                    <span className={styles.previewStatLabel}>風險分數</span>
                    <strong>78 / 100</strong>
                  </div>
                  <div className={styles.previewStatCard}>
                    <span className={styles.previewStatLabel}>建議動作</span>
                    <strong>先修改再發布</strong>
                  </div>
                </div>
              </div>

              <div className={styles.portraitCard}>
                <div className={styles.portraitMedia}>
                  <Image
                    src="/images/hero.png"
                    alt="AI 快審通 ADCheck.ai"
                    fill
                    sizes="(max-width: 1024px) 280px, 360px"
                    className={styles.portraitImage}
                    priority
                  />
                </div>
                <div className={styles.portraitCopy}>
                  <span className={styles.portraitKicker}>Beauty-first interface</span>
                  <p>
                    從療程介紹、保健商品、客服私訊到 KOL 合作稿，都先走一次更優雅的風險檢查流程。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>TWO ENTRY POINTS</span>
              <h2 className={styles.sectionTitle}>同一套審核引擎，拆成兩種更清楚的使用情境</h2>
              <p className={styles.sectionIntro}>
                首頁不再讓品牌、小編、消費者擠在同一條訊息裡，而是先把他們帶到最適合的起點。
              </p>
            </div>

            <div className={styles.modeGrid}>
              {modeCards.map((card) => {
                const config = reviewModeConfigs[card.mode]
                return (
                  <article key={card.mode} className={styles.modeCard}>
                    <span className={styles.modeEyebrow}>{card.eyebrow}</span>
                    <h3 className={styles.modeTitle}>{card.title}</h3>
                    <p className={styles.modeDescription}>{card.description}</p>
                    <ul className={styles.modeList}>
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <Link href={`/review?mode=${card.mode}`} className={styles.modeLink}>
                      {config.ctaLabel}
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>WHY IT FITS BEAUTY BRANDS</span>
              <h2 className={styles.sectionTitle}>美業最需要的，不只是法規提醒，而是更穩定的品牌表現</h2>
              <p className={styles.sectionIntro}>
                視覺和話術通常一起出現。當網站做得越美，內容越需要被寫得剛剛好，既有吸引力，也不過界。
              </p>
            </div>

            <div className={styles.storyGrid}>
              {beautyMoments.map((item) => (
                <article key={item.step} className={styles.storyCard}>
                  <span className={styles.storyStep}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.signalSection}>
          <div className={`${styles.container} ${styles.signalLayout}`}>
            <div className={styles.signalPanel}>
              <span className={styles.sectionEyebrow}>COMMON RED FLAGS</span>
              <h2 className={styles.sectionTitle}>這些字眼一出現，整體質感再好，也會立刻變成高風險訊號</h2>
              <p className={styles.sectionIntro}>
                尤其在美業、保健與案例分享場景裡，最常出事的不是設計，而是那一句說得太滿、太像療效承諾的話。
              </p>
            </div>

            <div className={styles.signalCloud}>
              {riskSignals.map((item, index) => (
                <span
                  key={item}
                  className={`${styles.signalToken} ${index % 3 === 1 ? styles.signalTokenWarm : ''} ${index % 4 === 0 ? styles.signalTokenDeep : ''}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.consumerSection}>
          <div className={styles.container}>
            <div className={styles.consumerShell}>
              <div className={styles.consumerIntroBlock}>
                <span className={styles.sectionEyebrow}>FOR CONSUMERS</span>
                <h2 className={styles.sectionTitle}>如果你是看到廣告的人，這一頁也能幫你先判斷值不值得相信</h2>
                <p className={styles.sectionIntro}>
                  當你遇到保證有效、快速見效、過度承諾的商品頁或限動，不需要先看完整法條，也能先做正確的自保動作。
                </p>
                <Link href="/review?mode=consumer" className={styles.consumerButton}>
                  我是消費者，先辨識風險
                </Link>
              </div>

              <div className={styles.consumerChecklist}>
                {consumerEvidenceChecklist.map((item, index) => (
                  <div key={item} className={styles.checklistCard}>
                    <span className={styles.checklistIndex}>0{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className={styles.resourceGrid}>
                {reportingResources.map((resource) => (
                  <article key={resource.title} className={styles.resourceCard}>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <a
                      href={resource.href}
                      className={styles.resourceLink}
                      target={resource.href.startsWith('http') ? '_blank' : undefined}
                      rel={resource.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {resource.actionLabel}
                    </a>
                    <small>{resource.helper}</small>
                  </article>
                ))}
              </div>

              <p className={styles.consumerDisclaimer}>{reportingDisclaimer}</p>
            </div>
          </div>
        </section>

        <ArticlesSection />
        <SponsorSection />

        <section className={styles.finalSection}>
          <div className={styles.container}>
            <div className={styles.finalCard}>
              <span className={styles.sectionEyebrow}>NEXT STEP</span>
              <h2 className={styles.finalTitle}>把首頁先做得更美，接下來就讓每一段內容也更穩</h2>
              <p className={styles.finalText}>
                無論你是準備發布一則療程文案，還是正猶豫一則看起來太完美的商品頁，
                先用 AI 快審通把風險看清楚，再決定下一步。
              </p>
              <div className={styles.finalActions}>
                <Link href="/review?mode=business" className={styles.primaryBtn}>
                  前往經營者送審
                </Link>
                <Link href="/review?mode=consumer" className={styles.secondaryBtn}>
                  前往消費者辨識
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
