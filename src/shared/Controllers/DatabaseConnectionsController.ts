import { BackendMethod, remult } from 'remult'
import { DatabaseConnectionTree } from '../Entities/DatabaseConnectionTree'

export class DatabaseConnectionsController {
    @BackendMethod({ allowed: true })
    static async setAllCompleted(completed: boolean) {
        const taskRepo = remult.repo(DatabaseConnectionTree)

        for (const task of await taskRepo.find()) {
            await taskRepo.update(task.id, { completed })
        }
    }
}