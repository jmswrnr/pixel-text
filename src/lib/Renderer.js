import split from 'lodash.split';

class Renderer {
  options = {
    color: 'white',
    colorSymbols: {
      '🔵': 'blue',
      '⚪': 'white',
      '🔴': 'red',
      '🟠': 'orange',
      '🟣': 'purple',
      '🟤': 'brown',
      '🟡': 'yellow',
      '🟢': 'green',
      '⚫': 'black'
    }
  };

  constructor(options) {
    this.options = Object.assign(this.options, options);
    
    if(!this.options.canvas) {
      return new Error('PixelText.Renderer: requires canvas option');
    }
    
    if(!this.options.font) {
      return new Error('PixelText.Renderer: requires font option');
    }

    this.ctx = this.options.canvas.getContext('2d');

    const bufferCanvasEl = document.createElement('canvas');
    bufferCanvasEl.style.position = 'absolute';
    bufferCanvasEl.style.display = 'none';
    document.body.appendChild(bufferCanvasEl);
    this.bufferCanvas = ('OffscreenCanvas' in window) ?
      bufferCanvasEl.transferControlToOffscreen() : 
      bufferCanvasEl;
    this.buffer = this.bufferCanvas.getContext('2d');
    this.checkBufferSize();
  }

  checkBufferSize = () => {
    if(this.bufferCanvas.width !== this.options.canvas.width) {
      this.bufferCanvas.width = this.options.canvas.width;
    }
    if(this.bufferCanvas.height !== this.options.canvas.height) {
      this.bufferCanvas.height = this.options.canvas.height;
    }
  }

  draw(x, y, text, drawOptions) {
    this.checkBufferSize();

    drawOptions = drawOptions || {};
    drawOptions.scale = drawOptions.scale || 1;
    this.color = drawOptions.color || this.options.color;

    const chars = split(text, '');  

    for(let c = 0, clen = chars.length; c < clen; c++) {
      let char = this.options.font.characters[chars[c]];
      if(char) {
        this.drawChar(x, y, char, drawOptions.scale);
        x += char.width * drawOptions.scale;
      } else if(chars[c] in this.options.colorSymbols) {
        this.color = this.options.colorSymbols[chars[c]]
      }
    }
  }

  drawChar(x, y, char, scale) {
		if(
      true
      // x + char.offset[0] + char.rect[2] > 0 && 
      // x < this.ctx.canvas.width &&
      // y + char.offset[1] + char.rect[23] > 0 && 
      // y < this.ctx.canvas.height
    ) {
      const offsetX = x + char.offset[0] * scale;
      const offsetY = y + char.offset[1] * scale;
      const charWidth = char.rect[2] * scale;
      const charHeight = char.rect[3] * scale;
      this.buffer.imageSmoothingEnabled = false;
			this.buffer.drawImage(
				this.options.font.image,
				char.rect[0],
				char.rect[1],
				char.rect[2],
				char.rect[3],
				offsetX,
				offsetY,
				charWidth,
				charHeight
			);
			this.buffer.fillStyle = this.color;
			this.buffer.globalCompositeOperation = 'source-in';
			this.buffer.fillRect(
				offsetX,
				offsetY,
				charWidth,
				charHeight
			);
			this.buffer.globalCompositeOperation = 'source-over';
			this.ctx.drawImage(
				this.buffer.canvas,
				offsetX,
				offsetY,
				charWidth,
				charHeight,
				offsetX,
				offsetY,
				charWidth,
        charHeight
			);
		}
  }
}

export default Renderer;