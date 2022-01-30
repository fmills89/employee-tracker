const db = require('./connection')

getDepartments = () => {
    return db.promise().query('SELECT * FROM departments')
};

getEmployees = () => {
    return db.promise().query('SELECT * FROM employees')
};

getRoles = () => {
    return db.promise().query('SELECT * FROM roles')
};

module.exports = {
    getDepartments,
    getEmployees,
    getRoles
}