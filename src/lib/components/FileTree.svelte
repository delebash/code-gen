<script>
    import {onMount} from 'svelte';
    import 'jstree/dist/themes/default/style.min.css';
    import jQuery from 'jquery'

    let treeElement; // This will be a reference to our DOM element
    // const data = [
    //     {"id": "ajson1", "parent": "#", "text": "Simple root node" },
    //     {"id": "ajson2", "parent": "#", "text": "Root node 2"},
    //     {"id": "ajson3", "parent": "ajson2", "text": "Child 1","type": "ejs-file"},
    //     {"id": "ajson4", "parent": "ajson2", "text": "Child 2", "type": "json-file"},
    // ];
    let data = [   {"id": "ajson1", "parent": "#", "text": "Simple root node","connectionString":"test"}]





    // let data2=[
    //     'Simple root node',
    //     {
    //         'id' : 'node_2',
    //         'text' : 'Root node with options',
    //         'state' : { 'opened' : true, 'selected' : true },
    //         'children' : [ { 'text' : 'Child 1' }, 'Child 2']
    //     }
    // ]
    onMount(async () => {
        const jstree = await import('jstree');

        jQuery(treeElement).jstree({
            'core': {
                "animation" : 0,
                "check_callback" : true,
                "themes" : { "stripes" : true },
                'data' : data
            },
            'types' : {
                'default' : { 'icon' : 'fa-solid fa-folder' },
                'ejs-file' : { 'valid_children' : [], 'icon' : 'fa-regular fa-file-code' },
                'json-file' : { 'valid_children' : [], 'icon' : 'fa-regular fa-file-lines' }
            },
            'unique' : {
                'duplicate' : function (name, counter) {
                    return name + ' ' + counter;
                }
            },
            "plugins" : [
                "contextmenu", "dnd", "search",
                "state", "types", "wholerow"
            ],
            "contextmenu" : {
                "items" : function(node) {
                    let tmp = jQuery.jstree.defaults.contextmenu.items();
                    delete tmp.create.action;
                    tmp.create.label = "New";
                    tmp.create.submenu = {
                        "create_folder" : {
                            "separator_after"	: true,
                            "label"				: "Folder",
                            "action"			: function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, { type : "default" }, "last", function (new_node) {
                                    setTimeout(function () { inst.edit(new_node); },0);
                                });
                            }
                        },
                        "create_ejs_file" : {
                            "label"				: "Ejs File",
                            "action"			: function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, { type : "ejs-file" }, "last", function (new_node) {
                                    setTimeout(function () { inst.edit(new_node); },0);
                                });
                            }
                        },
                        "create_json_file" : {
                            "label"				: "Json Data File",
                            "action"			: function (data) {
                                let inst = jQuery.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, { type : "json-file" }, "last", function (new_node) {
                                    setTimeout(function () { inst.edit(new_node); },0);
                                });
                            }
                        }
                    };
                    if(this.get_type(node) === "file") {
                        delete tmp.create;
                    }
                    return tmp;
                }
            },
        })
            .on('delete_node.jstree', function (e, data) {
                // jQuery.get('?operation=delete_node', { 'id' : data.node.id })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
                console.log('delete', data.node.id);
            })
            .on('create_node.jstree', function (e, data) {
                console.log('create', data);
                // jQuery.get('?operation=create_node', { 'type' : data.node.type, 'id' : data.node.parent, 'text' : data.node.text })
                //     .done(function (d) {
                //         data.instance.set_id(data.node, d.id);
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
            })
            .on('rename_node.jstree', function (e, data) {
                console.log('rename', data.node.id);
                // jQuery.get('?operation=rename_node', { 'id' : data.node.id, 'text' : data.text })
                //     .done(function (d) {
                //         data.instance.set_id(data.node, d.id);
                //     })
                //     .fail(function () {
                //         data.instance.refresh();
                //     });
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
            .on('dblclick', '.jstree-anchor', function (e, data) {
                console.log('dbleclick');
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
                if(data && data.selected && data.selected.length) {
                    console.log('changed', data.node.original);
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
                }
            // .on('dblclick', '.jstree-anchor', function () { ... })
                else {
                    // console.log('else', data);
                }
            });
    });
</script>
<div bind:this={treeElement}></div>