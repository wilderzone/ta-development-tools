import { Buffer, Decoder, stringToHex } from 'ta-network-api';

let loading = false;
let history = [] as string[];

let messageInputElement: HTMLInputElement | null;
let parsedHeadingElement: HTMLHeadingElement | null;
let parsedOutputElement: HTMLOutputElement | null;
let decodedHeadingElement: HTMLHeadingElement | null;
let decodedOutputElement: HTMLOutputElement | null;
let goButtonElement: HTMLButtonElement | null;
let clearButtonElement: HTMLButtonElement | null;
let historyButtonElement: HTMLButtonElement | null;
let historyContainerElement: HTMLDivElement | null;
let historyOutputElement: HTMLUListElement | null;

function showLoading (): void {
  if (goButtonElement) {
    if (loading) {
      goButtonElement.innerHTML = '<span class="spinner"></span>';
      goButtonElement.style.pointerEvents = 'none';
    } else {
      goButtonElement.innerHTML = 'Go';
      goButtonElement.style.pointerEvents = 'all';
    }
  }
}

function twirl(element: string): void {
  const elem = document.querySelector(element);
  if (elem) {
    if (elem.classList.contains('twirled')) {
      elem.classList.remove('twirled');
    } else {
      elem.classList.add('twirled');
    }
  }
}

function highlightSyntax (input: string): string {
  let output = '';
  output = input
    .replace(/("[a-z0-9\s\?-_\(\)]+"):/gi, (a, b) => b ? `<span class="key">${b}</span>:` : a )
    .replace(/"[^"]*"|'[^']*'|(\d+)/g, (a, b) => b ? `<span class="number">${b}</span>` : a )
    .replace(/:\s(true|false|undefined|null)/g, (a, b) => b ? `: <span class="boolean">${b}</span>` : a )
    .replace(/:\s("[a-z0-9\s\?-_\(\)]+")/g, (a, b) => b ? `: <span class="string">${b}</span>` : a );
  return output;
}

function go (): void {
  loading = true;
  showLoading();

  try {
    const input = messageInputElement?.value;
    if (input && input.length > 1) {
      addToHistory(input);
      const buffer = new Buffer(stringToHex(input) as Uint8Array);
      const parsedOutput = buffer.parse();
      const decoder = new Decoder(parsedOutput);
      const decodedOutput = decoder.decode();

      if (parsedOutputElement) {
        parsedOutputElement.classList.remove('error');
        const parsedOutputText = JSON.stringify(parsedOutput, undefined, 4);
        parsedOutputElement.innerHTML = highlightSyntax(parsedOutputText);
        if (parsedOutputText === '{}') {
          parsedOutputElement.classList.add('error');
        }
      }
      if (decodedOutputElement) {
        decodedOutputElement.classList.remove('error');
        const decodedOutputText = JSON.stringify(decodedOutput, undefined, 4);
        decodedOutputElement.innerHTML = highlightSyntax(decodedOutputText);
        if (decodedOutputText === '{}') {
          decodedOutputElement.classList.add('error');
        }
      }
    }
  } catch(error) {
    console.error(error);
    parsedOutputElement?.classList.add('error');
    decodedOutputElement?.classList.add('error');
  } finally {
    loading = false;
    showLoading();
  }
}

function clear (): void {
  if (messageInputElement) {
    messageInputElement.value = '';
  }
}

function addToHistory (string: string): void {
  history.push(string);
  if (historyOutputElement) {
    let output = '';
    for (const item of history) {
      output += `<li>${item}</li>`;
    }
    historyOutputElement.innerHTML = output;
  }
}

function toggleHistory (): void {
  if (historyContainerElement?.classList.contains('show')) {
    historyContainerElement.classList.remove('show');
  } else {
    historyContainerElement?.classList.add('show');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  messageInputElement = document.querySelector('#message-input');
  parsedOutputElement = document.querySelector('#parsed-output');
  decodedOutputElement = document.querySelector('#decoded-output');
  goButtonElement = document.querySelector('#go-button');
  goButtonElement?.addEventListener("click", () => go());
  clearButtonElement = document.querySelector('#clear-button');
  clearButtonElement?.addEventListener("click", () => clear());
  historyContainerElement = document.querySelector('#history-container');
  historyOutputElement = document.querySelector('#history-container ul');
  historyButtonElement = document.querySelector('#history-button');
  historyButtonElement?.addEventListener("click", () => toggleHistory());
  parsedHeadingElement = document.querySelector('#parsed-heading');
  parsedHeadingElement?.addEventListener("click", () => twirl('#parsed-heading'));
  decodedHeadingElement = document.querySelector('#decoded-heading');
  decodedHeadingElement?.addEventListener("click", () => twirl('#decoded-heading'));
});
