export let artistCategories = [];
export let pictureCategories = [];

export async function getCategories() {

  const response = await fetch('../../data/categories.json');
  const dataCategories = await response.json();
  artistCategories = dataCategories.slice(0, 120); //массив - тип Артисты
  pictureCategories = dataCategories.slice(120, 240); //массив - тип Картинки
}