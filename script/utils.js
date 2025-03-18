import { Texture } from 'three';

export function getImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Could not load image at ${url}`));
    };
    image.src = url;
  });
}

export function loadTexture(image, options) {
  var img;
  if (typeof image === 'string') {
    img = new Image();
    img.src = image;
  } else {
    img = image;
  }
  let texture = new Texture(img);
  for (let p in options) {
    texture[p] = options[p];
  }
  img.onload = function () {
    texture.needsUpdate = true;
  };
  return texture;
}
