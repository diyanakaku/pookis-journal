import React, { useState, useEffect } from 'react';
import { JournalEntryComponent } from '@/components/JournalEntry';
import { WeeklySummary } from '@/components/WeeklySummary';
import { WritingStats } from '@/components/WritingStats';
import { WritingPrompts } from '@/components/WritingPrompts';
import { MoodCalendar } from '@/components/MoodCalendar';
import { GoalTracker } from '@/components/GoalTracker';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenTool, Sparkles, BarChart3, Heart, Lightbulb, Calendar, Target } from "lucide-react";
import journalHero from '@/assets/journal-hero.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'journal' | 'summary' | 'stats' | 'prompts' | 'mood' | 'goals'>('journal');
  const [entries, setEntries] = useState<Array<{
    id: string;
    date: string;
    content: string;
    timestamp: number;
    mood?: string;
  }>>([]);

  // Load entries for stats
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [activeTab]); // Refresh when tab changes

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-red" />
              </div>
              <h1 className="text-2xl font-cursive font-bold text-foreground">Pookie's Journal</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              AI-Powered Journal
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-serif-elegant font-bold text-foreground leading-tight">
                  Your thoughts,
                  <span className="bg-rose-gold bg-clip-text text-transparent"> beautifully </span>
                  captured
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Write your daily thoughts and let AI help you discover patterns, 
                  growth, and insights in your journey.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setActiveTab('journal')}
                  variant={activeTab === 'journal' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <PenTool className="h-4 w-4" />
                  Start Writing
                </Button>
                <Button 
                  onClick={() => setActiveTab('summary')}
                  variant={activeTab === 'summary' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </Button>
                <Button 
                  onClick={() => setActiveTab('stats')}
                  variant={activeTab === 'stats' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  My Progress
                </Button>
                <Button 
                  onClick={() => setActiveTab('prompts')}
                  variant={activeTab === 'prompts' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Prompts
                </Button>
                <Button 
                  onClick={() => setActiveTab('mood')}
                  variant={activeTab === 'mood' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Mood
                </Button>
                <Button 
                  onClick={() => setActiveTab('goals')}
                  variant={activeTab === 'goals' ? 'default' : 'secondary'}
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  Goals
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={journalHero} 
                alt="Beautiful pink journal"
                className="w-full h-auto rounded-xl shadow-glow animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-card/80 backdrop-blur-sm shadow-soft border-0 sticky top-24">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'journal' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('journal')}
                >
                  <PenTool className="h-4 w-4" />
                  Daily Journal
                </Button>
                <Button
                  variant={activeTab === 'summary' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('summary')}
                >
                  <Sparkles className="h-4 w-4" />
                  Weekly Summary
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('stats')}
                >
                  <BarChart3 className="h-4 w-4" />
                  My Progress
                </Button>
                <Button
                  variant={activeTab === 'prompts' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('prompts')}
                >
                  <Lightbulb className="h-4 w-4" />
                  Writing Prompts
                </Button>
                <Button
                  variant={activeTab === 'mood' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('mood')}
                >
                  <Calendar className="h-4 w-4" />
                  Mood Calendar
                </Button>
                <Button
                  variant={activeTab === 'goals' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('goals')}
                >
                  <Target className="h-4 w-4" />
                  Goal Tracker
                </Button>
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'journal' && <JournalEntryComponent />}
            {activeTab === 'summary' && <WeeklySummary />}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-serif-elegant font-bold text-foreground mb-2">Your Writing Journey</h2>
                  <p className="text-muted-foreground">Track your progress and celebrate your consistency</p>
                </div>
                <WritingStats entries={entries} />
              </div>
            )}
            {activeTab === 'prompts' && <WritingPrompts />}
            {activeTab === 'mood' && <MoodCalendar />}
            {activeTab === 'goals' && <GoalTracker />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/60 backdrop-blur-sm border-t border-border/50 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            Made with <Heart className="h-4 w-4 inline text-primary" /> for mindful reflection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
