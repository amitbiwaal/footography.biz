import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/site/CtaBand'
import { Icon, type IconName } from '@/components/site/Icons'
import { JsonLd } from '@/components/site/JsonLd'
import { PostCard } from '@/components/site/PostCard'
import { homeFaqs } from '@/lib/faqs'
import { getPublishedPosts } from '@/lib/posts'
import { graph, organizationLd, pageMetadata, webPageLd, websiteLd } from '@/lib/seo'
import { AFFILIATE_URL, site } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = pageMetadata({
  title: site.title,
  absoluteTitle: true,
  description: site.description,
  path: '/',
})

const features: { icon: IconName; title: string; text: string }[] = [
  { icon: 'dollar', title: 'You Set the Price', text: 'Charge what your work deserves. Footography lets you price single photos, full sets, or subscriptions, and change your mind anytime without penalty.' },
  { icon: 'lock', title: 'Stay Anonymous', text: 'Sell feet pics online without anyone learning your name. Footography offers anonymity options and watermarking so your content travels but your identity never does.' },
  { icon: 'bolt', title: 'Payouts That Arrive', text: 'No chasing buyers, no awkward payment reminders. Footography runs checkout for you and sends your earnings through a payout system you can actually track.' },
  { icon: 'search', title: 'Buyers Find You', text: 'Your foot photography gets listed in browsable categories, so buyers searching the Footography marketplace land on your profile instead of scrolling past it.' },
  { icon: 'chart', title: 'Know What Sells', text: 'Footography shows you which photos earn and which sit idle, so every new upload gets smarter than your last one.' },
  { icon: 'phone', title: 'Works Like an App', text: 'Footography online runs beautifully in your phone browser, a footography app experience with nothing to download. Shoot, upload, price, and sell from your couch.' },
]

const benefitsLeft = [
  ['Your Content, Your Rules.', 'On Footography you decide what gets posted, what it costs, and who gets to see it.'],
  ['Privacy That Actually Holds.', 'Watermarks and anonymity tools mean you can sell feet pics online without your name ever entering the chat.'],
  ['Income Shaped Around You.', 'Single photos, bundles, or subscriptions, Footography bends to whichever feet pic selling style suits your life.'],
  ['Buyers Arrive Pre-Sold.', 'People on Footography came to purchase foot photography, so your first sale is days away, not months.'],
]
const benefitsRight = [
  ['Checkout Buyers Trust.', 'A clean professional Footography payment flow means fewer abandoned carts and smoother money for you.'],
  ['Zero Technical Babysitting.', 'Footography hosts, delivers, and guards your files while you stay focused on the camera.'],
  ['Grow When You Do.', 'Start selling feet pictures as a casual side hustle and scale into a real Footography business at your own speed.'],
  ['A Space Built Respectful.', 'Footography keeps creators and buyers in one purpose built community instead of the wild west of open apps.'],
]

const steps = [
  ['Open Your Free Footography Account', 'Sign up free, pick a creator name that is not your real one, and set your privacy preferences before you post.'],
  ['Upload Your Best Foot Photography', 'Add your strongest shots to Footography, watermark every feet pic, and organize your work into sets or categories.'],
  ['Price Your Feet Pics Your Way', 'Choose pay per photo, bundles, or subscriptions. Feet pic selling on Footography always runs on your numbers.'],
  ['Get Found on the Footography Marketplace', 'Footography puts your foot pics in front of browsing buyers while you share your profile link to grow your audience.'],
  ['Get Paid Selling Feet Pictures', 'When buyers purchase, Footography handles secure checkout and sends your payout. Then you upload the next set.'],
]

const categories = [
  ['Everyday Style', 'Casual lifestyle feet pics shot at home. The easiest starting point for brand new Footography creators.'],
  ['Beach and Sandals', 'Sun, sand, and open air sets. One of the most browsed corners of the Footography marketplace.'],
  ['Polished and Pedicures', 'Close up foot photography where grooming and detail do the selling. Craft shows on Footography.'],
  ['Custom Requests', 'Buyers describe the shot, you create it. Footography keeps tailored feet pic orders safe for both sides.'],
  ['Seasonal and Themed', 'Holiday sets and creative themes that keep your Footography profile fresh through the whole year.'],
  ['Subscriptions', 'Loyal buyers pay monthly for your newest work, turning Footography uploads into recurring income.'],
  ['Bundles and Sets', 'Group your foot pics into value packs that lift order size across the Footography marketplace.'],
  ['Premium Originals', 'Exclusive high end foot photography for buyers who want standout Footography feet pics worth collecting.'],
]

