import {remultApi} from "remult/remult-sveltekit";
import {JsonDataProvider} from "remult"
import {JsonEntityFileStorage} from "remult/server"
import {Task} from "../demo/todo/Task";

export const api = remultApi({
    dataProvider: async () =>
        new JsonDataProvider(new JsonEntityFileStorage("./db")
        ),
    entities: [Task],
});