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
  title: string
  description: string
  bullets: string[]
}> = [
  {
    mode: 'business',
    title: '經營者送審',
    description: '給品牌、小編、診所、美業與 KOL 的發布前審核流程。先收掉高風險語句，再讓內容上線。',
    bullets: [
      '標出危險句與可能涉及的法規依據',
      '提供較安全的改寫方向與修正版示例',
      '把送審結果整理成可留存的工作流程',
    ],
  },
  {
    mode: 'consumer',
    title: '消費者辨識',
    description: '給一般消費者的廣告風險查核入口。快速判斷一則說法是不是講得太滿，是否值得相信。',
    bullets: [
      '指出誇大、療效暗示與結果保證等高風險特徵',
      '整理查證方向、保留證據與官方資源',
      '幫你在下單前先把風險看清楚',
    ],
  },
]

const clinicFeatures = [
  {
    title: '像診所內部審稿，而不是臨時問 AI',
    description: '輸出不是一段聊天紀錄，而是更像風險評估報告。你可以看到重點句、風險、建議與下一步。',
  },
  {
    title: '美業常見情境都能先走一遍',
    description: '商品頁、限動、私訊、療程介紹、before / after 敘述與合作稿，都可以先放進來檢查。',
  },
  {
    title: '同時服務品牌端與消費端',
    description: '一邊幫經營者降低出稿風險，一邊讓消費者更容易辨識不實或過度承諾的說法。',
  },
]

const signalGroups = [
  {
    label: '療效承諾',
    items: ['改善睡眠問題', '逆轉老化', '三天粉刺代謝乾淨'],
  },
  {
    label: '結果保證',
    items: ['七天有感', '立即見效', '保證有效'],
  },
  {
    label: '過度比較',
    items: ['比藥還有效', '醫師都在用', '完全無副作用'],
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>AI 快審通 ADCheck.ai</span>
                <h1 className={styles.heroTitle}>
                  <span className={styles.heroLine}>美業廣告送審</span>
                  <span className={styles.heroTitleAccent}>發布前先看風險</span>
                </h1>
                <p className={styles.heroLead}>
                  給品牌、小編、診所、創作者與一般消費者使用。
                  把準備發布的文案先送審，把準備相信的廣告先辨識，
                  用更清楚的方式把誇大、療效暗示與高風險說法看清楚。
                </p>

                <div className={styles.heroActions}>
                  <Link href="/review?mode=business" className={styles.primaryBtn}>
                    {reviewModeConfigs.business.ctaLabel}
                  </Link>
                  <Link href="/review?mode=consumer" className={styles.secondaryBtn}>
                    {reviewModeConfigs.consumer.ctaLabel}
                  </Link>
                </div>

                <div className={styles.heroMeta}>
                  <div className={styles.metaItem}>
                    <strong>3 秒內</strong>
                    <span>完成初步風險判讀</span>
                  </div>
                  <div className={styles.metaItem}>
                    <strong>雙模式</strong>
                    <span>送審與消費者查核共用</span>
                  </div>
                  <div className={styles.metaItem}>
                    <strong>台灣法規</strong>
                    <span>聚焦美業、保健與廣告風險</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroPanel}>
                <div className={styles.visualCard}>
                  <div className={styles.visualMedia}>
                    <Image
                      src="/images/hero.png"
                      alt="AI 快審通 ADCheck.ai"
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className={styles.heroImage}
                      priority
                    />
                  </div>

                  <div className={styles.visualBody}>
                    <span className={styles.cardLabel}>本週常見風險情境</span>
                    <p className={styles.visualText}>
                      「術後很快就看得到效果」、「七天有感」、「不用運動也能瘦」這類說法，
                      往往是美業與保健品最容易出現問題的地方。
                    </p>
                  </div>
                </div>

                <div className={styles.noteCard}>
                  <span className={styles.cardLabel}>你會拿到的結果</span>
                  <ul className={styles.noteList}>
                    <li>風險等級與關鍵句整理</li>
                    <li>較安全的改寫方向或查證建議</li>
                    <li>適合品牌內部與消費者閱讀的結果頁</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionEyebrow}>兩個入口</span>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionTitleLine}>先選擇</span>
                <span className={styles.sectionTitleLine}>你的使用情境</span>
              </h2>
            </div>

            <div className={styles.modeGrid}>
              {modeCards.map((card) => {
                const config = reviewModeConfigs[card.mode]
                return (
                  <article key={card.mode} className={styles.modeCard}>
                    <h3>{card.title}</h3>
                    <p className={styles.modeDescription}>{card.description}</p>
                    <ul className={styles.modeList}>
                      {card.bullets.map((item) => (
                        <li key={item}>{item}</li>
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

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionEyebrow}>診所感的關鍵</span>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionTitleLine}>讓人安心的</span>
                <span className={styles.sectionTitleLine}>是清楚</span>
              </h2>
            </div>

            <div className={styles.featureGrid}>
              {clinicFeatures.map((feature) => (
                <article key={feature.title} className={styles.featureCard}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.signalLayout}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionEyebrow}>高風險詞</span>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionTitleLine}>最常踩線的</span>
                  <span className={styles.sectionTitleLine}>是那一句話</span>
                </h2>
                <p className={styles.sectionLead}>
                  尤其在美業、保健與療程內容裡，真正會讓人踩線的，常常是結果保證、療效暗示與過度比較。
                </p>
              </div>

              <div className={styles.signalGrid}>
                {signalGroups.map((group) => (
                  <article key={group.label} className={styles.signalCard}>
                    <span className={styles.signalLabel}>{group.label}</span>
                    <div className={styles.signalList}>
                      {group.items.map((item) => (
                        <span key={item} className={styles.signalItem}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionEyebrow}>消費者也能用</span>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionTitleLine}>看到廣告</span>
                <span className={styles.sectionTitleLine}>也能先自保</span>
              </h2>
              <p className={styles.sectionLead}>
                不需要先讀完法條，先把證據留好、先辨識高風險說法，再決定下一步要不要反映或申訴。
              </p>
            </div>

            <div className={styles.consumerGrid}>
              <div className={styles.consumerChecklist}>
                {consumerEvidenceChecklist.map((item, index) => (
                  <div key={item} className={styles.checkItem}>
                    <span className={styles.checkIndex}>0{index + 1}</span>
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
            </div>

            <p className={styles.consumerNote}>{reportingDisclaimer}</p>
          </div>
        </section>

        <ArticlesSection />
        <SponsorSection />

        <section className={styles.finalSection}>
          <div className={styles.container}>
            <div className={styles.finalCard}>
              <div>
                <span className={styles.sectionEyebrow}>開始使用</span>
                <h2 className={styles.finalTitle}>
                  <span className={styles.sectionTitleLine}>先看風險</span>
                  <span className={styles.sectionTitleLine}>再決定下一步</span>
                </h2>
              </div>

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
