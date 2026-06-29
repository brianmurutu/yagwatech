'use client';

import { useState, useEffect } from 'react';
import { Send, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
}

const MOCK_COMMENTS: Record<string, { name: string; date: string; text: string }[]> = {
  "why-every-business-needs-cloud-migration": [
    { name: "David Mwangi", date: "2026-06-15", text: "This is very true. We migrated our inventory system to AWS last year and our hosting costs dropped by 40%. The reliability is unmatched." },
    { name: "Sarah Kamau", date: "2026-06-18", text: "A very clear explanation. The part about not doing it overnight is key: baby steps and starting with low-risk systems is the best approach." }
  ],
  "kenya-ai-readiness-ranking-what-it-means": [
    { name: "John Koech", date: "2026-06-02", text: "Exciting times for Kenya! We really need more local AI developer training programs to capture this opportunity." },
    { name: "Amina Juma", date: "2026-06-05", text: "Great insights. I hope the government policies support local startup growth rather than just regulating them too early." }
  ],
  "essential-managed-it-services-for-small-business": [
    { name: "Peter Njoroge", date: "2026-05-12", text: "Highly recommend data backups and regular security monitoring. We learned the hard way when our office server failed two years ago." },
    { name: "Grace Wambui", date: "2026-05-15", text: "Strategic IT planning is indeed underused. Most small businesses only call IT support when things break. Prevention is better!" }
  ],
  "mpesa-daraja-integration-guide-for-kenyan-businesses": [
    { name: "Michael Musembi", date: "2026-06-20", text: "Daraja asynchronous callbacks were a nightmare for us to debug. Excellent guide on handling callback retries and timeouts." },
    { name: "Josephat Ndegwa", date: "2026-06-22", text: "STK push makes checkout conversion so much better: customers just enter their PIN and the order completes automatically." }
  ],
  "signs-your-business-website-needs-a-redesign": [
    { name: "Jane Wanjiku", date: "2026-06-10", text: "Our mobile site layout was terrible. Redesigning it for mobile-first doubled our mobile leads within a month." },
    { name: "Robert Mutua", date: "2026-06-14", text: "Page speed is everything. 3 seconds is indeed the cutoff: after that, visitors just bounce back to Google." }
  ],
  "digital-transformation-roadmap-for-smes-in-kenya": [
    { name: "Lucy Atieno", date: "2026-06-24", text: "Starting small and building confidence is a great tip for SMEs. Doing too much at once just overwhelms the staff." },
    { name: "Patrick Mwiti", date: "2026-06-26", text: "Staff training is often overlooked but so critical. A tool is only as good as the people using it." }
  ]
};

const AVATAR_COLORS = [
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-orange-500 text-white',
  'bg-purple-500 text-white',
  'bg-pink-500 text-white',
  'bg-teal-500 text-white',
  'bg-indigo-500 text-white'
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface BlogCommentsProps {
  slug: string;
}

export default function BlogComments({ slug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load comments
  useEffect(() => {
    const key = `yagwa_blog_comments_${slug}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse comments:', e);
      }
    } else {
      // Load mock comments
      const mocks = MOCK_COMMENTS[slug] || [];
      const formattedMocks = mocks.map((m, idx) => ({
        id: `mock-${idx}`,
        name: m.name,
        date: m.date,
        text: m.text
      }));
      setComments(formattedMocks);
      localStorage.setItem(key, JSON.stringify(formattedMocks));
    }
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitSuccess(false);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!text.trim()) {
      setError('Please write a comment.');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        name: name.trim(),
        date: new Date().toISOString().split('T')[0],
        text: text.trim()
      };

      const updated = [...comments, newComment];
      setComments(updated);
      localStorage.setItem(`yagwa_blog_comments_${slug}`, JSON.stringify(updated));

      // Reset form
      setName('');
      setEmail('');
      setText('');
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Dismiss success banner after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="mt-14 border-t border-black/5 pt-10">
      <div className="flex items-center gap-2.5 mb-8">
        <MessageSquare className="h-5 w-5 text-brand-orange" />
        <h3 className="text-xl font-bold text-ink-900">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 ? (
          <p className="text-sm text-ink-400 italic">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => {
            const initials = comment.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={comment.id}
                className="flex gap-4 p-5 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 font-bold text-sm ${getAvatarColor(comment.name)}`}>
                  {initials || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-[14.5px] text-ink-900">{comment.name}</span>
                    <span className="text-[11px] text-ink-400">
                      {new Date(comment.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Form */}
      <div className="rounded-2xl border border-black/5 bg-ink-50 p-6 sm:p-8">
        <h4 className="text-base font-bold text-ink-900 mb-4">Leave a Comment</h4>
        
        {submitSuccess && (
          <div className="flex items-center gap-2 mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Thank you! Your comment has been posted successfully.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="block text-xs font-semibold text-ink-600 mb-1.5">
                Name *
              </label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full text-sm rounded-lg border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all text-ink-900 placeholder:text-ink-300"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-xs font-semibold text-ink-600 mb-1.5">
                Email * <span className="text-[10px] text-ink-300 font-normal">(Will not be published)</span>
              </label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-sm rounded-lg border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all text-ink-900 placeholder:text-ink-300"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment-text" className="block text-xs font-semibold text-ink-600 mb-1.5">
              Comment *
            </label>
            <textarea
              id="comment-text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Join the discussion..."
              className="w-full text-sm rounded-lg border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all text-ink-900 placeholder:text-ink-300 resize-y"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-orangeLight disabled:bg-ink-300 transition-colors active:scale-95 duration-100 shadow shadow-brand-orange/10"
          >
            {isSubmitting ? (
              <>Posting...</>
            ) : (
              <>
                Post Comment <Send className="h-3 w-3" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
