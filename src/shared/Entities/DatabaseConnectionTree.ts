import {Entity, Fields} from "remult";

@Entity<DatabaseConnectionTree>("database_connections", {
    allowApiCrud: true,
})
export class DatabaseConnectionTree {
    @Fields.autoIncrement()
    id;

    @Fields.string()
    parent = ""

    @Fields.string()
    text = ""

    @Fields.string()
    type = ""

    @Fields.json()
    data = {}

    @Fields.createdAt()
    createdAt?: Date;
}
