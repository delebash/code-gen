import {remultApi} from "remult/remult-sveltekit";
import {JsonDataProvider} from "remult"
import {JsonEntityFileStorage} from "remult/server"
import {DatabaseConnectionTree} from "../shared/Entities/DatabaseConnectionTree";

export const api = remultApi({
    dataProvider: async () =>
        new JsonDataProvider(new JsonEntityFileStorage("./db")
        ),
    entities: [DatabaseConnectionTree],
});