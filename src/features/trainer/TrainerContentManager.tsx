import React, { useState, useEffect } from 'react';
import {
  subscribeQuotes,
  saveQuote,
  deleteQuote,
  subscribeHealthFacts,
  saveHealthFact,
  deleteHealthFact,
} from '@/lib/repositories';
import { QuoteItem, HealthFactItem } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Sparkles, Plus, Trash2, ShieldCheck, Quote, BookOpen, ExternalLink } from 'lucide-react';

export const TrainerContentManager: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [healthFacts, setHealthFacts] = useState<HealthFactItem[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'facts'>('quotes');

  // Quote modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [quoteCategory, setQuoteCategory] = useState<QuoteItem['category']>('Mindset');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  // Fact modal
  const [factModalOpen, setFactModalOpen] = useState(false);
  const [factText, setFactText] = useState('');
  const [factCategory, setFactCategory] = useState<HealthFactItem['category']>('Cardiovascular');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  useEffect(() => {
    const unsubQuotes = subscribeQuotes(setQuotes);
    const unsubFacts = subscribeHealthFacts(setHealthFacts);
    return () => {
      unsubQuotes();
      unsubFacts();
    };
  }, []);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;

    await saveQuote({
      id: `q_${Date.now()}`,
      text: quoteText.trim(),
      category: quoteCategory,
      author: quoteAuthor.trim() || 'Coaching Staff',
      isMotivationOnly: true,
    });

    setQuoteText('');
    setQuoteAuthor('');
    setQuoteModalOpen(false);
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factText.trim() || !sourceName.trim()) return;

    await saveHealthFact({
      id: `f_${Date.now()}`,
      text: factText.trim(),
      category: factCategory,
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim() || 'https://www.who.int',
    });

    setFactText('');
    setSourceName('');
    setSourceUrl('');
    setFactModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lime-400" />
            Curated Health & Motivation Content Manager
          </h2>
          <p className="text-xs text-gray-400">
            Publish motivational mantras and verified peer-reviewed scientific facts.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'quotes' ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setQuoteModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Quote
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setFactModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Health Fact
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-dark-border pb-3">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'quotes'
              ? 'bg-lime-500 text-black shadow-lime-sm'
              : 'text-gray-400 hover:text-white bg-dark-card border border-dark-border'
          }`}
        >
          Motivational Quotes ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'facts'
              ? 'bg-cyan-500 text-black shadow-sm'
              : 'text-gray-400 hover:text-white bg-dark-card border border-dark-border'
          }`}
        >
          Science-Backed Health Facts ({healthFacts.length})
        </button>
      </div>

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <SpotlightCard className="p-6">
          <div className="divide-y divide-dark-border">
            {quotes.map((q) => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="lime" size="sm">{q.category}</Badge>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Motivation</span>
                  </div>
                  <blockquote className="text-sm font-semibold text-gray-100 italic">
                    "{q.text}"
                  </blockquote>
                  <span className="text-xs text-gray-400 mt-1 block">— {q.author}</span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteQuote(q.id)}
                  className="text-gray-500 hover:text-coral-400 p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Health Facts Tab */}
      {activeTab === 'facts' && (
        <SpotlightCard className="p-6">
          <div className="divide-y divide-dark-border">
            {healthFacts.map((f) => (
              <div key={f.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="cyan" size="sm">{f.category}</Badge>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase">Peer-Reviewed</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed mb-2">{f.text}</p>
                  <a
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Source: {f.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => deleteHealthFact(f.id)}
                  className="text-gray-500 hover:text-coral-400 p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Create Quote Modal */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Add Motivational Quote"
      >
        <form onSubmit={handleCreateQuote} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Category
            </label>
            <select
              value={quoteCategory}
              onChange={(e) => setQuoteCategory(e.target.value as any)}
              className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
            >
              <option value="Mindset">Mindset</option>
              <option value="Discipline">Discipline</option>
              <option value="Resilience">Resilience</option>
              <option value="Consistency">Consistency</option>
              <option value="Focus">Focus</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Quote Text
            </label>
            <textarea
              rows={3}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="e.g. Energy and persistence conquer all things."
              required
              className="w-full bg-dark-base border border-dark-border rounded-lg p-3 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
            />
          </div>

          <Input
            label="Author"
            value={quoteAuthor}
            onChange={(e) => setQuoteAuthor(e.target.value)}
            placeholder="e.g. Benjamin Franklin"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" type="button" onClick={() => setQuoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Quote
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Fact Modal */}
      <Modal
        isOpen={factModalOpen}
        onClose={() => setFactModalOpen(false)}
        title="Add Verified Health Fact"
      >
        <form onSubmit={handleCreateFact} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Physiological Category
            </label>
            <select
              value={factCategory}
              onChange={(e) => setFactCategory(e.target.value as any)}
              className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Metabolism">Metabolism</option>
              <option value="Strength">Strength</option>
              <option value="Sleep & Recovery">Sleep & Recovery</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Longevity">Longevity</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Scientific Fact Text
            </label>
            <textarea
              rows={3}
              value={factText}
              onChange={(e) => setFactText(e.target.value)}
              placeholder="e.g. Adults should undertake 150-300 mins of moderate physical activity..."
              required
              className="w-full bg-dark-base border border-dark-border rounded-lg p-3 text-sm text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <Input
            label="Source Organization (e.g. WHO, CDC, ACSM, Harvard Health)"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="e.g. American College of Sports Medicine"
            required
          />

          <Input
            label="Source Citation URL"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://www.acsm.org/..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" type="button" onClick={() => setFactModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Verified Fact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
