<script>
    // Mock file system data structure
    let fileSystem = $state({
        name: 'root',
        type: 'folder',
        expanded: true,
        children: [
            {
                name: 'Documents',
                type: 'folder',
                expanded: false,
                children: [
                    { name: 'resume.pdf', type: 'file', size: '245 KB' },
                    { name: 'cover-letter.docx', type: 'file', size: '32 KB' },
                    {
                        name: 'Projects',
                        type: 'folder',
                        expanded: false,
                        children: [
                            { name: 'project-1.md', type: 'file', size: '12 KB' },
                            { name: 'project-2.txt', type: 'file', size: '8 KB' }
                        ]
                    }
                ]
            },
            {
                name: 'Images',
                type: 'folder',
                expanded: false,
                children: [
                    { name: 'vacation.jpg', type: 'file', size: '2.1 MB' },
                    { name: 'profile.png', type: 'file', size: '456 KB' },
                    { name: 'screenshot.png', type: 'file', size: '892 KB' }
                ]
            },
            {
                name: 'Code',
                type: 'folder',
                expanded: false,
                children: [
                    {
                        name: 'web-projects',
                        type: 'folder',
                        expanded: false,
                        children: [
                            { name: 'index.html', type: 'file', size: '4 KB' },
                            { name: 'styles.css', type: 'file', size: '12 KB' },
                            { name: 'script.js', type: 'file', size: '8 KB' }
                        ]
                    },
                    { name: 'app.svelte', type: 'file', size: '15 KB' },
                    { name: 'package.json', type: 'file', size: '2 KB' }
                ]
            },
            { name: 'readme.txt', type: 'file', size: '1 KB' },
            { name: 'config.json', type: 'file', size: '512 B' }
        ]
    });

    let selectedItem = $state(null);
    let currentPath = $state(['root']);

    function toggleFolder(item) {
        if (item.type === 'folder') {
            item.expanded = !item.expanded;
        }
    }

    function selectItem(item, path) {
        selectedItem = item;
        if (item.type === 'folder') {
            currentPath = [...path, item.name];
        }
    }

    function getFileIcon(fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const iconMap = {
            pdf: '📄',
            docx: '📝',
            doc: '📝',
            txt: '📄',
            gg: '📄',
            md: '📝',
            html: '🌐',
            css: '🎨',
            js: '⚡',
            svelte: '🔥',
            json: '⚙️',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            gif: '🖼️'
        };
        return iconMap[extension] || '📄';
    }

    function renderTree(items, path = ['root'], depth = 0) {
        return items;
    }
</script>

<div class="file-explorer">
    <div class="header">
        <div class="breadcrumb">
            {#each currentPath as pathItem, index}
        <span class="breadcrumb-item">
          {pathItem}
            {#if index < currentPath.length - 1}
            <span class="separator">/</span>
          {/if}
        </span>
            {/each}
        </div>
    </div>

    <div class="content">
        <div class="tree-view">
            {#snippet fileTreeItem(item, path, depth)}
                <div class="tree-item" style="padding-left: {depth * 20}px">
                    <div
                            class="item-content {selectedItem === item ? 'selected' : ''}"
                            onclick={() => {
              if (item.type === 'folder') {
                toggleFolder(item);
              }
              selectItem(item, path);
            }}
                    >
            <span class="icon">
              {#if item.type === 'folder'}
                <span class="folder-icon">{item.expanded ? '📂' : '📁'}</span>
              {:else}
                <span class="file-icon">{getFileIcon(item.name)}</span>
              {/if}
            </span>
                        <span class="name">{item.name}</span>
                        {#if item.type === 'file' && item.size}
                            <span class="size">{item.size}</span>
                        {/if}
                    </div>

                    {#if item.type === 'folder' && item.expanded && item.children}
                        {#each item.children as child}
                            {@render fileTreeItem(child, [...path, item.name], depth + 1)}
                        {/each}
                    {/if}
                </div>
            {/snippet}

            {#each fileSystem.children as item}
                {@render fileTreeItem(item, ['root'], 0)}
            {/each}
        </div>

        {#if selectedItem}
            <div class="details-panel">
                <h3>Properties</h3>
                <div class="property">
                    <label>Name:</label>
                    <span>{selectedItem.name}</span>
                </div>
                <div class="property">
                    <label>Type:</label>
                    <span>{selectedItem.type === 'folder' ? 'Folder' : 'File'}</span>
                </div>
                {#if selectedItem.size}
                    <div class="property">
                        <label>Size:</label>
                        <span>{selectedItem.size}</span>
                    </div>
                {/if}
                {#if selectedItem.type === 'folder' && selectedItem.children}
                    <div class="property">
                        <label>Items:</label>
                        <span>{selectedItem.children.length}</span>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .file-explorer {
        width: 100%;
        height: 600px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: white;
    }

    .header {
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        padding: 12px 16px;
    }

    .breadcrumb {
        font-size: 14px;
        color: #6c757d;
    }

    .breadcrumb-item {
        font-weight: 500;
    }

    .separator {
        margin: 0 8px;
        color: #adb5bd;
    }

    .content {
        display: flex;
        height: calc(100% - 50px);
    }

    .tree-view {
        flex: 1;
        overflow-y: auto;
        padding: 8px 0;
        border-right: 1px solid #e9ecef;
    }

    .tree-item {
        user-select: none;
    }

    .item-content {
        display: flex;
        align-items: center;
        padding: 4px 8px 4px 0;
        cursor: pointer;
        border-radius: 4px;
        margin: 0 8px;
        transition: background-color 0.2s;
    }

    .item-content:hover {
        background-color: #f8f9fa;
    }

    .item-content.selected {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
    }

    .icon {
        margin-right: 8px;
        font-size: 16px;
        width: 20px;
        display: flex;
        justify-content: center;
    }

    .name {
        flex: 1;
        font-size: 14px;
        color: #212529;
    }

    .size {
        font-size: 12px;
        color: #6c757d;
        margin-left: 8px;
    }

    .details-panel {
        width: 250px;
        padding: 16px;
        background: #f8f9fa;
        overflow-y: auto;
    }

    .details-panel h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #212529;
    }

    .property {
        display: flex;
        margin-bottom: 12px;
        font-size: 14px;
    }

    .property label {
        font-weight: 500;
        color: #6c757d;
        width: 60px;
        margin-right: 8px;
    }

    .property span {
        color: #212529;
        word-break: break-all;
    }

    .folder-icon, .file-icon {
        display: inline-block;
    }
</style>