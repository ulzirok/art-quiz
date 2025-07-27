import { renderMainMenu } from './js/modules/renderMainMenu.js';
import Settings from './js/modules/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  renderMainMenu();
});

const settings = new Settings();
settings.start();