const why: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Safety by Design', text: 'Most platforms treat creator safety as an afterthought. Footography starts there, with privacy tools and secure delivery built into every step of selling feet pics online.' },
  { icon: 'target', title: 'Built for the Niche', text: 'A foot pic website attracts foot pic buyers. People arriving on Footography already want what you create, so you skip the convincing and go straight to selling.' },
  { icon: 'badge', title: 'Fair for Creators', text: 'No mystery math. Footography keeps pricing in your hands and payouts transparent, so you always know exactly what your feet pics earn before you post them.' },
]

const comparison = [
  ['Built for foot photography', 'Yes', 'No'],
  ['Privacy and watermarking tools', 'Yes', 'Limited'],
  ['Secure built in payments', 'Yes', 'Risky and manual'],
  ['You set your own prices', 'Yes', 'Varies'],
  ['Buyer discovery by category', 'Yes', 'No'],
  ['Designed to reduce content theft', 'Yes', 'No'],
]

const audiences = [
  ['New Creators', 'Never sold a photo before? Footography feet pics start with people exactly like you, fully guided.'],
  ['Side Hustlers', 'Footography online fits a busy life. Shoot on Sunday, upload in minutes, earn all week.'],
  ['Established Creators', 'Bring your audience to Footography for tighter privacy, cleaner organization, and payouts you can rely on.'],
  ['Photographers', 'If foot photography is your craft, Footography pairs your polished work with buyers who pay for quality.'],
  ['Buyers and Collectors', 'For buyers, Footography is a curated marketplace of original feet pics from real creators.'],
  ['Privacy Conscious Sellers', 'The footography app experience plus anonymity tools means selling feet pics without your identity leaving home.'],
]

const quotes = [
  ['Footography is not a scam. It gave me a real way to start selling feet pics without showing my face anywhere.', 'Emilia, Footography Creator'],
  ['Footography online turned out to be more than income for me. It is a safe space where creators actually support each other.', 'Linda, Footography Creator'],
  ['I checked is Footography legit before joining and the security scores convinced me. Glad I started when I did.', 'Footography community voice'],
]

const tips: { icon: IconName; title: string; text: string }[] = [
  { icon: 'bulb', title: 'Chase the Light', text: 'Natural light does half your selling. Bright clean feet pics outperform everything else on Footography.' },
  { icon: 'calendar', title: 'Show Up Weekly', text: 'Fresh uploads keep your Footography profile alive and tell returning buyers you are worth following.' },
  { icon: 'tag', title: 'Title Like a Buyer', text: 'Use words buyers actually search. Descriptive titles get found across the Footography marketplace.' },
  { icon: 'drop', title: 'Watermark Everything', text: 'Never share previews without a Footography watermark. Stolen content earns someone else your money.' },
  { icon: 'gift', title: 'Sell in Bundles', text: 'Sets and subscriptions raise buyer spend on Footography and turn one time customers into regulars.' },
  { icon: 'megaphone', title: 'Pull Traffic In', text: 'Your other platforms are billboards. Point them at your Footography page and watch attention become sales.' },
]

const market: { icon: IconName; title: string; text: string }[] = [
  { icon: 'chart', title: 'Demand Keeps Rising', text: 'Buyer appetite for original foot photography grows yearly, and Footography sits exactly where it lands.' },
  { icon: 'users', title: 'Buyers Come Ready', text: 'Footography visitors arrive intending to purchase, which shortens the road to your first sale.' },
  { icon: 'shield', title: 'Nothing to Lose', text: 'No upfront investment needed. Test Footography with one starter set and scale only when it works.' },
]

