import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

let soundInstance: Audio.Sound | null = null;

export function useBackgroundMusic(enabled: boolean) {
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        if (!soundInstance) {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/music/dont-worry.mp3'),
            { isLooping: true, volume: 0.35, shouldPlay: false }
          );
          if (cancelled) { sound.unloadAsync(); return; }
          soundInstance = sound;
        }

        loaded.current = true;
        if (enabled) await soundInstance.playAsync();
      } catch {
        // audio file not found or device error — fail silently
      }
    }

    start();
    return () => { cancelled = true; };
  }, []);

  // React to toggle changes after initial load
  useEffect(() => {
    if (!loaded.current || !soundInstance) return;
    if (enabled) {
      soundInstance.playAsync().catch(() => {});
    } else {
      soundInstance.pauseAsync().catch(() => {});
    }
  }, [enabled]);
}
