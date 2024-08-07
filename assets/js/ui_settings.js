ui_data = Object.create(null);

const menu_opt = [{
  no_ui_buttons: true, // pra esconder o "+"/"-" das abas do menu
  logo: 'assets/images/logo.svg', // pra adicionar um logo no menu
  title: "TITULO",
  items: [
    {type: 'file', name: 'load', text: 'carrega arquivo', callback: callback},
    {type: 'button', name: 'button', text: 'botão', callback: callback},
    {type: 'slider', name: 'slider', text: 'slider', min: 0, max: 100, value: 50, callback: callback},
    {type: 'range_slider', name: 'range_slider', text: 'range slider', min: 0, max: 100, start: 50, end:75, callback: callback},
    {type: 'checkbox', name: 'checkbox', text: "checkbox", value: true, callback: callback},
    {type: 'dropdown', name: 'dropdown', text: "dropdown", options: [{name: 'Regular', value: 0, selected: true}, {name: 'Medium', value: 1}, {name: 'Semi bold', value: 2}, {name: 'Bold', value: 3}, {name: 'Black', value: 4}], callback: callback},
    {type: 'dropdown', name: 'dropdown2', text: "dropdown2", options: [{name: 'Regular', value: 0, selected: true}, {name: 'Medium', value: 1}, {name: 'Semi bold', value: 2}, {name: 'Bold', value: 3}, {name: 'Black', value: 4}], callback: callback},
  ]
},{
    title: "TITULO 2",
    items: [
      {type: 'text', name: 'text', text: 'text', value: "TYPE", callback: callback},
      { type: 'text_area', name: 'text_area', text: 'TEXT AREA', value: "", callback: callback },
      {type: 'number', name: 'number', text: 'number', value: 20, callback: callback, unit: "px"},
      {type: 'double_number', unit: "mm", name: ['double_number_0', 'double_number_1'], text: 'double number', value: [800, 800], callback: callback},
    ]
  },{
    title: "NOVOS",
    collapsed: true,
    items: [
      {type: 'gridselector', name: 'multiselector', callback: callback, multiselector: true, columns: 2, options: [
        { name: 'seletor-1', text: 'seletor 1', value: 1 },
        { name: 'seletor-2', text: 'seletor 2', value: 2, selected: true },
        { name: 'seletor-3', text: 'seletor 3', value: 3 },
        { name: 'seletor-4', text: 'seletor 4', value: 4 },
      ]},
      {type: 'gridselector', name: 'cores', text: 'cores', columns: 7, options: [
        { name: 'a', color: '#1ec9a1', value: 1 },
        { name: 'b', color: '#be1ec9', value: 2, selected: true },
        { name: 'c', color: '#c91e54', value: 3 },
        { name: 'd', color: '#9cc91e', value: 4 },
        { name: 'e', color: '#c0195f', value: 5 },
        { name: 'f', color: '#cc7913', value: 6 },
        { name: 'g', color: '#ae6921', value: 7 },
      ]},
      {type: 'gridselector', name: 'icones', text: 'icone svg', columns: 5, unselect: true, options: [
        { name: 'a', image: 'assets/images/a.jpg', value: 1, callback: callback },
        { name: 'b', image: 'assets/images/b.jpg', value: 2, callback: callback, selected: true },
        { name: 'c', image: 'assets/images/a.jpg', value: 3, callback: callback },
        { name: 'd', image: 'assets/images/b.jpg', value: 4 },
      ]},
      {type: 'gridselector', name: 'corBg', text: "cor de fundo", columns: 6, options: [
        { name: 'Branco', color: "#FFFFFF", value: '#FFFFFF' },
        { name: 'Lilás', color: "#C6B1FF", value: '#C6B1FF' },
        { name: 'Beringela', color: "#440041", value: "#440041", selected: true },
        { name: 'Verde', color: "#00B65D", value: '#00B65D' },
        { name: 'Laranja', color: "#FF4D00", value: '#FF4D00' },
        { name: 'Mostarda', color: "#DE8617", value: '#DE8617' },
        { name: 'Amarelo', color: "#F5C300", value: '#F5C300' },
        { name: 'Ocre', color: "#C4936B", value: '#C4936B' },
      ]},
    ]
  }
]

const ui_right = new UI_window({
name: 'menu',
// css: {
//   left: 'unset',
//   right: '0',
// },
sections: menu_opt,
data: ui_data
});