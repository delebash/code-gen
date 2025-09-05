<script>
    import {onMount} from 'svelte';
    import 'jstree/dist/themes/default/style.min.css';
    import jQuery from 'jquery'
    import icon_json from '$lib/assets/icons/icons8-curly-brackets-24.png';
    import icon_folder from '$lib/assets/icons/icons8-folder-24.png';
    import icon_ejs from '$lib/assets/icons/icons8-ejs-24.png';
    import {FileController} from "../../shared/Controllers/FileController.ts";
    import {repo} from "remult";
    import {DatabaseConnectionTree} from "../../shared/Entities/DatabaseConnectionTree.js";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js"
    import {Utils} from "../utils/utils.js";

    let isAlertDialogOpen = $state(false);
    let treeElement; // This will be a reference to our DOM element


    onMount(async () => {
        FileController.buildFileTree('./data')
        // let data =  await FileController.buildFileTree('./data')
        const jstree = await import('jstree');

        jQuery(treeElement).jstree({
            'core': {
                "animation": 0,
                'check_callback': true,
                "themes": {"stripes": true},
                // 'data' : data
                'data': {
                    'url': '/fileTree.json',
                    'data': function (node) {
                        return {'id': node.id};
                    }
                }
            },
            'types': {
                'folder': {'icon': icon_folder},
                'ejs-file': {'valid_children': [], 'icon': icon_ejs},
                // 'ejs-file' : { 'valid_children' : [], 'icon' : 'fa-regular fa-file-code' },
                // 'json-file' : { 'valid_children' : [], 'icon' : 'fa-regular fa-file-lines' }
                'json-file': {'valid_children': [], 'icon': icon_json}
            },
            // 'unique': {
            //     'duplicate': function (name, counter) {
            //         return name + ' ' + counter;
            //     }
            // },
            "plugins": [
                "contextmenu", "dnd", "search",
                "state", "types", "wholerow"
            ],
            "contextmenu": {
                "items": function (node) {
                    let tmp = jQuery.jstree.defaults.contextmenu.items();
                    delete tmp.create.action;
                    tmp.create.label = "New";
                    tmp.create.submenu = {
                        "create_folder": {
                            "separator_after": true,
                            "label": "Folder",
                            "action": function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {
                                    type: "folder",
                                    text: "New folder"
                                }, "last", function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        },
                        "create_ejs_file": {
                            "label": "Ejs File",
                            "action": function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {
                                    type: "ejs-file",
                                    text: "New ejs file"
                                }, "last", function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        },
                        "create_json_file": {
                            "label": "Json Data File",
                            "action": function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {
                                    type: "json-file",
                                    text: "New json file"
                                }, "last", function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        }
                    };
                    if (this.get_type(node) === "file") {
                        delete tmp.create;
                    }
                    return tmp;
                }
            },
        })
            .on('delete_node.jstree', function (e, data) {
                console.log('delete', data.node.text);
                try {
                    let idsToDelete = []
                    let immediateChildrenIds = data.node.children_d;
                    idsToDelete.push(data.node.id)
                    idsToDelete.push(...immediateChildrenIds)
                    if (data.node.id === "1") {
                        console.log('root node')
                        //You can't delete root node with id="1"
                        isAlertDialogOpen = true
                    } else {
                        for (let id of idsToDelete) {
                            let node = data.instance.get_node(id)
                            let path = data.instance.get_path(node, "/");
                            let type = node.type
                            FileController.deleteFileFolder(path, type)
                        }
                    }
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('create_node.jstree', function (e, data) {
                // console.log('create', data.node.text);
                // let parentNode = data.instance.get_node(data.node.parent);
                // let isDuplicate = checkDuplicateNode('rename_node', data.node, parentNode, data.instance)
                // if(isDuplicate) {
                //     data.instance.delete_node(data.node);
                //     alert('Duplicate node name found. Node not added.')
                // }
            })
            .on('rename_node.jstree', function (e, data) {
                console.log('rename ', data.node.text);
                //The unique plugin will not work here because we are manually renaming the node for files
                /**
                 * Handles the renaming of a node within a tree structure. Ensures that file extensions are added
                 * if missing, and resolves naming conflicts by appending a numeric suffix to create a unique name
                 * among sibling nodes.
                 *
                 * @param {Event} e - The event object associated with the rename action.
                 * @param {Object} data - An object containing details about the node being renamed and its context.
                 * @param {Object} data.node - The node object that is being renamed.
                 * @param {string} data.node.text - The current name of the node.
                 * @param {string} data.node.type - The type of the node (e.g., 'ejs-file', 'json-file', 'folder').
                 * @param {string} data.node.parent - The identifier of the parent node.
                 * @param {Object} data.instance - The instance of the tree controlling the node.
                 * @param {Function} data.instance.get_node - Function to retrieve a node object by its identifier.
                 * @param {Function} data.instance.set_text - Function to update the name (text) of a node.
                 */
                //Add ext if not exists
                if (Utils.getFileExtension(data.node.text) === "") {
                    console.log(data.node.text);
                    if (data.node.type === 'ejs-file') {
                        data.instance.set_text(data.node, data.node.text + '.ejs');
                        console.log('add .ext', data.node.text);
                    } else if (data.node.type === 'json-file') {
                        data.instance.set_text(data.node, data.node.text + '.json');
                        console.log('add .ext', data.node.text);
                    }
                }

                const parentNode = data.instance.get_node(data.node.parent);
                const siblingNames = parentNode.children
                    .map(childId => data.instance.get_node(childId).text);

                const newName = data.node.text;
                const type = data.node.type;
                const ext = Utils.getFileExtension(newName);
                const newNameWithoutExt = Utils.getFilenameWithoutExtension(newName);
                // Check for duplicates, excluding the node being renamed
                if (siblingNames.filter(name => name === newName).length > 1) {
                    console.log('duplicate found');
                    let finalName = newName;
                    let counter = 1;
                    while (siblingNames.includes(finalName)) {
                        if (type === "folder") {
                            finalName = `${newNameWithoutExt} ${counter++}`;
                        } else {
                            finalName = `${newNameWithoutExt} ${counter++}.${ext}`;
                        }
                    }
                    // Rename the node with the unique name
                    data.instance.set_text(data.node, finalName);
                }
            })
            .on('move_node.jstree', function (e, data) {
                console.log('move ', data.node.text);
                // jQuery.get('?operation=move_node', { 'id' : data.node.id, 'parent' : data.parent })
                //     .done(function (d) {
                //         //data.instance.load_node(data.parent);
                //         data.instance.refresh();
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
            })
            .on('copy_node.jstree', function (e, data) {
                console.log('copy ', data.node.text);
                // jQuery.get('?operation=copy_node', { 'id' : data.original.id, 'parent' : data.parent })
                //     .done(function (d) {
                //         //data.instance.load_node(data.parent);
                //         data.instance.refresh();
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
            })
            .on('dblclick', '.jstree-anchor', function (e, data) {
                console.log('dblClick ', data.node.text);
                // jQuery.get('?operation=copy_node', { 'id' : data.original.id, 'parent' : data.parent })
                //     .done(function (d) {
                //         //data.instance.load_node(data.parent);
                //         data.instance.refresh();
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
            })
            .on('changed.jstree', function (e, data) {
                if (data && data.selected && data.selected.length) {
                    console.log('changed ', data.node.text);
                } else {
                    // console.log('else', data);
                }
            });
    });

</script>
<div bind:this={treeElement}></div>
<AlertDialog.Root bind:open={isAlertDialogOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Error</AlertDialog.Title>
            <AlertDialog.Description>
                You cannot delete the root node.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Close</AlertDialog.Cancel>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>