<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import AppSideBarRoot from "$lib/components/nav/app-sidebar-root.svelte"
    import EditorCode from "$lib/components/editor-code.svelte"
    import EditorResult from "$lib/components/editor-result.svelte"
    import {Button} from "$lib/components/ui/button"; // Import the Shadcn button component
    import {onMount} from "svelte";
    import FileExplorer from "$lib/components/nav/file-explorer.svelte"

    const DEFAULT_SIZE = 15;
    const SIDEBAR_WIDTH_ICON = '3rem';
    const sideOpen = true; // initial state
    const codeOpen = false; // initial state


    let isVisibleCodePane = $state(true);
    let isVisibleSidebarPane = $state(true);
    let isVisibleResultPane = $state(true);


    let refSidebarHandle = null
    let refCodeHandle = null
    let sidebarPane: ReturnType<typeof Resizable.Pane>;
    let codePane: ReturnType<typeof Resizable.Pane>;
    let isSidebarPaneCollapsed = $state(!sideOpen);
    let isCodePaneCollapsed = $state(!codeOpen);
    let isSidebarOpen = $state(sideOpen);

    function handlePaneCollapse() {
        isSidebarPaneCollapsed = true;
        isSidebarOpen = false;
    }

    function handlePaneExpand() {
        isSidebarPaneCollapsed = false;
        isSidebarOpen = true;
    }

    function handleCodePaneCollapse() {
        console.log("collapsed")
        isCodePaneCollapsed = true;
    }

    function handleCodePaneExpand() {
        console.log("not collapsed")
        isCodePaneCollapsed = false;
    }

    function addListnerCodePane() {
        refCodeHandle.addEventListener('dblclick', () => {
            if (!isCodePaneCollapsed) {
                return codePane.collapse();
            }
            if (isCodePaneCollapsed) {
                codePane.expand();
            }
        })
    }

    function addListnerSidebar() {
        console.log("add listner function called")
        refSidebarHandle.addEventListener('dblclick', () => {
            console.log("dble clicked sidebar")
            if (isSidebarOpen && !isSidebarPaneCollapsed) {
                return sidebarPane.collapse();
            }
            if (!isSidebarOpen && isSidebarPaneCollapsed) {
                sidebarPane.expand();
            }
        });
    }

    onMount(() => {
        addListnerSidebar()
        addListnerCodePane()
    });

    $effect(() => {
        if (isSidebarOpen && isSidebarPaneCollapsed) {
            return sidebarPane.expand();
        }
        if (!isSidebarOpen && !isSidebarPaneCollapsed) {
            sidebarPane.collapse();
        }
    });

</script>

<Button variant="outline" onclick={() => ( isVisibleSidebarPane = !isVisibleSidebarPane)}>
    {isVisibleSidebarPane ? "Hide" : "Show"} Side Bar
</Button>
<Button variant="outline" onclick={() => (isVisibleCodePane = !isVisibleCodePane)}>
    {isVisibleCodePane ? "Hide" : "Show"} Code Pane
</Button>
<Button variant="outline" onclick={() => (isVisibleResultPane = !isVisibleResultPane)}>
    {isVisibleResultPane ? "Hide" : "Show"} Results Pane
</Button>

<!--App layout using Resizable Pane and Sidebar components-->
<Sidebar.Provider bind:open={isSidebarOpen}>
    <Resizable.PaneGroup direction="horizontal">
        <!--        Sidebar Pane-->
        <Resizable.Pane
                defaultSize={isSidebarOpen ? DEFAULT_SIZE : 0}
                hidden={!isVisibleSidebarPane}
                order={1}
                minSize={0}
                maxSize={50}
                collapsible={true}
                class="min-w-[var(--sidebar-icon-width)]"
                style="--sidebar-icon-width: {SIDEBAR_WIDTH_ICON}"
                onCollapse={handlePaneCollapse}
                onExpand={handlePaneExpand}
                bind:this={sidebarPane}>
            <FileExplorer></FileExplorer>
            <!--            <AppSideBarRoot/>-->
        </Resizable.Pane>
        <!-- Bind the handle to the ref to get html handle element -->
        <!-- svelte-ignore non_reactive_update -->
        <Resizable.Handle hidden={!isVisibleSidebarPane} withHandle="true" bind:ref={refSidebarHandle}/>
        <Sidebar.Trigger hidden={!isVisibleSidebarPane}></Sidebar.Trigger>
        <!--        Code Pane-->
        <Resizable.Pane
                order={2}
                hidden={!isVisibleCodePane}
                defaultSize={50}
                collapsible={true}
                onCollapse={handleCodePaneCollapse}
                onExpand={handleCodePaneExpand}
                bind:this={codePane}>
            <EditorCode></EditorCode>
        </Resizable.Pane>
        <Resizable.Handle hidden={!isVisibleCodePane} withHandle="true" bind:ref={refCodeHandle}/>
        <!--        Results Pane-->
        <Resizable.Pane
                hidden={!isVisibleResultPane}
                defaultSize={25}
                order={3}>
            <EditorResult></EditorResult>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</Sidebar.Provider>
