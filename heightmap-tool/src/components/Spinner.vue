<template>
	<div class="spinner"></div>
</template>

<style lang="css" scoped>
.spinner {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 1em;
	height: 1em;

	&::before {
		content: '';
		width: 90%;
		height: 90%;
		border: 3px solid currentColor;
		border-right-color: transparent;
		border-bottom-color: transparent;
		border-radius: 50%;
		animation: spinner 0.8s linear infinite;
	}
}

@keyframes spinner {
	0%   { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
