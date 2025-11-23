import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
import { readFile, readTextFile, writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { Scene } from '@/canvas';
import { Rectangle, Vector3 } from '@/canvas/vector';
import { Tile } from '@/canvas/tile';

export const scene = new Scene();

async function getImageUrl(file: string): Promise<string> {
	const data = await readFile(file);
	const blob = new Blob([data], { type: 'image/png' });
	return URL.createObjectURL(blob);
}

export async function addTile(file?: string): Promise<Tile | undefined> {
	file ||= await openDialog({ directory: false, multiple: false}) ?? undefined;
	if (!file) return;
	const url = await getImageUrl(file);
	return scene.tiles.add(file, url);
}

export async function render(): Promise<void> {
	const blob = await scene.export();
	const buffer = await blob.arrayBuffer();
	const data = new Uint8Array(buffer);
	const path = await saveDialog({
		filters: [{ name: 'PNG Image', extensions: ['png'] }]
	});
	if (!path) return;
	await writeFile(path, data);
}

export async function load(json?: string): Promise<void> {
	const string = json || (localStorage.getItem('data') ?? '');
	const data = JSON.parse(string);
	console.log('Load:', data);
	if (!Array.isArray(data.tiles)) return;
	const operations = new Array<Promise<void>>();
	for (const tile of data.tiles) {
		operations.push((async () => {
			const position = new Vector3(tile.position.x, tile.position.y, tile.position.z);
			const crop = new Rectangle(tile.crop.position.x, tile.crop.position.y, tile.crop.size.x, tile.crop.size.y);
			const newTile = await addTile(tile.file);
			if (newTile) {
				newTile.rectangle.position = position;
				newTile.subRectangle = crop;
			}
		})());
	}
	await Promise.all(operations);
}

export async function open(): Promise<void> {
	const file = await openDialog({ directory: false, multiple: false });
	if (!file) return;
	const json = await readTextFile(file);
	await load(json);
}

export async function save(): Promise<void> {
	const data = scene.store();
	const json = JSON.stringify(data);
	const path = await saveDialog({
		filters: [{ name: 'JSON File', extensions: ['json'] }]
	});
	if (!path) return;
	console.log('Save:', data);
	localStorage.setItem('data', json);
	await writeTextFile(path, json);
}

void load();
