import { Tile } from './tile';

export class Data {
	private tiles = new Array<Tile>();

	constructor() {}

	public get all(): Array<Tile> {
		return [...this.tiles];
	}

	public get selected(): Array<Tile> {
		return this.all.filter(tile => tile.selected);
	}

	public add(tile: Tile): Tile;
	public add(file: string, source: string): Tile;
	public add(fileOrTile: string | Tile, source?: string): Tile {
		if (fileOrTile instanceof Tile) {
			this.tiles.push(fileOrTile);
			this.sort();
			return fileOrTile;
		}

		const tile = new Tile(fileOrTile, source!);
		const maxZ = this.tiles.length
			? Math.max(...this.tiles.map(tile => tile.rectangle.position.z))
			: 0;
		tile.rectangle.position.z = maxZ + 1;
		this.tiles.push(tile);
		this.sort();
		return tile;
	}

	public remove(tiles: Array<Tile>): void {
		for (const tile of tiles) {
			const index = this.tiles.findIndex(t => t === tile);
			this.tiles.splice(index, 1);
		}
	}

	public select(tiles: 'all' | Array<Tile>): void {
		if (tiles === 'all') {
			tiles = this.all;
		}
		tiles.forEach(tile => tile.selected = true);
	}

	public deselect(tiles: 'all' | Array<Tile>): void {
		if (tiles === 'all') {
			tiles = this.all;
		}
		tiles.forEach(tile => {
			tile.cropping = false;
			tile.selected = false;
		});
	}

	public sort(): void {
		this.tiles.sort((a, b) => a.rectangle.position.z - b.rectangle.position.z);
	}

	public store(): object {
		const data = this.all.map(tile => ({
			crop: tile.subRectangle,
			file: tile.file,
			position: tile.rectangle.position
		}));
		return data;
	}
}
