
import { artistCategories, pictureCategories, getCategories } from './getCategories.js';
import { startQuiz } from './startQuiz.js';

export async function renderCategories(type) {
  await getCategories();

  if (type === 'artists') {
    renderCards(artistCategories, 'artists'); //передаем массив artistCategories
  }
  else if (type === 'pictures') {
    renderCards(pictureCategories, 'pictures'); //передаем массив pictureCategories
  }
}

export async function renderCards(categoryArray, type) { //принимает массив (artists или pictures)
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

  const chunkedCategories = chunkedArray(categoryArray, 10); //передаем массив (artists или pictures) и количсетво эл-тов внутри


  if (!Array.isArray(categoryArray) || categoryArray.length === 0) {
    categoriesItems.textContent = 'No categories found.';
    return;
  }

  chunkedCategories.forEach((item, index) => {

    categoriesItems.innerHTML += `
      <div class="categories__item" id="categories__item" data-number="${index}">
       <p class="categories__text">Round ${index + 1} <span>(7/10)</span></p>
       <img class="categories__img" src="./assets/img/${item[0].imageNum}.jpg" alt=""> 
      </div>
   `;

    if (chunkedCategories[index].length + 2 === chunkedCategories.length) {
      document.querySelector('.categories__img').style.filter = 'grayscale(0)';
      
    }
    
    
  });


  const categoriesItemsElements = document.querySelectorAll('.categories__item');
  categoriesItemsElements.forEach((categoriesItemsElement, index) => {
    categoriesItemsElement.addEventListener('click', (e) => {

      if (type === 'artists') {
        startQuiz(chunkedCategories[index], 'artists', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по artists

      }
      else if (type === 'pictures') {
        startQuiz(chunkedCategories[index], 'pictures', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по pictures
      }

    });

  });

}

function chunkedArray(array, size) { //принимает массив и количество для инкремента
  const category = [];

  for (let i = 0; i < array.length; i += size) { //на каждом цикле i увеличивается на 10
    category.push(array.slice(i, i + size)); //вырезаем по 10, пушим в новый массив
  }

  return category; //будет 12 массивов (из 12 циклов)
}





