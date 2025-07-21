import RenderFinal from './renderFinal.js';

export default class Quiz {
  constructor(questions, type) { //принимаем массив и тип кнопки
    this.questions = questions;
    this.type = type;
    this.questionIndex = 0;
  }

  start() {
    const currentQuestion = this.questions[this.questionIndex];
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


    this.checkAnswer()
  }
  
  checkAnswer() {
    
  }

} //конец класса