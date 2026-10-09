import React, { useState } from 'react';
import { QuoteItem, HealthFactItem } from '@/types';
import { useFiveMinuteBoost } from './useFiveMinuteBoost';
import { StarBorder } from '@/components/reactbits/StarBorder';
import { GradientText } from '@/components/reactbits/GradientText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, RefreshCw, Bookmark, Check, ExternalLink, Flame, ShieldAlert, Award } from 'lucide-react';
import { addFavorite } from '@/lib/repositories';
import { useAuth } from '@/features/auth/AuthContext';

interface FiveMinuteBoostCardProps {
  quotes: QuoteItem[];
  healthFacts: HealthFactItem[];
}

export const FiveMinuteBoostCard: React.FC<FiveMinuteBoostCardProps> = ({
  quotes,
  healthFacts,
}) => {
  const { user } = useAuth();
  const { currentQuote, currentFact, formattedTime, manualRefresh } = useFiveMinuteBoost({
    quotes,
    healthFacts,
    intervalMs: 300000,
  });

  const [savedQuote, setSavedQuote] = useState(false);
  const [savedFact, setSavedFact] = useState(false);

  const handleSaveQuote = async () => {
    if (!user || !currentQuote) return;
    try {
      await addFavorite(user.uid, {
        id: `quote_${currentQuote.id}`,
        type: 'quote',
        refId: currentQuote.id,
        title: currentQuote.category,
        snippet: currentQuote.text,
        savedAt: new Date().toISOString(),
      });
      setSavedQuote(true);
      setTimeout(() => setSavedQuote(false), 2500);
    } catch (err) {
      console.error('Failed to save favorite quote:', err);
    }
  };

  const handleSaveFact = async () => {
    if (!user || !currentFact) return;
    try {
      await addFavorite(user.uid, {
        id: `fact_${currentFact.id}`,
        type: 'fact',
        refId: currentFact.id,
        title: currentFact.category,
        snippet: currentFact.text,
        savedAt: new Date().toISOString(),
      });
      setSavedFact(true);
      setTimeout(() => setSavedFact(false), 2500);
    } catch (err) {
      console.error('Failed to save favorite fact:', err);
    }
  };

  return (
    <StarBorder className="w-full" color="#CCFF00" speed="6s">
      <div className="p-5 sm:p-6 bg-dark-card rounded-[11px] relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <GradientText className="text-base font-extrabold tracking-tight">
                  Five-Minute Fitness Boost
                </GradientText>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 font-mono font-bold border border-lime-500/30">
                  {formattedTime}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Auto-rotates high-impact scientific facts & mindset cues every 5 minutes.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={manualRefresh}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            New Inspiration
          </Button>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Mindset Quote */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-dark-base border border-dark-border/80">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Badge variant="lime" size="sm">
                  {currentQuote?.category || 'Mindset'}
                </Badge>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  Motivational Cue
                </span>
              </div>
              <blockquote className="text-sm font-semibold text-gray-100 italic leading-relaxed mb-2">
                "{currentQuote?.text || 'Discipline is the bridge between goals and accomplishment.'}"
              </blockquote>
              <div className="text-xs text-gray-400 font-medium">
                — {currentQuote?.author || 'FitSphere Coaching'}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSaveQuote}
                disabled={savedQuote}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-lime-400 transition-colors"
              >
                {savedQuote ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-lime-400" />
                    <span className="text-lime-400 font-semibold">Saved to Favorites</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Quote</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Peer-Reviewed Health Fact */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-dark-base border border-dark-border/80">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Badge variant="cyan" size="sm">
                  {currentFact?.category || 'Physiology'}
                </Badge>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                  Science Verified
                </span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed mb-3">
                {currentFact?.text ||
                  'Engaging in resistance training 2-3 times per week increases basal metabolic rate by 7% and significantly elevates insulin sensitivity.'}
              </p>
              {currentFact?.sourceName && (
                <a
                  href={currentFact.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <span>Source: {currentFact.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSaveFact}
                disabled={savedFact}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {savedFact ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">Saved to Favorites</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Fact</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StarBorder>
  );
};
