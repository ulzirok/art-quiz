import { getCategories } from './getCategories.js';
import { renderCategories } from './renderCategories.js';
import { playSound, currentAudio, soundEnabled, soundVolume } from './playSound.js';

export function renderMainMenu() {

  const app = document.getElementById('app');

  app.innerHTML = `
            <section class="main__card">
              <div class="main__buttons">
                <button class="main__btn" id="btn__artists" type="artists">Artists quiz</button>
                <button class="main__btn" id="btn__pictures" type="pictures">Pictures quiz</button>
              </div>
           </section>
          `;

  document.getElementById('btn__artists').addEventListener('click', async () => {
    playSound('assets/sound/gamestart.mp3');
    await getCategories();
    renderCategories('artists'); //тип кнопки artists
  });

  document.getElementById('btn__pictures').addEventListener('click', async () => {
    playSound('assets/sound/gamestart.mp3');
    await getCategories();
    renderCategories('pictures'); //тип кнопки pictures
  });

}

document.getElementById('header__nav-main').addEventListener('click', () => {
  app.innerHTML = '';
  if (currentAudio) { //останавливаем предыдущий аудио
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  renderMainMenu();
})






