import { artistCategories, pictureCategories } from './getCategories.js';
import RenderFinal from './renderFinal.js';

export default class Quiz {
  constructor(questions, type, roundIndex) { //принимаем массив и тип кнопки
    this.questions = questions;
    this.type = type;
    this.questionIndex = 0;
    this.roundIndex = roundIndex;
    this.score = 0;

  }

  start() {
    const currentQuestion = this.questions[this.questionIndex]; //текущий вопрос (с 0 по 10)
    this.renderQuiz(currentQuestion);

  }

  renderQuiz(question) {

    const app = document.getElementById('app');
    app.innerHTML = '';

    const sectionArtists = document.createElement('section');
    sectionArtists.classList.add('questions__card-artists');

    const sectionPictures = document.createElement('section');
    sectionPictures.classList.add('questions__card-pictures');

    const time = document.createElement('div');
    time.classList.add('questions__time-artists');
    sectionArtists.appendChild(time);

    const span = document.createElement('span');
    time.appendChild(span);


    if (this.type === 'artists') {

      const titleArtist = document.createElement('p');
      titleArtist.classList.add('questions__title-artists');
      titleArtist.textContent = question.question; //вопрос

      sectionArtists.appendChild(titleArtist);

      const imgArtist = document.createElement('img');
      imgArtist.classList.add('questions__img-artists');
      imgArtist.src = `./assets/img/${question.image}.jpg`;

      sectionArtists.appendChild(imgArtist);

      const ulArtist = document.createElement('ul');
      ulArtist.classList.add('questions__indicators-artists');
      sectionArtists.appendChild(ulArtist);

      for (let i = 0; i < 11; i++) {
        const liArtist = document.createElement('li');
        liArtist.classList.add('questions__indicator-artists');
        ulArtist.appendChild(liArtist);
      }

      const answersArtist = document.createElement('div');
      answersArtist.classList.add('questions__answers-artists');
      sectionArtists.appendChild(answersArtist);

      question.answers.forEach((answer) => {
        const answerArtist = document.createElement('div');
        answerArtist.classList.add('questions__answer-artists');
        answerArtist.textContent = answer;
        answersArtist.appendChild(answerArtist);
      });

      app.appendChild(sectionArtists);
    }


    if (this.type === 'pictures') {

      const titlePictures = document.createElement('p');
      titlePictures.classList.add('questions__title-pictures');
      titlePictures.textContent = question.question; //вопрос

      sectionPictures.appendChild(titlePictures);

      const ulPictures = document.createElement('ul');
      ulPictures.classList.add('questions__indicators-pictures');
      sectionPictures.appendChild(ulPictures);

      for (let i = 0; i < 11; i++) {
        const liPictures = document.createElement('li');
        liPictures.classList.add('questions__indicator-pictures');
        ulPictures.appendChild(liPictures);
      }

      const answersPictures = document.createElement('div');
      answersPictures.classList.add('questions__images-pictures');
      sectionPictures.appendChild(answersPictures);

      question.answers.forEach((answer) => {
        const answerPictures = document.createElement('img');
        answerPictures.classList.add('questions__img-pictures');
        answerPictures.src = `./assets/img/${answer}.jpg`;
        answersPictures.appendChild(answerPictures);
      });

      app.appendChild(sectionPictures);
    }

    document.querySelectorAll('.questions__answers-artists').forEach((answer) => {
      answer.addEventListener('click', (event) => {

        const selectedAnswer = event.target.textContent;
        this.handleAnswer(selectedAnswer, question, 'artists'); //передаем выбранный ответ по Artists
      });
    });

    document.querySelectorAll('.questions__img-pictures').forEach((answer) => {
      answer.addEventListener('click', (event) => {

        const selectedSrc = event.target.src;
        const splitSrc = selectedSrc.split('/img/')[1];
        const selectedAnswer = splitSrc.replace('.jpg', '');

        this.handleAnswer(selectedAnswer, question, 'pictures'); //передаем выбранный ответ по Pictures

      });

    });
  }

  handleAnswer(selectedAnswer, question, type) {

    const isCorrect = selectedAnswer === question.correctAnswer; //вернет true/false

    this.showModal(isCorrect, question, type);
  }

  showModal(isCorrect, question, type) {


    let globalArray; //исходный массив artistCategories/pictureCategories (по 120 каждый)
    const globalIndex = this.roundIndex * 10 + this.questionIndex; //индекс в исходном массиве artistCategories/pictureCategories 

    if (type === 'artists') {
      globalArray = artistCategories;
    }
    else if (type === 'pictures') {
      globalArray = pictureCategories;
    }

    const app = document.getElementById('app');

    const modalCard = document.createElement('section');
    modalCard.classList.add('modal__card');

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal__body');
    modalCard.appendChild(modalBody);

    const modalIcon = document.createElement('div');
    modalIcon.classList.add('modal__icon-success');
    modalBody.appendChild(modalIcon);

    const imgIcon = document.createElement('img');
    imgIcon.src = isCorrect ? 'assets/icons/success.svg' : 'assets/icons/error.svg';
    imgIcon.alt = isCorrect ? 'icon-success' : 'icon-error';
    imgIcon.width = 40;
    imgIcon.height = 40;
    modalIcon.appendChild(imgIcon);

    const modalImg = document.createElement('div');
    modalImg.classList.add('modal__img');
    modalBody.appendChild(modalImg);

    const imgModalImg = `
      <img src="assets/img/${globalArray[globalIndex].imageNum}.jpg" alt="modal-img">
      `;
    modalImg.innerHTML = imgModalImg;

    const modalTitle = document.createElement('h3');
    modalTitle.classList.add('modal__title');
    modalTitle.textContent = globalArray[globalIndex].name;
    modalBody.appendChild(modalTitle);

    const modalAuthor = document.createElement('div');
    modalAuthor.classList.add('modal__author');
    modalAuthor.textContent = globalArray[globalIndex].author + ', ';
    modalBody.appendChild(modalAuthor);

    const modalAuthorSpan = document.createElement('span');
    modalAuthorSpan.textContent = globalArray[globalIndex].year;
    modalAuthor.appendChild(modalAuthorSpan);

    const modalBtn = document.createElement('button');
    modalBtn.classList.add('modal__btn');
    modalBtn.textContent = 'Next';
    modalBody.appendChild(modalBtn);

    app.appendChild(modalCard);

    modalCard.classList.toggle('open');


    if (isCorrect) {
      this.score++;
      
    }
    
    document.querySelector('.modal__btn').addEventListener('click', () => {
      this.nextQuestion()
    })

  }
  
  
  nextQuestion() {
    
    // if (не последний вопрос? ) {
      
    // }
    // else {
    //   последний вопрос?
    // }
    
  }
  

} //конец класса