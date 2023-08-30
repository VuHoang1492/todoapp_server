const StatusCode = {
    Success: 1, //Successful and have data
    Fail: 0, //Successful and no data
    BadReq: -1, // Bad Request
    ServerErr: -2, // Error From Server
    Unauthorized: -3 // Unauthorized
}

module.exports = StatusCode