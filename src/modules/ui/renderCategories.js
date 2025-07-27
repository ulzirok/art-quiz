import { artistCategories, pictureCategories, getCategories } from '../utils/getCategories.js';
import { startQuiz } from '../logic/startQuiz.js';
import { getProgress, saveProgress } from '../utils/progressStorage.js';
import { playSound, currentAudio, soundEnabled, soundVolume } from '../utils/playSound.js';
import { renderMainMenu } from './renderMainMenu.js';

export async function renderCategories(type) { //рендер 12 раундов по выбранному типу

  const btnGoBack = document.querySelector('.header__nav-btnPrev');
  btnGoBack.style.display = 'none';

  const progress = getProgress(); //получаем данные из localStorage

  await getCategories();

  if (type === 'artists') {
    renderCards(artistCategories, 'artists');
  }
  else if (type === 'pictures') {
    renderCards(pictureCategories, 'pictures');
  }
}

export async function renderCards(categoryArray, type) { //показываем 12 раундов

  const settingsBtn = document.querySelector('.header__nav-btn');
  settingsBtn.style.display = 'none';

  const app = document.getElementById('app');
  app.innerHTML = '';

  const categoriesCard = document.createElement('section');
  categoriesCard.classList.add('categories__card');

  const categoriesTitle = document.createElement('h2');
  categoriesTitle.classList.add('categories__title');
  categoriesTitle.textContent = 'Rounds';
  categoriesCard.appendChild(categoriesTitle);

  const categoriesItems = document.createElement('div');
  categoriesItems.classList.add('categories__items');
  categoriesCard.appendChild(categoriesItems);

  const chunkedCategories = chunkedArray(categoryArray, 10); // 12 категории по 10 вопросов

  if (!Array.isArray(categoryArray) || categoryArray.length === 0) {
    categoriesItems.textContent = 'No categories found!';
    return;
  }

  const progress = getProgress(); //получаем данные из localStorage

  chunkedCategories.forEach((chunkedCategory, index) => {

    const categoriesItem = document.createElement('div');
    categoriesItem.classList.add('categories__item');
    categoriesItems.appendChild(categoriesItem);

    const categoriesText = document.createElement('p');
    categoriesText.classList.add('categories__text');
    categoriesText.textContent = `Round ${index + 1} `;
    categoriesItem.appendChild(categoriesText);

    const categoriesImg = document.createElement('img');
    categoriesImg.classList.add('categories__img');
    categoriesImg.alt = 'categories__img';
    categoriesImg.src = `assets/img/${chunkedCategory[0].imageNum}.jpg`;
    categoriesItem.appendChild(categoriesImg);

    // console.log(progress[type]?.[index]?.currImages); // pic
    // console.log(progress[type]?.[index]?.currName); // name
    // console.log(progress[type]?.[index]?.currAuthor); // author
    // console.log(progress[type]?.[index]?.currYear); // year

    const infoName = progress[type]?.[index]?.currName;
    const infoAuthor = progress[type]?.[index]?.currAuthor;
    const infoYear = progress[type]?.[index]?.currYear;

    const isCompleted = progress[type] && progress[type]?.[index]; // Проверяем, был ли пройден этот раунд (после 10 вопроса будет - true)

    if (isCompleted) {
      categoriesImg.style.filter = 'grayscale(0)';
      categoriesItem.style.position = 'relative';
      const categoriesItemScore = document.createElement('button');
      categoriesItemScore.textContent = `Score: ${progress[type]?.[index]?.userScore}/10`;
      categoriesItemScore.classList.add('categories__item-score');
      categoriesItem.appendChild(categoriesItemScore);

      const categoriesTextSpan = document.createElement('span');
      categoriesTextSpan.textContent = ` (${progress[type]?.[index]?.userScore}/10)`;
      categoriesTextSpan.style.color = '#FFBCA2';
      categoriesText.appendChild(categoriesTextSpan);

      categoriesItemScore.addEventListener('click', (e) => { //При нажатии на кнопку score - рендерим картинки всех раундов

        e.stopPropagation();

        if (currentAudio) { //останавливаем предыдущее аудио
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        playSound('assets/sound/gamestart.mp3'); //включаем аудио

        app.innerHTML = '';
        const imagesFinalCard = document.createElement('section');
        imagesFinalCard.classList.add('imagesFinal__card');

        const imageList = progress[type]?.[index]?.currImages; //картинки из localStorage

        imageList.forEach((imageNum, i) => {

          const imagesFinalItem = document.createElement('div');
          imagesFinalItem.classList.add('imagesFinal__item');

          const imagesFinalOverlay = document.createElement('div');
          imagesFinalOverlay.classList.add('imagesFinal__overlay');

          imagesFinalOverlay.innerHTML = `
            <p class="imagesFinal__name">${infoName[i]}</p>
            <p class="imagesFinal__author">${infoAuthor[i]}, 
              <span>${infoYear[i]}</span>
            </p>
            `;
          imagesFinalItem.appendChild(imagesFinalOverlay);

          const imagesFinalImg = document.createElement('img');
          imagesFinalImg.classList.add('imagesFinal__img');
          imagesFinalImg.src = `assets/img/${imageNum}.jpg`;
          imagesFinalItem.appendChild(imagesFinalImg);

          imagesFinalCard.appendChild(imagesFinalItem);

          imagesFinalImg.addEventListener('click', () => { //При нажатии на картинку - рендерим инфо
            imagesFinalOverlay.classList.toggle('open');
          });

          imagesFinalOverlay.addEventListener('click', () => {
            imagesFinalOverlay.classList.toggle('open');
          });

        }); //конец imageList.forEach

        app.appendChild(imagesFinalCard);

      }); //конец categoriesItemScore.addEventListener

    }

  }); //конец chuncedCategories.forEach

  app.appendChild(categoriesCard);

  //
  const categoriesItemsElements = document.querySelectorAll('.categories__item');
  categoriesItemsElements.forEach((categoriesItemsElement, index) => {
    categoriesItemsElement.addEventListener('click', (e) => { //при нажатии на кнопки artists и pictures - переходим в раунды

      if (currentAudio) { //останавливаем предыдущее аудио
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      playSound('assets/sound/choice.mp3'); //включаем аудио

      if (type === 'artists') {
        startQuiz(chunkedCategories[index], 'artists', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по artists

      }
      else if (type === 'pictures') {
        startQuiz(chunkedCategories[index], 'pictures', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по pictures
      }

    });

  });

} //конец функции renderCards

function chunkedArray(array, size) { //принимает массив и количество для инкремента
  const category = [];

  for (let i = 0; i < array.length; i += size) { //на каждом цикле i увеличивается на 10
    category.push(array.slice(i, i + size)); //вырезаем по 10, пушим в новый массив
  }

  return category; //будет 12 массивов (из 12 циклов)
}







