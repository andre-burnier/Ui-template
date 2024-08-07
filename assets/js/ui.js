'use strict';

class UI_window {
  //default params
  class = 'ui_window';
  sections = [];
  css = {};

  constructor(config) {
    Object.assign(this, config);

    document.addEventListener('DOMContentLoaded', (e) => {
      this.creating_html();
    });
  }

  creating_html() {
    this.window = document.createElement('div');
    this.setting_attrs();
    document.body.append(this.window);
    this.drawing_content();
  }

  setting_attrs() {
    this.window.className = this.class;
    this.window.setAttribute('style', UI_window.css_to_string(this.css));
  }

  drawing_content() {
    for (let section of this.sections) {
      section.component = document.createElement('div');

      let s = section.component;
      s.className = 'ui_section ui segments';
      this.window.appendChild(s);

      if (section.logo) {
        let container = document.createElement('div');
        container.className = "logo";
      
        const iconSvg = document.createElement('img');
        iconSvg.setAttribute('src', section.logo);
        container.appendChild(iconSvg);
        s.appendChild(container);
      }

      if (section.title) {
        s.id = section.title;

        let title = document.createElement('h1');
        title.innerText = section.title;
        s.appendChild(title);
      }

      if (section.collapsed) s.classList.add('hidden');

      if (!section.no_ui_buttons) {
        section.ui_buttons = this.create_ui_buttons(section.collapsed);
        s.appendChild(section.ui_buttons);
      }

      let form = document.createElement('form');
      form.className = 'ui form';
      form.action = '#';
      form.addEventListener('submit', (e) => e.preventDefault());
      form.addEventListener('change', (e) => this.updateDataFrom(e.target));
      s.appendChild(form)

      let items = section.items || [];

      for (let item of items) {
        let component = this.create_component(item);
        form.appendChild(component);

        if (item.type === 'dropdown') {
          $(component).dropdown({
            values: item.options,
            onChange: (value) => {
              let input = document.getElementById('dropdown_' + item.name);
              input.value = value;
              this.updateDataFrom(input);
              if (item.callback) item.callback(value);
            }
          });

          let input = document.getElementById('dropdown_' + item.name);
          input.addEventListener("change", function() {
            $(component).dropdown('set selected', input.value);
          });

          let wrapper = document.createElement("div");
          wrapper.id = 'dropdown-wrapper_' + item.name;
          wrapper.className = 'ui dropdown-wrapper';
          $(component).before(wrapper);
          wrapper.append(component);

          let label = document.createElement("label");
          label.innerText = component.getAttribute("data-label");
          label.id = 'dropdown-label_' + item.name;
          label.className = 'ui dropdown-label';
          $(component).before(label);
        }

        if (item.type === 'slider') {
          let tooltip = document.createElement('div');
          tooltip.className = "ui tooltip";
          tooltip.innerText = item.value;

          $(component).slider({
            min: item.min,
            max: item.max,
            start: item.value,
            onChange: (value) => {
              let input = document.getElementById('input_' + item.name);
              input.value = value;
              tooltip.innerText = value;
              this.updateDataFrom(input);
              if (item.callback) item.callback(item.params);
            }
          });

          let input = document.getElementById('input_' + item.name);
          input.addEventListener("change", () => {
            $(component).slider('set value', input.value);
          });

          $(component).find(".thumb").after(tooltip);
          // $(tooltip).hide();
          // $(component).find(".thumb").hover(() => $(tooltip).toggle());
        }

        if (item.type === 'range_slider') {
          let tooltip = document.createElement('div');
          tooltip.className = "ui tooltip";
          tooltip.innerText = item.start+', '+item.end;

          $(component).slider({
            min: item.min,
            max: item.max,
            start: item.start,
            end: item.end,
            onChange: (end, start) => {
              let input = document.getElementById('input_' + item.name);
              input.value = [start, start+end];
              tooltip.innerText = start+', '+(start+end);
              this.updateDataFrom(input);
              if (item.callback) item.callback(item.params);
            }
          });

          let input = document.getElementById('input_' + item.name);
          input.addEventListener("change", () => {
            $(component).slider('set value', input.value);
          });

          $(component).find(".thumb.second").after(tooltip);
          // $(tooltip).hide();
          // $(component).find(".thumb").hover(() => $(tooltip).toggle());
        }

        if (item.type === "gridselector") {
          component.querySelectorAll(".colored, .image").forEach(opt => opt.style.height = `${opt.offsetWidth}px`);
          component.addEventListener('resize', (e) => {
            component.querySelectorAll(".colored, .image").forEach(opt => opt.style.height = `${opt.offsetWidth}px`);
          });
        }

      }

      for(let el of form.elements) {
        this.updateDataFrom(el);
      }
    }
  }

