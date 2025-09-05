<script>
    import {onMount} from 'svelte';
    import 'jstree/dist/themes/default/style.min.css';
    import jQuery from 'jquery'
    import DialogDbConnection from "$lib/components/DialogDbConnection.svelte";
    import {EntityError, repo} from "remult";
    import {DatabaseConnectionTree} from "../../shared/Entities/DatabaseConnectionTree.js"
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js"
    import icon_database from '$lib/assets/icons/icons8-database-24.png';
    import icon_folder from '$lib/assets/icons/icons8-folder-24.png';

    let isAlertDialogOpen = $state(false);
    let dialogDbConnection, treeElement
    let databaseConnections = $state([])
    let errorMsg = $state("");


    /**
     * Adds a new database connection to the repository and updates the internal database connections list.
     *
     * @param {Object} data - The data object containing properties required to create a new database connection.
     * @return {Promise<Object>} The newly created database connection object.
     * @throws {Error} If an error occurs during the process, an appropriate error message is logged.
     */
    async function addDatabaseConnection(data) {
        errorMsg = "";
        try {
            const newDatabaseConnection = await repo(DatabaseConnectionTree).insert(data);
            databaseConnections.unshift(newDatabaseConnection);
            databaseConnections = [...databaseConnections, newDatabaseConnection];
            data = {};
            return newDatabaseConnection;
        } catch (error) {
            errorMsg = error instanceof EntityError ? error.message : "Unknown error";
        }
    }

    onMount(async () => {
        //Initial data
        const seedData = {"id": "1", "parent": "#", "text": "Database Connections", "data": {}}
        if ((await repo(DatabaseConnectionTree).count()) === 0) {
            await repo(DatabaseConnectionTree).insert(seedData)
        }
        databaseConnections = await repo(DatabaseConnectionTree).find()

        /**
         * The `jstree` variable represents the imported `jsTree` library module, a popular jQuery plugin
         * used to provide interactive tree-structured data visualization and manipulation in web applications.
         *
         * This library allows developers to create, configure, and manage dynamic trees, supporting
         * drag-and-drop, keyboard navigation, lazy loading, customizable themes, and various plugins
         * for extended functionality.
         *
         * The module must be imported asynchronously and is commonly used for implementing hierarchical
         * data structures like file explorers, category lists, or organization charts.
         */
        const jstree = await import('jstree');

        jQuery(treeElement).jstree({
            'core': {
                "animation": 0,
                "check_callback": true,
                "themes": {"stripes": true},
                'data': databaseConnections
            },
            'types': {
                'default': {'icon': icon_folder},
                'database_connection': {'icon': icon_database},
            },
            'unique': {
                'duplicate': function (name, counter) {
                    return name + ' ' + counter;
                }
            },
            "plugins": [
                "contextmenu", "dnd", "search", "unique",
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
                                inst.create_node(obj, {type: "default"}, "last", function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        },
                        "create_database_connection": {
                            "label": "Db Connection",
                            "action": async function (data) {
                                try {
                                    // Open the dialog and await the result
                                    const formData = await dialogDbConnection.openDialog();
                                    if (formData) {
                                        let inst = jQuery.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        inst.create_node(obj, {
                                            type: "database_connection",
                                            text: formData.name,
                                            data: {database_connection: formData.database_connection}
                                        }, "last", function (new_node) {
                                            setTimeout(function () {
                                                inst.edit(new_node);
                                            }, 0);
                                        });
                                    }
                                } catch (error) {
                                    // Handle cancellation or errors
                                    if (error !== 'Dialog closed by user') {
                                        console.log(error);
                                    }
                                }
                            }
                        },
                    };
                    return tmp;
                }
            },
        })
            .on('delete_node.jstree', async function (e, data) {
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
                            await repo(DatabaseConnectionTree).delete(id)
                        }
                    }
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('create_node.jstree', async function (e, data) {
                let objData
                try {
                    if (data.node.type === 'database_connection') {
                        objData = {
                            parent: data.node.parent,
                            text: data.node.text,
                            type: data.node.type,
                            data: {database_connection: data.node.data.database_connection}
                        }
                    } else if (data.node.type === 'default') {
                        objData = {
                            parent: data.node.parent,
                            text: data.node.text,
                            type: data.node.type
                        }
                    } else {
                        throw new Error('Unknown node type: ' + data.node.type);
                    }

                    let newDatabaseConnection = await addDatabaseConnection(objData)
                    data.instance.set_id(data.node, newDatabaseConnection.id);
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('rename_node.jstree', async function (e, data) {
                console.log('rename', data.node);
                try {
                    await repo(DatabaseConnectionTree).update(data.node.id, {text: data.node.text})
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('move_node.jstree', async function (e, data) {
                console.log('move', data.node.id);
                try {
                    await repo(DatabaseConnectionTree).update(data.node.id, {parent: data.node.parent})
                    data.instance.refresh();
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('copy_node.jstree', async function (e, data) {
                console.log('copy', data.node.id);
                let objData = {
                    parent: data.node.parent,
                    text: data.node.text,
                    type: data.node.type,
                    data: {database_connection: data.node.data.database_connection}
                }
                try {
                    let newDatabaseConnection = await addDatabaseConnection(objData)
                    data.instance.set_id(data.node, newDatabaseConnection.id);
                    data.instance.refresh();
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('dblclick', '.jstree-anchor', async function (e) {
                let li = jQuery(e.target).closest("li"); // Get the closest list item (node element)
                let instance = jQuery.jstree.reference(treeElement);
                let nodeId = li[0].id
                let node = instance.get_node(nodeId); // Get the node
                if (node.type === 'database_connection') {


                    let formData = {
                        name: node.text,
                        database_connection: node.data.database_connection
                    }

                    try {
                        let updatedData = await dialogDbConnection.openDialog(formData);
                        node.data.database_connection = updatedData.database_connection
                        instance.rename_node(node, updatedData.name);
                        await repo(DatabaseConnectionTree).update(nodeId, {
                            text: updatedData.name,
                            data: {database_connection: updatedData.database_connection}
                        })
                    } catch (e) {
                        console.log(e)
                        instance.refresh();
                    }
                }
            })
            .on('changed.jstree', function (e, data) {
                if (data && data.selected && data.selected.length) {
                    console.log('changed', data.node.id);
                } else {
                    //  console.log('else', data);
                }
            });
    });
</script>

<div bind:this={treeElement}></div>
<DialogDbConnection bind:this={dialogDbConnection}></DialogDbConnection>
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