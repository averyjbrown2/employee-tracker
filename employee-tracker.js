//requirements to allow app to run
var mysql = require("mysql");
var inquirer = require("inquirer");
var util = require('util');

//creates connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_trackerDB"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

//went over with instructor
//makes connection available to promisify
const queryAsync = util.promisify(connection.query).bind(connection)

//initial question choices prompted to user
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "Exit application"
      ]
    })
    //then statement that sets up switch cases for when user chooses item in prompt
    .then(function (answer) {
      switch (answer.action) {
        //case option for when user chooses "Add department", app will run addDepartments function
        case "Add department":
          addDepartments();
          break;

        //case option for when user chooses "Add role", app will run addRoles function
        case "Add role":
          addRoles();
          break;

        //case option for when user chooses "Add employee", app will run addEmployees function
        case "Add employee":
          addEmployees();
          break;

        //case option for when user chooses "View departments", app will run viewDepartments function
        case "View departments":
          viewDepartments();
          break;

        //case option for when user chooses "View role", app will run viewRoles function
        case "View roles":
          viewRoles();
          break;

        //case option for when user chooses "View Employees", app will run viewEmployees function
        case "View employees":
          viewEmployees();
          break;

        //case option for when user chooses "Update emplyee roles", app will run updateRole function
        case "Update employee roles":
          updateRole();
          break;
        //case option for when user chooses "Exit application", app will run exitApp function
        case "Exit application":
          exitApp();
          break;
        //For every other instance, connection will end
        default:
          connection.end();
          break;
      }
    });
}

//Function called by switch case that allows user to enter dept info
function addDepartments() {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "What department would you like to add?"
    })
    .then(function (answer) {
      var query = "INSERT INTO department SET ?";
      connection.query(query, answer, function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " departments added")
        runSearch();
      });
    });
}
//Function called by switch case that allows user to enter role info
function addRoles() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What role would you like to add?"
      },
      {
        name: "salary",
        type: "input",
        message: "What salary would you like to add to this role?"
      },
      {
        name: "department_id",
        type: "input",
        message: "What department ID would you like to add to this role?"
      }
    ])//selects role table and inserts info provided by user answers to prompts
    .then(function (answer) {
      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, answer.salary, answer.department_id],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role added");
          runSearch();
        });
    });
}
//adddEmployees function which prompts user to enter info about new employee
function addEmployees() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the first name of the employee you would you like to add?" //set functions up like this. need 7 functions
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the employee you would you like to add?" //set functions up like this. need 7 functions
      },
      {
        name: "role_id",
        type: "input",
        message: "What is the role ID of the employee you would you like to add?" //set functions up like this. need 7 functions
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the manager ID of the employee you would you like to add?" //set functions up like this. need 7 functions
      },
    ])
    //pushes info from user answers into employee table
    .then(function (answer) {
      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role added");
          runSearch();
        });
    });
}
//function that allows user to view department table
function viewDepartments() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}
//gathers info for all employees and makes them available 
function findAllEmployees() {
  return queryAsync("SELECT * FROM employee")
}

//viewRoles function allows user to view created roles
function viewRoles() {
  var query = "SELECT * FROM role;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}
//viewEmployees allows user to view created employee profiles
function viewEmployees() {
  var query = "SELECT * FROM employee;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

//allows user to update the role of an existing employee
const updateRole = async () => {    
  const employees = await findAllEmployees();
  const empList = employees.map(employee => { return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id } })
  connection.query("SELECT * from role;", (err, res) => {
    if (err) throw err;
    const roleList = res.map(({ title, id }) => { return { name: title, value: id } })
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which employee would you like to update?", 
          choices: empList
        },
        {
          name: "role_id",
          message: "What role would you like to assign to this employee?", 
          type: "list",
          choices: roleList
        },

      ])
      .then(function (answer) {
        var query = "UPDATE employee SET role_id = ? WHERE id = ?";
        connection.query(query, [answer.role_id, answer.id], function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role changed")
          runSearch();
        });
      });
  })
}

//exits application
function exitApp() {
  console.log("Exited application.");
  connection.end()
};