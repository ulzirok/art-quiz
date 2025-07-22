import { artistCategories, pictureCategories } from './getCategories.js';
import Quiz from './quiz.js';

export function startQuiz(questionsArray, type, roundIndex, chunkedCategories) { //принимаем вопросы роунда
  // console.log(questionsArray);
  console.log(chunkedCategories);
  console.log(chunkedCategories.length);
  console.log(chunkedCategories[roundIndex]);
  
  const questions = prepareQuestions(questionsArray, type); //передаем вопросы роунда
  
  const quiz = new Quiz(questions, type, roundIndex, chunkedCategories); //вызов класса - передаем готовый массив с вопросами/ответами и тип
  quiz.start(); //вызов метода класса Quiz
}

function prepareQuestions(arrayQuestionsOfRound, type) { //принимаем вопросы роунда
  
  return arrayQuestionsOfRound.map((arrayQuestionOfRound) => {

    const question = {
      question: type === 'artists' ? `Who is the author of ${arrayQuestionOfRound.name}?` : `Which is ${arrayQuestionOfRound.author} picture?`,

      correctAnswer: type === 'artists' ? arrayQuestionOfRound.author : arrayQuestionOfRound.imageNum,

      answers: type === 'artists' ? getAllAuthors(arrayQuestionOfRound.author, arrayQuestionsOfRound) : getAllImages(arrayQuestionOfRound.imageNum, arrayQuestionsOfRound),
    };
    
    if (type === 'artists') {
      question.image = arrayQuestionOfRound.imageNum
    }

    return question;
  });
}

function getAllAuthors(correctAuthor, arrayAuthors) {
  const authorsAll = arrayAuthors.map((arrayAuthor) => {
    return arrayAuthor.author;
  });
  return getAnswers(correctAuthor, authorsAll);
}

function getAllImages(correctAuthor, arrayAuthors) {
  const authorsAll = arrayAuthors.map((arrayAuthor) => {
    return arrayAuthor.imageNum;
  });
  return getAnswers(correctAuthor, authorsAll);
}

function getAnswers(correctAuthor, arrayAuthorsAll) {
  const otherAuthors = arrayAuthorsAll.filter(author => author !== correctAuthor);
  const shuffled = otherAuthors.sort(() => Math.random() - 0.5); //перемешиваем элементы массива с вопросами (3 неправильных ответа)
  const randomWrong = shuffled.slice(0, 3);
  const answers = [...randomWrong, correctAuthor];
  return answers.sort(() => Math.random() - 0.5); //перемешиваем элементы массива с вопросами (4 вопроса, включая правильный), чтобы правильный не был всегда последним
}


