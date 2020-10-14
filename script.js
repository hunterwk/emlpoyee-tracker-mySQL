const connection = require("./db/connection");
const inquirer = require("inquirer");

function mainPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What do you want to do",
            choices: [
                "View all employees",
                "Add an Employee",
                "View all departments",
                "Add a department",
                "View all roles",
                "Add a role",
                "Quit"
            ]
        }
    ]).then(res => {
        console.log(res.choice)
        if (res.choice === "View all employees") {
            viewAllEmployees();
        }
        else if (res.choice === "Add an Employee") {
            addEmployee();
        }
        else if (res.choice === "View all departments") {
            viewDepartments();
        }
        else if (res.choice === "Add a department") {
            addDepartment();
        }
        else if (res.choice === "View all roles") {
            viewRoles();
        }
        else if (res.choice === "Add a role") {
            addRole();
        }
    })
}

function viewAllEmployees() {
    connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee manager on manager.id = employee.manager_id
        `
    ).then(([rows]) => {
        console.table(rows)
        mainPrompt()
    })
}

function addEmployee() {
    connection.promise().query(`SELECT title, id FROM role`)
        .then(([rows]) => {
            const roleArray = rows.map(row => ({ name: row.title, value: row.id }))
            connection.promise().query(`SELECT first_name, last_name, id FROM employee`)
                .then(([rows]) => {
                    const managerArray = rows.map(row => ({ name: row.first_name + " " + row.last_name, value: row.id }))
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "first_name",
                            message: "What is the Employee's first name?",
                        },
                        {
                            type: "input",
                            name: "last_name",
                            message: "What is the Employee's last name?",
                        },
                        {
                            type: "list",
                            name: "role_id",
                            message: "What is the Employee's role?",
                            choices: roleArray
                        },
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who is this Employee's supervisor?",
                            choices: [...managerArray, { name: "None", value: null }]
                        }
                    ]).then(answer => {
                        connection.promise().query("INSERT INTO employee SET ?", answer)
                            .then(() => {
                                //console.table(row)
                                console.log(`Employee ${answer.first_name} ${answer.last_name} was added successfully.`)
                                mainPrompt()
                            })
                            .catch(err => console.log(err))
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

function viewDepartments() {
    connection.promise().query(`SELECT id, name FROM department`)
        .then(([rows]) => {
            console.table(rows)
            mainPrompt();
        })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you would like to add?",
        },
    ]).then(answer => {
        connection.promise().query("INSERT INTO department SET ?", answer)
            .then(() => {
                console.log(`${answer.name} was added successfully.`)
                mainPrompt()
            })
            .catch(err => console.log(err))
    })
}

function viewRoles() {
    connection.promise().query(`SELECT id, title, salary FROM role`)
        .then(([rows]) => {
            console.table(rows)
            mainPrompt();
        })
}
function addRole() {
    connection.promise().query(`SELECT id, name FROM department`)
        .then(([rows]) => {
            const roleArray = rows.map(row => ({ name: row.name, value: row.id }))
            inquirer.prompt([
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does this role belong to?",
                    choices: roleArray
                },
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the role you would like to add?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role you would like to add?",
                },
            ]).then(answer => {
                connection.promise().query("INSERT INTO role SET ?", answer)
                    .then(() => {
                        console.log(`${answer.title} was added successfully.`)
                        mainPrompt()
                    })
                    .catch(err => console.log(err))
            })
        })
    }

mainPrompt()