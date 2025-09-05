<script>
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger
    } from "$lib/components/ui/dialog";
    import {Button} from "$lib/components/ui/button";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea";

    let formData = {
        name: "",
        database_connection: "",
    }

    let promise = {
        resolve: function (value) {
        },
        reject: function (reason) {
        }
    };
    let open = false;


    /**
     * Opens a dialog, optionally initializing it with provided data.
     *
     * @param {Object} [data] - Optional data to prefill the form within the dialog.
     * @return {Promise} A promise that resolves or rejects based on dialog interaction.
     */
    export function openDialog(data) {
        open = true;
        if (data) {
            formData = data;
        }
        return new Promise((res, rej) => {
            promise = {resolve: res, reject: rej};
        });
    }


    /**
     * Handles form submission by resolving the formData and closing the dialog.
     *
     * @return {void} This method does not return a value.
     */
    function handleSubmit() {
        promise.resolve(formData);
        open = false; // Close the dialog
    }


    /**
     * Handles the cancellation of an operation, typically triggered by closing a dialog or modal.
     *
     * @param {Event} event - The event object associated with the cancellation action.
     * @return {void} This function does not return any value.
     */
    function handleCancel(event) {
        promise.reject("Dialog closed by user");
        open = false;
    }
</script>

<Dialog bind:open>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Database Connection</DialogTitle>
            <!--            <DialogDescription>-->
            <!--                Enter your database connection details below.-->
            <!--            </DialogDescription>-->
        </DialogHeader>

        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <Label for="name">Name</Label>
                <Input
                        type="text"
                        id="name"
                        bind:value={formData.name}
                        class="mt-2"
                        required
                        placeholder="Enter a name for your connection"
                />
            </div>
            <div class="mt-3">
                <Label for="databaseConnection">Connection String</Label>
                <Textarea
                        id="databaseConnection"
                        bind:value={formData.database_connection}
                        class="mt-2"
                        required
                        placeholder="Enter your connection string"
                />
            </div>
            <DialogFooter class="gap-2 sm:space-x-0 mt-4">
                <Button onclick={handleCancel} variant="outline">
                    Cancel
                </Button>
                <Button type="submit">Submit</Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>