const inquirer = require('inquirer');
const cTable = require('console.table');

const sequelize = require('./db/connection');

function questions() {
    inquirer.prompt({
        type: 'list',
        name: 'search',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles'
        ]
    })
}

questions();