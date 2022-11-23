<script lang="ts">
import { defineComponent } from 'vue';
import { hexToString, stringToHex, textToHex } from 'ta-network-api';

interface Tab {
  name: string;
  description: string;
}

export default defineComponent({
  name: 'App',
  data () {
    return {
      tabs: [
        {
          name: 'Bytes to Hex',
          description: '[201, 40, 3] → c92803'
        },
        {
          name: 'Hex to Bytes',
          description: 'a42b78 → [164, 43, 120]'
        },
        {
          name: 'Text to Bytes',
          description: 'Cat → [67, 97, 116]'
        },
        {
          name: 'Text to Hex',
          description: 'Bird → 42697264'
        },
        {
          name: 'Number to Hex',
          description: '174683 → 02aa5b'
        },
        {
          name: 'Hex to Number',
          description: '71ea → 29162'
        }
      ] as Tab[],
      currentTab: 0,
      input_hexToString: '',
      output_hexToString: '',
      input_stringToHex: '',
      output_stringToHex: '',
      input_textToBytes: '',
      output_textToBytes: '',
      input_textToHex: '',
      output_textToHex: '',
      input_numberToHex: '',
      output_numberToHex: '',
      input_hexToNumber: '',
      output_hexToNumber: ''
    };
  },
  watch: {
    input_hexToString (newValue: string): void {
      const break1 = newValue.split('[');
      const break2 = break1[break1.length - 1].split(']')[0];
      this.output_hexToString = hexToString(Uint8Array.from(break2.split(',').map((val) => parseInt(val))));
    },
    input_stringToHex (newValue: string): void {
      const hex = stringToHex(newValue);
      this.output_stringToHex = hex ? JSON.stringify([...hex]) : '';
    },
    input_textToBytes (newValue: string): void {
      const bytes = textToHex(newValue);
      this.output_textToBytes = bytes ? JSON.stringify([...bytes]).split(',').join(', ') : '';
    },
    input_textToHex (newValue: string): void {
      const bytes = textToHex(newValue);
      const hex = hexToString(bytes);
      this.output_textToHex = hex;
    },
    input_numberToHex (newValue: string): void {
      const number = parseInt(newValue);
      const hex = number.toString(16);
      this.output_numberToHex = hex.length % 2 !== 0 ? `0${hex}` : hex;
    },
    input_hexToNumber (newValue: string): void {
      const number = parseInt(newValue, 16);
      this.output_hexToNumber = isNaN(number) ? '' : number.toString();
    }
  }
});
</script>

<template>
  <div class="container">
    <ul class="tabs">
      <li
        v-for="tab, index in tabs"
        :key="tab.name"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        <div>
          <p>{{ tab.name }}</p>
          <p>{{ tab.description }}</p>
        </div>
      </li>
    </ul>

    <div
      v-show="currentTab === 0"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Bytes..."
        v-model="input_hexToString"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_hexToString ? output_hexToString : '&nbsp;' }}
      </output>
    </div>

    <div
      v-show="currentTab === 1"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Hex..."
        v-model="input_stringToHex"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_stringToHex ? output_stringToHex : '&nbsp;' }}
      </output>
    </div>

    <div
      v-show="currentTab === 2"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Text..."
        v-model="input_textToBytes"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_textToBytes ? output_textToBytes : '&nbsp;' }}
      </output>
    </div>

    <div
      v-show="currentTab === 3"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Text..."
        v-model="input_textToHex"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_textToHex ? output_textToHex : '&nbsp;' }}
      </output>
    </div>

    <div
      v-show="currentTab === 4"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Number..."
        v-model="input_numberToHex"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_numberToHex ? output_numberToHex : '&nbsp;' }}
      </output>
    </div>

    <div
      v-show="currentTab === 5"
      class="display"
    >
      <p>Input</p>
      <textarea
        type="text"
        placeholder="Hex..."
        v-model="input_hexToNumber"
      ></textarea>
      <p>Output</p>
      <output>
        {{ output_hexToNumber ? output_hexToNumber : '&nbsp;' }}
      </output>
    </div>

  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  gap: 20px;
  min-height: 100vh;
  padding: 20px;
}

.tabs {
  position: relative;
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  flex-flow: column nowrap;
  gap: 5px;
  list-style: none;
  margin: 0px;
  padding: 0px;
  padding-top: 2rem;
}
.tabs li {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 5px 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid #8888;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}
.tabs li > div {
  display: flex;
  flex-flow: column nowrap;
}
.tabs li > div p {
  margin: 0px;
}
.tabs li > div p:nth-child(2) {
  font-size: 0.8em;
  opacity: 0.8;
}
.tabs li::after {
  content: '';
  display: block;
  width: 0.5ch;
  height: 80%;
  margin-top: 1px;
  margin-left: auto;
  background-color: #8888;
  border-radius: 0.5ch;
  transition: 0.2s ease background-color;
}
.tabs li.active::after {
  background-color: aqua;
}

.display {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  flex-flow: column nowrap;
  gap: 5px;
}
.display p {
  margin: 0px;
}
</style>
