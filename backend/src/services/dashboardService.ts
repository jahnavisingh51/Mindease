import prisma from '../client.ts';

export const getDashboardSummary = async (userId: string) => {
  const totalChats = await prisma.chat.count({
    where: { userId, role: 'user', isDeleted: false }
  });

  const moods = await prisma.moodEntry.findMany({
    where: { userId, isDeleted: false }
  });

  const totalMoods = moods.length;
  const averageMoodScore = totalMoods > 0
    ? moods.reduce((acc, curr) => acc + curr.mood, 0) / totalMoods
    : 0;

  // Simple user activity summary (last 5 entries)
  const userActivitySummary = moods.slice(0, 5).map(m => ({
    type: 'mood',
    value: m.mood,
    label: m.label,
    timestamp: m.createdAt
  }));

  return {
    totalChats,
    averageMoodScore,
    userActivitySummary
  };
};
