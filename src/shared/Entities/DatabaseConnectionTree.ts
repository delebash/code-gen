import {Entity, Fields} from "remult";

/**
 * Represents a hierarchical structure of database connections.
 *
 * The DatabaseConnectionTree class is annotated to map to a database entity named "database_connections".
 * Each instance represents a node in a tree structure, providing details about the connection type, parent node,
 * and associated data. Additionally, it includes metadata such as creation timestamps.
 *
 * Fields:
 * - id: An auto-incremented unique identifier for each node.
 * - parent: The identifier of the parent node in the tree hierarchy.
 * - text: A descriptive name or label for the current node.
 * - type: Describes the type of connection represented by the node.
 * - data: A JSON object that holds additional details or metadata for the node.
 * - createdAt: A timestamp indicating when the node was created.
 *
 * This class provides CRUD API functionality via the allowApiCrud option, enabling operations on the database entity.
 */

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
