function save_svg() {
  var date = new Date().toLocaleString();
  var cnv = createGraphics(currentImage.width, currentImage.height, SVG);
  cnv.pixelDensity(1);
  cnv.background(cor_bg)
  qTree.save(cnv)

  cnv.save("PCD-BR_" + date + ".svg");
}

function save_png() {
  var date = new Date().toLocaleString();
  var cnv = createGraphics(currentImage.width, currentImage.height);
  cnv.pixelDensity(1);
  // cnv.background(cor_bg)
  qTree.save(cnv)

  cnv.save("PCD-BR_" + date + ".png");
}

function randCell(n) {
  let nRand = floor(random(celulas.length))
  if (nRand == n) return randCell(n)
  else return nRand
}

function triggerGravacao() {
  triggerComecaGrav = true
}

function comecaGravacao() {
  triggerComecaGrav = false
  criaEncoder();
  qTree.resetCell()
  nFrames = 0;
  // totalFrames = ui_data.duracaoVideo * ui_data.fps;
  salvaVideoMP4 = true
}

function calcFrames(){
  totalFrames = fps * parseInt(ui_data.duracao)
}

function setCores(){
  if(!ui_data.inverte) {
    cor_bg = color(0)
    cor_shape = color(255)
  } else {
    cor_bg = color(255)
    cor_shape = color(0)
  }
}

function carregaImagem(file) {

  if (file.type === 'image') {
    let url = URL.createObjectURL(file.file)
    currentImage = loadImage(url, resetQuad)
  } else {
    currentImage = null;
  }
}
function criaImagem(){
  currentImage = desenhaNoise()
  resetQuad()
}

function desenhaNoise(){
  let res = ui_data.res_noise * 0.0001
  let img = createImage(parseInt(ui_data.widthNoise), parseInt(ui_data.heightNoise))
  img.loadPixels()
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      // noiseDetail of the pixels octave count and falloff value
      noiseDetail(5, 0.5)

      noiseVal = noise(x * res, y * res)
      img.set(x, y, color(noiseVal*255))
      // img.stroke(noiseVal * 255);
      // img.point(x, y);
    }
  }
  img.updatePixels()
  return img
}

function salvaFrameMP4(p) {
  var tela = createGraphics(currentImage.width, currentImage.height);
  tela.pixelDensity(1);
  tela.background(cor_bg)

  qTree.save(tela, p)

  encoder.addFrameRgba(tela.drawingContext.getImageData(0, 0, encoder.width, encoder.height).data);
  tela.remove();
  if (nFrames < totalFrames) nFrames++;
  else {
    salvaVideoMP4 = false;
    nFrames = 0;
    encoder.finalize();
    const uint8Array = encoder.FS.readFile(encoder.outputFilename);
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([uint8Array], {
      type: 'video/mp4'
    }));
    anchor.download = encoder.outputFilename;
    anchor.click();
    encoder.delete();
    criaEncoder();
  }
}

function criaEncoder() {
  HME.createH264MP4Encoder().then(enc => {
    encoder = enc
    encoder.outputFilename = 'PCD2022'
    encoder.width = currentImage.width
    encoder.height = currentImage.height
    encoder.frameRate = fps
    encoder.kbps = 40000 // video quality
    // encoder.quantizationParameter = 10
    encoder.speed = 0
    encoder.groupOfPictures = 4 // lower if you have fast actions.
    encoder.initialize()
  });
}
