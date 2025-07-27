import { renderMainMenu } from '../ui/renderMainMenu.js';
export default class Settings {
  constructor() {
    this.audio = null;
    this.soundEnabled = true; //по умолчанию вкл
    this.soundVolume = 0.5; //по умолчанию 50
    this.timer = false;
    this.time = 5;
  }

  start() {
    const settings = this.getSettings();

    if (settings) {
      this.soundEnabled = settings.soundEnabled ?? true;
      this.soundVolume = settings.soundVolume ?? 0.5;
      this.timer = settings.timer ?? false;
      this.time = settings.time ?? 5;
    }

    this.renderSettings();
  }

  renderSettings() {

    const app = document.getElementById('app');
    document.querySelector('.header__nav-btn').addEventListener('click', () => {

      app.innerHTML = '';

      const settingsHtml = `
      <section class="settings__card">

    <div class="settings__header">
      <p class="settings__text"><span><img src="assets/icons/prev.svg" alt="prev"></span> Settings</p>
      <img src="assets/icons/close.svg" alt="" class="settings__btn">
    </div>

    <div class="settings__body">
      <label class="settings__volume">Volume
        <p>
          <input type="range" class="settings__volume-input" min="0" max="100" step="1" value="${this.soundVolume}">
        </p>
        <div class="settings__volume-controls">
          <img src="assets/icons/${this.soundEnabled ? 'volume' : 'mute'}.svg" alt="volume" width="25" height="25" class= "volume">
        </div>
      </label>
      <label class="settings__time">Time game
        <p>
          <input type="checkbox" class="settings__time-input" ${this.timer ? 'checked' : ''}>
          <span></span>
        </p>
      </label>
      <div class="settings__answer">
        <p>Time to answer</p>
        <p class="settings__answer-controls">
          <button class="settings__answer-btn minus">-</button>
          <span>${this.time}</span>
          <button class="settings__answer-btn plus">+</button>
        </p>
      </div>

      <button class="settings__save-btn">Save</button>
    </div>

      </section>
      `;

      app.innerHTML = settingsHtml;

      document.querySelector('.settings__text').addEventListener('click', () => {
        app.innerHTML = '';
        renderMainMenu();
      });

      document.querySelector('.settings__btn').addEventListener('click', () => {
        app.innerHTML = '';
        renderMainMenu();
      });

      this.listener();
    });

  } //конец renderSettings

  getSettings() { //получение данных из localStorage
    const data = localStorage.getItem('quizSettings');

    if (data) {
      return JSON.parse(data);
    }
    else {
      return null;
    }

  }

  setSettings() { //сохранение данных в localStorage

    const settings = {
      soundEnabled: this.soundEnabled,
      soundVolume: this.soundVolume,
      timer: this.timer,
      time: this.time,
    };

    localStorage.setItem('quizSettings', JSON.stringify(settings));
  }

  listener() {

    const settingsVolume = document.querySelector('.settings__volume-input');
    settingsVolume.addEventListener('input', () => {
      this.soundVolume = settingsVolume.value;

      if (this.soundEnabled === false) {
        this.soundVolume = 0;
      }


      this.setSettings(); //сохраняем текущее значение в localStorage
    });

    const volumeControl = document.querySelector('.settings__volume-controls img');
    volumeControl.addEventListener('click', (e) => {
      this.soundEnabled = !this.soundEnabled;

      if (this.soundEnabled === false) {
        volumeControl.src = 'assets/icons/mute.svg';
        settingsVolume.value = 0;
      }
      else {
        volumeControl.src = 'assets/icons/volume.svg';
        this.soundVolume = settingsVolume.value / 100 || 0.5;
      }
      this.setSettings(); //сохраняем текущее значение в localStorage
    });

    const settingsTimer = document.querySelector('.settings__time-input');
    settingsTimer.addEventListener('change', () => {
      this.timer = settingsTimer.checked;
      this.setSettings(); //сохраняем текущее значение в localStorage
    });

    const minus = document.querySelector('.minus');
    const plus = document.querySelector('.plus');
    const span = document.querySelector('.settings__answer-controls span');

    this.time = Number(span.textContent);
    let max = 30;
    let min = 5;

    plus.addEventListener('click', () => {

      if (this.time < max) {
        this.time += 5;
        span.textContent = this.time;
        this.setSettings(); //сохраняем текущее значение в localStorage
      }
    });

    minus.addEventListener('click', () => {
      if (this.time > min) {
        this.time -= 5;
        span.textContent = this.time;
        this.setSettings(); //сохраняем текущее значение в localStorage
      }
    });

    const settingsBtn = document.querySelector('.settings__save-btn');
    settingsBtn.addEventListener('click', () => {
      settingsBtn.style.backgroundColor = '#ffbca2';
      settingsBtn.style.color = '#000';
      settingsBtn.style.border = '2px solid transparent';
      settingsBtn.textContent = 'Saved';
      settingsBtn.style.fontWeight = 'bold';

      this.setSettings(); //сохраняем все текущие значения в localStorage
    });

  } //конец listener

} //конец class Settings



