import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class CustomButtonCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      entity: { type: String },
      status: { type: String },
      name: {type: String}
    };
  }

    setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    this.config = config;
  }
  
  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass) {
      this.entity = this.config.entity || '';
      
      // Use the hass object to get the state of the specified entity
      this.status = this.hass.states[this.entity] ? this.hass.states[this.entity].state : '';

      // Access the name from the configuration
      this.name = this.config.name || '';

      // If the name is not provided in the configuration, use a default value
      this.name = this.name || 'Default Name';
    }
  }

  render() {
    return html`
    <ha-card>
    <p class="title">Server Status</p>
      <div id="button-card">
      <p>${this.name}</p>
        <div class="icon" style="color: ${this.getStatusColor()}">
          <ha-icon class="icon" icon="mdi:circle"></ha-icon>
        </div>
      </div>
      </ha-card>
    `;
  }
  
  static get styles() {
    return css`
       #button-card {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center; 
            padding: 0 16px;
        }
        
        .icon {
            display: flex;
            justify-content: center;
            align-items: center; /* Add this line */
            border: 1px solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
            border-radius: 50%; /
            }
            
        .title {
            text-align: center;
        }
    `;
      
  }

  getStatusColor() {
    return this.status === '1' ? 'green' : 'red';
  }
}

customElements.define('button-card', CustomButtonCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "button-card",
  name: "Button Card",
  preview: true,
  description: "",
});
