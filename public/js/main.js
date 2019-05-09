if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/sw.js');
}

const clicklocalImageImportButton = () => {
  document.querySelector('#localImageImport').click();
};
document
  .querySelector('#localImageImportButton')
  .addEventListener('click', clicklocalImageImportButton);

const importLocalImage = ({ target }) => {
  const file = target.files.item(0);
  target.value = '';
  document.querySelector('#localImage').src = URL.createObjectURL(file);
};
document
  .querySelector('#localImageImport')
  .addEventListener('change', importLocalImage);

const onloadLocalImage = ({ target }) => {
  const { width, height } = target;
  const { canvas, ctx } = writeCanvas(target, width, height);
  editCanvas(ctx, width, height);
  exportImage(canvas);
};
document
  .querySelector('#localImage')
  .addEventListener('load', onloadLocalImage);

const writeCanvas = (imgElement, width = 150, height = 300) => {
  const canvas = document.querySelector('#editCanvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  return { canvas, ctx };
};

const editCanvas = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const newImageData = convertTransparentColor2White(imageData);
  ctx.putImageData(newImageData, 0, 0);
};

const convertTransparentColor2White = imageData => {
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] === 0) {
      imageData.data[i] = 255;
      imageData.data[i - 3] = 255;
      imageData.data[i - 2] = 255;
      imageData.data[i - 1] = 255;
    }
  }
  return imageData;
};

const exportImage = canvas => {
  document.querySelector('#editedImage').src = canvas.toDataURL();
  document.querySelector('#downloadButton').href = canvas.toDataURL();
};
