<script lang="ts" setup>
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';
import Icon from '@/components/Icon.vue';

const dialog = ref<HTMLDialogElement>();
const model = defineModel<boolean>({ required: true });

watch(
	model,
	value => {
		if (value) dialog.value?.showModal();
		else dialog.value?.close();
	}
);
</script>

<template>
	<dialog
		ref="dialog"
		class="help"
		@close="model = false"
	>
		<div class="header">
			<h3>Help</h3>
			<Button title="Close" @click="model = false">
				<Icon>close</Icon>
			</Button>
		</div>
		<table>
			<thead>
				<tr>
					<th>Action</th>
					<th>Key</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Select all tiles</td>
					<td><kbd>A</kbd></td>
				</tr>
				<tr>
					<td>Clear selection</td>
					<td><kbd>Esc</kbd></td>
				</tr>
				<tr>
					<td>Delete selected tiles</td>
					<td><kbd>Del</kbd></td>
				</tr>
				<tr>
					<td>Duplicate selected tiles</td>
					<td><kbd>D</kbd></td>
				</tr>
				<tr>
					<td>Put selected tiles into crop mode</td>
					<td><kbd>R</kbd></td>
				</tr>
				<tr>
					<td>Send selected tiles closer to the back</td>
					<td><kbd>[</kbd></td>
				</tr>
				<tr>
					<td>Bring selected tiles closer to the front</td>
					<td><kbd>]</kbd></td>
				</tr>
				<tr>
					<td>Nudge/crop selected tiles</td>
					<td><kbd>Arrows</kbd></td>
				</tr>
				<tr>
					<td>Nudge/crop selected tiles faster</td>
					<td><kbd>Ctrl</kbd>+<kbd>Arrows</kbd></td>
				</tr>
				<tr>
					<td>Crop selected tiles from the opposite edge</td>
					<td><kbd>Shift</kbd>+<kbd>Arrows</kbd></td>
				</tr>
				<tr>
					<td>Zoom in</td>
					<td><kbd>+</kbd></td>
				</tr>
				<tr>
					<td>Zoom out</td>
					<td><kbd>-</kbd></td>
				</tr>
				<tr>
					<td>Reset zoom</td>
					<td><kbd>0</kbd></td>
				</tr>
				<tr>
					<td>Toggle the text layer</td>
					<td><kbd>T</kbd></td>
				</tr>
			</tbody>
		</table>
	</dialog>
</template>

<style lang="css" scoped>
.help {
	min-width: 300px;
	min-height: 300px;
	margin: auto;
	padding: var(--gap-lg);
	border: var(--gap-sm) solid var(--color-button);
	border-radius: var(--border-radius-lg);
	box-shadow: var(--shadow);
	animation: fade-in 0.2s ease forwards;

	&::backdrop {
		background-color: #0006;
		animation: fade-in 0.2s ease forwards;
	}

	& .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-lg);
	}

	& table {
		width: 100%;
		border-spacing: var(--gap-sm);

		& td:has(kbd) {
			text-align: end;
		}
	}

	& kbd {
		display: inline-block;
		min-width: 6ch;
		padding: var(--gap-sm);
		text-align: center;
		background-color: #ddd;
		border-bottom: 2px solid #aaa;
		border-radius: var(--border-radius-sm);
		box-shadow: 0 0 4px #fff inset;
	}
}

@keyframes fade-in {
	0%   { opacity: 0; }
	100% { opacity: 1; }
}
</style>
