import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SponsorSection } from '@/components/SponsorSection'
import { ArticlesSection } from '@/components/ArticlesSection'
import { consumerEvidenceChecklist, reportingDisclaimer, reportingResources } from '@/data/reporting'
import { reviewModeConfigs, reviewModeOrder } from '@/data/reviewModes'
import styles from './page.module.css'

export default function HomePage() {
  const modeHighlights = {
    business: [
      '發布前先檢查危險句、療效暗示與誇大用語',
      '拿到法規依據、修改建議與較安全的改寫版本',
      '適合品牌小編、KOL、美業、電商與客服團隊',
    ],
    consumer: [
      '辨識可疑廣告是否有誇大、保證有效或療效暗示',
      '看到白話風險說明與該保留哪些證據',
      '快速連到 1950、食藥署與公平會等官方管道',
    ],
  } as const

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section - 強化恐懼訴求 */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              創作者、商家、消費者都能用
            </div>
            <h1 className={styles.title}>
              先看懂這則廣告
              <span className={styles.titleGradient}>有沒有貓膩</span>
            </h1>
            <p className={styles.subtitle}>
              貼上商品頁、社群貼文、私訊回覆或客服話術，
              <br />
              <strong>AI 幫你判斷能不能發，也幫你判斷該不該買。</strong>
            </p>
            <div className={styles.heroActions}>
              <Link href="/review?mode=business" className={styles.ctaBtn}>
                {reviewModeConfigs.business.icon} {reviewModeConfigs.business.ctaLabel}
              </Link>
              <Link href="/review?mode=consumer" className={styles.secondaryBtn}>
                {reviewModeConfigs.consumer.icon} {reviewModeConfigs.consumer.ctaLabel}
              </Link>
              <Link href="/cases" className={styles.secondaryBtn}>
                看真實開罰案例
              </Link>
            </div>
            <p className={styles.heroHint}>
              ✓ 先選經營者或消費者模式 ✓ 3 秒出結果 ✓ 不用登入就能用
            </p>
          </div>

          <div className={styles.heroImage}>
            <Image
              src="/images/hero.png"
              alt="AI 快審通 ADCheck.ai - AI 廣告法規審核"
              fill
              sizes="(max-width: 900px) 0px, (max-width: 1200px) 300px, 380px"
              className={styles.heroImageAsset}
              priority
            />
          </div>
          <div className={styles.heroGlow}></div>
        </section>

        <section className={styles.dualSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>先選你現在要解決的情境</h2>
            <div className={styles.dualGrid}>
              {reviewModeOrder.map((mode) => {
                const config = reviewModeConfigs[mode]
                return (
                  <article key={mode} className={styles.dualCard}>
                    <div className={styles.dualIcon}>{config.icon}</div>
                    <h3>{config.label}</h3>
                    <p>{config.homeDescription}</p>
                    <ul className={styles.dualList}>
                      {modeHighlights[mode].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link href={`/review?mode=${mode}`} className={styles.dualBtn}>
                      {config.ctaLabel}
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* 🔥 恐懼橫幅 - 強調痛點 */}
        <section className={styles.fearBanner}>
          <div className={styles.container}>
            <div className={styles.fearContent}>
              <span className={styles.fearIcon}>🚨</span>
              <div className={styles.fearText}>
                <h2>你以為只是廣告話術？</h2>
                <p>發的人可能吃罰單，買的人也可能被誤導下單；先查一下，往往比事後補救更省。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 💀 真實案例恐懼區 */}
        <section className={styles.horrorSection}>
          <div className={styles.container}>
            <h2 className={styles.horrorTitle}>這些情境，創作者和消費者都很常遇到</h2>
            <div className={styles.horrorGrid}>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😰</span>
                <p>「客服私訊傳 before / after 圖，還說效果很快看得見...」</p>
                <span className={styles.horrorResult}>高風險話術</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😱</span>
                <p>「商品頁寫『七天見效』『保證有效』，看起來很心動...」</p>
                <span className={styles.horrorResult}>可能誇大不實</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>💸</span>
                <p>「KOL 限動說『改善睡眠』『調理體質』，到底能不能信？」</p>
                <span className={styles.horrorResult}>先查再決定</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😭</span>
                <p>「賣場回覆『不用運動也能瘦』，到底是話術還是違規？」</p>
                <span className={styles.horrorResult}>別急著下單</span>
              </div>
            </div>
            <p className={styles.horrorNote}>
              看到可疑句子時，最安全的做法是先檢查、先留證據，再決定下一步
            </p>
          </div>
        </section>

        {/* 📊 數據衝擊區 */}
        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>4~400萬</span>
                <span className={styles.statLabel}>常見食安法罰鍰範圍</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>1950</span>
                <span className={styles.statLabel}>消費爭議可先諮詢</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>1919</span>
                <span className={styles.statLabel}>食品安全疑義可反映</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>私訊 / 商品頁</span>
                <span className={styles.statLabel}>都可能成為判斷內容</span>
              </div>
            </div>
          </div>
        </section>

        {/* ⚠️ 高風險行為清單 */}
        <section className={styles.riskSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>這些字眼，不論你是寫的人還是看到的人都要小心</h2>
            <div className={styles.riskGrid}>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>七天見效、立即有感、保證有效</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>不用運動也能瘦、吃了就會好</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>治療、根治、改善疾病、逆轉老化</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>100% 無害、絕不過敏、完全沒有副作用</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>醫師都在用、比藥還有效、取代治療</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>見證對比圖加上保證結果</p>
              </div>
            </div>
            <p className={styles.riskWarning}>
              👆 寫到這些字眼容易踩法規，看到這些字眼也別急著相信
            </p>
          </div>
        </section>

        {/* 🛡️ 解決方案區 */}
        <section className={styles.solutionSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>3 步判斷這段內容能不能發、能不能信</h2>
            <div className={styles.stepGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>01</div>
                <h3>貼上你要檢查的內容</h3>
                <p>商品頁、貼文、私訊回覆、客服話術都可以</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>02</div>
                <h3>AI 自動檢測</h3>
                <p>比對食安法、藥事法、化妝品與公平交易法規重點</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>03</div>
                <h3>拿到下一步建議</h3>
                <p>創作者看修正方向，消費者看是否先停買與如何申訴</p>
              </div>
            </div>
            <div className={styles.solutionCta}>
              <Link href="/review?mode=business" className={styles.ctaBtnLarge}>
                先用經營者模式送審 →
              </Link>
              <span className={styles.ctaSubtext}>消費者模式也可直接切換，不用註冊、不用登入、不收費</span>
            </div>
          </div>
        </section>

        <section className={styles.consumerSection}>
          <div className={styles.container}>
            <div className={styles.consumerHeader}>
              <span className={styles.consumerBadge}>消費者也適用</span>
              <h2 className={styles.sectionTitle}>看到可疑廣告，先做這 3 件事</h2>
              <p className={styles.consumerIntro}>
                如果你不是發文者，而是擔心自己被誇大宣稱誤導，這個工具可以幫你先判斷，再把你導到正確的官方管道。
              </p>
              <Link href="/review?mode=consumer" className={styles.consumerCta}>
                我是消費者，先檢查這則廣告 →
              </Link>
            </div>

            <div className={styles.consumerChecklist}>
              {consumerEvidenceChecklist.map((item, index) => (
                <div key={item} className={styles.consumerStepCard}>
                  <span className={styles.consumerStepNumber}>0{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className={styles.reportingPanel}>
              <div className={styles.reportingHeader}>
                <h3>官方申訴 / 檢舉資源</h3>
                <p>先分清楚你遇到的是「購買糾紛」還是「可疑廣告」，必要時兩邊都可以處理。</p>
              </div>

              <div className={styles.reportingGrid}>
                {reportingResources.map((resource) => (
                  <article key={resource.title} className={styles.reportingCard}>
                    <h4>{resource.title}</h4>
                    <p>{resource.description}</p>
                    <a
                      href={resource.href}
                      className={styles.reportingLink}
                      target={resource.href.startsWith('http') ? '_blank' : undefined}
                      rel={resource.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {resource.actionLabel}
                    </a>
                    <small>{resource.helper}</small>
                  </article>
                ))}
              </div>

              <p className={styles.reportingDisclaimer}>{reportingDisclaimer}</p>
            </div>
          </div>
        </section>

        {/* 🎯 受眾區分 */}
        <section className={styles.audienceSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>誰需要這個工具？</h2>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>🛍️</span>
                <h3>一般消費者</h3>
                <p>看到可疑商品頁、社群廣告、團購貼文</p>
                <small>先判斷再下單，也知道怎麼申訴</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>📱</span>
                <h3>KOL / 創作者</h3>
                <p>接業配、做團購、分享開箱心得</p>
                <small>品牌給的文案不一定真的合規</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>💆‍♀️</span>
                <h3>美業工作者</h3>
                <p>美容師、美甲師、美睫師、美體師</p>
                <small>私訊回覆和案例分享最容易踩雷</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>💊</span>
                <h3>保健品銷售</h3>
                <p>直銷、電商、團購主、賣場經營者</p>
                <small>療效宣稱與誇大效果是高風險區</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>🏪</span>
                <h3>品牌 / 電商團隊</h3>
                <p>商品頁、客服腳本、投廣素材</p>
                <small>降低內部出稿與客訴風險</small>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 恐懼喚起區 */}
        <section className={styles.quoteSection}>
          <div className={styles.container}>
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                「看到『保證瘦』『立即見效』，至少我知道先查一下，不會衝動下單。」
              </p>
              <span className={styles.quoteAuthor}>— 某位曾經差點踩雷的消費者</span>
            </div>
          </div>
        </section>

        {/* 涵蓋法規 */}
        <section className={styles.regulations}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>我們幫你檢查這些法規</h2>
            <div className={styles.regGrid}>
              <div className={styles.regCard}>
                <span className={styles.regIcon}>💊</span>
                <span className={styles.regName}>保健食品</span>
                <span className={styles.regPenalty}>4-400萬</span>
              </div>
              <div className={styles.regCard}>
                <span className={styles.regIcon}>💄</span>
                <span className={styles.regName}>化妝品</span>
                <span className={styles.regPenalty}>4-20萬</span>
              </div>
              <div className={styles.regCard}>
                <span className={styles.regIcon}>💉</span>
                <span className={styles.regName}>醫美廣告</span>
                <span className={styles.regPenalty}>5-25萬</span>
              </div>
              <div className={styles.regCard}>
                <span className={styles.regIcon}>🍽️</span>
                <span className={styles.regName}>食安法</span>
                <span className={styles.regPenalty}>4-400萬</span>
              </div>
              <div className={styles.regCard}>
                <span className={styles.regIcon}>🍷</span>
                <span className={styles.regName}>菸酒警語</span>
                <span className={styles.regPenalty}>10-50萬</span>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 即將推出功能 */}
        <section className={styles.comingSoonSection}>
          <div className={styles.container}>
            <div className={styles.comingSoonHeader}>
              <span className={styles.comingSoonBadge}>🚀 即將推出</span>
              <h2 className={styles.sectionTitle}>更強大的審核能力</h2>
              <p className={styles.comingSoonDesc}>
                我們正在開發更多功能，讓你在發布前、下單前都能更快判斷風險
              </p>
            </div>
            <div className={styles.comingSoonGrid}>
              <div className={styles.comingSoonCard}>
                <div className={styles.comingSoonIcon}>📸</div>
                <div className={styles.proBadge}>⭐ 進階功能</div>
                <h3>圖片 OCR 審核</h3>
                <p>
                  上傳 IG 限動截圖、產品海報、宣傳圖片，
                  AI 自動辨識圖片中的文字並檢測違規風險。
                </p>
                <ul className={styles.comingSoonFeatures}>
                  <li>📱 支援 IG 限動、貼文截圖</li>
                  <li>🖼️ 產品海報、DM 圖片</li>
                  <li>⚡ 消費者也能直接貼截圖來查</li>
                </ul>
                <span className={styles.comingSoonEta}>預計上線：2026 Q2</span>
              </div>
              <div className={styles.comingSoonCard}>
                <div className={styles.comingSoonIcon}>🎬</div>
                <h3>影片內容審核</h3>
                <p>
                  上傳 YouTube / TikTok / Reels 影片，
                  AI 分析影片字幕、口白內容，全方位檢測風險。
                </p>
                <ul className={styles.comingSoonFeatures}>
                  <li>🎤 語音轉文字分析</li>
                  <li>📝 影片字幕掃描</li>
                  <li>🔗 貼上連結即可審核</li>
                </ul>
                <span className={styles.comingSoonEta}>預計上線：2026 Q3</span>
              </div>
              <div className={styles.comingSoonCard}>
                <div className={styles.comingSoonIcon}>📄</div>
                <h3>合規報告下載</h3>
                <p>
                  生成專業審核報告 PDF，
                  作為內部審核紀錄、品牌合作證明，或消費申訴時的整理摘要。
                </p>
                <ul className={styles.comingSoonFeatures}>
                  <li>📋 專業審核報告</li>
                  <li>✅ 合規重點與風險摘要</li>
                  <li>📤 一鍵分享給品牌或家人朋友</li>
                </ul>
                <span className={styles.comingSoonEta}>預計上線：2026 Q2</span>
              </div>
            </div>
            <div className={styles.comingSoonCta}>
              <p>想第一時間體驗新功能？</p>
              <Link href="/sponsor" className={styles.comingSoonBtn}>
                🔔 加入早鳥名單
              </Link>
            </div>
          </div>
        </section>

        {/* 📊 信任數據區 */}
        <section className={styles.trustSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>為什麼選擇 AI 快審通？</h2>
            <div className={styles.trustGrid}>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>3,200+</span>
                <span className={styles.trustLabel}>段內容已檢查</span>
                <p className={styles.trustDesc}>持續增加中</p>
              </div>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>NT$ 1,200萬+</span>
                <span className={styles.trustLabel}>潛在罰款已避免</span>
                <p className={styles.trustDesc}>保護每一位用戶</p>
              </div>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>多角色</span>
                <span className={styles.trustLabel}>創作者、商家、消費者都能用</span>
                <p className={styles.trustDesc}>發文前檢查、下單前判讀</p>
              </div>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>3 秒</span>
                <span className={styles.trustLabel}>平均審核時間</span>
                <p className={styles.trustDesc}>業界最快</p>
              </div>
            </div>
          </div>
        </section>

        {/* ❓ FAQ 區 */}
        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>常見問題</h2>
            <div className={styles.faqGrid}>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  AI 快審通是免費的嗎？
                </summary>
                <p className={styles.faqAnswer}>
                  是的！基本審核功能完全免費，每天可免費審核 5 次。
                  未來進階功能（如圖片 OCR）可能會推出付費方案。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  審核結果有法律效力嗎？
                </summary>
                <p className={styles.faqAnswer}>
                  我們的 AI 分析僅供參考，不具正式法律效力。
                  建議作為風險預警工具，最終判斷請諮詢專業法律顧問或參照政府法規。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  我的文案內容會被保存嗎？
                </summary>
                <p className={styles.faqAnswer}>
                  不會。我們不會儲存你的文案內容，審核完成後即刻清除。
                  未登入用戶完全匿名，登入用戶可選擇保存審核記錄。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  AI 審核的準確率高嗎？
                </summary>
                <p className={styles.faqAnswer}>
                  我們的 AI 模型基於 GPT-4o 和 Claude，並整合台灣本地法規知識庫。
                  準確率約 90%+，但建議搭配人工判斷使用。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  可以審核哪些類型的內容？
                </summary>
                <p className={styles.faqAnswer}>
                  目前支援：商品頁文案、社群貼文、私訊回覆、客服話術、業配腳本等。
                  產品面向涵蓋保健食品、化妝品、醫美、一般食品、酒類、藥品等。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  消費者也適合使用嗎？
                </summary>
                <p className={styles.faqAnswer}>
                  可以。你可以把看到的廣告、商品頁、賣場客服話術貼進來，
                  先判斷有沒有誇大、療效暗示或高風險宣稱，再依頁面提供的官方連結決定是否申訴或檢舉。
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 文章區塊 */}
        <ArticlesSection />

        {/* 贊助區塊 */}
        <SponsorSection />

        {/* 最終 CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2 className={styles.finalCtaTitle}>
              先判斷有沒有誇大，再決定要不要發、要不要買
            </h2>
            <p className={styles.finalCtaDesc}>
              花 3 秒檢查，少踩一次罰單，也少踩一次衝動下單
            </p>
            <Link href="/review?mode=business" className={styles.ctaBtnLarge}>
              🔍 前往送審 / 風險辨識頁
            </Link>
            <p className={styles.finalCtaNote}>
              創作者、商家與消費者都適用
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <p className={styles.disclaimer}>
              ⚖️ 免責聲明：AI 快審通提供之建議僅供參考，不具法律效力。
              最終發布、購買、申訴或檢舉前，仍請以政府公告與主管機關說明為準。
              本服務為獨立開發之 AI 工具，與任何政府機關或第三方合規平台無關。
            </p>
            <p>© 2026 AI 快審通 ADCheck.ai. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
