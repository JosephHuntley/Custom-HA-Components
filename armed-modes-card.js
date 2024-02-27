import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ArmedModesCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      activeMode: { type: String },
    };
  }

  render() {
    return html`
      <div class="custom_outer_container">
        <div class="custom_inner_container">
          <button
            class="button"
            @click=${() => this._setMode('ARMED AWAY')}
            ?disabled=${this.hass.states['input_boolean.pin_accepted'].state !== 'on'}
          >
            <ha-icon icon="mdi:shield-check" class="icon ${this.activeMode === 'ARMED AWAY' ? 'active' : ''}"></ha-icon>
            <span class="custom_text">Arm Away</span>
          </button>

          <button
            class="button"
            @click=${() => this._setMode('ARMED HOME')}
            ?disabled=${this.hass.states['input_boolean.pin_accepted'].state !== 'on'}
          >
            <ha-icon icon="mdi:shield-home" class="icon ${this.activeMode === 'ARMED HOME' ? 'active' : ''}"></ha-icon>
            <span class="custom_text">Arm Home</span>
          </button>

          <button
            class="button"
            @click=${() => this._setMode('DISARMED')}
            ?disabled=${this.hass.states['input_boolean.pin_accepted'].state !== 'on'}
          >
            <ha-icon icon="mdi:shield-off" class="icon ${this.activeMode === 'DISARMED' ? 'active' : ''}"></ha-icon>
            <span class="custom_text">Disarm</span>
          </button>
        </div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }

  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass) {
      this.activeMode = this.hass.states[this.config.entity].state;
    }
  }

  _setMode(mode) {
      if(this.hass.states['input_boolean.pin_accepted'].state === 'on'){
          this.hass.callService("script", "set_armed_mode", {
                mode: mode,
            });
          // Assuming the service call will update the entity state, you can set activeMode here
          this.activeMode = mode;
        
          // Trigger a re-render
          this.requestUpdate();
}}

static get styles() {
    return css`
        .custom_outer_container {
            width: 100%;
            display: block;
            margin: var(--masonry-view-card-margin,4px 4px 8px);
        }

        .custom_inner_container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 92px;
            height: 100%;
            background: var(--ha-card-background,var(--card-background-color,#fff));
            box-shadow: var(--ha-card-box-shadow,none);
            box-sizing: border-box;
            border-radius: var(--ha-card-border-radius,12px);
            border-width: var(--ha-card-border-width,1px);
            border-style: solid;
            border-color: var(--ha-card-border-color,var(--divider-color,#e0e0e0));
            color: var(--primary-text-color);
            display: block;
            transition: all 0.3s ease-out 0s;
            position: relative;

            padding: 8px ;
            margin: 0 4px 0 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .button:hover {
            background-color: var(--fc-button-hover-bg-color);
        }

        .icon {
            width: 40%;
            height: auto;
            max-height: 80%;
            color:  var(--state-icon-color);
            --mdc-icon-size: 100%;
            transition: transform 180ms ease-in-out 0s;

        }

        .icon.active {
            color: #00ddff;
        }

        .custom_text{
            margin: 0;
            padding-top: 8px;
            font-size: 16.8px;
            font-weight: 400;
        }
        
        .button:disabled{
            cursor: not-allowed; /* Change cursor style when disabled */
            opacity: 0.5; /* Change opacity when disabled */
        }
        .button:disabled:hover{
            background-color:none;
        }
    `;
  }
}

customElements.define("armed-modes-card", ArmedModesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "armed-modes-card",
  name: "Armed Modes",
  preview: false,
  description: "Custom card to control armed modes with icons.",
});
