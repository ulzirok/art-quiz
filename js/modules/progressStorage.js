export function getProgress() {
  const data = localStorage.getItem('quizProgress');

  if (data) {
    return JSON.parse(data);
  }

  // Если данных нет — создаём начальную структуру
  const defaultProgress = {};

  ['artists', 'pictures'].forEach(type => {
    defaultProgress[type] = {};
    for (let i = 0; i < 12; i++) {
      defaultProgress[type][i] = null;
    }
  });

  // Сохраняем в localStorage
  saveProgress(defaultProgress);

  return defaultProgress;
}

export function saveProgress(progress) {
  localStorage.setItem('quizProgress', JSON.stringify(progress));
}
