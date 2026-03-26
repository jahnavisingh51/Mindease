import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Heart, MessageSquare, History, Loader2, Save } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { moodService } from '../../services/mood.service';
import { MoodEntry } from '../../types';
import { cn } from '../../utils/cn';

const moods = [
  { value: 1, label: 'Very Low', emoji: '😞', color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' },
  { value: 2, label: 'Low', emoji: '😕', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' },
  { value: 3, label: 'Neutral', emoji: '😐', color: 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:bg-neutral-100' },
  { value: 4, label: 'Good', emoji: '🙂', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' },
  { value: 5, label: 'Great', emoji: '😊', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
];

const MoodTracker: React.FC = () => {
  const user = authService.getCurrentUser();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMoods = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const history = await moodService.getMoods(user.id);
          setEntries(history);
        } catch (err: any) {
          console.error("Error fetching mood history:", err);
          setError(err.message || "Failed to load mood history. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMoods();
  }, [user]);

  const handleLogMood = async () => {
    if (!selectedMood || !user) return;
    setSubmitting(true);

    try {
      const moodLabel = moods.find(m => m.value === selectedMood)?.label || 'Neutral';
      const newMood = await moodService.logMood(user.id, selectedMood as any, moodLabel, note);
      setEntries(prev => [newMood, ...prev]);
      setSelectedMood(null);
      setNote('');
      setIsLogging(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-neutral-500 font-medium">Loading your mood history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <Loader2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Unable to load mood entries</h2>
        <p className="text-neutral-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mood Tracker</h1>
          <p className="text-neutral-500 font-medium">Keep track of your emotional journey.</p>
        </div>
        {!isLogging && (
          <button
            onClick={() => setIsLogging(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-5 h-5" />
            Log Today's Mood
          </button>
        )}
      </div>

      {isLogging && (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl shadow-indigo-600/5 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              How are you feeling right now?
            </h2>
            <button onClick={() => setIsLogging(false)} className="text-neutral-400 hover:text-neutral-600 font-bold transition-all p-1">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group",
                  m.color,
                  selectedMood === m.value ? "ring-4 ring-indigo-50 border-transparent scale-105" : "border-transparent opacity-80"
                )}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                <span className="text-sm font-bold tracking-tight">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <label className="text-sm font-bold text-neutral-700 ml-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Add a private note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind? Writing it down can help."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none min-h-[120px]"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleLogMood}
              disabled={!selectedMood || submitting}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Mood Entry
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Mood History
          </h2>
          <span className="text-sm font-semibold text-neutral-400">Showing last {entries.length} entries</span>
        </div>

        <div className="divide-y divide-neutral-50">
          {entries.length > 0 ? entries.map((entry) => {
            const mood = moods.find(m => m.value === entry.mood);
            return (
              <div key={entry.id} className="p-8 hover:bg-neutral-50/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0",
                    mood?.color
                  )}>
                    {mood?.emoji}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-neutral-900">{entry.label}</h3>
                      <span className="text-sm font-bold text-neutral-400">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-neutral-600 font-medium leading-relaxed bg-white/50 p-4 rounded-xl border border-neutral-100 italic">
                        "{entry.note}"
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1 text-indigo-500">
                        <Heart className="w-3 h-3" />
                        Private Entry
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 px-4">
              <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="w-10 h-10 text-neutral-200" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No mood history yet</h3>
              <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                Start logging your moods to see trends and better understand your mental well-being over time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;