export let currentAudio = null;
export let soundEnabled = true;
export let soundVolume = 0.5;

export function playSound(srcSound) {

  const savedSettings = JSON.parse(localStorage.getItem('quizSettings')) || {};
  const volume = (savedSettings.soundVolume ?? 50) / 100;
  const enabled = savedSettings.soundEnabled ?? true;

  soundEnabled = enabled;
  soundVolume = volume;

  localStorage.setItem('quizSettings', JSON.stringify(savedSettings));

  if (!soundEnabled) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  currentAudio = new Audio(srcSound);
  currentAudio.volume = soundVolume;
  currentAudio.play();
}
