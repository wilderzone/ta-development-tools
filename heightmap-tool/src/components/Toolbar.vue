<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/Button.vue';
import Help from '@/components/Help.vue';
import Icon from '@/components/Icon.vue';
import Toggle from '@/components/Toggle.vue';
import * as state from '@/state';
import { asyncRef } from '@/utilities';

const adding = ref(false);
const opening = ref(false);
const rendering = ref(false);
const showHelp = ref(false);
const saving = ref(false);
const zoom = computed(() => `${(state.scene.zoom().value * 100).toFixed(0)}%`);

const add = () => asyncRef(state.addTile(), adding);
const open = () => asyncRef(state.open(), opening);
const render = () => asyncRef(state.render(), rendering);
const save = () => asyncRef(state.save(), saving);
</script>

<template>
	<div class="toolbar">
		<div class="left">
			<Button
				:loading="opening"
				title="Open"
				@click="open()"
			><Icon>folder_open</Icon></Button>
			<Button
				:loading="saving"
				title="Save"
				@click="save()"
			><Icon>save</Icon></Button>
			<Button
				:loading="adding"
				title="New Tile"
				@click="add()"
			><Icon>add_box</Icon></Button>
			<Button
				:loading="rendering"
				title="Export"
				@click="render()"
			><Icon>outbound</Icon></Button>
		</div>
		<div class="right">
			<Toggle
				:title="state.scene.debug.value ? 'Hide Text' : 'Show Text'"
				v-model="state.scene.debug.value"
			/>
			<output title="Zoom" @dblclick="state.scene.zoom('reset')">
				<Icon>search</Icon>{{ zoom }}
			</output>
			<Button
				title="Help"
				@click="showHelp = true"
			><Icon>help</Icon></Button>
			<Help v-model="showHelp" />
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	padding: var(--gap-sm);
	pointer-events: none;

	& > :is(.left, .right) {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--gap-sm);
		width: fit-content;
		padding: var(--gap-sm);
		background-color: white;
		border-radius: calc(var(--border-radius-sm) + var(--gap-sm));
		box-shadow: var(--shadow);
		pointer-events: all;
	}

	& output {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding-inline: var(--gap-sm);
		background-color: var(--color-button);
		border-radius: var(--border-radius-sm);
	}
}
</style>
