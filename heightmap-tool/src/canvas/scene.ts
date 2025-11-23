import { type Ref, ref } from 'vue';
import { Data } from './data';
import { Input, InputClickEvent, InputKeyEvent, InputMoveEvent } from './input';
import { Rectangle, Vector2 } from './vector';

export class Scene {
	private canvas?: HTMLCanvasElement;
	private context?: CanvasRenderingContext2D;
	private gridSize = 10;
	private input?: Input;
	private exportOffset = new Vector2();
	private view = {
		origin: new Vector2(),
		pan: new Vector2(),
		zoom: {
			value: 1,
			inverse: 1,
			ref: ref(1)
		}
	}
	public tiles = new Data();
	public debug = ref(false);

	constructor() {}

	private keyboard(event: InputKeyEvent): void {
		const nudgeDistance = event.control
			? 10
			: 1;

		switch (event.key) {
			case 'Escape':
				this.tiles.deselect('all');
				break;
			case 'Delete':
				this.tiles.remove(this.tiles.selected);
				this.tiles.deselect('all');
				break;
			case '[':
				for (const tile of this.tiles.selected) {
					tile.rectangle.position.z -= 1;
				}
				this.tiles.sort();
				break;
			case ']':
				for (const tile of this.tiles.selected) {
					tile.rectangle.position.z += 1;
				}
				this.tiles.sort();
				break;
			case '0':
				this.zoom('reset')
				break;
			case '-':
				this.zoom('out')
				break;
			case '+':
			case '=':
				this.zoom('in')
				break;
			case 'a':
				this.tiles.select('all');
				break;
			case 'r':
				for (const tile of this.tiles.selected) {
					tile.cropping = !tile.cropping;
				}
				break;
			case 'ArrowUp': {
				const side = event.shift ? 'bottom' : 'top';
				for (const tile of this.tiles.selected) {
					tile.cropping
						? tile.crop(side, -nudgeDistance)
						: tile.nudge(0, -nudgeDistance);
				}
				break;
			}
			case 'ArrowRight': {
				const side = event.shift ? 'right' : 'left';
				for (const tile of this.tiles.selected) {
					tile.cropping
						? tile.crop(side, nudgeDistance)
						: tile.nudge(nudgeDistance, 0);
				}
				break;
			}
			case 'ArrowDown': {
				const side = event.shift ? 'bottom' : 'top';
				for (const tile of this.tiles.selected) {
					tile.cropping
						? tile.crop(side, nudgeDistance)
						: tile.nudge(0, nudgeDistance);
				}
				break;
			}
			case 'ArrowLeft': {
				const side = event.shift ? 'right' : 'left';
				for (const tile of this.tiles.selected) {
					tile.cropping
						? tile.crop(side, -nudgeDistance)
						: tile.nudge(-nudgeDistance, 0);
				}
				break;
			}
		}
	}

	private screenToCanvasSpace(client: Vector2): Vector2 {
		if (!this.canvas) return new Vector2();
		return new Vector2(
			(client.x - this.view.origin.x) / this.view.zoom.value - this.view.pan.x,
			(client.y - this.view.origin.y) / this.view.zoom.value - this.view.pan.y
		);
	}

	public start(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		this.context = canvas.getContext('2d')!;
		this.input = new Input(this.canvas);
		this.input.on('scroll', event => this.zoom(event.direction));
		this.input.on('click', event => this.select(event));
		this.input.on('move', event => this.move(event));
		this.input.on('key', event => this.keyboard(event));
		requestAnimationFrame(() => this.render());
	}

	public move(event: InputMoveEvent): void {
		const point = this.screenToCanvasSpace(event.position);
		let tileMove = false;
		for (const tile of this.tiles.selected) {
			if (tile.contains(point)) {
				tileMove = true;
			}
		}
		if (tileMove) {
			for (const tile of this.tiles.selected) {
				event.distance.multiply(this.view.zoom.inverse);
				event.distance.round();
				tile.rectangle.position.add(event.distance);
			}
		} else {
			event.distance.multiply(this.view.zoom.inverse);
			this.view.pan.add(event.distance);
		}
	}

	public select(event: InputClickEvent): void {
		const point = this.screenToCanvasSpace(event.position);
		this.tiles.sort();
		const sorted = this.tiles.all.reverse();
		const tile = sorted.find(tile => tile.contains(point));
		if (tile) {
			this.tiles.select([tile]);
		} else {
			this.tiles.deselect('all');
		}
	}

	public refine(value: number): number {
		return Math.round(value) + 0.5;
	}

