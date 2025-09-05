import {BackendMethod, remult} from 'remult'
import {FileUtils} from './fileUtils.ts'


/**
 * A controller class to manage file operations such as reading, writing,
 * building a file tree, renaming, and deleting files/folders. All methods
 * are marked as backend methods to facilitate proper access control and
 * execution in a backend environment.
 */
export class FileController {

    /**
     * Reads the content of a file from the specified path.
     *
     * @param {string} path - The path to the file that needs to be read.
     * @return {string} The content of the file as a string.
     */
    @BackendMethod({allowed: true})
    static readFile(path) {
        let data = FileUtils.readFile(path)
        return data
    }


    /**
     * Writes data to a specified file on the server.
     *
     * @param {string} pathFile - The full path of the file where the data will be written.
     * @param {string|Buffer|TypedArray|DataView} data - The content to be written to the file.
     * @return {void} No return value. The operation writes data directly to the specified file.
     */
    @BackendMethod({allowed: true})
    static writeFile(pathFile, data) {
        FileUtils.writeFile(pathFile, data)
    }


    /**
     * Builds a structured representation of the file tree for a given folder path,
     * writes the result to a JSON file, and returns the file tree as a JSON string.
     *
     * @param {string} folderPath - The path to the folder for which the file tree is to be built.
     * @return {string} A JSON string representation of the file tree.
     */
    @BackendMethod({allowed: true})
    static buildFileTree(folderPath) {
        let fileTree = JSON.stringify(FileUtils.buildFileTree(folderPath), null, 2)
        FileUtils.writeFile('./static/fileTree.json',fileTree )
        return fileTree
    }


    @BackendMethod({allowed: true})
    static renameFileFolder(oldName,newPath) {
      FileUtils.renameFileFolder(oldName,newPath)
    }

    @BackendMethod({allowed: true})
    static createFileFolder(newPath,type) {
        FileUtils.createFileFolder(newPath,type)
    }


    /**
     * Deletes a file or folder located at the specified path.
     *
     * @param {string} path - The path to the file or folder to be deleted.
     * @param {string} type - The type of the item to delete (e.g., file or folder).
     * @return {void} This method does not return a value.
     */
    @BackendMethod({allowed: true})
    static deleteFileFolder(path,type) {
        FileUtils.deleteFileFolder(path,type)
    }
}

