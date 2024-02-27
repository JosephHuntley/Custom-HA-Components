import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class pinpadComponent extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      pin: { type: String },
    };
  }
  
  constructor() {
    super();
    this.pin = ''; // Initialize pin property
  }

  appendNumber(number) {
    this.pin += number;
    this.requestUpdate();
  }
 
  clearDisplay() {
    this.pin = '';
    this.requestUpdate();
  }

  submitPin() {
    // Update tmp_pin with the submitted PIN
    this.hass.callService('input_text', 'set_value', {
     entity_id: 'input_text.tmp_pin',
     value: this.pin,
    });
    this.clearDisplay()
     }
  
setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entit");
    }
    this.config = config;
  }

  render() {
    return html`
      <style>
      :root{
          --active-blue:#00ddff;
      }
        .outer {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction:column;
          margin: 0;
          background-color: #111111;
        }

        .keypad {
          text-align: center;
        }

        #display {
          width: 250px;
          font-size: 18px;
          padding: 8px;
          box-shadow: var(--ha-card-box-shadow, none);
          box-sizing: border-box;
          border-radius: var(--ha-card-border-radius, 12px);
          border-width: var(--ha-card-border-width, 1px);
          border-style: solid;
          border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
          margin: 10px 0;
        }

        .keys {
          display: inline-grid;
          grid-template-columns: repeat(3, 75px);
          justify-content: space-between;
          grid-gap: 10px;
          margin-top:10px;
        }

        .key {
          padding: 0;
          width: 75px;
          height: 75px;
          font-size: 18px;
          background-color: grey;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          background: var(--ha-card-background, var(--card-background-color, #fff));
          box-shadow: var(--ha-card-box-shadow, none);
          box-sizing: border-box;
          border-radius: var(--ha-card-border-radius, 12px);
          border-width: var(--ha-card-border-width, 1px);
          border-style: solid;
          border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
        }

        #submit {
          background-color:var(--active-blue);
        }

        .key:hover {
          background-color: var(--fc-button-hover-bg-color);
        }
        
        #clear{
            background-color:var(--state-icon-color);
        }
        
        .pin_message{
            margin-top: 10px;
            color: green;
            font-size: 22px;
            font-weight: bold;
        }
        
      </style>
      <div class="outer">
      ${this.hass.states['input_boolean.pin_accepted'].state === 'on'
      ? html`<div class="pin_message">PIN Accepted!</div>`
      : ''}
      <div class="keypad">
        <input type="password" id="display" .value=${this.pin} readonly>
        <div class="keys">
          <button class="key" @click=${() => this.appendNumber(1)} >1</button>
          <button class="key" @click=${() => this.appendNumber(2)} >2</button>
          <button class="key" @click=${() => this.appendNumber(3)} >3</button>
          <button class="key" @click=${() => this.appendNumber(4)} >4</button>
          <button class="key" @click=${() => this.appendNumber(5)} >5</button>
          <button class="key" @click=${() => this.appendNumber(6)} >6</button>
          <button class="key" @click=${() => this.appendNumber(7)} >7</button>
          <button class="key" @click=${() => this.appendNumber(8)} >8</button>
          <button class="key" @click=${() => this.appendNumber(9)} >9</button>
          <button class="key" id="clear" @click=${() => this.clearDisplay()}>C</button>
          <button class="key" @click=${() => this.appendNumber(0)}>0</button>
          <button class="key" id="submit" @click=${() => this.submitPin()}>Submit</button>
        </div>
      </div>
      </div>
    `;
  }
}

customElements.define('pin-pad', pinpadComponent);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "pin-pad",
  name: "Pinpad",
  preview: false,
  description: "Custom card to control to use pinpad.",
});
