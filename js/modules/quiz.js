import { artistCategories, pictureCategories, getCategories } from './getCategories.js';
import { startQuiz } from './startQuiz.js';
import { renderMainMenu } from './renderMainMenu.js';
import { getProgress, saveProgress } from './progressStorage.js';
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

    // console.log(this.chunkedCategories);
    // console.log(questions);

    this.soundEnabled = true; //по умолчанию вкл
    this.soundVolume = 0.5; //по умолчанию
    this.audio = null;

  }

  playSound(srcSound) {
    if (!this.soundEnabled) {
      return;
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio = new Audio(srcSound);
    this.audio.play();
  }

  getSoundSettings() { //получение настроенных данных из localStorage
    const savedSettings = JSON.parse(localStorage.getItem('settings'));

    this.soundEnabled = savedSettings?.soundEnabled ?? true; //если пользователь еще не настроил (?? - если значение из localStorage - undefined Или null то soundEnabled будет true, иначе установленное значение)
    this.soundVolume = savedSettings?.volume ?? 0.5;

    this.soundEnabled = savedSettings?.soundEnabled ?? true;
    this.soundVolume = savedSettings?.volume ?? 0.5;
  }

  start() { //начало Викторины - вызываем текущий вопрос
    const currentQuestion = this.questions[this.questionIndex];
    this.renderQuiz(currentQuestion);

    this.getSoundSettings();
  }

  renderQuiz(question) { //рендер вопросов - Начало текущего раунда
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

    if (this.type === 'artists') { //вопросы для Artists

      const titleArtist = document.createElement('p');
      titleArtist.classList.add('questions__title-artists');
      titleArtist.textContent = question.question;

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

        if (this.answers[i] === true) { //если ответ данного вопроса правильный, то красим индикаторы
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

    if (this.type === 'pictures') { //вопросы для Pictures

      const titlePictures = document.createElement('p');
      titlePictures.classList.add('questions__title-pictures');
      titlePictures.textContent = question.question;

      sectionPictures.appendChild(titlePictures);

      const ulPictures = document.createElement('ul');
      ulPictures.classList.add('questions__indicators-pictures');
      sectionPictures.appendChild(ulPictures);

      for (let i = 0; i < 10; i++) {
        const liPictures = document.createElement('li');
        liPictures.classList.add('questions__indicator');

        if (this.answers[i] === true) { //если ответ данного вопроса правильный, то красим индикаторы
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

    document.querySelectorAll('.questions__answer-artists').forEach((answer) => { //ответ пользователя по Artists
      answer.addEventListener('click', (event) => {
        event.stopPropagation();
        const selectedAnswer = event.target.textContent;
        this.handleAnswer(selectedAnswer, question, 'artists'); //прверка ответа
      });
    });

    document.querySelectorAll('.questions__img-pictures').forEach((answer) => { //ответ пользователя по Pictures
      answer.addEventListener('click', (event) => {
        event.stopPropagation();
        const selectedSrc = event.target.src;
        const splitSrc = selectedSrc.split('/img/')[1];
        const selectedAnswer = splitSrc.replace('.jpg', '');

        this.handleAnswer(selectedAnswer, question, 'pictures'); //проверка ответа
      });
    });

  }

  handleAnswer(selectedAnswer, question, type) {  //проверяем ответы пользователя

    const isCorrect = selectedAnswer === question.correctAnswer; //вернет true/false

    if (isCorrect) {
      this.playSound('/assets/sound/correct.mp3');
    }
    else {
      this.playSound('/assets/sound/wrong.mp3');
    }

    this.showModal(isCorrect, question, type); //показ результата текущего вопроса
  }

  showModal(isCorrect, question, type) { //рендер результата текущего вопроса и увеличение score

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

    document.querySelector('.modal__btn').addEventListener('click', (e) => { //кнопка next question

      if (isCorrect) {
        this.score++; //если правильно, увеличиваем score
      }

      this.answers.push(isCorrect); //добавляем правильный ответ в массив answers

      this.nextQuestion(modalCard, question); //переход к следующему вопросу
    });

  }

  nextQuestion(modalCard, question) { //вызываем следующий вопрос. Конец текущего раунда

    if (this.questionIndex !== this.questions.length - 1) { //проверка - не последний вопрос?
      this.questionIndex++; //нет - индекс вопроса увеличиваем
      modalCard.classList.toggle('open'); //закрываем модалку

      this.start(); //вызываем следующий вопрос
    }
    else { //последний вопрос? да - значит 1-роунд окончен
      modalCard.remove();

      let progress = getProgress(); //получаем данные из localStorage

      const currentType = this.type;
      const currentRoundIndex = this.roundIndex;

      if (!progress[currentType]) {
        progress[currentType] = {}; // создаём объект, если типа ещё нет (т.к у нас 2 типа)
      }

      progress[currentType][currentRoundIndex] = {
        currentQuestionIndex: this.questionIndex,
        userScore: this.score,
        userAnswers: this.answers,
        currImages: this.chunkedCategories[this.roundIndex].map(q => q.imageNum),
        currName: this.chunkedCategories[this.roundIndex].map(q => q.name),
        currAuthor: this.chunkedCategories[this.roundIndex].map(q => q.author),
        currYear: this.chunkedCategories[this.roundIndex].map(q => q.year),
      };

      saveProgress(progress); //Сохраняем прогресс (данные) по текущему раунду в localStorage

      this.showResult(question); //показ резултата текущего раунда
    }

  }

  showResult(question) { //рендер результата текущего раунда. Переходы по кнопкам

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
    modalCardFinish.classList.toggle('open'); //показываем модалку - результат текущего раунда
    this.playSound('/assets/sound/end_game.mp3');
    //

    const buttonsFinish = document.querySelector('.modal__buttons-finish');  //Клики по кнопкам: next,home,next-quiz,no/yes
    const btnFinish = buttonsFinish.querySelectorAll('.modal__btn-finish');
    btnFinish.forEach((btn) => {
      btn.addEventListener('click', () => {
        modalCardFinish.classList.toggle('open'); //скрываем модалку - результат


        if (btn.classList.contains('next')) { //переход на страницу 12 раундов
          app.innerHTML = ''; //очищаем страницу
          this.nextQuiz();
        }
        if (btn.classList.contains('home')) { //переход на главную
          app.innerHTML = ''; //очищаем страницу
          renderMainMenu();
        }
        if (btn.classList.contains('next-quiz')) { //переход на страницу 12 раундов
          app.innerHTML = ''; //очищаем страницу
          this.nextQuiz();
        }
        if (btn.classList.contains('no')) { //переход на главную
          app.innerHTML = ''; //очищаем страницу
          renderMainMenu();
        }
        if (btn.classList.contains('yes')) { //начать текущий раунд заново (перезапуск раунда)

          const indicators = document.querySelectorAll('.questions__indicator');

          indicators.forEach(indicator => {
            indicator.classList.remove('success');
            indicator.classList.remove('error');
          });

          this.questionIndex = 0;
          this.score = 0;
          this.answers = [];
          app.innerHTML = ''; //очищаем страницу
          this.start();
        }

      });
    });

  }

  nextQuiz() { //переход на страницу 12 раундов

    renderCategories(this.type); //передаем текущий тип

  }


} //конец класса Quiz