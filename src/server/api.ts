import {remultApi} from "remult/remult-sveltekit";
import {JsonDataProvider} from "remult"
import {JsonEntityFileStorage} from "remult/server"
import {DatabaseConnectionTree} from "../shared/Entities/DatabaseConnectionTree";
import {repo} from "remult";
import {FileController} from "../shared/Controllers/FileController";
import {FileUtils} from "../shared/Controllers/fileUtils"


export const api = remultApi({
    dataProvider: async () =>
        new JsonDataProvider(new JsonEntityFileStorage("./db")
        ),
    entities: [DatabaseConnectionTree],
    controllers: [FileController],
    admin: true,
    initApi: async () => {
        FileUtils.makeDirectory("data")
        FileUtils.makeDirectory("db")
    },

});