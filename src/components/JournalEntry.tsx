import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Sparkles, Save, Brain, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "./MoodSelector";
import { analyzeSentiment, isAPIKeyConfigured } from "@/lib/openai";

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
      setCurrentMood(analysis.mood); // Auto-set the mood from AI analysis
      
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
      // If no mood is selected and AI analysis is available, use AI mood
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
        
        {/* AI Analysis Section */}
        {isAPIKeyConfigured() && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                AI Mood Analysis
              </h4>
              <Button
                onClick={analyzeWithAI}
                disabled={isAnalyzing || !currentEntry.trim()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-3 w-3" />
                    Analyze Mood
                  </>
                )}
              </Button>
            </div>
            
            {aiAnalysis && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Detected mood:</span>
                  <span className="text-sm font-medium capitalize text-primary">{aiAnalysis.mood}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(aiAnalysis.confidence * 100)}% confidence)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{aiAnalysis.reason}</p>
              </div>
            )}
          </div>
        )}

        {!isAPIKeyConfigured() && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Add your OpenAI API key to enable AI mood analysis
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {(isSaving || isAnalyzing) && (
              <>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {isSaving ? 'Saving...' : 'Analyzing...'}
              </>
            )}
          </div>
          <Button 
            onClick={saveEntry}
            disabled={isSaving || !currentEntry.trim()}
            variant="default"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Entry'}
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