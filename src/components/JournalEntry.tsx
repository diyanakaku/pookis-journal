import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Sparkles, Save, Brain, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "./MoodSelector";
import { analyzeSentiment, isAPIKeyConfigured } from "@/lib/openai";
//
interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mood?: string;
  aiMood?: string;
  aiConfidence?: number;
  aiReason?: string;
}

export const JournalEntryComponent = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{mood: string, confidence: number, reason: string} | null>(null);
  const { toast } = useToast();

  const today = new Date().toDateString();

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === today);
    if (todayEntry) {
      setCurrentEntry(todayEntry.content);
      setCurrentMood(todayEntry.mood || '');
      if (todayEntry.aiMood) {
        setAiAnalysis({
          mood: todayEntry.aiMood,
          confidence: todayEntry.aiConfidence || 0,
          reason: todayEntry.aiReason || ''
        });
      }
    }
  }, [entries, today]);

  const analyzeWithAI = async () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Nothing to analyze",
        description: "Please write something in your journal first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSentiment(currentEntry);
      setAiAnalysis(analysis);
      setCurrentMood(analysis.mood);
      toast({
        title: "AI Analysis Complete 🧠",
        description: `Detected mood: ${analysis.mood}. ${analysis.reason}`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please write something in your journal first.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      let finalMood = currentMood;
      let analysis = aiAnalysis;
      
      if (!finalMood && currentEntry.trim() && isAPIKeyConfigured()) {
        analysis = await analyzeSentiment(currentEntry);
        finalMood = analysis.mood;
        setAiAnalysis(analysis);
      }

      const newEntry: JournalEntry = {
        id: `${today}-${Date.now()}`,
        date: today,
        content: currentEntry,
        timestamp: Date.now(),
        mood: finalMood,
        aiMood: analysis?.mood,
        aiConfidence: analysis?.confidence,
        aiReason: analysis?.reason
      };

      const updatedEntries = entries.filter(entry => entry.date !== today);
      updatedEntries.push(newEntry);
      
      setEntries(updatedEntries);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      
      toast({
        title: "Entry saved ✨",
        description: analysis?.mood 
          ? `Your journal entry has been saved with AI-detected mood: ${analysis.mood}`
          : "Your journal entry has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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
        
        <div>
          {aiAnalysis && (
            <div className="mt-4 p-4 rounded-lg bg-muted/40 flex items-center gap-4">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-foreground font-medium">
                  AI Mood: <span className="font-bold">{getMoodEmoji(aiAnalysis.mood)} {aiAnalysis.mood}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Confidence: {(aiAnalysis.confidence * 100).toFixed(0)}%<br />
                  Reason: {aiAnalysis.reason}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button onClick={analyzeWithAI} disabled={isAnalyzing || !currentEntry.trim()} className="gap-2">
            <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
          <Button onClick={saveEntry} disabled={isSaving || !currentEntry.trim()} className="gap-2">
            <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </Card>
      <Card className="p-6 bg-card/60 backdrop-blur-sm border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {getRecentEntries().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Your recent entries will appear here</p>
            </div>
          ) : (
            getRecentEntries().map(entry => (
              <div key={entry.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-primary capitalize">
                    {getMoodEmoji(entry.mood || 'neutral')} {entry.mood || 'neutral'}
                  </span>
                  <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
