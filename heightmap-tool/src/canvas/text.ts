export class TextRenderer {
	private canvas = document.createElement('canvas');
	private context = this.canvas.getContext('2d')!;
	private dirty = false;
	private fontSize = 16;
	private lineHeight = this.fontSize + 8;
	private text = '';

	constructor() {
		this.canvas.width = 400;
		this.canvas.height = 400;
		this.context.font = `${this.fontSize}px sans-serif`;
		this.context.fillStyle = 'white';
		this.context.textBaseline = 'top';
	}

	public render(): HTMLCanvasElement {
		if (this.dirty) {
			const lines = this.text.split('\n');
			const width = Math.max(...lines.map(line => this.context.measureText(line).width));
			const height = lines.length * this.lineHeight;
			this.canvas.width = width;
			this.canvas.height = height;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			for (let i = 0; i < lines.length; i++) {
				this.context.font = `${this.fontSize}px sans-serif`;
				this.context.fillStyle = 'white';
				this.context.textBaseline = 'top';
				this.context.fillText(lines[i], 0, i * this.lineHeight);
			}
		}
		return this.canvas;
	}

	public update(text: string): HTMLCanvasElement {
		this.dirty = this.text !== text;
		this.text = text;
		return this.render();
	}
}
