import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";
import { invitation } from "../config/invitation";
import { asset } from "../lib/asset";
import { isMusicPlaying, onMusicChange, pauseMusic, playMusic } from "../lib/music";
import { useToast } from "./Toast";

/**
 * Hides the button only when the file is clearly missing (a 404, or the dev server's index.html
 * fallback). Never cached, so adding the file later works on refresh. If the check itself can't
 * run, the button is shown and the audio element reports any real error.
 */
async function isAudioAvailable(url: string): Promise<boolean> {
  try {
    const res = await fetch(asset(url), { method: "HEAD", cache: "no-store" });
    const type = res.headers.get("content-type") || "";
    if (res.status === 404 || type.includes("text/html")) return false;
    return true;
  } catch {
    return true;
  }
}

/**
 * Floating background-music toggle. Music starts when the guest opens the invitation
 * (see App) or taps this button; it never plays on page load.
 */
export function MusicPlayer() {
  const { music } = invitation;
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(isMusicPlaying);
  const toast = useToast();

  useEffect(() => {
    if (!music.enabled || !music.url.trim()) return;
    let alive = true;
    isAudioAvailable(music.url).then((ok) => alive && setAvailable(ok));
    const off = onMusicChange((state) => {
      setPlaying(state === "playing");
      if (state === "error") setAvailable(false);
    });
    return () => {
      alive = false;
      off();
    };
  }, [music.enabled, music.url]);

  if (!available) return null;

  const toggle = async () => {
    if (isMusicPlaying()) return pauseMusic();
    if (!(await playMusic(music.url))) toast("Sorry, the music couldn't be played");
  };

  return (
    <button
      type="button"
      className={`float-btn music-btn ${playing ? "is-playing" : ""}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Pause music (${music.title})` : `Play music (${music.title})`}
      title={playing ? "Music on" : "Music off"}
    >
      <Music2 size={17} strokeWidth={1.4} aria-hidden="true" />
      <span className="music-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
