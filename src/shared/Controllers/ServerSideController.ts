import {BackendMethod} from "remult";

/**
 * Type defining the file operations that will be implemented on the server side
 * This type matches the static methods of FileUtils class
 */
export type FileOperations = {
    readFile(path: string): string | undefined;
    writeFile(
        pathFile: string,
        data: string | Buffer | Uint8Array | DataView
    ): void;
    buildFileTree(folderPath: string): any[];
    renameFileFolder(oldName: string, newPath: string): void;
    createFileFolder(newPath: string, type: string): void;
    deleteFileFolder(path: string, type: string): void;
    makeDirectory(path: string): void;
};

/**
 * A controller class to manage file operations such as reading, writing,
 * building a file tree, renaming, and deleting files/folders. All methods
 * are marked as backend methods to facilitate proper access control and
 * execution in a backend environment.
 */
export class ServerSideController {
    // Abstract serverside instance that will be implemented on the server side
    static ssf;

    /**
     * Reads the content of a file from the specified path.
     *
     * @param {string} path - The path to the file that needs to be read.
     * @return {string} The content of the file as a string.
     */
    @BackendMethod({allowed: true})
    static readFileMethod(path: string) {
        return ServerSideController.ssf.readFile(path);
    }

    /**
     * Writes data to a specified file on the server.
     *
     * @param {string} pathFile - The full path of the file where the data will be written.
     * @param {string|Buffer|TypedArray|DataView} data - The content to be written to the file.
     * @return {void} No return value. The operation writes data directly to the specified file.
     */
    @BackendMethod({allowed: true})
    static writeFileMethod(
        pathFile: string,
        data: string | Buffer | Uint8Array | DataView
    ) {
        return ServerSideController.ssf.writeFile(pathFile, data);
    }

    /**
     * Builds a structured representation of the file tree for a given folder path,
     * writes the result to a JSON file, and returns the file tree as a JSON string.
     *
     * @param {string} folderPath - The path to the folder for which the file tree is to be built.
     * @return {string} A JSON string representation of the file tree.
     */
    @BackendMethod({allowed: true})
    static buildFileTreeMethod(folderPath: string) {
        let fileTree = JSON.stringify(ServerSideController.ssf.buildFileTree(folderPath), null, 2);
        return ServerSideController.ssf.writeFile("./static/fileTree.json", fileTree);

    }

    @BackendMethod({allowed: true})
    static renameFileFolderMethod(oldName: string, newPath: string) {
        return ServerSideController.ssf.renameFileFolder(oldName, newPath);
    }

    @BackendMethod({allowed: true})
    static createFileFolderMethod(newPath: string, type: string) {
        return ServerSideController.ssf.createFileFolder(newPath, type);
    }

    /**
     * Deletes a file or folder located at the specified path.
     *
     * @param {string} path - The path to the file or folder to be deleted.
     * @param {string} type - The type of the item to delete (e.g., file or folder).
     * @return {void} This method does not return a value.
     */
    @BackendMethod({allowed: true})
    static deleteFileFolderMethod(path: string, type: string) {
        return ServerSideController.ssf.deleteFileFolder(path, type);
    }
}
