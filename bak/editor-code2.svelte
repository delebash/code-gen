<script lang="ts">
     import MonacoEditor from "$lib/components/monaco/MonacoEditor.svelte";
    // Initialize tabs array with some initial tabs
</script>

<div class="flex flex-col gap-4">
                <MonacoEditor bind:sourceCode={tab.content} tabID="tab.value"/>

</div>

