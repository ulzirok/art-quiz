import { getCategories } from './getCategories.js';
import { renderCategories } from './renderCategories.js';

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
    await getCategories();
    renderCategories('artists'); //тип кнопки artists
  });

  document.getElementById('btn__pictures').addEventListener('click', async () => {
    await getCategories();
    renderCategories('pictures'); //тип кнопки pictures
  });

}

document.getElementById('header__nav-main').addEventListener('click', () => {
  app.innerHTML = '';
  renderMainMenu();
})






