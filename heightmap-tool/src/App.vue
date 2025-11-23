<script setup lang="ts">
import Canvas from '@/components/Canvas.vue';
import Toolbar from '@/components/Toolbar.vue';
</script>

<template>
	<main>
		<Canvas></Canvas>
		<Toolbar></Toolbar>
	</main>
</template>

<style scoped>
main {
	display: flex;
	flex-flow: column nowrap;
	height: 100%;
}
</style>
