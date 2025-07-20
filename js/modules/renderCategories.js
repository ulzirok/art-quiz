import RenderQuiz from '../modules/renderQuiz.js';
import { artistCategories, pictureCategories, getCategories } from './getCategories.js';

export async function renderCategories(type) {
  await getCategories();

  if (type === 'artists') {
    renderCards(artistCategories); //передаем массив artistCategories
  }
  else if (type === 'pictures') {
    renderCards(pictureCategories); //передаем массив pictureCategories
  }
}

export function renderCards(categoryArray) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const categoriesCard = document.createElement('section');
  categoriesCard.classList.add('categories__card');

  const categoriesTitle = document.createElement('h2');
  categoriesTitle.classList.add('categories__title');
  categoriesTitle.textContent = 'Rounds';

  const categoriesItems = document.createElement('div');
  categoriesItems.classList.add('categories__items');

  categoriesCard.appendChild(categoriesTitle);
  categoriesCard.appendChild(categoriesItems);

  app.appendChild(categoriesCard);

  const chunkedCategories = chunkedArray(categoryArray, 10);

  if (!Array.isArray(categoryArray) || categoryArray.length === 0) {
    categoriesItems.textContent = 'No categories found.';
    return;
  }

  chunkedCategories.forEach((item, index) => {

    categoriesItems.innerHTML += `
      <div class="categories__item">
       <p class="categories__text">Round ${index + 1}</p>
       <img class="categories__img" src="./assets/img/${item[0].imageNum}.jpg" alt=""> 
      </div>
   `;
  });

}

function chunkedArray(array, size) {
  const category = [];

  for (let i = 0; i < array.length; i += size) {
    category.push(array.slice(i, i + size));
  }

  return category;
}

