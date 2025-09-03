import {Entity, Fields} from "remult";

@Entity<DatabaseConnectionTree>("tasks", {
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
    database_connection = ""

    @Fields.string()
    type = ""

    @Fields.createdAt()
    createdAt?: Date;
}
