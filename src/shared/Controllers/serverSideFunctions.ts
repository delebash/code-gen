import path from "path";
import fs from "fs-extra";

/**
 * Utility class for handling file and directory-related operations.
 */
export class ServerSideFunctions {
    /**
     * Writes data to a specified file.
     *
     * @param {string} pathFile - The path to the file where the data will be written.
     * @param {string} data - The content to write to the file.
     * @return {void} This method does not return a value.
     */
    static writeFile(pathFile: string, data: string | Buffer | Uint8Array | DataView) {
        try {
            fs.writeFileSync(pathFile, data, "utf8");
            console.log("File written successfully.");
        } catch (err) {
            console.error("Error writing file:", e);
            return e
        }
    }

    static makeDirectory(path: string) {
        try{
            if (fs.existsSync(path)) {
                console.log("Directory exists:", path);
            } else {
                fs.mkdirSync(path);
            }
        }catch(e){
            console.error(e);
            return e
        }
    }

    /**
     * Reads the content of a file at the specified path with UTF-8 encoding.
     *
     * @param {string} path - The file path to read.
     * @return {string|undefined} Returns the content of the file as a string if successful, or undefined if an error occurs.
     */
    static readFile(path: string) {
        try {
            // Read a file with UTF-8 encoding
            const data = fs.readFileSync(path, "utf8");
            return data;
        } catch (e) {
            console.error("Error reading file:", e);
            return e
        }
    }

    /**
     * Recursively builds the children array for a directory.
     * @param {string} dir The directory to read.
     * @returns {Array<Object>} An array of objects representing the directory's contents.
     */
    static buildChildren(dir: string) {

        const tree: any[] = [];
        const files = fs.readdirSync(dir);

        try {
            files.forEach((file) => {
                const fullPath = path.join(dir, file);
                const stats = fs.statSync(fullPath);

                if (stats.isDirectory()) {
                    tree.push({
                        text: file,
                        type: "folder",
                        data: {path: fullPath},
                        children: this.buildChildren(fullPath),
                    });
                } else {
                    const ext = path.extname(file);
                    let fileType = "";
                    if (ext === ".ejs") {
                        fileType = "ejs-file";
                    } else if (ext === ".json") {
                        fileType = "json-file";
                    }

                    tree.push({
                        text: file,
                        type: fileType,
                        data: {path: fullPath},
                    });
                }
            });

            return tree;
        } catch (e) {
            console.error("Error writing bundle:", e);
            return e
        }
    }

    /**
     * Builds a file tree object synchronously for a given directory path.
     * @param {string} dir The directory to read.
     * @returns {Object} An object representing the file tree with the root included.
     */
    static buildFileTree(dir: string) {
        try {
            const rootName = path.parse(dir).base;
            const tree = {
                text: rootName,
                type: "folder",
                path: path.join(dir),
                children: this.buildChildren(dir),
            };
            return [tree];
        } catch (e) {
            return e.message;
        }
    }

    /**
     * Checks whether a file or folder exists at the specified path.
     *
     * @param {string} path - The path to the file or folder to check for existence.
     * @return {boolean} Returns true if the file or folder exists, otherwise returns false.
     */
    static fileFolderExists(path: string) {
        try {
            if (fs.existsSync(path)) {
                console.log(`${path} exists!`);
                return true;
            } else {
                console.log(`${path} does not exist.`);
                return false;
            }
        } catch (e) {
            return e
        }
    }

    static renameFileFolder(oldName: string, newPath: string) {

        const currentWorkingDirectory = process.cwd();
        let lastSlashIndex = newPath.lastIndexOf("/");
        let oldPath;

        try {
            if (lastSlashIndex !== -1) {
                let pathWithoutFile = newPath.substring(0, lastSlashIndex);
                oldPath = pathWithoutFile + "/" + oldName;
            } else {
                oldPath = oldName;
            }
            const oldFullPath = path.join(currentWorkingDirectory, oldPath);
            const newFullPath = path.join(currentWorkingDirectory, newPath);

            // const oldPathExists = this.fileFolderExists(oldFullPath);

            if (fs.lstatSync(oldFullPath).isDirectory()) {
                fs.copySync(oldFullPath, newFullPath);
                fs.rmSync(oldFullPath, {recursive: true});
                console.log(`Folder renamed from ${oldFullPath} to ${newFullPath}`);
            } else if (fs.lstatSync(oldFullPath).isFile()) {
                fs.renameSync(oldFullPath, newFullPath);
                console.log(`File renamed from ${oldFullPath} to ${newFullPath}`);
            }
        } catch (e) {
            return e
        }
    }

    static createFileFolder(newPath: string, type: string) {
        const currentWorkingDirectory = process.cwd();
        const newFullPath = path.join(currentWorkingDirectory, newPath);
        try {
            if (type === "folder") {
                fs.mkdirSync(newFullPath);
            } else {
                fs.writeFileSync(newFullPath, "");
            }
            console.log(`File or Folder created ${newFullPath}`);

        } catch (e) {
            console.error("Error creating file or folder" + newFullPath, e);
            return e
        }
    }

    /**
     * Deletes a file or folder at the specified path.
     *
     * @param {string} currPath - The relative path of the file or folder to delete.
     * @param {string} type - The type of the item to delete; should be either "file" or "folder".
     * @return {void} This method does not return a value.
     */
    static deleteFileFolder(currPath: string, type: string) {
        const currentWorkingDirectory = process.cwd();
        const fullPath = path.join(currentWorkingDirectory, currPath);
        try {
            if (type === "folder") {
                //folder

                fs.rmSync(fullPath, {recursive: true, force: true});
                console.log(
                    `Folder and its contents at '${fullPath}' deleted successfully.`
                );
            } else {
                //file
                fs.unlinkSync(fullPath);
                console.log("file deleted successfully");
            }
        } catch (err) {
            if ((err as any).code !== "ENOENT") {
                // Check if the error is not because the file or folder does not exist
                console.error("Error deleting folder file:", err);
            }
        }
    }
}
