export let currentAudio = null
export let soundEnabled = true
export let soundVolume = 0.5

export function playSound(srcSound) {
  if (!soundEnabled) {
    return
  }
  
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  
  currentAudio = new Audio(srcSound)
  currentAudio.volume = soundVolume
  currentAudio.play()
}