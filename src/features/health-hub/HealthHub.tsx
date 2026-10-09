import React, { useState } from 'react';
import { ArticleItem, QuoteItem, HealthFactItem, ChallengeItem } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  BookOpen,
  Search,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  Bookmark,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { addFavorite } from '@/lib/repositories';
import { useAuth } from '@/features/auth/AuthContext';

interface HealthHubProps {
  articles: ArticleItem[];
  quotes: QuoteItem[];
  healthFacts: HealthFactItem[];
  challenges: ChallengeItem[];
}

export const HealthHub: React.FC<HealthHubProps> = ({
  articles,
  quotes,
  healthFacts,
  challenges,
}) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'articles' | 'facts' | 'quotes' | 'challenges'>('articles');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredFacts = healthFacts.filter(
    (f) =>
      f.text.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredQuotes = quotes.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveItem = async (type: 'quote' | 'fact' | 'article', item: any) => {
    if (!user) return;
    try {
      await addFavorite(user.uid, {
        id: `${type}_${item.id}`,
        type,
        refId: item.id,
        title: item.title || item.category,
        snippet: item.text || item.body?.slice(0, 100),
        savedAt: new Date().toISOString(),
      });
      setSavedIds((prev) => new Set([...prev, item.id]));
    } catch (err) {
      console.error('Failed to favorite item:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lime-400" />
            Health Education & Science Hub
          </h2>
          <p className="text-xs text-gray-400">
            Peer-reviewed training principles, nutritional science, and recovery strategies.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-dark-card border border-dark-border">
          <button
            onClick={() => setTab('articles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'articles' ? 'bg-lime-500 text-black shadow-lime-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setTab('facts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'facts' ? 'bg-lime-500 text-black shadow-lime-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Science Facts ({healthFacts.length})
          </button>
          <button
            onClick={() => setTab('quotes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'quotes' ? 'bg-lime-500 text-black shadow-lime-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setTab('challenges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'challenges' ? 'bg-lime-500 text-black shadow-lime-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Challenges ({challenges.length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      {tab !== 'challenges' && (
        <div className="max-w-md">
          <Input
            placeholder="Search keywords, physiology, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-500" />}
          />
        </div>
      )}

      {/* Articles View */}
      {tab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <SpotlightCard key={article.id} className="p-5 flex flex-col justify-between hover:border-lime-500/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="lime" size="sm">{article.category}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-lime-400" />
                    {article.readTimeMin} min read
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                  {article.body}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-dark-base border border-dark-border text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                <Button variant="secondary" size="sm" onClick={() => setSelectedArticle(article)}>
                  Read Guide
                </Button>
                <button
                  type="button"
                  onClick={() => handleSaveItem('article', article)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    savedIds.has(article.id)
                      ? 'border-lime-500 text-lime-400'
                      : 'border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Science Facts View */}
      {tab === 'facts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacts.map((fact) => (
            <SpotlightCard key={fact.id} className="p-5 flex flex-col justify-between hover:border-cyan-500/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="cyan" size="sm">{fact.category}</Badge>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-4">{fact.text}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>{fact.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleSaveItem('fact', fact)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    savedIds.has(fact.id)
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Motivational Quotes View */}
      {tab === 'quotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((q) => (
            <SpotlightCard key={q.id} className="p-5 flex flex-col justify-between hover:border-lime-500/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="lime" size="sm">{q.category}</Badge>
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Motivation</span>
                </div>
                <blockquote className="text-sm font-semibold text-gray-100 italic mb-2">
                  "{q.text}"
                </blockquote>
                <span className="text-xs text-gray-400 block">— {q.author}</span>
              </div>

              <div className="flex justify-end pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => handleSaveItem('quote', q)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    savedIds.has(q.id)
                      ? 'border-lime-500 text-lime-400'
                      : 'border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Challenges View */}
      {tab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((ch) => (
            <SpotlightCard key={ch.id} className="p-5 flex flex-col justify-between border-amber-500/30">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="amber" size="sm">{ch.type}</Badge>
                  <span className="text-xs text-amber-400 font-bold font-mono">+{ch.points} pts</span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{ch.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{ch.description}</p>
              </div>

              <div className="pt-3 border-t border-dark-border">
                <Button variant="outline" size="sm" className="w-full border-amber-500/40 text-amber-400 hover:bg-amber-500/10">
                  Join Challenge
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 pb-3 border-b border-dark-border">
              <Badge variant="lime">{selectedArticle.category}</Badge>
              <span>{selectedArticle.readTimeMin} min read • Verified Source</span>
            </div>

            <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.body}
            </div>

            <div className="pt-4 border-t border-dark-border flex items-center justify-between">
              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Academic Source: {selectedArticle.sourceName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Button variant="secondary" size="sm" onClick={() => setSelectedArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
