import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Sparkles, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "./MoodSelector";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mood?: string;
}

export const JournalEntryComponent = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const { toast } = useToast();

  const today = new Date().toDateString();

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Load today's entry if it exists
  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === today);
    if (todayEntry) {
      setCurrentEntry(todayEntry.content);
      setCurrentMood(todayEntry.mood || '');
    }
  }, [entries, today]);

  // Auto-save functionality
  useEffect(() => {
    if (currentEntry.trim()) {
      setIsAutoSaving(true);
      const timeoutId = setTimeout(() => {
        saveEntry();
        setIsAutoSaving(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentEntry]);

  const saveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: `${today}-${Date.now()}`,
      date: today,
      content: currentEntry,
      timestamp: Date.now(),
      mood: currentMood
    };

    const updatedEntries = entries.filter(entry => entry.date !== today);
    updatedEntries.push(newEntry);
    
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry saved ✨",
      description: "Your journal entry has been saved successfully.",
    });
  };

  const getRecentEntries = () => {
    return entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .filter(entry => entry.date !== today);
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: '😊', sad: '😔', peaceful: '😌', frustrated: '😤',
      thoughtful: '🤔', tired: '😴', excited: '🥳', anxious: '😰',
      grateful: '💝', neutral: '😐'
    };
    return moodMap[mood] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* Today's Entry */}
      <Card className="p-6 bg-gradient-soft shadow-soft border-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Today's Journal</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          <MoodSelector 
            selectedMood={currentMood} 
            onMoodChange={setCurrentMood} 
          />
          
          <Textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How was your day? What are you thinking about? Write your thoughts here..."
            className="min-h-[200px] text-base leading-relaxed resize-none border-0 bg-card/50 focus:bg-card transition-smooth placeholder:text-muted-foreground/60"
          />
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isAutoSaving && (
              <>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Auto-saving...
              </>
            )}
          </div>
          <Button 
            onClick={saveEntry}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Entry
          </Button>
        </div>
      </Card>

      {/* Recent Entries */}
      {getRecentEntries().length > 0 && (
        <Card className="p-6 bg-card shadow-soft border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Recent Entries
          </h3>
          <div className="space-y-4">
            {getRecentEntries().map((entry) => (
              <div key={entry.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">{entry.date}</div>
                  {entry.mood && (
                    <span className="text-lg" title={entry.mood}>
                      {getMoodEmoji(entry.mood)}
                    </span>
                  )}
                </div>
                <p className="text-foreground line-clamp-3">
                  {entry.content.length > 150 
                    ? `${entry.content.substring(0, 150)}...` 
                    : entry.content
                  }
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};