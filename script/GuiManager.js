import { Color } from 'three';

export default class GuiManager {
  constructor() {
    this.guiMap = {};
  }

  initGuiByName(name, gui, params) {
    this.name = name;
    this.gui = gui;
    this.params = params;

    const { guiMap } = this;
    guiMap[name] = gui;

    this.createGui(gui, params);
  }

  destroy() {
    this.gui.destroy();

    const { name, params } = this;
    this.initGuiByName(name, new dat.GUI(), params);

    // 恢复设置的属性
    params.forEach((param) => {
      const { settings } = param;
      settings.forEach((setting) => {
        const { entity, type, parameters } = setting;
        Object.entries(parameters).forEach(([key, { value }]) => {
          if (key === 'restore') return;
          if (type === 'material') {
            entity[key] = key === 'color' ? new Color(value) : value;
            entity.needsUpdate = true;
          }
        });
      });
    });
  }

  createGui(gui, params) {
    params.forEach((param) => {
      const { folderName, isOpen = true, settings } = param;
      const folder = gui.addFolder(folderName);
      isOpen && folder.open();

      this.handleSettings(settings, folder);
    });
  }

  handleSettings(settings, folder) {
    settings.forEach((setting) => {
      const { entity, parameters, type } = setting;

      this.setParameters(folder, parameters, entity, type);
    });
  }

  setParameters(folder, parameters, entity, type) {
    const isMtl = type === 'material';
    Object.keys(parameters).forEach((key) => {
      const { value, range } = parameters[key];
      const _params = { [key]: value };
      if (key === 'color') {
        folder.addColor(_params, key).onChange((value) => {
          entity[key] = new Color(value);
        });
      } else if (['opacity'].includes(key)) {
        folder.add(_params, key, range[0], range[1]).onChange((value) => {
          entity[key] = value;
        });
      } else {
        folder.add(_params, key).onChange((value) => {
          if (key === 'restore') return;
          entity[key] = value;
          isMtl && (entity.needsUpdate = true);
        });
      }
    });
  }
}
