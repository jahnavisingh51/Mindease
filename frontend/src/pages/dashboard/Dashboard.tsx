import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, LineChart, TrendingUp, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authService } from '../../services/auth.service';
import { moodService } from '../../services/mood.service';
import { chatService } from '../../services/chat.service';
import { MoodEntry, ChatMessage } from '../../types';
import { cn } from '../../utils/cn';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState<any>({ average: 0, trend: [] });
  const [recentChats, setRecentChats] = useState<ChatMessage[]>([]);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>({ totalChats: 0, averageMoodScore: 0, userActivitySummary: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [moodStats, allMessages, allMoods, isAlert, dashSummary] = await Promise.all([
          moodService.getStats(user.id),
          chatService.getMessages(user.id),
          moodService.getMoods(user.id),
          moodService.checkSmartAlert(user.id),
          moodService.getDashboardSummary()
        ]);

        setStats(moodStats || { average: 0, trend: [] });
        setRecentChats(allMessages?.slice(-5).reverse() || []);
        setRecentMoods(allMoods?.slice(0, 5) || []);
        setShowAlert(!!isAlert);
        setSummary(dashSummary || { totalChats: 0, averageMoodScore: 0, userActivitySummary: [] });
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const cards = [
    {
      name: 'Total Support Chats',
      value: summary?.totalChats || 0,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      name: 'Avg. Mood Score',
      value: (summary?.averageMoodScore || 0).toFixed(1),
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      name: 'Active Streak',
      value: '5 Days',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-neutral-500 font-medium">Loading your journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Oops! Something went wrong</h2>
        <p className="text-neutral-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
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
          <h1 className="text-3xl font-bold text-neutral-900">Hello, {user?.fullName?.split(' ')[0]}!</h1>
          <p className="text-neutral-500 font-medium">Here's an overview of your well-being journey.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-neutral-700">AI Assistant Online</span>
        </div>
      </div>

      {showAlert && (
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900">Personal Support Alert</h3>
            <p className="text-amber-700 mt-1 font-medium">
              We've noticed you've been feeling a bit low lately. Remember, you don't have to face this alone.
              Consider reaching out to a professional or a trusted friend. We're here for you.
            </p>
            <button className="mt-4 bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-600/20">
              View Resources
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl", card.color)}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-500">{card.name}</p>
                <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trend Chart */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <div className="bg-indigo-50 p-2 rounded-xl">
                <LineChart className="w-5 h-5 text-indigo-600" />
              </div>
              Mood Trends
            </h2>
            <select className="bg-neutral-50 border border-neutral-200 text-sm font-semibold text-neutral-600 px-3 py-1.5 rounded-xl focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            Recent Activity
          </h2>
          <div className="space-y-6">
            {recentChats.length > 0 ? recentChats.filter(c => c.role === 'user').map((chat) => (
              <div key={chat.id} className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900 line-clamp-1">{chat.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      chat.sentiment === 'happy' ? "bg-emerald-50 text-emerald-600" :
                      chat.sentiment === 'sad' ? "bg-rose-50 text-rose-600" :
                      chat.sentiment === 'anxiety' ? "bg-amber-50 text-amber-600" :
                      chat.sentiment === 'stress' ? "bg-indigo-50 text-indigo-600" :
                      "bg-neutral-100 text-neutral-600"
                    )}>
                      {chat.sentiment}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-neutral-500">No recent activity found.</p>
                <button 
                  onClick={() => navigate('/chat')}
                  className="text-indigo-600 font-bold mt-2"
                >
                  Start a chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;