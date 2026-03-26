import prisma from '../client.ts';
import ApiError from '../utils/ApiError.ts';

export const logMood = async (userId: string, mood: number, label: string, note?: string) => {
  if (mood < 1 || mood > 5) {
    throw new ApiError(400, "Mood score must be between 1 and 5");
  }

  return await prisma.moodEntry.create({
    data: {
      userId,
      mood,
      label,
      note
    }
  });
};

export const getMoods = async (userId: string) => {
  return await prisma.moodEntry.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: 'desc' }
  });
};

export const getStats = async (userId: string) => {
  const userMoods = await getMoods(userId);
  const total = userMoods.length;

  if (total === 0) return { average: 0, trend: [] };

  const sum = userMoods.reduce((acc, curr) => acc + curr.mood, 0);
  const average = sum / total;

  // Last 7 entries trend
  const trend = userMoods.slice(0, 7).reverse().map(m => {
    const dateObj = new Date(m.createdAt);
    return {
      date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: m.mood
    };
  });

  return { average, trend };
};

export const checkSmartAlert = async (userId: string) => {
  const userMoods = await getMoods(userId);
  if (userMoods.length < 3) return false;

  const lastThree = userMoods.slice(0, 3);
  return lastThree.every(m => m.mood <= 2);
};
