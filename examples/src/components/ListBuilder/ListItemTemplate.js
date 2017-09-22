const template = `
  <style>
    .row {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    a {
      cursor: pointer;
      padding: 2px;
      background-color: white;
      color: gray;
    }
  </style>
  <div class="row">
    <div>{{item}}</div>
    <a class="delete">X</a>
  </div>
`;

export default template;
