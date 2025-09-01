<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs"; // Assuming you've installed shadcn-svelte
    import {Button} from "$lib/components/ui/button"; // Import the Shadcn button component
    import MonacoEditor from "$lib/components/monaco/MonacoEditor.svelte";
    // Initialize tabs array with some initial tabs
    let tabs = [
        {value: 1, label: 'New Tab 1', content: ''},
    ];

    let activeTab = tabs[0].value; // Set the initial active tab

    let tabCounter = tabs.length + 1; // Counter for unique tab IDs

    function addNewTab() {
        console.log("Adding new tab");
        const newTabValue = tabCounter;
        const newTabLabel = `New Tab ${tabCounter}`;
        // const newTabContent = `Content for New Tab ${tabCounter}`;

        tabs = [...tabs, {value: newTabValue, label: newTabLabel, content: ''}]; // Add new tab to the array

        activeTab = newTabValue; // Make the newly added tab active

        tabCounter++; // Increment the counter for the next new tab
    }

    export function getActiveTab() {
        return tabs.find((tab) => tab.value === activeTab);
    }

    const closeTab = (tabValue) => {
        console.log("Closing tab:", tabValue);
        // Filter out the closed tab
        tabs = tabs.filter((tab) => tab.value !== tabValue);

        // Update activeTab if the closed tab was active
        if (activeTab === tabValue) {
            activeTab = tabs[0]?.value || ""; // Set to the first tab or empty if no tabs remain
        }
        tabCounter = tabs.length + 1;
    };
</script>

<div class="flex flex-col gap-4">

    <Tabs.Root bind:value={activeTab}>
        <Tabs.List>
            {#each tabs as tab (tab.value)}
                <Tabs.Trigger value={tab.value}>
                    {tab.label}
                    <Button variant="ghost" size="sm" class=""
                            onclick={(e) => { e.stopPropagation(); closeTab(tab.value); }}>x
                    </Button>
                </Tabs.Trigger>
            {/each}
            <Button size="sm" class="" onclick={addNewTab}>+</Button>
        </Tabs.List>
        {#each tabs as tab (tab.value)}
            <Tabs.Content value={tab.value}>
                <MonacoEditor bind:sourceCode={tab.content} tabID="tab.value"/>
            </Tabs.Content>
        {/each}
    </Tabs.Root>
</div>

