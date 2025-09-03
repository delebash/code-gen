<script>
    import {onMount} from 'svelte';
    import 'jstree/dist/themes/default/style.min.css';
    import jQuery from 'jquery'
    import DialogDbConnection from "$lib/components/DialogDbConnection.svelte";
    import {EntityError, repo} from "remult";
    import {DatabaseConnectionTree} from "../../shared/Entities/DatabaseConnectionTree.js"
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js"
    import {buttonVariants} from "$lib/components/ui/button/index.js";

    let isAlertDialogOpen = $state(false);
    let dialogDbConnection, treeElement
    let databaseConnections = $state([])
    let errorMsg = $state("");

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

        const jstree = await import('jstree');

        jQuery(treeElement).jstree({
            'core': {
                "animation": 0,
                "check_callback": true,
                "themes": {"stripes": true},
                'data': databaseConnections
            },
            'types': {
                'default': {'icon': 'fa-solid fa-folder'},
                'database_connection': {'icon': 'fa-solid fa-database'},
            },
            'unique': {
                'duplicate': function (name, counter) {
                    return name + ' ' + counter;
                }
            },
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
                    if (idsToDelete.length > 1) {
                        for (let id of idsToDelete) {
                            await repo(DatabaseConnectionTree).delete(id)
                        }
                    } else {
                        isAlertDialogOpen=true
                        // throw new Error('Cannot delete root node')

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
                try {
                    await repo(DatabaseConnectionTree).update(data.node.id, {'text': data.text})
                } catch (e) {
                    console.log(e)
                    data.instance.refresh();
                }
            })
            .on('move_node.jstree', function (e, data) {
                console.log('move', data.node.id);
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
                console.log('copy', data.node.id);
                // jQuery.get('?operation=copy_node', { 'id' : data.original.id, 'parent' : data.parent })
                //     .done(function (d) {
                //         //data.instance.load_node(data.parent);
                //         data.instance.refresh();
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
            })
            .on('dblclick', '.jstree-anchor', async function (e) {
                // let node = jQuery(e.target).closest("li");
                // let id = node[0].id;
                // let data = jQuery(treeElement).jstree().get_node(id)
                // let instance = jQuery(treeElement).jstree()
                // $('#tree').jstree(true).get_node("some_node_id").data.obj.asdf;
                // jQuery(treeElement).jstree(true).get_node(li[0].id).data.asdf = "some other value";

                let li = jQuery(e.target).closest("li"); // Get the closest list item (node element)
                let instance = jQuery.jstree.reference(treeElement);
                let nodeId = li[0].id
                let node = instance.get_node(nodeId); // Get the node

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
                    // console.log('changed', data.node.original);
                    // jQuery.get('?operation=get_content&id=' + data.selected.join(':'), function (d) {
                    //     if(d && typeof d.type !== 'undefined') {
                    //         jQuery('#data .content').hide();
                    //         switch(d.type) {
                    //             case 'text':
                    //             case 'txt':
                    //             case 'md':
                    //             case 'htaccess':
                    //             case 'log':
                    //             case 'sql':
                    //             case 'php':
                    //             case 'js':
                    //             case 'json':
                    //             case 'css':
                    //             case 'html':
                    //                 jQuery('#data .code').show();
                    //                 jQuery('#code').val(d.content);
                    //                 break;
                    //             case 'png':
                    //             case 'jpg':
                    //             case 'jpeg':
                    //             case 'bmp':
                    //             case 'gif':
                    //                 jQuery('#data .image img').one('load', function () { jQuery(this).css({'marginTop':'-' + jQuery(this).height()/2 + 'px','marginLeft':'-' + jQuery(this).width()/2 + 'px'}); }).attr('src',d.content);
                    //                 jQuery('#data .image').show();
                    //                 break;
                    //             default:
                    //                 jQuery('#data .default').html(d.content).show();
                    //                 break;
                    //         }
                    //     }
                    // });
                } else {
                    // console.log('else', data);
                }
            });
    });
</script>
<!--<Button on:click={}>Add Database Connection</Button>-->
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