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

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div  className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 rounded-lg flex items-center justify-center">
                <img src='../public/logo.png' className="h-8 w-8 sm:h-6 sm:w-6 text-accent-foreground pl-[0.5px] mt-[2px]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-cursive font-bold text-foreground">Pookie's Journal</h1>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              AI-Powered Journal
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-elegant font-bold text-foreground leading-tight">
                  Your thoughts,
                  <span className="text-primary font-extrabold"> beautifully </span>
                  captured
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Write your daily thoughts and let AI help you discover patterns, 
                  growth, and insights in your journey.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button 
                  onClick={() => setActiveTab('journal')}
                  variant={activeTab === 'journal' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <PenTool className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Start Writing</span>
                  <span className="sm:hidden">Write</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab('summary')}
                  variant={activeTab === 'summary' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">AI Summary</span>
                  <span className="sm:hidden">Summary</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab('stats')}
                  variant={activeTab === 'stats' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">My Progress</span>
                  <span className="sm:hidden">Progress</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab('prompts')}
                  variant={activeTab === 'prompts' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                  Prompts
                </Button>
                <Button 
                  onClick={() => setActiveTab('mood')}
                  variant={activeTab === 'mood' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mood
                </Button>
                <Button 
                  onClick={() => setActiveTab('goals')}
                  variant={activeTab === 'goals' ? 'default' : 'secondary'}
                  className="gap-2 text-sm sm:text-base"
                >
                  <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                  Goals
                </Button>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <img 
                src={journalHero} 
                alt="Beautiful pink journal"
                className="w-full h-auto max-w-md mx-auto lg:max-w-full rounded-xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Navigation Sidebar - Hidden on mobile, shown in content area */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="p-4 bg-card/80 backdrop-blur-sm shadow-soft border-0 sticky top-24">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'journal' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('journal')}
                >
                  <PenTool className="h-4 w-4" />
                  Daily Journal
                </Button>
                <Button
                  variant={activeTab === 'summary' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('summary')}
                >
                  <Sparkles className="h-4 w-4" />
                  Weekly Summary
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('stats')}
                >
                  <BarChart3 className="h-4 w-4" />
                  My Progress
                </Button>
                <Button
                  variant={activeTab === 'prompts' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('prompts')}
                >
                  <Lightbulb className="h-4 w-4" />
                  Writing Prompts
                </Button>
                <Button
                  variant={activeTab === 'mood' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('mood')}
                >
                  <Calendar className="h-4 w-4" />
                  Mood Calendar
                </Button>
                <Button
                  variant={activeTab === 'goals' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
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
            {/* Mobile Navigation - Show on small screens */}
            <div className="lg:hidden mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-2 p-3 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft">
                <Button
                  variant={activeTab === 'journal' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('journal')}
                >
                  <PenTool className="h-3 w-3" />
                  Journal
                </Button>
                <Button
                  variant={activeTab === 'summary' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('summary')}
                >
                  <Sparkles className="h-3 w-3" />
                  Summary
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('stats')}
                >
                  <BarChart3 className="h-3 w-3" />
                  Stats
                </Button>
                <Button
                  variant={activeTab === 'prompts' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('prompts')}
                >
                  <Lightbulb className="h-3 w-3" />
                  Prompts
                </Button>
                <Button
                  variant={activeTab === 'mood' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('mood')}
                >
                  <Calendar className="h-3 w-3" />
                  Mood
                </Button>
                <Button
                  variant={activeTab === 'goals' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => setActiveTab('goals')}
                >
                  <Target className="h-3 w-3" />
                  Goals
                </Button>
              </div>
            </div>

            {activeTab === 'journal' && <JournalEntryComponent />}
            {activeTab === 'summary' && <WeeklySummary />}
            {activeTab === 'stats' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-foreground mb-2">Your Writing Journey</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Track your progress and celebrate your consistency</p>
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
      <footer className="bg-card/60 backdrop-blur-sm border-t border-border/50 mt-8 sm:mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 inline text-primary" /> for mindful reflection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;