import { renderMainMenu } from './src/modules/ui/renderMainMenu.js';
import Settings from './src/modules/logic/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  renderMainMenu();
});

const settings = new Settings();
settings.start();