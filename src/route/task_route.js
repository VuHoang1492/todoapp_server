import { Router } from "express";
import taskControl from '../controller/task_control'

const route = Router()

route.get('/getTaskByUserId', taskControl.getTaskByUserId)
route.get('/getTaskById', taskControl.getTaskById)
route.post('/addTask', taskControl.addTask)
route.post('/finish', taskControl.finishTask)
route.delete('/delete', taskControl.deleteTask)
route.post('/update', taskControl.updateTask)



module.exports = route