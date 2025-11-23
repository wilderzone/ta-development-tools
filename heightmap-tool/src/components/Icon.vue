<script setup lang="ts">
defineProps<{
	outline?: boolean;
}>();
</script>

<template>
	<span class="icon" :class="{ outline }" aria-hidden="true"><slot></slot></span>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0..1,0&display=block');

.icon {
	display: inline-block;
	width: 1em;
	height: 1em;
	line-height: 1em;
	font-family: 'Material Symbols Rounded';
	font-size: inherit;
	font-variation-settings:
		'FILL' 1,
		'wght' 400,
		'GRAD' 0,
		'opsz' 48;
	user-select: none;

	&.outline {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 48;
	}
}
</style>
