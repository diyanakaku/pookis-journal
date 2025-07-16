import React, { useState } from 'react';
import { JournalEntryComponent } from '@/components/JournalEntry';
import { WeeklySummary } from '@/components/WeeklySummary';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenTool, Sparkles, Calendar, Heart } from "lucide-react";
import journalHero from '@/assets/journal-hero.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'journal' | 'summary'>('journal');

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Pink Ink</h1>
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
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Your thoughts,
                  <span className="bg-gradient-accent bg-clip-text text-transparent"> beautifully </span>
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
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'journal' && <JournalEntryComponent />}
            {activeTab === 'summary' && <WeeklySummary />}
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