  static css_to_string(css_obj) {
    return Object.entries(css_obj).map(([k, v]) => `${k}:${v}`).join(';');
  }

  create_component(component_obj) {
    let component, wrapper, input, label;
    switch (component_obj.type) {
      case 'checkbox':
        component = document.createElement('div');
        component.className = "ui field";

        wrapper = document.createElement('div');
        wrapper.className = "ui right aligned checkbox";

        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'input_' + component_obj.name;
        input.name = component_obj.name;

        label = document.createElement('label');
        label.setAttribute("for", input.id);
        label.innerText = component_obj.text;

        if (component_obj.value) {
          input.setAttribute('checked', true);
        }

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        component.appendChild(wrapper);

        if (component_obj.callback) {
          input.addEventListener('change', (evt) => {
            let param = input.checked;
            component_obj.callback(param);
          });
        }

        break;
      case 'dropdown':
        component = document.createElement('div');
        component.className = "ui floating mini compact selection dropdown";
        component.id = 'dropdown-selector_' + component_obj.name;
        component.dataset.label = component_obj.text;

        input = document.createElement('input');
        input.id = 'dropdown_' + component_obj.name;
        input.type = 'hidden';
        input.name = component_obj.name;

        let dd = document.createElement('div');
        dd.className = 'text';

        let dd_icon = document.createElement('i');
        dd_icon.className = 'dropdown icon';

        component.append(input);
        component.appendChild(dd);
        component.appendChild(dd_icon);

        break;


      case 'slider':
        component = document.createElement('div');
        component.className = "ui slider";
        component.id = 'slider_' + component_obj.name;

        // slider deve ter mínimo, máximo e valor, se não tiver define o padrão
        if (component_obj.min === undefined) component_obj.min = 0
        if (component_obj.max === undefined) component_obj.max = 100
        if (component_obj.value === undefined) component_obj.value = (component_obj.min + component_obj.max) / 2;

        input = document.createElement('input');
        input.type = 'hidden';
        input.name = component_obj.name;
        input.id = 'input_' + component_obj.name;
        input.value = component_obj.value;

        label = document.createElement('label');
        label.innerText = component_obj.text;

        component.append(label);
        component.append(input);

        break;

        case 'range_slider':
          component = document.createElement('div');
          component.className = "ui range slider";
          component.id = 'range_slider_' + component_obj.name;
  
          // slider deve ter mínimo, máximo e valor, se não tiver define o padrão
          if (component_obj.min === undefined) component_obj.min = 0
          if (component_obj.max === undefined) component_obj.max = 100
          if (component_obj.start === undefined) component_obj.start = Math.round((component_obj.min + component_obj.max) / 3);
          if (component_obj.end === undefined) component_obj.end = Math.round((component_obj.min + component_obj.max) * 2 / 3);
  
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = component_obj.name;
          input.id = 'input_' + component_obj.name;
          input.value = component_obj.start + ',' + component_obj.end;
  
          label = document.createElement('label');
          label.innerText = component_obj.text;
  
          component.append(label);
          component.append(input);
  
          break;


      case 'number':
        component = document.createElement('div');
        component.className = "ui input number";
        component.id = 'number_' + component_obj.name;

        label = document.createElement('label');
        label.innerText = component_obj.text;

        let floater = document.createElement("div");
        floater.className = "input_floater";

        let b_subtract = document.createElement('button');
        b_subtract.className = "ui icon button";
        let i_sub = document.createElement('i');
        i_sub.className = "minus icon";
        b_subtract.append(i_sub);

        input = document.createElement('input');
        input.type = 'number';
        input.name = component_obj.name;
        input.value = component_obj.value;
        input.id = 'input_' + component_obj.name;

        let b_add = document.createElement('button');
        b_add.className = "ui icon button"
        let i_add = document.createElement('i');
        i_add.className = "plus icon";
        b_add.append(i_add);

        if (component_obj.steps) floater.append(b_subtract);
        floater.append(input);
        if (component_obj.steps) floater.append(b_add);
        component.append(label);
        component.append(floater);

        if (component_obj.unit) {
          const unit = document.createElement('span');
          unit.innerHTML = component_obj.unit;
          unit.className = "ui input-unit";
          floater.append(unit);
        }

        // b_subtract.addEventListener('click', (e) => this.updateDataFrom(input));

        b_subtract.addEventListener('click', () => {
          input.stepDown();
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback();
        });

        b_add.addEventListener('click', () => {
          input.stepUp();
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback();
        });

        input.addEventListener('input', (e) => {
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback(input.value);
        });

        break;
      case 'text':
        component = document.createElement('div');
        component.className = "ui input text";
        component.id = 'text_' + component_obj.name;

        label = document.createElement('label');
        label.innerText = component_obj.text;

        let floater__ = document.createElement("div");
        floater__.className = "input_floater";

        let b_subtract__ = document.createElement('button');
        b_subtract__.className = "ui icon button";
        let i_sub__ = document.createElement('i');
        i_sub__.className = "minus icon";
        b_subtract__.append(i_sub__);

        input = document.createElement('input');
        input.type = 'text';
        input.name = component_obj.name;
        input.value = component_obj.value;
        input.id = 'input_' + component_obj.name;

        let b_add__ = document.createElement('button');
        b_add__.className = "ui icon button"
        let i_add__ = document.createElement('i');
        i_add__.className = "plus icon";
        b_add__.append(i_add__);

        // if (component_obj.steps) floater__.append(b_subtract);
        // floater__.append(input);
        // if (component_obj.steps) floater__.append(b_add);
        // component.append(label);
        // component.append(floater__);
        component.append(input);

        // b_subtract.addEventListener('click', (e) => this.updateDataFrom(input));

        b_subtract__.addEventListener('click', () => {
          input.stepDown();
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback();
        });

        b_add__.addEventListener('click', () => {
          input.stepUp();
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback();
        });

        // if (component_obj.callback) input.addEventListener('change', component_obj.callback);
        input.addEventListener('input', (e) => {
          this.updateDataFrom(input);
          if (component_obj.callback) component_obj.callback(input.value);
        });

        break;

        case 'text_area':
          component = document.createElement('div');
          component.className = "ui input text";
          component.id = 'text_' + component_obj.name;
  
          label = document.createElement('label');
          label.innerText = component_obj.text;
  
  
          input = document.createElement("textarea");
          input.name = component_obj.name;
          input.value = component_obj.value;
          input.id = 'input_' + component_obj.name;
  
          component.append(label);
          component.append(input);
  
          input.addEventListener('input', (e) => {
            this.updateDataFrom(input);
            if (component_obj.callback) component_obj.callback(input.value);
          });
  
          break;

      case 'button':
        component = document.createElement('button');
        component.className = "ui fluid button";
        component.id = 'btn_' + component_obj.name;
        component.innerText = component_obj.text;
        component.param = component_obj.param;

        component.addEventListener('click', (evt) => {
          let param = evt.currentTarget.param;
          component_obj.callback(param);
        });

        break;
      case 'file':
        component = document.createElement('div');
        component.id = 'file_' + component_obj.name;

        input = document.createElement('input');
        input.id = 'btn_' + component_obj.name;
        input.type = 'file';

        label = document.createElement('label');
        label.className = "ui fluid button";
        label.setAttribute('for', input.id)
        label.innerText = component_obj.text;

        component.append(input);
        component.append(label);

        component.addEventListener('input', (evt) => {
          let [file] = evt.target.files;

          p5.File._load(file, component_obj.callback);
        });

        break;
        // case 'table':
        //     component = document.createElement('table');
        //     component.className = "ui single line table";
        //     component.id = 'table_' + component_obj.name;

        //     component.createTHead();
        //     component.createTBody();

        //     let header = component.tHead.insertRow();
        //     let firs_row = component.tBodies[0].insertRow();

        //     for (let c of component_obj.items) {
        //         header.insertCell().innerText = c.text;
        //         firs_row.insertCell().appendChild(UI_window.create_component(c));
        //     }

        //     break;
      case "double_number":
        component = document.createElement('div');
        component.className = "ui input double_number";
        component.id = 'double_number_' + component_obj.name;

        label = document.createElement('label');
        label.innerText = component_obj.text;

        let floater_ = document.createElement("div");
        floater_.className = "input_floater";

        let separator = document.createElement("span");
        separator.innerText = " x ";

        let inputA = document.createElement('input');
        inputA.type = 'number';
        inputA.name = component_obj.name[0];
        inputA.value = component_obj.value[0];
        inputA.id = 'input_' + component_obj.name;

        let inputB = document.createElement('input');
        inputB.type = 'number';
        inputB.name = component_obj.name[1];
        inputB.value = component_obj.value[1];
        inputB.id = 'input_' + component_obj.name;

        floater_.append(inputA);
        floater_.append(separator);
        floater_.append(inputB);
        component.append(label);
        component.append(floater_);

        if (component_obj.unit) {
          const unit = document.createElement('span');
          unit.innerHTML = component_obj.unit;
          unit.className = "ui input-unit";
          inputA.after(unit);
          inputB.after(unit.cloneNode(true));
        }

        inputA.addEventListener('input', (event) => {
          this.updateDataFrom(inputA);
          if (component_obj.callback) component_obj.callback(inputA.value)
        });
        inputB.addEventListener('input', (event) => {
          this.updateDataFrom(inputB);
          if (component_obj.callback) component_obj.callback(inputB.value)
        });

        break;
      case "gridselector":
        component = document.createElement('div');
        component.className = "ui input gridselector";
        component.id = 'gridselector_' + component_obj.name;

        input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'input_' + component_obj.name;
        input.name = component_obj.name;
        component.append(input);

        input.addEventListener('change', (e) => {
          const values = input.value.split(',');
          const optionEls = input.parentElement.querySelectorAll('.gridselector-option');

          optionEls.forEach((opt) => {
            if (values.includes(opt.dataset.value)) {
              opt.classList.add('selected');
            } else {
              opt.classList.remove('selected');
            }
          });
        });

        if (component_obj.text) {
          const p = document.createElement('p');
          p.className = "ui gridselector-label";
          p.innerHTML = component_obj.text;
          component.append(p);
        }

        if (component_obj.columns) {
          component.style.gridTemplateColumns = `repeat(${component_obj.columns}, 1fr)`;
        }

        component_obj.options.forEach((option) => {
          const multiselector = component_obj.multiselector;
          const unselect = component_obj.unselect;
          const opt = document.createElement('div');
          opt.className = "ui gridselector-option";
          opt.id = 'gridselector-option_' + option.name;
          opt.dataset.name = option.name;
          opt.dataset.value = option.value;
          
          if (option.text) {
            const p = document.createElement('p');
            p.innerHTML = option.text;
            opt.append(p);
          }

          if (option.selected) opt.classList.add('selected');
          if (option.color) {
            opt.classList.add('colored');
            opt.style.backgroundColor = option.color;
          }
          if (option.image) {
            opt.classList.add('image');
            opt.style.backgroundImage = `url(${option.image})`;
          }

          component.append(opt);

          opt.addEventListener('click', (event) => {
            const optionEl = event.target.closest('.gridselector-option');
            const gridselector = optionEl.parentElement;
            const input = gridselector.querySelector('input');

            if (multiselector) {
              optionEl.classList.toggle('selected');
            } else {
              const selected = gridselector.querySelector('.gridselector-option.selected')

              if (selected) selected.classList.remove('selected');
              if (!selected || selected !== optionEl || unselect) optionEl.classList.add('selected');
            }

            const values = [...gridselector.querySelectorAll('.selected')].map(el => el.dataset.value);
            input.value = values;
            this.updateDataFrom(input);

            if (component_obj.callback) component_obj.callback(input.value);
            if (option.callback) option.callback(input.value);
          });

          const values = [...component.querySelectorAll('.selected')].map(el => el.dataset.value);
          input.value = values;
        });

        break;
      default:
        console.log("tipo de componente inválido");
        component = document.createElement('p');
        component.innerHTML = "componente de interface inválido";
    }
    return component;
  }

