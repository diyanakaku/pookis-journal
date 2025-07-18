import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from "lucide-react";

interface MoodEntry {
  date: string;
  mood: string;
  timestamp: number;
}

const moodColors = {
  happy: 'bg-gradient-rose-gold',
  sad: 'bg-gradient-primary',
  peaceful: 'bg-gradient-mauve',
  frustrated: 'bg-gradient-accent',
  thoughtful: 'bg-gradient-blush',
  tired: 'bg-muted',
  excited: 'bg-gradient-accent',
  anxious: 'bg-gradient-primary',
  grateful: 'bg-gradient-rose-gold',
  neutral: 'bg-secondary'
};

const moodEmojis = {
  happy: '😊',
  sad: '😔',
  peaceful: '😌',
  frustrated: '😤',
  thoughtful: '🤔',
  tired: '😴',
  excited: '🥳',
  anxious: '😰',
  grateful: '💝',
  neutral: '😐'
};

export const MoodCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = () => {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const moodData: MoodEntry[] = entries
      .filter((entry: any) => entry.mood || entry.aiMood)
      .map((entry: any) => ({
        date: entry.date,
        mood: entry.aiMood || entry.mood, 
        timestamp: entry.timestamp
      }));
    setMoodEntries(moodData);
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getMoodForDate = (date: Date): string | null => {
    const dateString = date.toDateString();
    const entry = moodEntries.find(entry => entry.date === dateString);
    return entry ? entry.mood : null;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayClasses = (date: Date | null, mood: string | null): string => {
    if (!date) return 'invisible';
    
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate === date.toISOString().split('T')[0];
    
    let classes = 'relative w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer hover:scale-110 ';
    
    if (mood) {
      classes += `${moodColors[mood as keyof typeof moodColors]} text-white shadow-soft `;
    } else {
      classes += 'bg-background/50 text-muted-foreground hover:bg-background ';
    }
    
    if (isToday) {
      classes += 'ring-2 ring-primary ring-offset-2 ';
    }
    
    if (isSelected) {
      classes += 'scale-110 ';
    }
    
    return classes;
  };

  const getMonthStats = (): { [key: string]: number } => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    
    const stats: { [key: string]: number } = {};
    monthEntries.forEach(entry => {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    });
    
    return stats;
  };

  const days = getDaysInMonth(currentDate);
  const monthStats = getMonthStats();
  const topMood = Object.entries(monthStats).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif-elegant font-bold text-foreground">
          Mood Calendar
        </h2>
        <p className="text-muted-foreground">
          Track your emotional journey through time
        </p>
      </div>

      <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-elegant border-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const mood = date ? getMoodForDate(date) : null;
              return (
                <div
                  key={index}
                  className={getDayClasses(date, mood)}
                  onClick={() => date && setSelectedDate(date.toISOString().split('T')[0])}
                  title={date && mood ? `${date.getDate()} - ${mood} ${moodEmojis[mood as keyof typeof moodEmojis]}` : undefined}
                >
                  {date && (
                    <>
                      <span>{date.getDate()}</span>
                      {mood && (
                        <div className="absolute -top-1 -right-1 text-xs">
                          {moodEmojis[mood as keyof typeof moodEmojis]}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {Object.keys(monthStats).length > 0 && (
        <Card className="p-6 bg-card/60 backdrop-blur-sm border-0">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">This Month's Highlights</h3>
          </div>
          
          <div className="space-y-4">
            {topMood && (
              <div className="text-center p-4 bg-gradient-primary rounded-lg">
                <div className="text-3xl mb-2">
                  {moodEmojis[topMood[0] as keyof typeof moodEmojis]}
                </div>
                <p className="text-foreground font-medium">
                  Most frequent mood: <span className="capitalize">{topMood[0]}</span>
                </p>
                <p className="text-sm text-foreground/80">
                  {topMood[1]} days this month
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(monthStats).slice(0, 6).map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                  <span className="text-lg">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                  <span className="text-sm font-medium capitalize">{mood}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};