import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🥳', label: 'Excited', value: 'excited' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '💝', label: 'Grateful', value: 'grateful' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' }
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">How are you feeling today?</label>
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood === mood.value ? "default" : "outline"}
            size="sm"
            onClick={() => onMoodChange(mood.value)}
            className="h-12 flex flex-col gap-1 text-xs transition-smooth hover:scale-105"
            title={mood.label}
          >
            <span className="text-lg">{mood.emoji}</span>
            <span className="text-[10px] leading-none">{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};