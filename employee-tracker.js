var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "top_songsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });

  function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [ 
          "Add department", //break down into individ questions in this format
          "Add role",
          "Add employee",
          "View departments",
          "View roles",
          "View employees",
          "Update employee roles",
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add department": //set up cases like this
          addDepartment();
          break;

        case "Add role": //set up cases like this
            addRole();
            break;

        case "Add employee": //set up cases like this
            addEmployee();
            break;
  
        case "View departments":
            viewDepartments();
          break;
  
        case "View role":
            viewRoles();
            break;
        case "View employees":
            viewEmployees();
            break;
        case "Update empoyee roles":
            updateEmployees();
            break;
        default:
            connection.end();
          break;
        }
      });
  }
  function addDepartment() {
    inquirer
      .prompt({
        name: "department",
        type: "input",
        message: "What department would you like to add?" //set functions up like this. need 7 functions
      })
      .then(function(answer) {
        var query = "INSERT INTO department (name) values ?";
        connection.query(query, { department: answer.department }, function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "departments added")
          runSearch();
        });
      });
  }
  function addRoles() {
    inquirer
      .prompt({
        name: "roles",
        type: "input",
        message: "What role would you like to add?" //set functions up like this. need 7 functions
      })
      .then(function(answer) {
        var query = "INSERT INTO role (department_id) values ?";
        connection.query(query, { role: answer.role }, function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "role added")
          runSearch();
        });
      });
  }
  function viewDepartment() { //add function to switch statement
        var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
          if (err) throw err;
          console.table(res);
          runSearch();
        });
  }

  function findAllEmployees(){
      return this.connection.query("SELECT * FROM employee") 
  }
function updateRole() { //add function to switch statement   
    const employees = await db.findAllEmployees();  
    inquirer
      .prompt({
        name: "employee-id",
        type: "input",
        message: "Which employee would you like to update?" //set functions up like this. needd 7 functions
      },
      {name: "employee-role",
      type: "list",
      message: "What role would you like to update to?", //set functions up like this. needd 7 functions
      choices: (employees)
    })
      .then(function(answer) { // needs work
        var query = "UPDATE employee SET ? WHERE ?";
        connection.query(query, { department: answer.department }, function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "departments added")
          runSearch();
        });
      });
}
