export class Vector2 {
	public x: number;
	public y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public add(vector: Vector2): void {
		this.x += vector.x;
		this.y += vector.y;
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	public equal(vector: Vector2): boolean {
		return this.x === vector.x && this.y === vector.y;
	}

	public multiply(factor: number): void;
	public multiply(vector: Vector2): void;
	public multiply(factorOrVector: number | Vector2): void {
		if (typeof factorOrVector === 'number') {
			this.x *= factorOrVector;
			this.y *= factorOrVector;
		} else {
			this.x *= factorOrVector.x;
			this.y *= factorOrVector.y;
		}
	}

	public round(): void {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	}

	public isZero(): boolean {
		return this.x === 0 && this.y === 0;
	}
}

export class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public add(vector: Vector2 | Vector3): void {
		this.x += vector.x;
		this.y += vector.y;
		if ('z' in vector) this.z += vector.z;
	}

	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	public equal(vector: Vector3): boolean {
		return this.x === vector.x && this.y === vector.y && this.z === vector.z;
	}

	public multiply(factor: number): void;
	public multiply(vector: Vector3): void;
	public multiply(factorOrVector: number | Vector3): void {
		if (typeof factorOrVector === 'number') {
			this.x *= factorOrVector;
			this.y *= factorOrVector;
			this.z *= factorOrVector;
		} else {
			this.x *= factorOrVector.x;
			this.y *= factorOrVector.y;
			this.z *= factorOrVector.z;
		}
	}

	public round(): void {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
	}

	public isZero(): boolean {
		return this.x === 0 && this.y === 0 && this.z === 0;
	}
}

export class Rectangle {
	public position = new Vector3();
	public size = new Vector2();

	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.position.x = x;
		this.position.y = y;
		this.size.x = width;
		this.size.y = height;
	}

	public get center(): Vector2 {
		return new Vector2(this.size.x / 2 + this.position.x, this.size.y / 2 + this.position.y);
	}

	public contains(point: Vector2): boolean {
		return (
			this.position.x <= point.x
			&& this.position.y <= point.y
			&& point.x <= this.position.x + this.size.x
			&& point.y <= this.position.y + this.size.y
		);
	}
}
