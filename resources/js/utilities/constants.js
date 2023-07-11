// === App Specific Info ===
export const name = 'AI Toolbox';

export const packages = [
  'Laravel 10',
  'Vite 4',
  'OpenAI 3',
];

export const version = '1.6.4';


// === OpenAI Info ===
export const OPENAI_REQUEST_TYPES = {
  CHAT: 'CHAT',
  IMAGE: 'IMAGE',
};

const OPENAI_MODEL_DEFAULT = {
  endPoint: 'chat/completions',
  requestType: OPENAI_REQUEST_TYPES.CHAT,
};

export const OPENAI_MODELS = {
  'gpt-3.5-turbo-0613': { ...OPENAI_MODEL_DEFAULT, created: 1686587434 },
  'gpt-3.5-turbo-16k-0613': { ...OPENAI_MODEL_DEFAULT, created: 1685474247 },
  'gpt-3.5-turbo-16k': { ...OPENAI_MODEL_DEFAULT, created: 1683758102 },
  'gpt-3.5-turbo-0301': { ...OPENAI_MODEL_DEFAULT, created: 1677649963 },
  'gpt-3.5-turbo': { ...OPENAI_MODEL_DEFAULT, created: 1677610602 },
  'image-generation': { endPoint: 'images/generations', requestType: OPENAI_REQUEST_TYPES.IMAGE }
};

export const IMAGE_SIZES = [
  '256x256',
  '512x512',
  '1024x1024',
];

// Note: Properties affect features on ResultDisplay.vue
export const RESPONSE_DEFAULT = Object.freeze({
  answers: [],
  canBeCopiedToClipboard: true,
  canBeDownloaded: false,
  image: {},
  isDisplayReady: false,
  prompt: null,
  requestType: null,
});

export const ROLE_AI_DEFAULT = 'a helpful assistant';
