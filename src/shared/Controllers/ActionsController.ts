import { BackendMethod, remult } from 'remult'
import fs from 'fs'
import * as path from "node:path";


export class ActionsController {
    @BackendMethod({allowed: true})
    static async getDbEntitiesMetadata(connectionInfo: ConnectionInfo): Promise<{
        entities: {
            fileContent: string
            meta: EntityMetaData
        }[]
    }> {
        try {
            const db = await getDbFromConnectionInfo(connectionInfo)

            const repo = remult.repo(Setting)
            const all = await repo.find()
            const outputDir =
                all.find((c) => c.id === SettingKey.outputDir)?.value ?? 'src/shared/entities'
            const tableProps =
                all.find((c) => c.id === SettingKey.tableProps)?.value ?? "'allowApiCrud: true'"

            const toRet = await getEntitiesTypescriptFromDb(
                db,
                outputDir,
                tableProps,
                ['order', 'name'],
                {},
                true,
                [db.schema],
                'NEVER',
                ['pg_stat_statements', 'pg_stat_statements_info'],
            )

            return toRet
        } catch (error) {
            return {entities: []}
        }
    }

    @BackendMethod({allowed: true})
    static readFile(path) {
        try {
            // Read a file with UTF-8 encoding
            const data = fs.readFileSync(path, 'utf8');
            console.log('File content:', data);

            // Read a file as a Buffer
            const bufferData = fs.readFileSync('image.png');
            console.log('Image buffer:', bufferData);

        } catch (err) {
            console.error('Error reading file:', err);
        }
    }
    // static async readFile(pathFile: string) {
    //     return (read(pathFile) ?? '').split('\n')
    // }

    @BackendMethod({allowed: true})
    static writeFile(pathFile, data) {
        try {
            fs.writeFileSync(pathFile, data, 'utf8');
            console.log('File written successfully.');
        } catch (err) {
            console.error('Error writing file:', err);
        }
    }
    @BackendMethod({allowed: true})
    static getAllPaths(folderPath){
        let allPaths = [];

        // Read the contents of the current directory
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(folderPath, entry.name);
            allPaths.push(entryPath); // Add the current entry's path

            if (entry.isDirectory()) {
                // If it's a directory, recursively call the function and add its contents
                allPaths = allPaths.concat(this.getAllPaths(entryPath));
            }
        }

        return allPaths;
    }
    // static listFilesAndDirectories(path) {
    //     const directoryPath = '/path/to/your/directory';
    //
    //     fs.readdir(directoryPath, (err, items) => {
    //         if (err) {
    //             console.error('Error reading directory:', err);
    //             return;
    //         }
    //
    //         const files = [];
    //         const directories = [];
    //
    //         items.forEach(item => {
    //             const itemPath = path.join(directoryPath, item);
    //             const stats = fs.statSync(itemPath); // Synchronous stat for simplicity in this example
    //
    //             if (stats.isFile()) {
    //                 files.push(item);
    //             } else if (stats.isDirectory()) {
    //                 directories.push(item);
    //             }
    //         });
    //
    //         console.log('Files:', files);
    //         console.log('Directories:', directories);
    //     })
    // }


    // static async writeFiles(files: { className: string; data: string[] }[]) {
    //     for (let i = 0; i < files.length; i++) {
    //         const {className, data} = files[i]
    //         const outDir = (await remult.repo(Setting).findId(SettingKey.outputDir))?.value || ''
    //         const pathFile = `${outDir}/${className}.ts`
    //         updateIndex({
    //             targetTSFile: `${outDir}/index.ts`,
    //             entityClassName: className,
    //             entityFileName: pathFile,
    //         })
    //         write(pathFile, data)
    //     }
    // }

}

