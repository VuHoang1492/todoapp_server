import pool from '../config/database_config'



const getTaskByUserId = (userId, page, nameFilter, statusFilter) => {

  const index = (page - 1) * 5

  let queryStr = `SELECT * FROM tasks WHERE tasks.id IN  (SELECT id FROM tasks WHERE UserId = '${userId}' `
  if (statusFilter != -1) {
    queryStr += `AND status = ${statusFilter} `
  }
  if (nameFilter)
    queryStr += `AND title LIKE '%${nameFilter}%'`
  queryStr += ` ) LIMIT ${index},5;`

  return new Promise((res, rej) => {
    pool.query(queryStr, function (err, results, fields) {
      if (err) {
        rej(err)
      }
      res(results)
    }
    );
  })
}

const addTask = (data) => {
  return new Promise((res, rej) => {
    pool.query(
      'INSERT INTO tasks (id,title,description,userId,createdAt) VALUES (?,?,?,?,CURTIME())',
      Object.values(data),
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

const getTaskById = (taskId) => {
  return new Promise((res, rej) => {
    pool.query(
      'SELECT * FROM `tasks` WHERE `id` = ? ', [taskId],
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

const updateTask = (data) => {
  return new Promise((res, rej) => {
    pool.query(
      `UPDATE tasks
      SET title = ?, description = ?, updateAt = CURTIME()
      WHERE id = ?; `,
      Object.values(data),
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

const deleteTask = (taskId) => {
  return new Promise((res, rej) => {
    pool.query(
      'DELETE FROM `tasks` WHERE `ID` = ?', [taskId],
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

const finishTask = (taskId) => {
  return new Promise((res, rej) => {
    pool.query(
      `UPDATE tasks
      SET status = true
      WHERE id = ?; `,
      [taskId],
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        console.log(results);
        res(results)
      }
    );
  })
}


module.exports = {
  getTaskByUserId,
  getTaskById,
  updateTask,
  deleteTask,
  addTask,
  finishTask
}