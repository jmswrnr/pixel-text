import './css/App.css';
import PixelText from './../lib';

class DemoApp {
  constructor() {
    const canvas = document.getElementById('demo-canvas');
    PixelText.loadFont(
      '/helvetipixel_medium_16.png',
      '/helvetipixel_medium_16.xml'
    ) .then(font => {
      const textRenderer = new PixelText.Renderer({
        font,
        canvas,
        color: '#f8f8f2',
        colorSymbols: {
          '🔵': '#8be9fd',
          '⚪': '#f8f8f2',
          '🔴': '#ff5555',
          '🟠': '#ffb86c',
          '🟣': '#bd93f9',
          '🟡': '#f1fa8c',
          '🟢': '#50fa7b',
          '⚫': '#282a36'
        }
      });

      textRenderer.draw(0, 0, 'Hello World! 🔵(canvas pixel-text)');
      
      textRenderer.ctx.fillStyle = '#f8f8f2';
      textRenderer.ctx.font = '16px helvetipixel';
      textRenderer.ctx.fillText('Hello World!', 0, 26);
      textRenderer.ctx.fillStyle = '#ff5555';
      textRenderer.ctx.fillText('(canvas fillText)', 70, 26);
    });
  }
}

export default DemoApp;
