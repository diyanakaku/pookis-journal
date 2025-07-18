import OpenAI from 'openai';

// You'll need to add your OpenAI API key here when you clone to GitHub
// For development, you can replace this with your actual API key
const OPENAI_API_KEY = 'your-openai-api-key-here';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - use backend in production
});

export interface SentimentAnalysis {
  mood: string;
  confidence: number;
  reason: string;
}

export const analyzeSentiment = async (journalText: string): Promise<SentimentAnalysis> => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Fallback to manual mood selection when API key is not configured
      return {
        mood: 'neutral',
        confidence: 0,
        reason: 'API key not configured'
      };
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis AI for a personal journal app. Analyze the user's journal entry and determine their mood. 

Available moods: happy, sad, peaceful, frustrated, thoughtful, tired, excited, anxious, grateful, neutral

Respond with a JSON object containing:
- mood: one of the available moods
- confidence: a number from 0 to 1 indicating how confident you are
- reason: a brief explanation of why you chose this mood

Be empathetic and understanding. Consider the overall emotional tone, not just individual words.`
        },
        {
          role: 'user',
          content: `Please analyze the sentiment of this journal entry: "${journalText}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content);
    return {
      mood: analysis.mood || 'neutral',
      confidence: analysis.confidence || 0.5,
      reason: analysis.reason || 'Analysis completed'
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Fallback to neutral mood on error
    return {
      mood: 'neutral',
      confidence: 0,
      reason: 'Error occurred during analysis'
    };
  }
};

export const isAPIKeyConfigured = (): boolean => {
  return OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here';
};