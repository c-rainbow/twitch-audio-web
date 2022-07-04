// Code shared by both service workers and content script


const TWITCH_CLIENT_ID_KEY = 'twitchClientId';


export async function getTwitchClientId(): Promise<string | null> {
  const result = await chrome.storage.local.get([TWITCH_CLIENT_ID_KEY]);
  return result[TWITCH_CLIENT_ID_KEY] ?? null;
}


export async function setTwitchClientId(twitchClientId: string) {
  await chrome.storage.local.set({ twitchClientId });
}