function AffiliateButton({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  return (
    <a className={`btn${large ? ' btn-lg' : ''}`} href={AFFILIATE_URL} rel="nofollow sponsored noopener" target="_blank">
      {children}
    </a>
  )
}

export default async function HomePage() {
  const { posts } = await getPublishedPosts({ limit: 3 })

  const jsonLd = graph(
    organizationLd,
    websiteLd,
    webPageLd({ path: '/', title: site.title, description: site.description }),
    {
      '@type': 'FAQPage',
      '@id': `${site.url}/#faq`,
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  )

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* 1. HERO */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="wrap inner">
          <span className="eyebrow">Footography Feet Pics</span>
          <h1 id="hero-h1">Footography Makes Selling Feet Pics Online Simple</h1>
          <p className="lead">
            Footography is a dedicated foot photography marketplace where creators sell feet pics online on their own terms and
            buyers discover original feet content from real people in one secure place.
          </p>
          <div className="hero-cta">
            <AffiliateButton large>Get Started on Footography</AffiliateButton>
            <a className="btn btn-lg btn-ghost" href="#how-it-works">
              See How It Works
            </a>
          </div>
          <div className="pill-row">
            <span className="pill"><Icon name="lock" />Privacy first</span>
            <span className="pill"><Icon name="dollar" />You set prices</span>
            <span className="pill"><Icon name="bolt" />Fast payouts</span>
            <span className="pill"><Icon name="globe" />Global buyers</span>
          </div>
        </div>
      </section>

      {/* 2. ABOUT */}
      <section id="about" aria-labelledby="about-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">About the Platform</span>
            <h2 id="about-h">What Is Footography and How Does It Work</h2>
          </div>
          <p className="lead">
            Footography is exactly what it sounds like. Feet plus photography, turned into a real marketplace. It is a foot pic
            website where ordinary people sell feet pics online without showing their face, without haggling with strangers in
            DMs, and without praying that a buyer actually pays. You post your foot photography, you name your price, and
            Footography handles the boring parts like checkout and delivery.
          </p>
          <p>
            Here is the part most newcomers miss. The hardest thing about feet pic selling is not taking good photos, it is
            finding people who actually want to buy them. Footography online solves that by putting your work in front of buyers
            who came specifically looking for Footography feet pics, not random scrollers. So whether selling feet pictures online
            is your weekend experiment or your next serious income stream, you start with an audience instead of an empty room.
          </p>
          <p>
            <a href={AFFILIATE_URL} rel="nofollow sponsored noopener" target="_blank">
              Explore the Footography marketplace →
            </a>{' '}
            or <Link href="/about">learn more about this guide</Link>.
          </p>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section className="alt cv-auto" id="features" aria-labelledby="feat-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Key Features</span>
            <h2 id="feat-h">Everything You Need to Sell Feet Pics on Footography</h2>
            <p className="lead">No plugins, no spreadsheets, no patchwork of apps. Footography puts the whole selling toolkit in one place.</p>
          </div>
          <div className="grid g3">
            {features.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon"><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BENEFITS */}
      <section className="cv-auto" id="benefits" aria-labelledby="ben-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Footography</span>
            <h2 id="ben-h">Why Creators Pick Footography for Selling Feet Pictures</h2>
          </div>
          <div className="grid g2">
            {[benefitsLeft, benefitsRight].map((col, i) => (
              <ul className="checks" key={i}>
                {col.map(([title, text]) => (
                  <li key={title}>
                    <strong>{title}</strong> {text}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <p className="section-foot">
            <AffiliateButton>Join Footography Today</AffiliateButton>
          </p>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="alt cv-auto" id="how-it-works" aria-labelledby="how-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Getting Started with Footography</span>
            <h2 id="how-h">How to Sell Feet Pics Online with Footography in 5 Steps</h2>
            <p className="lead">Getting started on Footography takes just a few simple steps with no studio and no experience required.</p>
          </div>
          <ol className="steps" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map(([title, text]) => (
              <li className="step" key={title}>
                <div className="num" aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. CATEGORIES */}
      <section className="cv-auto" id="categories" aria-labelledby="cat-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What You Will Find</span>
            <h2 id="cat-h">Feet Pic Categories Across the Footography Marketplace</h2>
            <p className="lead">Footography sorts foot photography into clear categories so buyers land on exactly what they want and creators reach the right audience.</p>
          </div>
          <div className="grid g4">
            {categories.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE */}
      <section className="alt cv-auto" id="why" aria-labelledby="why-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Choose Footography</span>
            <h2 id="why-h">What Makes Footography Different from Other Foot Pic Websites</h2>
            <p className="lead">Footography was built from day one for foot photography, not bolted onto a generic app, and that focus shows everywhere.</p>
          </div>
          <div className="grid g3">
            {why.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon"><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COMPARISON */}
      <section className="cv-auto" id="compare" aria-labelledby="cmp-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Comparison</span>
            <h2 id="cmp-h">Footography vs Generic Social Apps for Selling Feet Pics</h2>
            <p className="lead">Plenty of people still try selling feet pictures through DMs and open apps. Here is what that actually costs you.</p>
          </div>
          <div className="table-wrap" role="region" aria-labelledby="cmp-h" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Footography</th>
                  <th scope="col">Generic Social and DMs</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feature, yes, no]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td className="yes">{yes}</td>
                    <td className="no">{no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. USE CASES */}
      <section className="alt cv-auto" id="who" aria-labelledby="who-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Community</span>
            <h2 id="who-h">Who Uses Footography Online for Feet Pic Selling</h2>
          </div>
          <div className="grid g3">
            {audiences.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF */}
      <section className="cv-auto" id="proof" aria-labelledby="proof-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Legit Check</span>
            <h2 id="proof-h">Creators and Buyers Can Trust Footography</h2>
          </div>
          <div className="stats">
            <div className="stat"><div className="big">100</div><span>Trust score</span></div>
            <div className="stat"><div className="big">20+</div><span>Years online</span></div>
            <div className="stat"><div className="big">365</div><span>Days encrypted</span></div>
            <div className="stat"><div className="big">2026</div><span>Verified legit</span></div>
          </div>
          <div className="grid g3">
            {quotes.map(([text, who]) => (
              <figure className="quote" key={who}>
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote style={{ margin: 0 }}>
                  <p>“{text}”</p>
                </blockquote>
                <figcaption className="who">— {who}</figcaption>
              </figure>
            ))}
          </div>
          <p className="small-note">Trust scores above are sourced from independent third party security reports.</p>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="alt cv-auto" id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography FAQs</span>
            <h2 id="faq-h">Questions People Ask Before Selling Feet Pics on Footography</h2>
            <p className="lead">Quick answers to the questions people ask most before they sell feet pics online with Footography.</p>
          </div>
          {homeFaqs.map((f) => (
            <details className="faq" key={f.q}>
              <summary>
                <h3 style={{ fontSize: 'inherit', margin: 0 }}>{f.q}</h3>
              </summary>
              <div className="answer">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 12. GETTING STARTED */}
      <section className="cv-auto" id="get-started" aria-labelledby="gs-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Quick Start</span>
            <h2 id="gs-h">The Six Step Checklist to Start Selling Feet Pics Online</h2>
            <p className="lead">Six short moves between you and your first Footography sale. Most creators clear this list in one afternoon.</p>
          </div>
          <div className="grid g2">
            <ul className="checks">
              <li><strong>Step 1 —</strong> Open your free Footography account and lock your privacy settings before anything else.</li>
              <li><strong>Step 2 —</strong> Shoot 5 to 10 strong feet pics in bright natural light, sharp and clean.</li>
              <li><strong>Step 3 —</strong> Upload to Footography, watermark every photo, and sort your work into neat sets.</li>
            </ul>
            <ul className="checks">
              <li><strong>Step 4 —</strong> Price a starter bundle slightly low to invite those important first purchases.</li>
              <li><strong>Step 5 —</strong> Share your Footography profile link wherever your audience already spends time.</li>
              <li><strong>Step 6 —</strong> Watch what sells, then double down on your winners with every new upload.</li>
            </ul>
          </div>
          <p className="section-foot">
            <AffiliateButton large>Start on Footography Now</AffiliateButton>
          </p>
        </div>
      </section>

      {/* 13. TIPS */}
      <section className="alt cv-auto" id="tips" aria-labelledby="tips-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Seller Tips</span>
            <h2 id="tips-h">How Top Creators Sell More Feet Pics on Footography</h2>
            <p className="lead">The creators earning steadily on Footography share a few habits anyone can copy from day one.</p>
          </div>
          <div className="grid g3">
            {tips.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon teal"><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 14. SAFETY */}
      <section className="cv-auto" id="safety" aria-labelledby="safety-h">
        <div className="wrap">
          <div className="banner">
            <div>
              <span className="eyebrow">Footography Privacy</span>
              <h2 id="safety-h">Sell Feet Pics Online Without Anyone Knowing Your Name</h2>
              <p>
                Ask anyone hesitating to start feet pic selling and the answer is almost never about photography. It is about
                exposure. Will someone recognize me, will my photos end up somewhere I never agreed to, will this follow me later.
                Footography was engineered around exactly those fears, with privacy decisions placed in your hands at every single
                step.
              </p>
              <p>
                On Footography you choose what is visible, who can buy, and how every photo is watermarked before a buyer ever sees
                it. Your face stays out of frame, your name stays off the page, and your foot photography earns for you quietly.
                That is the whole point, income without a trace you did not choose to leave.
              </p>
              <p className="section-foot">
                <AffiliateButton>Visit Footography Now</AffiliateButton>
              </p>
            </div>
            <div className="art">
              <ul className="checks">
                <li><strong>Optional anonymity.</strong> Sell on Footography without revealing your real name or face anywhere.</li>
                <li><strong>Automatic watermarking.</strong> Every preview carries your mark, making stolen reposts worthless.</li>
                <li><strong>Secure delivery.</strong> Footography hosts and serves your files so they are never left exposed.</li>
                <li><strong>Buyer controls.</strong> Block, limit, or screen exactly who gets access to your feet pics.</li>
                <li><strong>Encrypted payments.</strong> Every sale moves through the protected Footography checkout.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 15. MARKET */}
      <section className="alt cv-auto" id="market" aria-labelledby="market-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Footography Opportunity</span>
            <h2 id="market-h">Why Now Is the Right Time for Feet Pic Selling on Footography</h2>
            <p className="lead">
              Five years ago, earning from your own photos meant building a following first. That rule is dead. The creator economy
              flipped the script, and feet pic selling sits in one of its most open corners. Buyers want authentic foot photography
              from real people, not polished agency content, and Footography is where that demand already gathers.
            </p>
          </div>
          <p>
            Look at what you actually need to start. Not a camera kit, not connections, not ten thousand followers. A phone, a
            window with good light, and the patience to upload consistently. Footography kept the entry bar deliberately low because
            the platform earns when creators succeed, which is exactly the incentive you want behind any marketplace you join.
          </p>
          <p>
            Here is the real difference though. On social apps you post and pray someone scrolling happens to care. On Footography
            online, every visitor arrived intending to buy feet pics. High intent traffic plus built in category discovery means
            your first sale sits days away instead of months, and the same machine keeps working as your catalog grows.
          </p>
          <div className="grid g3 mt-lg">
            {market.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon"><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 16. LATEST BLOG POSTS */}
      {posts.length > 0 && (
        <section className="cv-auto" id="latest" aria-labelledby="latest-h">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">From the Blog</span>
              <h2 id="latest-h">Latest Guides for Footography Creators</h2>
              <p className="lead">Practical, privacy-first advice on shooting, pricing, and selling foot photography online.</p>
            </div>
            <div className="post-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <p className="section-foot">
              <Link className="btn btn-ghost" href="/blog">
                Read All Articles
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 17. FINAL CTA */}
      <CtaBand
        text="Everything you read above comes down to one decision. Open your free Footography account, upload your first set, and let buyers who are already searching find your feet pics. Privacy stays in your hands, prices stay in your hands, and your first payout could be closer than you think."
      />
    </>
  )
}
