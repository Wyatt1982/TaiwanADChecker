import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SponsorSection } from '@/components/SponsorSection'
import { ArticlesSection } from '@/components/ArticlesSection'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section - 強化恐懼訴求 */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              ⚠️ 2024 年社群廣告違規案件成長 23%
            </div>
            <h1 className={styles.title}>
              一則私訊，
              <span className={styles.titleGradient}>罰款 4 萬起跳</span>
            </h1>
            <p className={styles.subtitle}>
              LINE 回個案例照片、IG 傳個見證圖，
              <br />
              <strong>截圖一秒，罰單跟著來。</strong>
            </p>
            <div className={styles.heroActions}>
              <Link href="/review" className={styles.ctaBtn}>
                🔍 馬上檢查你的文案
              </Link>
              <Link href="/cases" className={styles.secondaryBtn}>
                看真實開罰案例
              </Link>
            </div>
            <p className={styles.heroHint}>
              ✓ 完全免費 ✓ 3 秒出結果 ✓ 不用登入就能用
            </p>
          </div>

          <div className={styles.heroImage}>
            <img src="/images/hero.png" alt="AI 快審通 ADCheck.ai - AI 廣告法規審核" />
          </div>
          <div className={styles.heroGlow}></div>
        </section>

        {/* 🔥 恐懼橫幅 - 強調痛點 */}
        <section className={styles.fearBanner}>
          <div className={styles.container}>
            <div className={styles.fearContent}>
              <span className={styles.fearIcon}>🚨</span>
              <div className={styles.fearText}>
                <h2>你以為私訊很安全？</h2>
                <p>同業釣魚、職業檢舉人、不滿意的客戶... 隨時都在截圖等著檢舉你</p>
              </div>
            </div>
          </div>
        </section>

        {/* 💀 真實案例恐懼區 */}
        <section className={styles.horrorSection}>
          <div className={styles.container}>
            <h2 className={styles.horrorTitle}>這些都是真實發生的事...</h2>
            <div className={styles.horrorGrid}>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😰</span>
                <p>「客人私訊問效果，我傳了一張對比圖...」</p>
                <span className={styles.horrorResult}>罰款 4 萬</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😱</span>
                <p>「IG 限動分享吃了保健品很有精神...」</p>
                <span className={styles.horrorResult}>罰款 20 萬</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>💸</span>
                <p>「寫了『一次見效』被當成誇大不實...」</p>
                <span className={styles.horrorResult}>罰款 60 萬</span>
              </div>
              <div className={styles.horrorCard}>
                <span className={styles.horrorEmoji}>😭</span>
                <p>「回覆『可以改善睡眠問題』給客戶...」</p>
                <span className={styles.horrorResult}>罰款 8 萬</span>
              </div>
            </div>
            <p className={styles.horrorNote}>
              以上都是 2024-2025 年真實開罰案例
            </p>
          </div>
        </section>

        {/* 📊 數據衝擊區 */}
        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>4~400萬</span>
                <span className={styles.statLabel}>保健食品罰款範圍</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>60%</span>
                <span className={styles.statLabel}>違規來自社群貼文</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>+23%</span>
                <span className={styles.statLabel}>2024 年違規案件成長</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>私訊</span>
                <span className={styles.statLabel}>也算廣告內容</span>
              </div>
            </div>
          </div>
        </section>

        {/* ⚠️ 高風險行為清單 */}
        <section className={styles.riskSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>你是不是也做過這些事？</h2>
            <div className={styles.riskGrid}>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>私訊傳送使用前後對比圖</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>說「吃了很有效」「皮膚變好了」</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>分享客戶「見證」「體驗心得」</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>用「改善」「治療」「根治」等字眼</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>回覆陌生詢問時提供案例照片</p>
              </div>
              <div className={styles.riskItem}>
                <span className={styles.riskCheck}>❌</span>
                <p>宣稱「一次見效」「保證有感」</p>
              </div>
            </div>
            <p className={styles.riskWarning}>
              👆 每一項都可能讓你收到 4 萬起跳的罰單
            </p>
          </div>
        </section>

        {/* 🛡️ 解決方案區 */}
        <section className={styles.solutionSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>3 秒知道文案有沒有問題</h2>
            <div className={styles.stepGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>01</div>
                <h3>貼上你的文案</h3>
                <p>私訊內容、貼文文案、回覆話術都可以</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>02</div>
                <h3>AI 自動檢測</h3>
                <p>比對食安法、藥事法、化妝品法規</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>03</div>
                <h3>取得安全版本</h3>
                <p>告訴你哪裡有風險、怎麼改才安全</p>
              </div>
            </div>
            <div className={styles.solutionCta}>
              <Link href="/review" className={styles.ctaBtnLarge}>
                免費檢查我的文案 →
              </Link>
              <span className={styles.ctaSubtext}>不用註冊、不用登入、不收費</span>
            </div>
          </div>
        </section>

        {/* 🎯 受眾區分 */}
        <section className={styles.audienceSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>誰需要這個工具？</h2>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>💆‍♀️</span>
                <h3>美業工作者</h3>
                <p>美容師、美甲師、美睫師、美體師</p>
                <small>私訊回覆客戶時最容易踩雷</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>🔮</span>
                <h3>身心靈產業</h3>
                <p>能量療癒、芳療師、頌缽音療</p>
                <small>「療癒」「改善」超容易被罰</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>💊</span>
                <h3>保健品銷售</h3>
                <p>直銷、電商、團購主</p>
                <small>產品推薦文案高風險群</small>
              </div>
              <div className={styles.audienceCard}>
                <span className={styles.audienceIcon}>📱</span>
                <h3>KOL / 創作者</h3>
                <p>接業配、推廣合作</p>
                <small>品牌給的文案不一定合規</small>
              </div>
            </div>
          </div>
        </section>

        {/* 💬 恐懼喚起區 */}
        <section className={styles.quoteSection}>
          <div className={styles.container}>
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                「我只是回個 LINE 分享效果，怎麼知道會被罰 4 萬...」
              </p>
              <span className={styles.quoteAuthor}>— 某美業工作者</span>
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
                我們正在開發更多功能，讓你的每一則內容都能安心發布
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
                  <li>⚡ 秒速辨識圖中文字</li>
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
                  作為品牌合作的合規證明，保護自己的同時展現專業。
                </p>
                <ul className={styles.comingSoonFeatures}>
                  <li>📋 專業審核報告</li>
                  <li>✅ 合規通過證明</li>
                  <li>📤 一鍵分享給品牌</li>
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
                <span className={styles.trustLabel}>篇文案已審核</span>
                <p className={styles.trustDesc}>持續增加中</p>
              </div>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>NT$ 1,200萬+</span>
                <span className={styles.trustLabel}>潛在罰款已避免</span>
                <p className={styles.trustDesc}>保護每一位用戶</p>
              </div>
              <div className={styles.trustCard}>
                <span className={styles.trustNumber}>500+</span>
                <span className={styles.trustLabel}>位 KOL 信任使用</span>
                <p className={styles.trustDesc}>美業、保健品、身心靈</p>
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
                  目前支援：保健食品、化妝品、醫美廣告、食品、酒類等。
                  未來將擴充更多產業別。
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  跟「快合規」有什麼不同？
                </summary>
                <p className={styles.faqAnswer}>
                  我們專為 KOL、美業、個人創作者設計，強調「免費、快速、輕量」。
                  快合規偏向企業級解決方案，適合大型品牌。
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
              一張對比圖，可能讓你賠掉半年營收
            </h2>
            <p className={styles.finalCtaDesc}>
              花 3 秒檢查，省下 4 萬以上的罰款
            </p>
            <Link href="/review" className={styles.ctaBtnLarge}>
              🔍 立即免費檢查文案
            </Link>
            <p className={styles.finalCtaNote}>
              已經有 <strong>1,200+</strong> 位美業人使用過
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <p className={styles.disclaimer}>
              ⚖️ 免責聲明：AI 快審通提供之建議僅供參考，不具法律效力。
              最終文案發布請參照政府公告之正式法規。
              本服務為獨立開發之 AI 工具，與任何政府機關或第三方合規平台無關。
            </p>
            <p>© 2026 AI 快審通 ADCheck.ai. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