	public transform(vector: Vector2): Vector2 {
		const position = vector.clone();
		if (this.exportOffset.isZero()) {
			position.add(this.view.pan);
		} else {
			position.add(this.exportOffset);
		}
		position.x = this.refine(position.x);
		position.y = this.refine(position.y);
		return position;
	}

	public zoom(direction?: 'in' | 'out' | 'reset'): Ref<number> {
		if (direction && this.canvas) {
			if (direction === 'reset') {
				this.view.zoom.value = 1;
				this.view.zoom.ref.value = 1;
				this.view.zoom.inverse = 1;
			} else {
				const amount = direction === 'in'
					? 0.1
					: -0.1;
				const previousZoom = this.view.zoom.value;
				const zoom = Math.min(Math.max(0.1, this.view.zoom.value + amount), 5);
				if (zoom !== previousZoom) {
					const center = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
					const scale = zoom / previousZoom;
					this.view.origin = new Vector2(
						center.x - (center.x - this.view.origin.x) * scale,
						center.y - (center.y - this.view.origin.y) * scale
					);
					this.view.zoom.value = zoom;
					this.view.zoom.ref.value = zoom;
					this.view.zoom.inverse = 1 / zoom;
				}
			}
		}
		return this.view.zoom.ref;
	}

	public render(): void {
		if (!this.canvas || !this.context) return;

		this.context.reset();
		this.context.imageSmoothingEnabled = false;
		const screen = new Rectangle(0, 0, this.canvas.width, this.canvas.height);
		const world = new Rectangle();
		const worldPosition = this.screenToCanvasSpace(screen.position);
		worldPosition.add(this.view.pan);
		world.position.x = worldPosition.x;
		world.position.y = worldPosition.y;
		world.size = this.screenToCanvasSpace(screen.size);
		world.size.add(this.view.pan);
		this.context.clearRect(0, 0, screen.size.x, screen.size.y);
		this.context.translate(screen.center.x, screen.center.y);
		this.context.scale(this.view.zoom.value, this.view.zoom.value);
		this.context.translate(-screen.center.x, -screen.center.y);

		// Grid.
		this.context.beginPath();
		const zoom = this.view.zoom.inverse;
		const from = new Vector2(world.position.x - world.position.x % this.gridSize, world.position.y - world.position.y % this.gridSize);
		const to = new Vector2(world.position.x + world.size.x, world.position.y + world.size.y);
		const lines = new Vector2(to.x - from.x / this.gridSize * zoom, to.y - from.y / this.gridSize * zoom);
		for (let i = 0; i < lines.x; i++) {
			const x = i * this.gridSize + this.view.pan.x % this.gridSize;
			this.context.moveTo(this.refine(x + from.x), this.refine(world.position.y));
			this.context.lineTo(this.refine(x + from.x), this.refine(world.size.y));
		}
		for (let i = 0; i < lines.y; i++) {
			const y = i * this.gridSize + this.view.pan.y % this.gridSize;
			this.context.moveTo(this.refine(world.position.x), this.refine(y + from.y));
			this.context.lineTo(this.refine(world.size.x), this.refine(y + from.y));
		}
		this.context.closePath();
		this.context.strokeStyle = '#0002';
		this.context.stroke();

		// Tiles.
		for (const tile of this.tiles.all) {
			tile.render(this, this.context, this.debug.value);
		}

		requestAnimationFrame(() => this.render());
	}

	public async export(): Promise<Blob> {
		return new Promise((resolve, reject) => {
			if (!this.canvas) {
				reject();
				return;
			}

			const minX = Math.min(...this.tiles.all.map(tile => tile.rectangle.position.x));
			const maxX = Math.max(...this.tiles.all.map(tile => tile.rectangle.position.x + tile.subRectangle.size.x));
			const minY = Math.min(...this.tiles.all.map(tile => tile.rectangle.position.y));
			const maxY = Math.max(...this.tiles.all.map(tile => tile.rectangle.position.y + tile.subRectangle.size.y));
			const width = maxX - minX;
			const height = maxY - minY;
			const renderingCanvas = document.createElement('canvas');
			renderingCanvas.width = width;
			renderingCanvas.height = height;

			const context = renderingCanvas.getContext('2d');
			if (!context) {
				reject();
				return;
			}
			context.imageSmoothingEnabled = false;

			this.exportOffset = new Vector2(0 - minX, 0 - minY);
			for (const tile of this.tiles.all) {
				tile.render(this, context, this.debug.value);
			}
			this.exportOffset = new Vector2();

			renderingCanvas.toBlob(blob => {
				if (blob) resolve(blob);
				else reject();
			}, 'image/png', 1);
		});
	}

	public store(): object {
		const data = {
			tiles: this.tiles.store()
		};
		return data;
	}
}
