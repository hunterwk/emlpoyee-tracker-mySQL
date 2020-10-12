const connection = require("./db/connection");
const inquirer = require("inquirer");

function mainPrompt(){
    inquirer.prompt([
        {
        type: "list",
        name: "choice",
        message: "What do you want to do",
        choices: [
            "View all employees",
            "Quit"
            ]
        }
    ]).then(res => {
        console.log(res.choice)
        if(res.choice === "View all employees"){
            viewAllEmployees()
        }
    })
}

function viewAllEmployees(){
    connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee manager on manager.id = employee.manager_id
        `
    ).then(([rows]) => {
        console.table(rows)
    }).then(() => mainPrompt())
}

mainPrompt()