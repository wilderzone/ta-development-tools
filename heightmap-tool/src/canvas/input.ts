import { Vector2 } from './vector';

export interface InputClickEvent {
	type: 'click';
	control: boolean;
	position: Vector2;
}

export interface InputKeyEvent {
	type: 'key';
	key: string;
	control: boolean;
	shift: boolean;
}

export interface InputMoveEvent {
	type: 'move';
	distance: Vector2;
	position: Vector2;
}

export interface InputScrollEvent {
	type: 'scroll';
	direction: 'in' | 'out';
}

type InputEventType = 'click' | 'key' | 'move' | 'scroll';
type InputEvent<T extends InputEventType> =
	T extends 'click' ? InputClickEvent :
	T extends 'key'   ? InputKeyEvent :
	T extends 'move'  ? InputMoveEvent :
	T extends 'scroll'  ? InputScrollEvent :
	never;

type MouseCallback<T extends InputEventType> = (event: InputEvent<T>) => void;
type MouseCallbackMap = { [T in InputEventType]: Array<MouseCallback<T>> };

export class Input {
	private element: HTMLElement;
	private callbacks: MouseCallbackMap = {
		click: [],
		key: [],
		move: [],
		scroll: []
	};
	private action = {
		active: false,
		moved: false
	};
	public position = new Vector2();

	constructor(element: HTMLElement) {
		this.element = element;
		element.addEventListener('pointerdown', event => this.pointerDown(event));
		element.addEventListener('pointercancel', event => this.pointerUp(event));
		element.addEventListener('pointerleave', event => this.pointerUp(event));
		element.addEventListener('pointerup', event => this.pointerUp(event));
		element.addEventListener('pointermove', event => this.pointerMove(event));
		document.addEventListener('keydown', event => this.keyDown(event));
		document.addEventListener('wheel', event => this.scroll(event));
	}

	private keyDown(event: KeyboardEvent): void {
		const key: InputKeyEvent = {
			type: 'key',
			key: event.key,
			control: event.ctrlKey,
			shift: event.shiftKey
		};
		for (const callback of this.callbacks.key) {
			callback(key);
		}
	}

	private pointerDown(event: PointerEvent): void {
		this.action.active = true;
	}

	private pointerUp(event: PointerEvent): void {
		if (!this.action.active) return;
		this.action.active = false;
		if (!this.action.moved) {
			const click: InputClickEvent = {
				type: 'click',
				control: event.ctrlKey,
				position: new Vector2(event.offsetX, event.offsetY)
			};
			for (const callback of this.callbacks.click) {
				callback(click);
			}
		}
		this.action.moved = false;
	}

	private pointerMove(event: PointerEvent): void {
		if (!this.action.active) return;
		this.action.moved = true;
		const move: InputMoveEvent = {
			type: 'move',
			distance: new Vector2(event.movementX, event.movementY),
			position: new Vector2(event.offsetX, event.offsetY)
		};
		for (const callback of this.callbacks.move) {
			callback(move);
		}
	}

	private scroll(event: WheelEvent): void {
		const scroll: InputScrollEvent = {
			type: 'scroll',
			direction: event.deltaY < 0 ? 'in' : 'out'
		};
		for (const callback of this.callbacks.scroll) {
			callback(scroll);
		}
	}

	public on<T extends InputEventType>(event: T, callback: MouseCallback<T>): void {
		this.callbacks[event].push(callback);
	}
}
