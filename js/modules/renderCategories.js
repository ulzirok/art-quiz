
import { artistCategories, pictureCategories, getCategories } from './getCategories.js';
import { startQuiz } from './startQuiz.js';
import { getProgress, saveProgress } from './progressStorage.js';

export async function renderCategories(type) {
  console.log(artistCategories);
  console.log(pictureCategories);
  

  let progress = getProgress();

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
  categoriesCard.appendChild(categoriesTitle);

  const categoriesItems = document.createElement('div');
  categoriesItems.classList.add('categories__items');
  categoriesCard.appendChild(categoriesItems);

  const chunkedCategories = chunkedArray(categoryArray, 10); // 12 категории по 10 вопросов
  console.log(chunkedCategories);
  

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
    //

    // console.log(index); //номер вопроса
    // console.log(chunkedCategory); // 1 раунд
    // console.log(chunkedCategory[index]); // 1 вопрос

    // console.log(progress[type]); //образуется пустой объект до 10 вопроса
    // console.log(progress[type]?.[index]); //будет undefined, т.к номер раунда сохраняем после 10 вопроса
    // console.log(progress[type]?.[index]?.currentQuestionIndex); //номер вопроса
    // console.log(progress[type]?.[index]?.userScore); // очко
    // console.log(progress[type]?.[index]?.userAnswers); // ответы
    console.log(progress[type]?.[index]?.currImages); // картинки
    // console.log(progress[type]?.[index]?.info); // инфо
    console.log(progress[type]?.[index]?.currName); // name
    console.log(progress[type]?.[index]?.currAuthor); // author
    console.log(progress[type]?.[index]?.currYear); // year
    
    const infoName = progress[type]?.[index]?.currName
    const infoAuthor = progress[type]?.[index]?.currAuthor
    const infoYear = progress[type]?.[index]?.currYear

    const isCompleted = progress[type] && progress[type]?.[index]; // Проверяем, был ли пройден этот раунд (после 10вопроса будет - true)

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

      categoriesItemScore.addEventListener('click', (e) => { //При нажатии на кнопку score - рендерим картинки всех раундов( ${progress[type][index].currentImages} )
        e.stopPropagation();

        app.innerHTML = '';
        const imagesFinalCard = document.createElement('section');
        imagesFinalCard.classList.add('imagesFinal__card');

        const imageList = progress[type]?.[index]?.currImages;

        imageList.forEach((imageNum, i) => {

          const imagesFinalItem = document.createElement('div');
          imagesFinalItem.classList.add('imagesFinal__item');
          imagesFinalCard.appendChild(imagesFinalItem);

          const imagesFinalImg = document.createElement('img');
          imagesFinalImg.classList.add('imagesFinal__img');
          imagesFinalImg.src = `assets/img/${imageNum}.jpg`;
          
          imagesFinalItem.appendChild(imagesFinalImg);
          
          //====================
          
          
          imagesFinalItem.addEventListener('click', () => {

            const imagesFinalOverlay = document.createElement('div');
            imagesFinalOverlay.classList.add('imagesFinal__overlay');

            imagesFinalOverlay.innerHTML = `
            <p class="imagesFinal__name">${infoName[i]}</p>
            <p class="imagesFinal__author">${infoAuthor[i]}, 
              <span>${infoYear[i]}</span>
            </p>
            `;
            imagesFinalItem.appendChild(imagesFinalOverlay);

            
            for (let i = 0; i < imagesFinalOverlay.length; i++) {
              console.log(imagesFinalOverlay.length);
              console.log(i);
              
              imagesFinalImg[i].addEventListener('click', () => {
                imagesFinalOverlay[i].classList.toggle('open');
              });
              
            }
            
            const overlays = document.querySelectorAll('.imagesFinal__overlay');
            const images = document.querySelectorAll('.imagesFinal__img');
            for (let i = 0; i < overlays.length; i++) {
              console.log(overlays.length);
              console.log(images[i]);
              
              images[i].addEventListener('click', () => {
                overlays[i].classList.toggle('open');
              });
            }

          }); //конец imagesFinalItem.addEventListener('click'
          
          
          //====================

        }); //конец imageList.forEach

        app.appendChild(imagesFinalCard);

      }); //конец categoriesItemScore.addEventListener('click'

    }

   
  }); //конец chuncedCategories.forEach


 app.appendChild(categoriesCard); //рендится 12 роундов



  //
  const categoriesItemsElements = document.querySelectorAll('.categories__item'); //переходим в роунды
  categoriesItemsElements.forEach((categoriesItemsElement, index) => {
    categoriesItemsElement.addEventListener('click', (e) => { //при нажатии на кнопки artists и pictures - переходим в роунды

      if (type === 'artists') {
        startQuiz(chunkedCategories[index], 'artists', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по artists

      }
      else if (type === 'pictures') {
        startQuiz(chunkedCategories[index], 'pictures', index, chunkedCategories); //передаем массив 1 роунда с 10 вопросами по pictures
      }

    });

  });




} //конец функции renderCards()





function chunkedArray(array, size) { //принимает массив и количество для инкремента
  const category = [];

  for (let i = 0; i < array.length; i += size) { //на каждом цикле i увеличивается на 10
    category.push(array.slice(i, i + size)); //вырезаем по 10, пушим в новый массив
  }

  return category; //будет 12 массивов (из 12 циклов)
}







