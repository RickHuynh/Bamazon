var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Soithan1605187',
    database: 'bamazon',
    insecureAuth: true
});

connection.connect(function (err) {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt([{
            name: "choice",
            type: "rawlist",
            choices: function (value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            },
            message: "What product do you want to buy?"
        }, {
            name: "value",
            type: "input",
            message: "How many do you want?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE?";
            connection.query(query, { product_name: answer.choice }, function (err, result) {
                var stock = result[0].stock_quantity-answer.value;
                if(stock < 0){
                    console.log("Insufficient quantity!");
                    connection.end();
                    return;
                }
                var query = "UPDATE products SET ? WHERE ?"
                connection.query(query,[{stock_quantity: stock},{product_name:answer.choice}],function(err,res){
                    console.log("Item processed succesfully.");
                    connection.end();
                })
            })
        });
    })
});