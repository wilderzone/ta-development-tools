<script lang="ts" setup>
import Spinner from '@/components/Spinner.vue';

defineProps<{
	loading?: boolean;
}>();
</script>

<template>
	<button :disabled="loading">
		<Spinner v-if="loading" />
		<slot v-else></slot>
	</button>
</template>

<style lang="css" scoped>
button {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: var(--gap-sm);
	font-size: larger;
	background-color: var(--color-button);
	border: unset;
	border-radius: var(--border-radius-sm);

	&:is(:active, :hover, :focus-visible) {
		background-color: var(--color-hover);
	}

	&:disabled {
		pointer-events: none;
	}
}
</style>
