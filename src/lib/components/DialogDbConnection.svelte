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

    // Expose a function to open the dialog and get a Promise
    export function openDialog(data) {
        open = true;
        if (data) {
           formData = data;
        }
        return new Promise((res, rej) => {
            promise = {resolve: res, reject: rej};
        });
    }

    // Handle successful form submission
    function handleSubmit() {
        promise.resolve(formData);
        open = false; // Close the dialog
    }

    // Handle cancellation or dialog close
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