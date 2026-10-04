/**
 * One shared background-music element, so the cover's "Open Invitation" tap and the
 * floating music button control the same audio.
 *
 * Browsers only allow sound after a user gesture, so `playMusic` must be called
 * synchronously inside a click/tap handler (it is — from the cover button and the music button).
 */

import { asset } from "./asset";

type State = "playing" | "paused" | "error";
type Listener = (state: State) => void;

const TARGET_VOLUME = 0.45;
let audio: HTMLAudioElement | null = null;
let fadeId: number | undefined;
const listeners = new Set<Listener>();

const emit = (state: State) => listeners.forEach((l) => l(state));

function getAudio(url: string) {
  if (!audio) {
    audio = new Audio(asset(url));
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("play", () => emit("playing"));
    audio.addEventListener("pause", () => emit("paused"));
    audio.addEventListener("error", () => emit("error"));
  }
  return audio;
}

function fadeIn(el: HTMLAudioElement) {
  window.clearInterval(fadeId);
  el.volume = 0;
  fadeId = window.setInterval(() => {
    el.volume = Math.min(TARGET_VOLUME, el.volume + 0.03);
    if (el.volume >= TARGET_VOLUME) window.clearInterval(fadeId);
  }, 80);
}

/** Starts (or resumes) the music with a soft fade-in. Resolves false if the browser refused. */
export async function playMusic(url: string): Promise<boolean> {
  const el = getAudio(url);
  fadeIn(el);
  try {
    await el.play();
    return true;
  } catch {
    window.clearInterval(fadeId);
    return false;
  }
}

export function pauseMusic() {
  window.clearInterval(fadeId);
  audio?.pause();
}

export const isMusicPlaying = () => !!audio && !audio.paused;

export function onMusicChange(listener: Listener) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
