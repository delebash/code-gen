import fs from "fs";
import path from 'path';
import {FileController} from "../shared/Controllers/FileController";

// export class FileUtils {

FileController.writeFileServ = function writeFile(pathFile, data) {
    try {
        fs.writeFileSync(pathFile, data, 'utf8');
        console.log('File written successfully.');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

FileController.readFileServ = function readFile(path) {
    try {
        // Read a file with UTF-8 encoding
        const data = fs.readFileSync(path, 'utf8');
        return data
    } catch (err) {
        console.error('Error reading file:', err);
    }

}


/**
 * Recursively builds the children array for a directory.
 * @param {string} dir The directory to read.
 * @returns {Array<Object>} An array of objects representing the directory's contents.
 */
// FileController.buildChildrenSync=function buildChildrenSync(dir) {
FileController.buildChildrenSyncServ = function buildChildrenSync(path) {
    const tree = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            tree.push({
                text: file,
                type: 'directory',
                data: {path: fullPath},
                children: FileController.buildChildrenSyncServ(fullPath),
            });
        } else {
            tree.push({
                text: file,
                type: 'file',
                data: {path: fullPath},
            });
        }
    });

    return tree;
}


/**
 * Builds a file tree object synchronously for a given directory path.
 * @param {string} dir The directory to read.
 * @returns {Object} An object representing the file tree with the root included.
 */
FileController.buildFileTreeServ = function buildFileTree(dir) {
    const rootName = path.parse(dir).base;
    const tree = {
        text: rootName,
        type: 'folder',
        path: path.join(dir),
        children: this.buildChildrenSyncServ(dir),
    };
    return [tree];
}
// }