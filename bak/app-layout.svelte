<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import AppSideBarRoot from "$lib/components/nav/app-sidebar-root.svelte"
    import MonacoEditor from "$lib/components/monaco/MonacoEditor.svelte"
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
    let editorCodeInstance
    // let isSidebarOpen = $state(sideOpen);

    function handlePaneCollapse() {
        isSidebarPaneCollapsed = true;
        // isSidebarOpen = false;
    }

    function handlePaneExpand() {
        isSidebarPaneCollapsed = false;
        // isSidebarOpen = true;
    }

    function handleCodePaneCollapse() {
        isCodePaneCollapsed = true;
    }

    function handleCodePaneExpand() {
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

            if (!isSidebarPaneCollapsed) {
                return sidebarPane.collapse();
            }
            if (isSidebarPaneCollapsed) {
                sidebarPane.expand();
            }
        });
    }

    onMount(() => {
        addListnerSidebar()
        addListnerCodePane()
    });

    $effect(() => {
        // if (isSidebarOpen && isSidebarPaneCollapsed) {
        //     return sidebarPane.expand();
        // }
        // if (!isSidebarOpen && !isSidebarPaneCollapsed) {
        //     sidebarPane.collapse();
        // }
    });
function getActive() {
console.log(editorCodeInstance.getActiveTab())
}
</script>
<div class="editor-top">
    <Button variant="outline" onclick={() => ( isVisibleSidebarPane = !isVisibleSidebarPane)}>
        {isVisibleSidebarPane ? "Hide" : "Show"} Side Bar
    </Button>
    <Button variant="outline" onclick={() => (isVisibleCodePane = !isVisibleCodePane)}>
        {isVisibleCodePane ? "Hide" : "Show"} Code Pane
    </Button>
    <Button variant="outline" onclick={() => (isVisibleResultPane = !isVisibleResultPane)}>
        {isVisibleResultPane ? "Hide" : "Show"} Results Pane
    </Button>
    <Button variant="outline" onclick={getActive}>
        Get Tab Content
    </Button>
</div>
<!--App layout using Resizable Pane and Sidebar components-->
<!--<Sidebar.Provider bind:open={isSidebarOpen}>-->
<!--<Resizable.PaneGroup direction="horizontal">-->
<!--    &lt;!&ndash;        Sidebar Pane&ndash;&gt;-->
<!--    <Resizable.Pane-->
<!--            defaultSize={15}-->
<!--            hidden={!isVisibleSidebarPane}-->
<!--            order={1}-->
<!--            minSize={0}-->
<!--            maxSize={50}-->
<!--            collapsible={true}-->
<!--            onCollapse={handlePaneCollapse}-->
<!--            onExpand={handlePaneExpand}-->
<!--            bind:this={sidebarPane}>-->
<!--        <FileExplorer></FileExplorer>-->
<!--        &lt;!&ndash;            <AppSideBarRoot/>&ndash;&gt;-->
<!--    </Resizable.Pane>-->
<!--    &lt;!&ndash; Bind the handle to the ref to get html handle element &ndash;&gt;-->
<!--    &lt;!&ndash; svelte-ignore non_reactive_update &ndash;&gt;-->
<!--    <Resizable.Handle hidden={!isVisibleSidebarPane} withHandle="true" bind:ref={refSidebarHandle}/>-->
<!--    &lt;!&ndash;        <Sidebar.Trigger hidden={!isVisibleSidebarPane}></Sidebar.Trigger>&ndash;&gt;-->
<!--    &lt;!&ndash;        Code Pane&ndash;&gt;-->
<!--    <Resizable.Pane-->
<!--            order={2}-->
<!--            hidden={!isVisibleCodePane}-->
<!--            defaultSize={50}-->
<!--            collapsible={true}-->
<!--            onCollapse={handleCodePaneCollapse}-->
<!--            onExpand={handleCodePaneExpand}-->
<!--            bind:this={codePane}>-->
<!--        <EditorCode bind:this={editorCodeInstance}></EditorCode>-->
<!--    </Resizable.Pane>-->
<!--    <Resizable.Handle class="mt-11" hidden={!isVisibleCodePane} withHandle="true" bind:ref={refCodeHandle}/>-->
<!--    &lt;!&ndash;        Results Pane&ndash;&gt;-->
<!--    <Resizable.Pane class="mt-11"-->
<!--            hidden={!isVisibleResultPane}-->
<!--            defaultSize={25}-->
<!--            order={3}>-->
<!--        <EditorResult></EditorResult>-->
<!--    </Resizable.Pane>-->
<!--</Resizable.PaneGroup>-->
<!--</Sidebar.Provider>-->
<div class="flex h-[86vh] w-full flex-col gap-4 sm:flex-row">
    <Resizable.PaneGroup
            direction="horizontal"
            class="min-h-[200px] gap-1 rounded-lg"
    >
        <Resizable.Pane defaultSize={1}>
            <div class="flex h-full min-h-full flex-col pr-1">
                <Resizable.PaneGroup
                        direction="vertical"
                        class="min-h-[200px] gap-1 rounded-lg"
                >
                    <Resizable.Pane defaultSize={1}>
                        <div class="flex h-full flex-col rounded-lg bg-primary/20">
                            <div class="flex flex-row items-center gap-2 px-2 py-1">
                                <label class="text-sm">Input Data</label>
                                <!--{inputDataError != null && (-->
                                <!--    <p class="text-[0.8em] text-error">{`${inputDataError}`}</p>-->
                                <!--)}-->
                            </div>

                            <EditorCode
                                    language="json"
                                    class="resize-none rounded-lg transition-all"
                                    bind:this={editorCodeInstance}>
                            </EditorCode>
                        </div>
                    </Resizable.Pane>
                    <Resizable.Handle withHandle />
                    <Resizable.Pane defaultSize={2}>
                        <div class="flex h-full flex-col rounded-lg bg-primary/20">
                            <div class="flex flex-row items-center gap-2 px-2 py-1">
                                <label class="text-sm">Input EJS</label>
                                input error
                                <!--{inputEjsError != null && (-->
                                <!--    <p class="text-[0.8em] font-light text-error">-->
                                <!--        {inputEjsError.toString()}-->
                                <!--    </p>-->
                                <!--)}-->
                            </div>
                            <EditorCode
                                    language="html"
                                    class="resize-none rounded-lg transition-all"
                                    bind:this={editorCodeInstance}>
                            </EditorCode>
                        </div>
                    </Resizable.Pane>
                </Resizable.PaneGroup>
            </div>
        </Resizable.Pane>
        <Resizable.Handle withHandle />
        <Resizable.Pane defaultSize={1} class="rounded-lg bg-secondary/10">
            <div class="flex flex-col gap-1">
                <div class="flex flex-row-reverse gap-2 p-1">
                    <button
                           class="rounded-md bg-primary px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        PRINT
                    </button>
                    <button
                            class="rounded-md bg-primary px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Copy
                    </button>
                </div>

                <div class="flex h-full items-center justify-center overflow-auto p-2">
<!--                    testy-->
<!--                    {htmlString.trim().length === 0 ? (-->
                        <div class="flex flex-col items-center gap-2 text-onSurface/50">
                            <p>Add your EJS template and input data to see the preview</p>
                            <p class="text-sm">The preview will appear here</p>
                        </div>
                    output
<!--                    ) : (-->
<!--                        <HtmlPreview htmlContent={htmlString} />-->
<!--                    )}-->
                </div>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>