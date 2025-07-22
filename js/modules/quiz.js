import { artistCategories, pictureCategories, getCategories } from './getCategories.js';
import { startQuiz } from './startQuiz.js';
import { renderMainMenu } from './renderMainMenu.js';
import RenderFinal from './renderFinal.js';
import { renderCategories } from './renderCategories.js';

export default class Quiz {
  constructor(questions, type, roundIndex, chunkedCategories) { //принимаем массив и тип кнопки
    this.questions = questions;
    this.type = type;
    this.questionIndex = 0;
    this.roundIndex = roundIndex;
    this.score = 0;
    this.chunkedCategories = chunkedCategories;
    this.answers = [];
    console.log(this.questions);

  }

  start() { //начинаем квиз - рендерим вопрос (с 1-вопроса 1-категории)
    const currentQuestion = this.questions[this.questionIndex]; //текущий вопрос (с 0 по 10)
    // console.log(currentQuestion);

    this.renderQuiz(currentQuestion);

  }

  renderQuiz(question) { //рендер вопроса
    console.log(question);


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

      for (let i = 0; i < 10; i++) {
        const liArtist = document.createElement('li');
        liArtist.classList.add('questions__indicator');

        if (this.answers[i] === true) {
          liArtist.classList.add('success');
        } else if (this.answers[i] === false) {
          liArtist.classList.add('error');
        }
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
      
      for (let i = 0; i < 10; i++) {
        const liPictures = document.createElement('li');
        liPictures.classList.add('questions__indicator');

        if (this.answers[i] === true) {
          liPictures.classList.add('success');
        } else if (this.answers[i] === false) {
          liPictures.classList.add('error');
        }
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

  handleAnswer(selectedAnswer, question, type) {  //рендерим правильный ответ и увеличиваем score

    const isCorrect = selectedAnswer === question.correctAnswer; //вернет true/false

    this.showModal(isCorrect, question, type);
  }

  showModal(isCorrect, question, type) { //рендер правильного ответа и увеличение score

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

    modalCard.classList.toggle('open'); //открываем модалку


    document.querySelector('.modal__btn').addEventListener('click', () => { //кнопка next question

      if (isCorrect) {
        this.score++;
      }

      this.answers.push(isCorrect);

      this.nextQuestion(modalCard);

    });

  }

  nextQuestion(modalCard) { //рендерим следующий вопрос или рендерим результат
    
    console.log(this.questionIndex);
    console.log(this.questions.length);
    

    if (this.questionIndex !== this.questions.length - 1) { //не последний вопрос?
      this.questionIndex++;
      modalCard.classList.toggle('open'); //закрываем модалку

      this.start();

    }
    else { //следующий вопрос?
      modalCard.remove();

      this.showResult();
    }

  }

  showResult() { //рендер результата, рендерим 12 категории

    const app = document.getElementById('app');

    const modalCardFinish = document.createElement('section');
    modalCardFinish.classList.add('modal__card-finish');
    app.appendChild(modalCardFinish);

    const modalBodyFinish = document.createElement('div');
    modalBodyFinish.classList.add('modal__body-finish');
    modalCardFinish.appendChild(modalBodyFinish);

    const modalImgFinish = document.createElement('div');
    modalImgFinish.classList.add('modal__img-finish');
    modalBodyFinish.appendChild(modalImgFinish);

    const imgFinish = document.createElement('img');
    imgFinish.width = 150;
    imgFinish.height = 150;

    if (this.score === this.questions.length) { //grand
      imgFinish.src = 'assets/icons/grand.svg';
      imgFinish.alt = 'img-grand';
    }
    else if (this.score * 100 / this.questions.length >= 50) { //congrats
      imgFinish.src = 'assets/icons/congrats.svg';
      imgFinish.alt = 'img-congrats';
    }
    else { //gameover
      imgFinish.src = 'assets/icons/gameover.svg';
      imgFinish.alt = 'img-gameover';
    }
    modalImgFinish.appendChild(imgFinish);

    const modalTitleFinish = document.createElement('h3');
    modalTitleFinish.classList.add('modal__title-finish');

    if (this.score === this.questions.length) { //grand
      modalTitleFinish.textContent = 'Grand Result!';
    }
    else if (this.score * 100 / this.questions.length >= 50) { //congrats
      modalTitleFinish.textContent = 'Congratulations!';
    }
    else { //gameover
      modalTitleFinish.textContent = 'Game over!';
    }
    modalBodyFinish.appendChild(modalTitleFinish);

    const modalTextFinish = document.createElement('p');
    modalTextFinish.classList.add('modal__text-finish');

    if (this.score === this.questions.length) { //grand
      modalTextFinish.textContent = 'Congratulations';
    }
    else if (this.score * 100 / this.questions.length >= 50) { //congrats
      const span = document.createElement('span');
      span.textContent = `${this.score} / ${this.questions.length}`;
      modalTextFinish.appendChild(span);
    }
    else { //gameover
      modalTextFinish.textContent = 'Play again?';
    }
    modalBodyFinish.appendChild(modalTextFinish);

    const modalButtonsFinish = document.createElement('div');
    modalButtonsFinish.classList.add('modal__buttons-finish');

    if (this.score === this.questions.length) { //grand
      modalButtonsFinish.innerHTML = `
    <button class="modal__btn-finish next">Next</button>
    `;
    }
    else if (this.score * 100 / this.questions.length >= 50) { //congrats
      modalButtonsFinish.innerHTML = `
    <button class="modal__btn-finish home">Home</button>
    <button class="modal__btn-finish next-quiz">Next Quiz</button>
    `;
    }
    else { //gameover
      modalButtonsFinish.innerHTML = `
    <button class="modal__btn-finish no">No</button>
    <button class="modal__btn-finish yes">Yes</button>
    `;
    }
    modalBodyFinish.appendChild(modalButtonsFinish);

    app.appendChild(modalCardFinish);
    modalCardFinish.classList.toggle('open');

    const buttonsFinish = document.querySelector('.modal__buttons-finish');
    const btnFinish = buttonsFinish.querySelectorAll('.modal__btn-finish');
    btnFinish.forEach((btn) => {
      btn.addEventListener('click', () => {
        modalCardFinish.classList.toggle('open');
        app.innerHTML = '';

        if (btn.classList.contains('next')) { //переход на следующую категорию (роунд 2) 
          console.log('next');
            this.handleRoundComplete(); //
        }
        if (btn.classList.contains('home')) { //переход на главную
          renderMainMenu(); //работает
        }
        if (btn.classList.contains('next-quiz')) { //переход на следующую категорию (роунд 2) 
          console.log('next-quiz');
          this.handleRoundComplete(); //
        }
        if (btn.classList.contains('no')) { //переход на главную
          renderMainMenu(); //работает
        }
        if (btn.classList.contains('yes')) { //начать заново текущие 10 вопросов this.start(); // перезапуск викторины
          console.log('yes');

          // const indicators = document.querySelectorAll('.questions__indicator');
          // console.log(indicators);
          
          // indicators.forEach(indicator => {
          //   indicator.classList.remove('success');
          //   indicator.classList.remove('error');
          // });

          this.questionIndex = 0;
          this.score = 0;
          this.start(); //работает

        }

      });
    });

  }

   handleRoundComplete() { //рендер 12 категории и ?рендерим следующий раунд
    console.log('отображаем категории');
    
    console.log(this.chunkedCategories[this.roundIndex]);
    
    // if (chunkedCategories.length === (this.questions.length + 2) {}

    renderCategories(this.type)
    
    

    // отображаем опять категории - список 12 категории //
    // пройденные категории - 1. картинка уже цветная, 2. поверх внизу картинки оверлай с надписью score, 3. сверху картинки появляется score
    //при нажатии на 1 категорию - рендерится 10 картинок этой категории 
    //при нажатии на 1 картинку - поверх картинки появится оверлай с информацией о картинке (появляется слева и закрывает картинку и при нажатии на них они исчезают обратно)
  }


  nextQuiz() { //рендер следующего раунда 

    // console.log(this.roundIndex);
    // console.log(this.chunkedCategories.length); //роунд12? 


    // if (this.roundIndex !== this.chunkedCategories.length - 1) { //не последний роунд?
    //   this.roundIndex++;

    //   startQuiz(this.chunkedCategories[this.roundIndex], this.type, this.roundIndex, this.chunkedCategories);

    // }
    // else { //последний роунд?

    // }

  }




} //конец класса