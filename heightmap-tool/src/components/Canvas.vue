<script lang="ts" setup>
import { scene } from '@/state';
import { computed, onMounted, ref } from 'vue';

const container = ref<HTMLDivElement | null>();
const canvas = ref<HTMLCanvasElement | null>();
const context = computed(() => canvas.value?.getContext('2d'));

onMounted(() => {
	if (!container.value || !canvas.value || !context.value) return;

	scene.start(canvas.value);

	const observer = new ResizeObserver(entries => {
		if (!canvas.value)return;
		const entry = entries[0];
		const width = entry.borderBoxSize[0].inlineSize;
		const height = entry.borderBoxSize[0].blockSize;
		canvas.value.width = width;
		canvas.value.height = height;
	});
	observer.observe(container.value);
});
</script>

<template>
	<div ref="container" class="container">
		<canvas ref="canvas"></canvas>
	</div>
</template>

<style lang="css" scoped>
.container {
	height: 100%;
	overflow: hidden;
}
</style>
