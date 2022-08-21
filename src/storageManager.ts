// Code shared by both service workers and content script

const TWITCH_CLIENT_ID_KEY = 'twitchClientId';
const TWITCH_OAUTH_TOKEN_KEY = 'twitchOauthToken';

export async function getTwitchClientId(): Promise<string | null> {
    const result = await chrome.storage.local.get([TWITCH_CLIENT_ID_KEY]);
    return result[TWITCH_CLIENT_ID_KEY] || null;
}

export async function setTwitchClientId(twitchClientId: string) {
    await chrome.storage.local.set({ [TWITCH_CLIENT_ID_KEY]: twitchClientId });
}

export async function getTwitchOauthToken(): Promise<string | null> {
  const result = await chrome.storage.local.get([TWITCH_OAUTH_TOKEN_KEY]);
  return result[TWITCH_OAUTH_TOKEN_KEY] || null;
}

export async function setTwitchOauthToken(twitchOauthToken: string | null) {
  await chrome.storage.local.set({ [TWITCH_OAUTH_TOKEN_KEY]: twitchOauthToken });
}