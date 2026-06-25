import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Jeremy Cotten, NC Attorney',
  description:
    'Jeremy Cotten is a North Carolina traffic and criminal defense attorney and founder of Cotten Firm, PLLC in Fuquay-Varina. Licensed since 2012; Campbell Law J.D.',
  alternates: { canonical: 'https://blog.cottenfirm.com/about' },
  openGraph: {
    title: 'About Jeremy Cotten, NC Attorney',
    description:
      'North Carolina traffic and criminal defense attorney. Founder of Cotten Firm, PLLC. Campbell Law J.D., licensed since 2012.',
    type: 'profile',
    url: 'https://blog.cottenfirm.com/about',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jeremy Cotten',
  jobTitle: 'Attorney',
  description:
    'North Carolina traffic and criminal defense attorney; founder of Cotten Firm, PLLC. Licensed to practice in North Carolina since 2012.',
  url: 'https://blog.cottenfirm.com/about',
  image: 'https://blog.cottenfirm.com/favicon.ico',
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Campbell University School of Law' },
    { '@type': 'CollegeOrUniversity', name: 'Campbell University' },
  ],
  knowsAbout: [
    'North Carolina traffic law',
    'DWI defense',
    'driving while license revoked',
    'speeding tickets',
    'criminal defense',
  ],
  worksFor: {
    '@type': 'LegalService',
    name: 'Cotten Firm, PLLC',
    url: 'https://cottenfirm.com',
    telephone: '+19195867072',
    areaServed: ['Wake County, NC', 'Johnston County, NC', 'Harnett County, NC', 'Chatham County, NC', 'Orange County, NC'],
  },
  sameAs: ['https://www.facebook.com/cottenlawpllc', 'https://x.com/spokestatutejc'],
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-blue-600">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-600">About the Author</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Jeremy Cotten</h1>
      <p className="text-slate-500 mb-8">North Carolina Attorney · Founder, Cotten Firm, PLLC</p>

      <div className="prose max-w-none text-slate-700">
        <p>
          Jeremy Cotten is the attorney behind every article on this blog and the founder of{' '}
          <strong>Cotten Firm, PLLC</strong>, a traffic and criminal defense practice based in
          Fuquay-Varina, North Carolina. He has been licensed to practice law in North Carolina
          since <strong>2012</strong>.
        </p>
        <p>
          His path to law was anything but a straight line. Before he ever set foot in a courtroom,
          Jeremy chased a <strong>baseball career</strong>, then spent years in <strong>financial
          services</strong>, earning professional designations along the way. He holds a{' '}
          <strong>B.A. in Trust &amp; Investment Management from Campbell University</strong> and went
          on to earn his <strong>J.D. from Campbell University School of Law</strong>. That finance
          background still shapes how he talks to clients — in plain, dollars-and-cents terms about
          what a conviction actually costs (license points, insurance surcharges, and the long tail of
          expense most drivers never see coming).
        </p>
        <p>
          A familiar face around <strong>Fuquay-Varina</strong> and the surrounding towns, Jeremy is
          proud to be a local — and much of his practice comes from neighbors, friends, and word of
          mouth in the community he calls home.
        </p>
        <p>
          Today, Jeremy focuses on traffic tickets, DWI, driving-while-license-revoked, and related
          criminal matters across <strong>Wake, Johnston, Harnett, Chatham, and Orange counties</strong>.
          He built his practice around a simple model: a flat fee, online sign-up, and{' '}
          <strong>appearing in court so his clients don&rsquo;t have to</strong>.
        </p>
        <p>
          This blog exists to give North Carolina drivers straight, accurate answers about their
          charges — grounded in the actual statutes and how cases really resolve in local courts.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm">
        <a href="https://www.facebook.com/cottenlawpllc" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600">Facebook</a>
        <a href="https://x.com/spokestatutejc" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600">X (Twitter)</a>
        <a href="tel:+19195867072" className="text-slate-500 hover:text-blue-600">(919) 586-7072</a>
      </div>

      <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-center">
        <h2 className="text-white text-xl font-bold mb-2">Facing a charge in North Carolina?</h2>
        <p className="text-slate-400 text-sm mb-4">
          Sign up online in minutes — we handle the court appearance so you don&rsquo;t have to.
        </p>
        <a
          href="https://portal.cottenfirm.com?utm_source=blog&utm_medium=about_page&utm_campaign=hire"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
        >
          Hire Us Now → Get Started
        </a>
      </div>
    </div>
  )
}
