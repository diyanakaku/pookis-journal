import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Target, Award } from "lucide-react";

interface WritingStatsProps {
  entries: Array<{
    id: string;
    date: string;
    content: string;
    timestamp: number;
    mood?: string;
  }>;
}

export const WritingStats: React.FC<WritingStatsProps> = ({ entries }) => {
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
    totalWords: 0,
    averageWordsPerEntry: 0,
    weeklyGoalProgress: 0
  });

  useEffect(() => {
    calculateStats();
  }, [entries]);

  const calculateStats = () => {
    if (entries.length === 0) {
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        totalWords: 0,
        averageWordsPerEntry: 0,
        weeklyGoalProgress: 0
      });
      return;
    }

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    const todayStr = today.toDateString();
    const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString();
    
    const hasRecentEntry = sortedEntries.some(entry => 
      entry.date === todayStr || entry.date === yesterdayStr
    );
    
    if (hasRecentEntry) {
      const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];
      uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      let checkDate = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const entryDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (24 * 60 * 60 * 1000));
        
        if (diffDays <= i) {
          currentStreak++;
          checkDate = new Date(entryDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      }
      
      tempStreak = 1;
      longestStreak = 1;
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (24 * 60 * 60 * 1000));
        
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }
    
    const totalWords = entries.reduce((sum, entry) => {
      return sum + entry.content.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
    
    const averageWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
    
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyEntries = entries.filter(entry => entry.timestamp >= oneWeekAgo);
    const weeklyGoalProgress = Math.min(100, Math.round((weeklyEntries.length / 7) * 100));
    
    setStats({
      currentStreak,
      longestStreak,
      totalEntries: entries.length,
      totalWords,
      averageWordsPerEntry,
      weeklyGoalProgress
    });
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '✨';
    return '📝';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-gradient-accent shadow-soft border-0 text-center">
        <div className="flex items-center justify-center mb-2">
          <Calendar className="h-4 w-4 text-accent-foreground" />
        </div>
        <div className="text-2xl font-bold text-accent-foreground">{stats.currentStreak}</div>
        <div className="text-sm text-accent-foreground/80">Current Streak</div>
      </Card>

      <Card className="p-4 bg-card shadow-soft border-0 text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground">{stats.longestStreak}</div>
        <div className="text-sm text-muted-foreground">Best Streak</div>
      </Card>

      <Card className="p-4 bg-card shadow-soft border-0 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground">{stats.totalWords.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Total Words</div>
      </Card>

      <Card className="p-4 bg-card shadow-soft border-0 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground">{stats.weeklyGoalProgress}%</div>
        <div className="text-sm text-muted-foreground">Weekly Goal</div>
        <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-smooth" 
            style={{ width: `${stats.weeklyGoalProgress}%` }}
          />
        </div>
      </Card>
    </div>
  );
};