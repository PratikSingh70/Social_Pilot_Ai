import { Link } from 'react-router-dom';
import SkipToContent from '../components/SkipToContent';
import { LastUpdated } from '../lib/content-dates';
import { ArrowLeft, Shield } from 'lucide-react';

const LEGAL_DOCS = {
  privacy: {
    title: 'Privacy Policy',
    key: 'privacy',
    sections: [
      { heading: '1. Information We Collect', text: 'We collect information you provide directly to us when creating an account, connecting social media profiles, and composing posts. We do not sell your personal data to third parties.' },
      { heading: '2. How We Use Information', text: 'We use the information we collect to operate, maintain, and provide the features of SocialPilot AI, including generating personalized social media drafts and compiling engagement analytics.' },
      { heading: '3. Data Security & Storage', text: 'We implement industry-standard encryption protocols (TLS 1.3 in transit and AES-256 at rest) to safeguard your account credentials and connected API tokens.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    key: 'terms',
    sections: [
      { heading: '1. Acceptance of Terms', text: 'By accessing or using SocialPilot AI, you agree to be bound by these Terms of Service and all applicable platform policies of integrated social networks.' },
      { heading: '2. User Accounts & Responsibilities', text: 'You are responsible for safeguarding your password and account details, and for all activities that occur under your account credentials.' },
      { heading: '3. Acceptable Use', text: 'You agree not to use SocialPilot AI to generate or distribute spam, harassment, hateful content, or any material that violates social media platform terms.' },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    key: 'cookies',
    sections: [
      { heading: '1. What Are Cookies', text: 'Cookies are small text files placed on your device to remember user session preferences, analyze service performance, and secure your login tokens.' },
      { heading: '2. How We Use Cookies', text: 'We use essential cookies to maintain your authenticated session and optional analytics cookies to measure feature adoption and application load times.' },
      { heading: '3. Managing Your Preferences', text: 'You can update your cookie choices at any time via the Cookie Banner at the bottom of the page or through your browser settings.' },
    ],
  },
};

/**
 * Universal legal policy page (Privacy, Terms, Cookies) featuring semantic <time> LastUpdated component.
 * @param {{ docType: 'privacy' | 'terms' | 'cookies' }} props
 */
export default function LegalPage({ docType = 'privacy' }) {
  const doc = LEGAL_DOCS[docType] || LEGAL_DOCS.privacy;

  return (
    <div className="min-h-screen bg-bg text-white">
      <SkipToContent targetId="main-content" />
      <main id="main-content" tabIndex={-1} className="py-12 px-4 sm:px-6 lg:px-8 focus:outline-none">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="btn btn-ghost btn-sm text-text-2 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
          <LastUpdated pageKey={doc.key} />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> Compliance & Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{doc.title}</h1>
        </div>

        <div className="card p-6 sm:p-8 space-y-6 text-sm text-text-2 leading-relaxed">
          {doc.sections.map((sec) => (
            <section key={sec.heading} className="space-y-2">
              <h2 className="text-base font-semibold text-white">{sec.heading}</h2>
              <p>{sec.text}</p>
            </section>
          ))}
        </div>
      </div>
      </main>
    </div>
  );
}
