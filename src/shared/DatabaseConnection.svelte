<script lang="ts">
  import { EntityError, repo } from "remult";
  import { DatabaseConnectionTree } from "./Entities/DatabaseConnectionTree";


  let databaseConnections= $state([]);
  let databaseConnection = $state(repo(DatabaseConnectionTree).create());
  let errorMsg = $state("");

  // For demo purposes. By default we are in liveQuery mode.
  const liveQuery = true;

  $effect(() => {
    if (!liveQuery) {
      repo(DatabaseConnectionTree)
        .find()
        .then((_databaseConnections) => {
            databaseConnections = _databaseConnections;
        });
    } else {
      return repo(DatabaseConnectionTree)
        .liveQuery()
        .subscribe((info) => {
            databaseConnections = info.items;
        });
    }
  });

  const addDatabaseConnection = async (e: Event) => {
    e.preventDefault();
    errorMsg = "";
    try {
      const newDatabaseConnection = await repo(DatabaseConnectionTree).insert(databaseConnection);
      if (!liveQuery) {
          databaseConnections.unshift(newDatabaseConnection);
      }
        databaseConnection = repo(DatabaseConnectionTree).create();
    } catch (error) {
      errorMsg = error instanceof EntityError ? error.message : "Unknown error";
    }
  };

  const deleteDatabaseConnection = async (databaseConnection) => {
    await repo(DatabaseConnectionTree).delete(databaseConnection);
    if (!liveQuery) {
        databaseConnections = databaseConnections.filter((c) => c.id !== databaseConnection.id);
    }
  };
</script>
  <main>
    {#if errorMsg}
      <div class="message error">
        <p>{errorMsg}</p>
      </div>
    {/if}
    <form onsubmit={addDatabaseConnection}>
      <input
        bind:value={databaseConnection.text}
        placeholder="Connection name"
        type="text"
      />
        <input
                bind:value={databaseConnection.database_connection_string}
                placeholder="Connection string"
                type="text"
        />
      <button type="submit">
        <img src="plus.svg" alt="Add" />
      </button>
    </form>
    {#each databaseConnections as databaseConnection, i}

        <input
          id={databaseConnection.id}
          type="text"
        />
        <span>
          <label for={databaseConnection.id}>{databaseConnection.text}</label>
        </span>
        <button onclick={() => deleteDatabaseConnection(databaseConnection)}>
          <img src="trash.svg" alt="Delete" />
        </button>
    {/each}
  </main>
