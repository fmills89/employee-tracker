const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require('./db/connection');
const { getDepartments, getEmployees, getRoles } = require('./db/query');

function questions() {
    inquirer.prompt({
        type: 'list',
        name: 'search',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Exit'
        ]
    }).then(function(answer) {
        switch(answer.search) {
            
        case "View All Employees":
            viewAllEmployees();
            break;
                
        case "View All Roles":
            viewAllRoles();
            break;
        
        case "Add Employee":
            addEmployee();
            break;
                        
        case "Update Employee Role":
            updateEmployeeRole();
            break;
                            
        case "Add Role":
            addRole();
            break;

        case "View All Departments":
            viewAllDepartments();
            break;
                            
        case "Add Department":
            addDepartment();
            break;
        
        case "Exit":
            console.log('Good-Bye');
            db.end();
            break;
        }
    })
};

viewAllDepartments = () => {
    const query = db.query('SELECT * FROM departments', (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Departments in database');
            console.table(res);
            questions();
        };
    });
}

viewAllEmployees = () => {
    const query = db.query("SELECT e1.id, e1.first_name, e1.last_name, roles.title as role, departments.name AS department, roles.salary, Concat(e2.first_name, ' ', e2.last_name) AS manager FROM employees e1 LEFT JOIN roles ON e1.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees e2 ON e2.id = e1.manager_id", (err, res) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Employees in database');
            console.table(res);
            questions();
        };
    });
}

viewAllRoles = () => {
    const query = db.query("SELECT roles.id, roles.title, roles.salary, departments.name as department FROM roles JOIN departments ON roles.department_id = departments.id", (err, res) => {
        if(err){
            console.log(err);
        } else {
            console.log('Roles in database.');
            console.table(res);
            questions();
        }
    })
}

function addEmployee() {
    getEmployees()
    .then((employee) => {
        let employeeNamesArr = []
        let employeesArray = employee[0]
        for (var i = 0; i < employeesArray.length; i++) {
            let employee = employeesArray[i].first_name + '' + employeesArray[i].last_name
            employeeNamesArr.push(employee)
        }
        employeeNamesArr.unshift('--');
        getRoles()
        .then((roles) => {
            let roleTitlesArr = []
            let rolesArray = roles[0]
            for (var i = 0; i < rolesArray.length; i++) {
                let role = rolesArray[i].title
                roleTitlesArr.push(role)
            }
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter employee's first name: "
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter employee's last name: "
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Enter employee's ID: ",
                    choices: roleTitlesArr
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Choose employee's manager: ",
                    choices: employeeNamesArr
                }
            ])
            .then((input) => {
                let roleId
                for(let i = 0; i < rolesArray.length; i++) {
                    if(input.role === rolesArray[i].title) {
                        roleId = rolesArray[i].id;
                        break
                    }
                }
                let managerId
                for (i = 0; i < employeesArray.length; i++) {
                    if(input.manager === employeesArray[i].first_name + '' + employeesArray[i].last_name) {
                        managerId = employeesArray[i].id;
                        break
                    }
                }
                console.log('Adding new employee...');
                const query = db.query('INSERT INTO employees SET ?',
                    {
                        first_name: input.firstName,
                        last_name: input.lastName,
                        role_id: roleId,
                        manager_Id: managerId
                    },
                    function(err, res) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('Employee added..');
                            questions();
                        }
                    }
                )
            });
        });
    });
};

function updateEmployeeRole() {
    getEmployees()
    .then((employee) => {
        let employeeNamesArr = []
        let employeesArray = employee[0]
        for (var i = 0; i < employeesArray.length; i++) {
            let employee = employeesArray[i].first_name + '' + employeesArray[i].last_name
            employeeNamesArr.push(employee)
        }
        employeeNamesArr.unshift('--');
        getRoles()
        .then((roles) => {
            let roleTitlesArr = []
            let rolesArray = roles[0]
            for (var i = 0; i < rolesArray.length; i++) {
                let role = rolesArray[i].title
                roleTitlesArr.push(role)
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Please update employee's role: ",
                    choices: employeeNamesArr
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Please update employee's role",
                    choices: roleTitlesArr
                }
            ])
            .then((input) => {
                let roleId
                for(let i = 0; i < rolesArray.length; i++) {
                    if(input.role === rolesArray[i].title) {
                        roleId = rolesArray[i].id;
                        break
                    }
                }
                let employeeId
                for (i = 0; i < employeesArray.length; i++) {
                    if(input.employee === employeesArray[i].first_name + '' + employeesArray[i].last_name) {
                        employeeId = employeesArray[i].id;
                        break
                    }
                }
                console.log('Updating employee role...');
                db.query('UPDATE employees SET ? WHERE ?', [
                    {
                        role_id: roleId
                    },
                    {
                        id: employeeId
                    }
                ],
                ((err, res) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Role updated..');
                        questions();
                    }
                })
                )
            });
        });
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'Please enter name of new department: '
    })
    .then((input) => {
        console.log('Creating new department..');
        const query = db.query('INSERT INTO departments SET ?',
        {
            name: input.department
        },
        ((err, res) => {
            if(err) {
                console.log(err);
            } else {
                console.log('Department created...');
                questions();
            }
        }));
    });
};

function addRole() {
    getDepartments()
    .then((rows) => {
        let departmentNamesArr = []
        let departmentArray = rows[0]
        for (var i = 0; i < departmentArray.length; i++) {
            let department = departmentArray[i].name;
            departmentNamesArr.push(department)
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Please enter new role title: '
            },
            {
                type: 'nnumber',
                name: 'salary',
                message: "Enter the role's salary"
            },
            {
                type: 'list',
                name: 'department',
                message: 'Enter the department of the role: ',
                choices: departmentNamesArr
            }
        ])
        .then((response) => {
            let departmentId
            for (let i = 0; i < departmentArray.length; i++) {
                    if(response.department === departmentArray[i].name) {
                    departmentId = departmentArray[i].id;
                    break
                }
            }
            db.query('INSERT INTO roles SET ?',
                {
                title: response.roleTitle,
                salary: response.salary,
                department_id: departmentId
                },
                ((err, res) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(response.roleTitle + ' added to roles.');
                        questions();
                    }
                })
            );
        });
    });
};


questions();