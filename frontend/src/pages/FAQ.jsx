import { Link } from 'react-router-dom';
import SkipToContent from '../components/SkipToContent';
import FaqAccordion from '../components/FaqAccordion';
import { LastUpdated } from '../lib/content-dates';
import { Sparkles, ArrowLeft, MessageSquare } from 'lucide-react';

const FAQ_DATA = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is SocialPilot AI?',
    answer: 'SocialPilot AI is an all-in-one AI workspace designed for creators, solopreneurs, and growth teams to generate, schedule, optimize, and analyze high-performing social content across LinkedIn, Instagram, X, and Facebook.'
  },
  {
    id: 'faq-2',
    category: 'AI',
    question: 'How does the AI generation work?',
    answer: 'Our models analyze your previous top-performing posts, industry trends, and target audience tone to produce personalized hooks, body copy, carousels, and hashtag sets tailored for each platform algorithm.'
  },
  {
    id: 'faq-3',
    category: 'Integrations',
    question: 'Which platforms are supported?',
    answer: 'SocialPilot AI natively supports Instagram (Posts, Reels, Carousels), LinkedIn (Text, Documents/Carousels, Media), X / Twitter (Posts, Threads), and Facebook Business Pages.'
  },
  {
    id: 'faq-4',
    category: 'Billing',
    question: 'Is there a free trial?',
    answer: 'Yes! We offer a 14-day fully featured free trial with no credit card required. You get access to all AI Studio templates, unlimited drafts, and multi-channel scheduling.'
  },
  {
    id: 'faq-5',
    category: 'Billing',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime with one click in your Account Settings. You will retain access until the end of your billing cycle with zero cancellation fees.'
  },
  {
    id: 'faq-6',
    category: 'Security',
    question: 'Is my data safe and private?',
    answer: 'Yes. We use industry-standard 256-bit encryption in transit and at rest. We never sell your personal data or train public foundation models on your private drafts.'
  },
  {
    id: 'faq-7',
    category: 'General',
    question: 'Does SocialPilot AI work on mobile devices?',
    answer: 'Yes, our platform is fully responsive and optimized for mobile devices, tablets, and desktops so you can review drafts and manage posts on the go.'
  },
  {
    id: 'faq-8',
    category: 'Features',
    question: 'Can I schedule multi-slide carousels and threads?',
    answer: 'Absolutely. AI Studio provides dedicated formats for multi-image Instagram carousels, PDF sliders for LinkedIn, and multi-tweet X threads with custom delays.'
  },
  {
    id: 'faq-9',
    category: 'Features',
    question: 'How does automated performance analytics work?',
    answer: 'We sync engagement, impressions, follower growth, and response metrics hourly, giving you real-time graphs and automated weekly AI summaries of what resonated best.'
  },
  {
    id: 'faq-10',
    category: 'Team',
    question: 'Can I invite collaborators or team members?',
    answer: 'Pro and Agency plans allow you to invite unlimited team members with granular permission roles (Draft creator, Editor, Publisher, Admin).'
  },
  {
    id: 'faq-11',
    category: 'AI',
    question: 'Do I need my own OpenAI or Anthropic API key?',
    answer: 'No. All AI generation tokens and models are included in your subscription without needing separate API accounts or unexpected usage fees.'
  },
  {
    id: 'faq-12',
    category: 'Features',
    question: 'What happens if a post fails to publish?',
    answer: 'If a social network API is down or returns a temporary error, SocialPilot AI automatically retries up to three times and immediately alerts you via email and notification toast.'
  },
  {
    id: 'faq-13',
    category: 'AI',
    question: 'Are custom brand voices and tones supported?',
    answer: 'Yes! You can define your brand voice, prohibited words, emoji guidelines, and preferred industry terminology in Settings to ensure every AI generation matches your identity.'
  },
  {
    id: 'faq-14',
    category: 'Features',
    question: 'Can I export my analytics and reports?',
    answer: 'Yes, you can export reports in PDF and CSV format, or print clean presentation-ready charts using our print stylesheet.'
  },
  {
    id: 'faq-15',
    category: 'Integrations',
    question: 'How do I connect multiple social accounts?',
    answer: 'Navigate to the Connected Accounts tab in your workspace and click Connect next to any provider. We use standard secure OAuth 2.0 authorization.'
  },
  {
    id: 'faq-16',
    category: 'Developers',
    question: 'Is there a REST API for developers?',
    answer: 'Yes, our FastAPI backend includes OpenAPI / Swagger documentation at /docs with endpoints for programmatic draft creation and webhook callbacks.'
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <SkipToContent targetId="main-content" />
      <main id="main-content" tabIndex={-1} className="py-12 px-4 sm:px-6 lg:px-8 focus:outline-none">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="btn btn-ghost btn-sm text-text-2 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
          <LastUpdated pageKey="faq" />
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Help Center & Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-text-2 max-w-xl mx-auto">
            Everything you need to know about SocialPilot AI, subscriptions, AI generation, and security.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <FaqAccordion items={FAQ_DATA} />
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-card/60 text-center space-y-3">
          <h2 className="text-base font-semibold">Still have questions?</h2>
          <p className="text-xs text-text-2">
            Our support team is always available to assist with onboarding, custom workflows, or enterprise inquiries.
          </p>
          <div className="pt-2">
            <a
              href="mailto:support@socialpilot.ai"
              className="btn btn-primary btn-sm inline-flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Contact Support
            </a>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
