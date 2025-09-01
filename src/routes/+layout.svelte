<script lang="ts">
	//import favicon from '$lib/assets/favicon.svg';
    import "../app.css"; /* Adjust path if your CSS file is elsewhere */
    import AppLayout from "$lib/components/app-layout.svelte";

    let { children } = $props();
</script>
<!--<svelte:head>-->
<!--    Head-->
<!--</svelte:head>-->
<AppLayout />

{@render children?.()}

