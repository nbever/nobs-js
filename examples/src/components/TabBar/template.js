const template = `
  <style>
    .tab-bar-container {
      display: flex;
      background-color: #cccccc;
      padding-top: 4px;
    }

    ::slotted(a) {
      padding: 8px;
      cursor: pointer;
    }

    ::slotted(a.selected) {
      color: green;
    }
  </style>
  <div class="tab-bar-container">
    <slot />
  </div>
`;

export default template;
