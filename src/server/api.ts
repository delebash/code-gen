import { remultApi } from "remult/remult-sveltekit";
import { JsonDataProvider } from "remult";
import { JsonEntityFileStorage } from "remult/server";
import { DatabaseConnectionTree } from "../shared/Entities/DatabaseConnectionTree";
import { ServerSideController } from "../shared/Controllers/ServerSideController";
import { ServerSideFunctions } from "../shared/Controllers/serverSideFunctions";

export const api = remultApi({
  dataProvider: async () =>
    new JsonDataProvider(new JsonEntityFileStorage("./db")),
  entities: [DatabaseConnectionTree],
  controllers: [ServerSideController],
  admin: true,
  initApi: async () => {
    ServerSideFunctions.makeDirectory("data");
    ServerSideFunctions.makeDirectory("db");

    ServerSideController.ssf = ServerSideFunctions;
  },
});
