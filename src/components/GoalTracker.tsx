import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, Calendar, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'health' | 'career' | 'learning' | 'relationships';
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  mentionCount: number;
  lastMentioned: string | null;
  createdAt: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

const categoryColors = {
  personal: 'bg-gradient-primary',
  health: 'bg-gradient-rose-gold',
  career: 'bg-gradient-accent',
  learning: 'bg-gradient-blush',
  relationships: 'bg-gradient-mauve'
};

const categoryIcons = {
  personal: Star,
  health: Target,
  career: TrendingUp,
  learning: Star,
  relationships: Target
};

export const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    targetDate: ''
  });
  const [newMilestone, setNewMilestone] = useState('');
  const [milestones, setMilestones] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
    analyzeJournalMentions();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem('userGoals');
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const analyzeJournalMentions = () => {
    // Analyze journal entries for goal mentions
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const saved = localStorage.getItem('userGoals');
    if (!saved) return;

    const currentGoals = JSON.parse(saved);
    const updatedGoals = currentGoals.map((goal: Goal) => {
      const mentions = entries.filter((entry: any) => 
        entry.content.toLowerCase().includes(goal.title.toLowerCase()) ||
        goal.description.toLowerCase().split(' ').some((word: string) => 
          word.length > 3 && entry.content.toLowerCase().includes(word.toLowerCase())
        )
      );

      return {
        ...goal,
        mentionCount: mentions.length,
        lastMentioned: mentions.length > 0 ? mentions[mentions.length - 1].date : goal.lastMentioned
      };
    });

    saveGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      progress: 0,
      milestones: milestones.map((title, index) => ({
        id: `${Date.now()}-${index}`,
        title: title.trim(),
        completed: false
      })),
      mentionCount: 0,
      lastMentioned: null,
      createdAt: new Date().toISOString(),
      completed: false
    };

    saveGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', category: 'personal', targetDate: '' });
    setMilestones([]);
    setShowAddForm(false);
    
    toast({
      title: "Goal created! 🎯",
      description: "Your new goal has been added to your tracker.",
    });
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone.trim()]);
      setNewMilestone('');
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return {
              ...milestone,
              completed: !milestone.completed,
              completedAt: !milestone.completed ? new Date().toISOString() : undefined
            };
          }
          return milestone;
        });

        const completedMilestones = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedMilestones / updatedMilestones.length) * 100);

        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          completed: progress === 100
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
    toast({
      title: "Goal removed",
      description: "The goal has been deleted from your tracker.",
    });
  };

  const getDaysUntilTarget = (targetDate: string): number => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif-elegant font-bold text-foreground">
          Goal Tracker
        </h2>
        <p className="text-muted-foreground">
          Set, track, and achieve your dreams with AI-powered insights
        </p>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add New Goal'}
        </Button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-elegant border-0">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Create New Goal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Learn Spanish"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                  className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="career">Career</option>
                  <option value="learning">Learning</option>
                  <option value="relationships">Relationships</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal and why it matters to you..."
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Date</label>
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Milestones</label>
              <div className="flex gap-2">
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                />
                <Button onClick={addMilestone} size="sm">Add</Button>
              </div>
              {milestones.length > 0 && (
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-background/50 rounded">
                      <span className="text-sm">{milestone}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMilestones(milestones.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={addGoal} className="flex-1">
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Active Goals</h3>
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleMilestone={toggleMilestone}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Completed Goals
          </h3>
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleMilestone={toggleMilestone}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && !showAddForm && (
        <Card className="p-8 text-center bg-card/60 backdrop-blur-sm border-0">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your goals and watch AI analyze your progress through your journal entries
          </p>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Goal
          </Button>
        </Card>
      )}
    </div>
  );
};

const GoalCard: React.FC<{
  goal: Goal;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (goalId: string) => void;
}> = ({ goal, onToggleMilestone, onDelete }) => {
  const getDaysUntilTarget = (targetDate: string): number => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const Icon = categoryIcons[goal.category];
  const daysUntil = goal.targetDate ? getDaysUntilTarget(goal.targetDate) : null;

  return (
    <Card className={`p-6 shadow-elegant border-0 ${goal.completed ? 'bg-card/40' : 'bg-card/80'} backdrop-blur-sm`}>
      <div className="space-y-4">
        {/* Goal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${categoryColors[goal.category]}`}>
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`text-lg font-semibold ${goal.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {goal.title}
                </h4>
                {goal.completed && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge variant="secondary" className="capitalize">
                  {goal.category}
                </Badge>
                {goal.targetDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {daysUntil !== null && daysUntil >= 0 ? `${daysUntil} days left` : 'Overdue'}
                  </div>
                )}
                {goal.mentionCount > 0 && (
                  <div className="text-primary">
                    📝 Mentioned {goal.mentionCount} times
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            Delete
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Progress</span>
            <span className="text-muted-foreground">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Milestones</h5>
            <div className="space-y-1">
              {goal.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={milestone.completed}
                    onCheckedChange={() => onToggleMilestone(goal.id, milestone.id)}
                    disabled={goal.completed}
                  />
                  <span className={`text-sm ${milestone.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {milestone.title}
                  </span>
                  {milestone.completed && milestone.completedAt && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      ✓ {new Date(milestone.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};