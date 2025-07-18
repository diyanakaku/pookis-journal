import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Calendar, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mood?: string;
}

export const WeeklySummary = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const getWeeklyEntries = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return entries.filter(entry => entry.timestamp >= oneWeekAgo);
  };

  const generateSummary = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to generate summaries.",
        variant: "destructive"
      });
      return;
    }

    const weeklyEntries = getWeeklyEntries();
    if (weeklyEntries.length === 0) {
      toast({
        title: "No entries found",
        description: "You need at least one journal entry from this week to generate a summary.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const entriesText = weeklyEntries
        .map(entry => `${entry.date}: ${entry.content}`)
        .join('\n\n');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a compassionate AI assistant that helps people reflect on their journal entries. Create a thoughtful, encouraging summary of their week based on their journal entries. Focus on patterns, growth, emotions, and insights. Be warm and supportive.'
            },
            {
              role: 'user',
              content: `Please create a weekly summary of my journal entries:\n\n${entriesText}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.choices[0].message.content);
      
      toast({
        title: "Weekly summary generated! ✨",
        description: "Your AI-powered reflection is ready.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error generating summary",
        description: "Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('openai-api-key', apiKey);
    toast({
      title: "API key saved",
      description: "Your OpenAI API key has been saved locally.",
    });
  };

  const weeklyEntries = getWeeklyEntries();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-soft shadow-soft border-0">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Weekly Summary
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              OpenAI API Key
            </label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button onClick={saveApiKey} variant="secondary" size="sm">
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally and never shared.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {weeklyEntries.length} entries from this week
            </div>
            <Button 
              onClick={generateSummary}
              disabled={isGenerating || !apiKey.trim()}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </Button>
          </div>
        </div>
      </Card>

      {summary && (
        <Card className="p-6 bg-gradient-accent shadow-glow border-0 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-foreground" />
            Your Week in Reflection
          </h3>
          <div className="prose prose-pink max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </Card>
      )}

      {weeklyEntries.length > 0 && (
        <Card className="p-6 bg-card shadow-soft border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            This Week's Entries ({weeklyEntries.length})
          </h3>
          <div className="space-y-3">
            {weeklyEntries.map((entry) => (
              <div key={entry.id} className="p-3 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
                <p className="text-foreground text-sm line-clamp-2">
                  {entry.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};