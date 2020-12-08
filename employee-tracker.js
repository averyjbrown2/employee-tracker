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
          "Add departments, roles, employees",
          "View departments, roles, employees",
          "Update employee roles",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add departments, roles, employees":
          artistSearch();
          break;
  
        case "View departments, roles, employees":
          multiSearch();
          break;
  
        case "Update employee roles":
          rangeSearch();
          break;

        case "Exit":
          connection.end();
          break;
        }
      });
  }