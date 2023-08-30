import { v4 as uuidv4 } from 'uuid'
import Message from '../contanst/message'
import StatusCode from '../contanst/status_code'
import taskService from '../service/task_service'
import userService from '../service/user_service'

const getTaskByUserId = async (req, res) => {
    try {
        const userId = req.userId
        const username = req.username
        const page = req.query.page
        const nameFilter = req.query.name
        const statusFilter = req.query.status
        console.log(req.query);

        if (!userId || !page || nameFilter === undefined || statusFilter === undefined) {
            return res.status(400).send(
                {
                    Mes: Message.MissingData,
                    Code: StatusCode.BadReq,
                    Data: []
                }
            )
        }
        const tasks = await taskService.getTaskByUserId(userId, page, nameFilter, statusFilter)
        const user = await userService.getUserByUsername(username)
        return res.status(200).send(
            {
                Mes: Message.Success,
                Code: StatusCode.Success,
                Data: {
                    Tasks: tasks,
                    cursor: tasks.length ? tasks[tasks.length - 1].id : null,
                    User: user
                }
            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            Mes: Message.ServerErr,
            Code: StatusCode.ServerErr,
            Data: []
        })
    }

}

const updateTask = async (req, res) => {
    try {
        const userId = req.userId
        const taskId = req.body.taskId
        const title = req.body.title
        const des = req.body.description

        if (!taskId || !title || !des) {
            return res.status(400).send(
                {
                    Mes: Message.MissingData,
                    Code: StatusCode.BadReq,
                    Data: []
                }
            )
        }

        const task = await taskService.getTaskById(taskId)
        //Nếu task không thuộc user
        if (task[0].userId !== userId)
            return (res.status(401).send({
                Mes: Message.PermissionErr,
                Code: StatusCode.Fail,
                Data: []
            }))


        await taskService.updateTask({ title, des, taskId })
        return res.status(200).send({
            Mes: Message.Success,
            code: StatusCode.Success,
            Data: []
        })



    } catch (error) {
        console.log(error);
        return res.status(500).send({
            Mes: Message.ServerErr,
            Code: StatusCode.ServerErr,
            Data: []
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.body.taskId
        const userId = req.userId
        if (!taskId) {
            return res.status(400).send(
                {
                    Mes: Message.MissingData,
                    Code: StatusCode.BadReq,
                    Data: []
                }
            )
        }

        const task = await taskService.getTaskById(taskId)
        if (task.length === 0) {
            return (res.status(401).send({
                Mes: Message.BadReq,
                Code: StatusCode.Fail,
                Data: []
            }))
        }
        //Nếu task không thuộc user
        if (task[0].userId !== userId)
            return (res.status(401).send({
                Mes: Message.PermissionErr,
                Code: StatusCode.Fail,
                Data: []
            }))

        await taskService.deleteTask(taskId)
        return res.status(200).send({
            Mes: Message.Success,
            code: StatusCode.Success,
            Data: []
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            Mes: Message.ServerErr,
            Code: StatusCode.ServerErr,
            Data: []
        })
    }
}

const addTask = (req, res) => {

    const Title = req.body.title
    const Des = req.body.description
    const UserId = req.userId

    //thiếu dữ liệu
    if (!UserId || !Title || !Des) {
        return res.status(400).send(
            {
                Mes: Message.MissingData,
                Code: StatusCode.BadReq,
                Data: []
            }
        )
    }
    const id = uuidv4()
    taskService.addTask({ id, Title, Des, UserId })
        .then((data) => {
            return res.status(200).send(
                {
                    Mes: Message.Success,
                    Code: StatusCode.Success,
                    Data: []
                }
            )
        }).catch((err) => {
            console.log(err);
            return res.status(500).send({
                Mes: Message.ServerErr,
                Code: StatusCode.ServerErr,
                Data: []
            })
        })
}


const getTaskById = async (req, res) => {
    try {
        const taskId = req.query.taskId
        const userId = req.userId
        //Thiếu data
        if (!taskId) {
            return res.status(400).send(
                {
                    Mes: Message.MissingData,
                    Code: StatusCode.BadReq,
                    Data: []
                }
            )
        }

        const task = await taskService.getTaskById(taskId)
        //Nếu task không thuộc user
        if (task[0].userId !== userId)
            return (res.status(401).send({
                Mes: Message.PermissionErr,
                Code: StatusCode.Fail,
                Data: []
            }))

        return res.status(200).send({
            Mes: Message.Success,
            Code: StatusCode.Success,
            Data: task
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Mes: Message.ServerErr,
            Code: StatusCode.ServerErr,
            Data: []
        })
    }

}

const finishTask = (req, res) => {

    const taskId = req.body.taskId
    const userId = req.userId
    if (!taskId) {
        return res.status(400).send(
            {
                Mes: Message.MissingData,
                Code: StatusCode.BadReq,
                Data: []
            }
        )
    }
    taskService.getTaskById(taskId).then(task => {
        //Nếu task không thuộc user
        if (task[0].userId !== userId)
            return (res.status(401).send({
                Mes: Message.PermissionErr,
                Code: StatusCode.Fail,
                Data: []
            }))
    }).then(() => {
        taskService.finishTask(taskId)
        return res.status(200).send({
            Mes: Message.Success,
            code: StatusCode.Success,
            Data: []
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).send({
            Mes: Message.ServerErr,
            Code: StatusCode.ServerErr,
            Data: []
        })
    })





}


module.exports = {
    getTaskByUserId,
    updateTask,
    addTask,
    deleteTask,
    getTaskById,
    finishTask
}