var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Zxcvbnm24!",
    database: "bamazon_db",
    port: 3306
});

connection.connect(function (error) {
    if (error) throw error;
    console.log(`Welcome! You are connected with user id ${connection.threadId}`)
    shopping();
 });

var display = function() {
    connection.query("SELECT * FROM products", function(error,res){
        if(error) throw error;
        console.log("-----------------------");
        console.log("  Welcome to Bamazon   ");
        console.log("-----------------------");
        console.log("");
        console.log("Find Your Product Below");
        console.log("");
        console.table(res)
    });
    
    console.log("");
};

var shopping = function(){
    inquirer.prompt({
        name: "productToBuy",
        type: "input",
        message: "Please enter the Product Id of the item you wish to purchase!"
    }).then(function(answer1){
        
        var selection = answer1.productToBuy;
        connection.query("SELECT * FROM products WHERE Id=?", selection, function(error, res){
            if (error) 
            throw error;
            if(res.length ===0){
                console.log("That Product doesn't exist, Please enter a Product Id from the list above")

                shopping()
            } else {
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many items would you like to purchase?"
                }).then (function(answer2){
                    var quantity = answer2.quantity;
                    if(quantity > res[0].stock_quantity){
                        console.log("Our Apologies we only have " + res[0].stock_quantity + " item of the product selected")

                        shopping();
                    }else{
                        console.log("");
                        console.log(res[0].products_name + " purchased");
                        console.log(quantity + " qty @ $" + res[0].price);

                        var newQuantity = res[0].stock_quantity - quantity;
                        connection.query(
                            "UPDATE products SET stock_quantity = " + newQuantity + " WHERE Id = " + res[0].id, function(error, resUpdated){
                                if(error)
                                throw error;
                                console.log("");
                                console.log("Your Order has been Processed");
                                console.log("Thank you for Shopping with us...!");
                                console.log("");
                                connection.end();
                            }
                        );
                    }
                    
                });
                
                // console.log("all is ok");

            }

        });
    });
};






display();

