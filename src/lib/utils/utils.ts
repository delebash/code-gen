// import { render } from "./ejs";
import * as ejs from 'ejs';


/**
 * Utility class providing static methods for common operations.
 */
export class Utils {


    /**
     * Attempts to parse a JSON string and returns an object containing either the parsed data or an error.
     *
     * @param {string} jsonString - The potential JSON string to be parsed.
     * @return {{data?: string, error?: unknown}} An object containing the `data` property if parsing succeeds,
     * or the `error` property if parsing fails.
     */
    static tryParseJson(jsonString: string): {
        data?: string;
        error?: unknown;
    } {
        try {
            const data = JSON.parse(jsonString);
            return {data};
        } catch (error) {
            return {error: error};
        }
    }


    /**
     * Attempts to render a template using provided data and options. Returns either the rendered HTML or an error.
     *
     * @param {string} template - The template string to be rendered.
     * @param {unknown} data - The data to be used for rendering the template.
     * @param {unknown} [options=null] - Optional rendering options.
     * @return {Promise<{html?: string, error?: unknown}>} A promise that resolves with an object containing either the rendered HTML or an error.
     */
    static async tryRender(
        template: string,
        data: unknown,
        options: unknown = null,
    ): Promise<{ html?: string; error?: unknown }> {
        try {
            const html = await ejs.render(template, data, options);
            return {html: html};
        } catch (e) {
            return {error: e};
        }
    }


    /**
     * Retrieves the file extension from a given file name.
     *
     * @param {string} fileName - The name of the file from which to extract the extension.
     * @return {string} The file extension if present, otherwise an empty string.
     */
    static getFileExtension(fileName) {
        const lastDotIndex = fileName.lastIndexOf('.');
        let extension = "";

        if (lastDotIndex !== -1 && lastDotIndex < fileName.length - 1) {
            extension = fileName.substring(lastDotIndex + 1); // "jpeg"
        } else {
            // Handle cases where no dot exists or dot is the last character
            extension = "";
        }
        return extension;
    }


    /**
     * Extracts and returns the filename without its extension from the provided full filename.
     * If no extension is present, the original filename is returned. Handles edge cases such
     * as hidden files like `.gitignore` or paths containing dots as part of directories.
     *
     * @param {string} filename - The full filename or path from which to extract the base filename.
     * @return {string} The filename without its extension. If no extension exists, returns the original filename.
     */
    static getFilenameWithoutExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');

        // If there's no dot or the dot is at the beginning (e.g., ".gitignore"),
        // assume no extension and return the original filename.
        if (lastDotIndex === -1 || lastDotIndex === 0) {
            return filename;
        }

        // Handle cases where the last dot might be part of a directory name (e.g., "my.folder/file.txt")
        // or if it's a hidden file (e.g., ".htaccess").
        const lastSlashIndex = filename.lastIndexOf('/');
        if (lastSlashIndex !== -1 && lastDotIndex < lastSlashIndex) {
            return filename; // The dot is part of a directory, not an extension
        }

        return filename.substring(0, lastDotIndex);
    }
}

// const node = data.node;
// // let oldName = data.old;
// const newName = data.node.text;
// const parentNode = data.instance.get_node(node.parent);
// let uniqueName=""
//
// // Get all sibling nodes
// const siblings = parentNode.children.map(childId => data.instance.get_node(childId));
// console.log('siblings', siblings);
// console.log('newName', newName);
// // Count occurrences of the new name
// let count = 0;
// siblings.forEach(sibling => {
//     // Check for exact text matches, excluding the node being renamed
//     if (sibling.text === newName && sibling.id !== node.id) {
//         console.log('rename check', sibling.text);
//         count++;
//     }
// });
//
// // If duplicates exist, rename the current node with a suffix
// if (count > 0) {
//     let suffix = 2;
//     // let uniqueName = `${newName} (${suffix})`;
//     while (siblings.some(sibling => sibling.text === uniqueName && sibling.id !== node.id)) {
//         suffix++;
//         uniqueName = `${newName} (${suffix})`;
//     }
//     // Update the node's name in the tree
//     console.log('renaminf', uniqueName);
//     data.instance.set_text(node, uniqueName);
// }