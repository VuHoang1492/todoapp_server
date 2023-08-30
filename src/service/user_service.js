import pool from '../config/database_config'



const getUserByUsername = (username) => {
  return new Promise((res, rej) => {
    pool.query(
      'SELECT * FROM `users` WHERE `username` = ? ', [username],
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

const handleRegister = (user) => {
  return new Promise((res, rej) => {
    pool.query(
      'INSERT INTO users (id,username, PASSWORD,createdAt) VALUES (?,?,?,CURTIME())', Object.values(user),
      function (err, results, fields) {
        if (err) {
          rej(err)
        }
        res(results)
      }
    );
  })
}

module.exports = {
  handleRegister,
  getUserByUsername
}