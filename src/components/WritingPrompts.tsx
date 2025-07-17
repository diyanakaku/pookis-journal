import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, RefreshCw, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WritingPrompt {
  id: string;
  prompt: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'creative' | 'mindfulness';
}

const prompts: WritingPrompt[] = [
  {
    id: '1',
    prompt: "What moment today made you smile, and why did it feel special?",
    category: 'gratitude'
  },
  {
    id: '2',
    prompt: "If you could give your past self one piece of advice, what would it be?",
    category: 'reflection'
  },
  {
    id: '3',
    prompt: "Describe a small act of kindness you witnessed or experienced today.",
    category: 'gratitude'
  },
  {
    id: '4',
    prompt: "What's one thing you're excited to learn or improve in the coming week?",
    category: 'goals'
  },
  {
    id: '5',
    prompt: "Write about a place that makes you feel completely at peace.",
    category: 'mindfulness'
  },
  {
    id: '6',
    prompt: "If your day was a color, what would it be and why?",
    category: 'creative'
  },
  {
    id: '7',
    prompt: "What's something challenging that helped you grow recently?",
    category: 'reflection'
  },
  {
    id: '8',
    prompt: "Describe three things you're grateful for right now, big or small.",
    category: 'gratitude'
  },
  {
    id: '9',
    prompt: "What would you do if you knew you couldn't fail?",
    category: 'goals'
  },
  {
    id: '10',
    prompt: "Write a letter to someone who has positively impacted your life.",
    category: 'gratitude'
  }
];

const categoryIcons = {
  reflection: Lightbulb,
  gratitude: Heart,
  goals: Sparkles,
  creative: RefreshCw,
  mindfulness: Lightbulb
};

const categoryColors = {
  reflection: 'bg-gradient-primary',
  gratitude: 'bg-gradient-rose-gold',
  goals: 'bg-gradient-accent',
  creative: 'bg-gradient-blush',
  mindfulness: 'bg-gradient-mauve'
};

export const WritingPrompts: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateNewPrompt();
  }, []);

  const generateNewPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    setResponse('');
  };

  const saveResponse = () => {
    if (!response.trim() || !currentPrompt) return;

    setIsLoading(true);
    
    // Save to localStorage with timestamp
    const savedPrompts = JSON.parse(localStorage.getItem('promptResponses') || '[]');
    const newResponse = {
      id: Date.now().toString(),
      promptId: currentPrompt.id,
      prompt: currentPrompt.prompt,
      response: response.trim(),
      category: currentPrompt.category,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    savedPrompts.push(newResponse);
    localStorage.setItem('promptResponses', JSON.stringify(savedPrompts));
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Response saved! ✨",
        description: "Your reflection has been beautifully captured.",
      });
      setResponse('');
      generateNewPrompt();
    }, 500);
  };

  const Icon = currentPrompt ? categoryIcons[currentPrompt.category] : Lightbulb;
  const gradientClass = currentPrompt ? categoryColors[currentPrompt.category] : 'bg-gradient-primary';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif-elegant font-bold text-foreground">
          Writing Prompts
        </h2>
        <p className="text-muted-foreground">
          Spark your creativity and overcome writer's block
        </p>
      </div>

      {currentPrompt && (
        <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-elegant border-0">
          <div className="space-y-6">
            {/* Prompt Header */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${gradientClass} shadow-soft`}>
                <Icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {currentPrompt.category}
                  </span>
                  <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    Today's Prompt
                  </span>
                </div>
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  {currentPrompt.prompt}
                </p>
              </div>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Let your thoughts flow here..."
                className="min-h-32 text-base leading-relaxed resize-none border-0 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {response.length} characters
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={generateNewPrompt}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Prompt
                  </Button>
                  <Button
                    onClick={saveResponse}
                    disabled={!response.trim() || isLoading}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
                    {isLoading ? 'Saving...' : 'Save Response'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Previous Responses Preview */}
      <Card className="p-6 bg-card/60 backdrop-blur-sm border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reflections</h3>
        <RecentResponses />
      </Card>
    </div>
  );
};

const RecentResponses: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem('promptResponses') || '[]');
    const recent = savedResponses.slice(-3).reverse();
    setResponses(recent);
  }, []);

  if (responses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Your reflections will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {responses.map((response) => (
        <div key={response.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary capitalize">
              {response.category}
            </span>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span className="text-sm text-muted-foreground">
              {new Date(response.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2 italic">
            "{response.prompt}"
          </p>
          <p className="text-sm text-foreground line-clamp-2">
            {response.response}
          </p>
        </div>
      ))}
    </div>
  );
};