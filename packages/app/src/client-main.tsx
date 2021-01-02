import ReactDOM from 'react-dom';
import { App } from './app';

const rootContainerId = 'SITE_MAIN';

const container = document.getElementById(rootContainerId) ?? createContainer(document.body);

ReactDOM.render(<App />, container);

function createContainer(targetParent: Element) {
  const newContainer = document.createElement('div');
  newContainer.id = rootContainerId;
  return targetParent.appendChild(newContainer);
}
