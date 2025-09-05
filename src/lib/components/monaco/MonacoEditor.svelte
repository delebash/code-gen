<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import {useMonacoEx} from "monaco-editor-ex";

    let modelInstance, monaco, editorContainer, editorInstance
    import prettier from 'prettier'
    import prettierPluginEjs from 'prettier-plugin-ejs'


    let {sourceCode = $bindable(), language = 'html', theme = 'vs-dark',} = $props();

    const monacoOptions = {
        value: sourceCode,
        language: language,
        theme: theme,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        autoIndent: "full",
        contextmenu: true,
        lineHeight: 24,
        hideCursorInOverviewRuler: true,
        matchBrackets: "always",
        readOnly: false,
        scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
        },
        wordWrap: 'on',
        wordWrapColumn: 80,
        wrappingIndent: 'indent',
        fontSize: 16,
        fontFamily: 'Fira Code, monospace',
        fontLigatures: true,
        cursorStyle: 'line',
        cursorBlinking: 'smooth',
        automaticLayout: true,
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false
        },
        padding: {
            top: 16
        }
    };

    onMount(async () => {

        //Import workers
        monaco = (await import('./monaco')).default;
        // useMonacoEx(monaco)
        //
        // import("monaco-themes/themes/Blackboard.json").then((data) => {
        //     monaco.editor.defineTheme("Blackboard", data);
        //     setIsThemeLoaded(true);


        editorInstance = monaco.editor.create(editorContainer, {
            ...monacoOptions,
        });


        //let response = await fetch('test.txt')
        // sourceCode = await response.text();
        modelInstance = monaco.editor.createModel(sourceCode, language);
        editorInstance.setModel(modelInstance);

        //Prettier
        // monaco.languages.registerDocumentFormattingEditProvider('html', {
        //     async provideDocumentFormattingEdits(modelInstance, options, token) {
        //            const text = prettier.format(modelInstance.getValue(), {
        //             parser: 'html',
        //             plugins: [prettierPluginEjs],
        //         });
        //         return [
        //             {
        //                 range: modelInstance.getFullModelRange(),
        //                 text,
        //             },
        //         ];
        //     },
        // });
        // monaco.languages.registerDocumentFormattingEditProvider('json', {
        //     async provideDocumentFormattingEdits(modelInstance, options, token) {
        //         const text = prettier.format(modelInstance.getValue(), {
        //             parser: 'json',
        //         });
        //         return [
        //             {
        //                 range: modelInstance.getFullModelRange(),
        //                 text,
        //             },
        //         ];
        //     },
        // });


        // Add event listeners
        // editorInstance.onDidChangeModelContent(() => {
        //     const updatedSourceCode = editorInstance.getValue();
        //     console.log({updatedSourceCode});
        // })
        editorInstance.onDidChangeModelContent((e) => {
            if (e.isFlush) {
                // true if setValue call
                // console.log('setValue call');
                /* editor.setValue(value); */
            } else {
                // console.log('user input');
                const updatedSourceCode = editorInstance?.getValue() ?? ' ';
                sourceCode = updatedSourceCode;
             //   console.log({sourceCode});
            }
        });

        // editorInstance.onDestroy(() => {
        //     monaco?.editor.getModels().forEach((model) => model.dispose());
        //     editorInstance?.dispose();
        // });

        // const model = editorInstance.getModel();
        // onDidChangeModelLanguage, onDidChangeModel,
        // export function getCode(){
        //     return monacoEditor.getValue()
        // }

        // fs.readFile('/path/to/your/file', 'utf8', (err, res) => {
        //     if (!err) {
        //         editor.setModel(monaco.editor.createModel(res, 'javascript'));
        //     }
        // })
    });
    $effect(() => {
        if (sourceCode) {
            if (editorInstance) {
                // check if the editor is focused
                if (editorInstance.hasWidgetFocus()) {
                    // console.log('focus');
                // let the user edit with no interference
                } else {
                if (editorInstance?.getValue() ?? ' ' !== sourceCode) {
                    // console.log('setval');
                    editorInstance?.setValue(sourceCode);
                }
                }
            }
        }
        if (sourceCode === '') {
            editorInstance?.setValue(' ');
        }
    });

    // onDestroy(() => {
    //     monaco?.editor.getModels().forEach((model) => model.dispose());
    //     editorInstance?.dispose();
    // });
</script>

<div class="container" bind:this={editorContainer}></div>
