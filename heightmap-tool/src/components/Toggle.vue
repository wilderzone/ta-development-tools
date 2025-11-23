<script setup lang="ts">
import Icon from '@/components/Icon.vue';

const model = defineModel<boolean>({ required: true });
</script>

<template>
	<label class="toggle">
		<input type="checkbox" v-model="model">
		<Icon>text_fields</Icon>
	</label>
</template>

<style lang="css" scoped>
.toggle {
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

	&:has(:checked) {
		background-color: var(--color-selected);
	}

	& input[type="checkbox"] {
		position: absolute;
		inset: 0;
		opacity: 0;
	}
}
</style>
