
const APP_CONFIG = {
    VERSION: '3.0.0',
    LAST_UPDATED: 'January 2025',
    MAX_CHAR_LIMIT: 200,
    WARNING_CHAR_LIMIT: 150,
    DANGER_CHAR_LIMIT: 180,
    MAX_ENTRIES_DISPLAY: 10,
    CALENDAR_DAYS: 42,
    REMINDER_HOUR: 20, // 8 PM
    STORAGE_KEYS: {
        ENTRIES: 'oneLineJournalEntries',
        THEME: 'oneLineJournalTheme',
        ONBOARDING: 'oneLineJournalOnboarding',
        VOICE_ENABLED: 'oneLineJournalVoiceEnabled',
        WISDOM_ENABLED: 'oneLineJournalWisdomEnabled',
        CUSTOM_QUOTES: 'oneLineJournalCustomQuotes',
        AI_SETTINGS: 'oneLineJournalAISettings'
    },
    // V3.0 Features
    VOICE_RECOGNITION: {
        LANG: 'en-US',
        CONTINUOUS: false,
        INTERIM_RESULTS: true
    },
    AI_PROVIDERS: {
        OPENAI: 'openai',
        GROQ: 'groq',
        XAI: 'xai',
        ANTHROPIC: 'anthropic',
        GOOGLE: 'google',
        MISTRAL: 'mistral',
        COHERE: 'cohere',
        AWS_BEDROCK: 'aws_bedrock',
        AZURE_OPENAI: 'azure_openai'
    },
    DEFAULT_QUOTES: [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Life is what happens when you're busy making other plans. - John Lennon",
        "The journey of a thousand miles begins with one step. - Lao Tzu",
        "Be the change you wish to see in the world. - Mahatma Gandhi",
        "Every day is a new beginning. Take a deep breath and start again.",
        "Your thoughts create your reality. Choose them wisely.",
        "The present moment is filled with joy and happiness. - Thich Nhat Hanh",
        "Gratitude turns what we have into enough. - Anonymous",
        "Small progress is still progress. Keep moving forward.",
        "You are capable of amazing things. Believe in yourself."
    ],
    SUGGESTED_TAGS: [
        '#gratitude', '#goal', '#focus', '#win', '#low', '#energy', '#creative',
        '#productive', '#learning', '#family', '#friends', '#work', '#health',
        '#fitness', '#mindfulness', '#inspiration', '#challenge', '#breakthrough',
        '#reflection', '#growth', '#peace', '#joy', '#love', '#success'
    ],
    TAG_CATEGORIES: {
        'Emotions': ['#gratitude', '#love', '#peace', '#joy', '#excitement', '#calm', '#inspired', '#motivated'],
        'Goals': ['#goal', '#focus', '#win', '#success', '#achievement', '#progress', '#milestone', '#breakthrough'],
        'Activities': ['#work', '#learning', '#creativity', '#exercise', '#reading', '#writing', '#cooking', '#travel'],
        'Relationships': ['#family', '#friendship', '#connection', '#support', '#community', '#mentor', '#team'],
        'Wellness': ['#health', '#mindfulness', '#meditation', '#sleep', '#nutrition', '#energy', '#balance', '#selfcare'],
        'Growth': ['#growth', '#challenge', '#reflection', '#learning', '#improvement', '#discovery', '#adventure', '#exploration']
    }
};

const MOOD_EMOJIS = {
    happy: '🙂',
    neutral: '😐',
    sad: '😔'
};

const MOOD_VALUES = {
    happy: 3,
    neutral: 2,
    sad: 1
};
