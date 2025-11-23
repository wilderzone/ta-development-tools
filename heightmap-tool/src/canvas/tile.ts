import type { Scene } from './scene';
import { TextRenderer } from './text';
import { Rectangle, Vector2 } from './vector';

export class Tile {
	public name: string;
	public file: string;
	public source: string;
	public image = new Image();
	public rectangle = new Rectangle();
	public subRectangle = new Rectangle();
	public text = new TextRenderer();
	public cropping = false;
	public loading = true;
	public selected = false;

	constructor(file: string, source: string) {
		this.file = file;
		this.source = source;
		this.image.addEventListener('load', () => {
			this.rectangle.size.x ||= this.image.width;
			this.rectangle.size.y ||= this.image.height;
			this.subRectangle.size.x ||= this.image.width;
			this.subRectangle.size.y ||= this.image.height;
			this.loading = false;
		});
		this.image.src = source;

		this.name = file
			.replace(/\\{1}/ig, '/')
			.split('/')
			.at(-1) ?? '';
	}

	public contains(point: Vector2): boolean {
		return (
			this.rectangle.position.x <= point.x
			&& this.rectangle.position.y <= point.y
			&& point.x <= this.rectangle.position.x + this.subRectangle.size.x
			&& point.y <= this.rectangle.position.y + this.subRectangle.size.y
		);
	}

	public crop(side: 'top' | 'right' | 'bottom' | 'left', reduction: number): void {
		if (!this.cropping) return;
		switch (side) {
			case 'top':
				this.rectangle.position.y += reduction;
				this.rectangle.size.y += reduction;
				this.subRectangle.position.y += reduction;
				this.subRectangle.size.y -= reduction;
				break;
			case 'right':
				this.subRectangle.size.x += reduction;
				break;
			case 'bottom':
				this.subRectangle.size.y += reduction;
				break;
			case 'left':
				this.rectangle.position.x += reduction;
				this.rectangle.size.x += reduction;
				this.subRectangle.position.x += reduction;
				this.subRectangle.size.x -= reduction;
				break;
		}
	}

	public nudge(x = 0, y = 0): void {
		const nudge = new Vector2(x, y);
		this.rectangle.position.add(nudge);
	}

	public render(scene: Scene, context: CanvasRenderingContext2D, debug = false): void {
		if (this.loading) return;

		// Image.
		const position = scene.transform(this.rectangle.position);
		context.drawImage(
			this.image,
			this.subRectangle.position.x,
			this.subRectangle.position.y,
			this.subRectangle.size.x,
			this.subRectangle.size.y,
			position.x,
			position.y,
			this.subRectangle.size.x,
			this.subRectangle.size.y
		);

		// Text.
		if (debug) {
			const lines = [
				this.name,
				` X: ${this.rectangle.position.x}, Y: ${this.rectangle.position.y}, Z: ${this.rectangle.position.z}`,
				`W: ${this.subRectangle.size.x}, H: ${this.subRectangle.size.y}`
			];
			const text = this.text.update(lines.join('\n'));
			context.drawImage(text, position.x + 10, position.y + 10);
		}

		// Highlights.
		if (this.selected) {
			context.fillStyle = '#04f4';
			if (this.cropping) {
				context.fillStyle = '#f4f4';
			}
			context.fillRect(position.x, position.y, this.subRectangle.size.x, this.subRectangle.size.y);
		}
	}
}
