import App from './App.svelte';

const name = 'dataExplorer';

class DataExplorer {
  init() {
    const toolbox = document.querySelector('#toolbox');
    new App({
      target: toolbox,
    });
  }
}

const setup = () => {
  window.plugin[name] = new DataExplorer();
  window.plugin[name].init();
  addCSSs();
};

export default setup;