  create_ui_buttons(hidden = false) {
    let component, hide_btn

    component = document.createElement("div");
    component.className = "ui_buttons";

    hide_btn = document.createElement("button");
    hide_btn.className = "hide_btn";
    hide_btn.innerText = hidden ? "+" : "-";
    // hide_btn.innerHTML = "<i class=\"eye icon\"></i>";


    hide_btn.addEventListener("click", function() {
      let target = this.parentElement.parentElement;
      target.classList.toggle("hidden");
      if (target.classList.contains("hidden")) this.innerText = "+";
      else this.innerText = "-";
      target.querySelectorAll('*').forEach(el => {
        el.dispatchEvent(new Event('resize'));
      });
    })

    component.appendChild(hide_btn);
    return component;
  }

  updateDataFrom(input) {
    let value;
    if (input.type === 'checkbox') value = input.checked;
    else if (input.type === 'submit' || input.type === 'file') return;
    else value = input.value;
    this.data[input.name] = value;
  }

  refresh() {
    for (let prop in this.data) {
      let changed = false;
      let input = document.getElementsByName(prop)[0];
      if (input.type === 'checkbox' && input.checked != this.data[prop]) {
        input.checked = this.data[prop];
        changed = true
      } else if (input.value != this.data[prop]) {
        input.value = this.data[prop];
        changed = true;
      }

      if (changed) {
        let event = new Event('change');
        input.dispatchEvent(event);
      }
    }
  }
}
