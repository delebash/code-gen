<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import MonacoEditor from "$lib/components/monaco/MonacoEditor.svelte"
    import EditorResult from "$lib/components/editor-result.svelte"
    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import JsTree from "$lib/components/JsTree.svelte";
    import {tryParseJson, tryRender} from "../utils/utils";


    let sideOpen = true; // initial state
    let dataOpen = false; // initial state

    let jsonSourceCode = $state("");
    let ejsSourceCode = $state("");
    let htmlString = $state("");
    let jsonSourceCodeError = $state(null);
    let ejsSourceCodeError = $state(null);
    let isVisibleCodePane = $state(true);
    let isVisibleSidebarPane = $state(true);
    let isVisibleResultPane = $state(true);
    let isVisibleDataPane = $state(true);

    let refSidebarHandle = null
    let refDataPaneHandle = null
    let sidebarPane: ReturnType<typeof Resizable.Pane>;
    let dataPane: ReturnType<typeof Resizable.Pane>;
    let isSidebarPaneCollapsed = $state(!sideOpen);
    let isDataPaneCollapsed = $state(!dataOpen);
    let editorCodeInstance

    function handleSidebarPaneCollapse() {
        isSidebarPaneCollapsed = true;
    }

    function handleSidebarPaneExpand() {
        isSidebarPaneCollapsed = false;
    }

    function handleDataPaneCollapse() {
        isDataPaneCollapsed = true;
    }

    function handleDataPaneExpand() {
        isDataPaneCollapsed = false;
    }

    function addListnerDataPane() {
        refDataPaneHandle.addEventListener('dblclick', () => {
            if (!isDataPaneCollapsed) {
                return dataPane.collapse();
            }
            if (isDataPaneCollapsed) {
                dataPane.expand();
            }
        })
    }

    function addListnerSidebar() {
        console.log("add sidebar listner function called")
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
        addListnerDataPane()
    });

    $effect(() => {
        const renderEjs = async () => {
            let data: unknown = null;
            if (jsonSourceCode) {
                const jsonResult = tryParseJson(jsonSourceCode);
                data = jsonResult.data;
                jsonSourceCodeError = jsonResult.error;
                if (jsonResult.error) {
                    return;
                }
            } else {
                jsonSourceCodeError = "";
            }
            const {html, error} = await tryRender(ejsSourceCode, data);

            ejsSourceCodeError = error;
            htmlString = html ?? "";
        };
        renderEjs().catch((e) => console.log(e));
    });

    function getActive() {
        console.log(editorCodeInstance.getActiveTab())
    }
</script>
<div class="editor-top">
    <Button variant="outline" onclick={() => ( isVisibleSidebarPane = !isVisibleSidebarPane)}>
        {isVisibleSidebarPane ? "Hide" : "Show"} Explorer
    </Button>
    <Button variant="outline" onclick={() => (isVisibleDataPane = !isVisibleDataPane)}>
        {isVisibleDataPane ? "Hide" : "Show"} Data Pane
    </Button>
    <Button variant="outline" onclick={() => (isVisibleCodePane = !isVisibleCodePane)}>
        {isVisibleCodePane ? "Hide" : "Show"} Ejs Pane
    </Button>
    <Button variant="outline" onclick={() => (isVisibleResultPane = !isVisibleResultPane)}>
        {isVisibleResultPane ? "Hide" : "Show"} Result Pane
    </Button>
    <Button variant="outline" onclick={getActive}>
        Get Tab Content
    </Button>
</div>

<!--App layout using Resizable Pane and Sidebar components-->
<div class="flex h-[95vh] w-full flex-col gap-4 sm:flex-row">
    <Resizable.PaneGroup direction="horizontal">
        <!--        Sidebar Pane-->
        <Resizable.Pane
                defaultSize={20}
                hidden={!isVisibleSidebarPane}
                minSize={0}
                maxSize={50}
                collapsible={true}
                onCollapse={handleSidebarPaneCollapse}
                onExpand={handleSidebarPaneExpand}
                bind:this={sidebarPane}>
            <JsTree></JsTree>
        </Resizable.Pane>
        <!-- Bind the handle to the ref to get html handle element -->
        <!-- svelte-ignore non_reactive_update -->
        <Resizable.Handle hidden={!isVisibleSidebarPane} withHandle="true" bind:ref={refSidebarHandle}/>

        <!--        Data Code Pane Group-->
        <Resizable.Pane>
            <div class="flex h-full min-h-full flex-col pr-1">
                <Resizable.PaneGroup
                        direction="vertical"
                        class="min-h-[200px] gap-1 rounded-lg"
                >
                    <!--                    Data Pane-->
                    <Resizable.Pane
                            defaultSize={1}
                            hidden={!isVisibleDataPane}
                            collapsible={true}
                            onCollapse={handleDataPaneCollapse}
                            onExpand={handleDataPaneExpand}
                            bind:this={dataPane}
                    >
                        <div class="flex h-full flex-col rounded-lg bg-primary/20">
                            <div class="flex flex-row items-center gap-2 px-2 py-1">
                                <div class="text-sm">Input Data</div>
                                {#if jsonSourceCodeError != null}
                                    <p class="text-[0.8em] text-error">{`${jsonSourceCodeError}`}</p>
                                {/if}
                            </div>
                            <MonacoEditor bind:sourceCode={jsonSourceCode} language="json"></MonacoEditor>
                        </div>
                    </Resizable.Pane>
                    <Resizable.Handle hidden={!isVisibleDataPane} withHandle="true" bind:ref={refDataPaneHandle}/>
                    <!--        Ejs Code Pane-->
                    <Resizable.Pane
                            hidden={!isVisibleCodePane}
                            defaultSize={2}
                    >
                        <div class="flex h-full flex-col rounded-lg bg-primary/20">
                            <div class="flex flex-row items-center gap-2 px-2 py-1">
                                <label class="text-sm">Input EJS</label>
                                {#if ejsSourceCodeError != null}
                                    {ejsSourceCodeError.toString()}
                                {/if}
                            </div>
                            <MonacoEditor bind:sourceCode={ejsSourceCode} language="html"></MonacoEditor>
                        </div>
                    </Resizable.Pane>
                </Resizable.PaneGroup>
            </div>
        </Resizable.Pane>
        <Resizable.Handle withHandle/>
        <!--        Result Pane-->
        <Resizable.Pane defaultSize={35} hidden={!isVisibleResultPane} class="rounded-lg bg-secondary/10">
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

                    {#if htmlString.trim().length === 0  }
                        <div class="flex flex-col items-center gap-2 text-onSurface/50">
                            <p>Add your EJS template and input data to see the preview</p>
                            <p class="text-sm">The preview will appear here</p>
                        </div>
                    {:else}
                        <EditorResult input={4}></EditorResult>
                    {/if}
                </div>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>
