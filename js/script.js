$(document).ready(function () {
    let currentId = 1;
    const selectedProducts = [];
    const exchangeRate = 4150;
    $("#exchangeRate").html("&nbsp;&nbsp;(" + exchangeRate + ")");
    function updateTotal() {
        let total = 0;
    
        selectedProducts.forEach(function (product) {
            total += product.total;
        });
    
        const taxRate = 0.1; // 10% tax rate
        const taxAmount = total * taxRate;
        const grandTotal = total + taxAmount;
    
        $("#totalAmount").text("$" + total.toFixed(2));
        $("#taxAmount").text("$" + taxAmount.toFixed(2));
        $("#grandTotal").text("$" + grandTotal.toFixed(2));
    
        // const exchangeRate = 4100;
    
        const totalInRiel = total * exchangeRate;
        const taxAmountInRiel = taxAmount * exchangeRate;
        const grandTotalInRiel = grandTotal * exchangeRate;
    
        $("#totalAmountRiel").text(totalInRiel.toLocaleString() + " Riel");
        $("#taxAmountRiel").text(taxAmountInRiel.toLocaleString() + " Riel");
        $("#grandTotalRiel").text(grandTotalInRiel.toLocaleString() + " Riel");
    
        const totalAmountRielText = total.toFixed(2) + " $" + " / " + totalInRiel.toLocaleString() + " Riel";
        const taxAmountRiel = taxAmount.toFixed(2) + " $" + " / " + taxAmountInRiel.toLocaleString() + " Riel";
        const grandTotalText = grandTotal.toFixed(2) + " $" + " / " + grandTotalInRiel.toLocaleString() + " Riel";
    
        $("#totalAmount").text(totalAmountRielText);
        $("#taxAmount").text(taxAmountRiel);
        $("#grandTotal").text(grandTotalText);
    }
    

    updateTotal();

    $("input[name='currency']").on("change", function () {
        const selectedCurrency = $(this).val();
        
        if (selectedCurrency === "riel") {
            // Set the input step to 1, indicating 1 Riel per step.
            $("#paymentReceived").attr("step", "100");
        } else {
            // Set the input step back to 0.01 for dollars.
            $("#paymentReceived").attr("step", "1");
        }
    });

    // Event listener for "Payment Received" input
    $("#paymentReceived").on("input", function () {
        ChangeReturned();
    });

    // Function to calculate change and display it in both Dollars and Riel
    function ChangeReturned() {
        const selectedCurrency = $("input[name='currency']:checked").val();
        const paymentReceived = parseFloat($("#paymentReceived").val()) || 0;
        const grandTotal = parseFloat($("#grandTotal").text().replace("$", ""));
        
        if (selectedCurrency === "riel") {
            const paymentInDollars = paymentReceived / exchangeRate;
            const changeInDollars = paymentInDollars - grandTotal;
            const changeInRiel = changeInDollars * exchangeRate;
            $("#changeReturned").text(changeInDollars.toFixed(2) + " $" + " / " + changeInRiel.toLocaleString() + " Riel");
        } else {
            // Calculate change in Dollars
            const changeReturned = paymentReceived - grandTotal;
            const changeInRiel = changeReturned * exchangeRate;
            $("#changeReturned").text(changeReturned.toFixed(2) + " $" + " / " + changeInRiel.toLocaleString() + " Riel");
        }
    }

    // Event listener for "Order" button click
    $(".order-button").on("click", function () {
        const productName = $(this).data("product");
        const productPrice = parseFloat($(this).data("price"));

        const existingProduct = selectedProducts.find(product => product.name === productName);

        if (existingProduct) {
            alert("This product is already in your order.");
        } else {
            const productId = currentId++;
            const productQuantity = 1;
            const productTotal = productPrice * productQuantity;

            selectedProducts.push({
                id: productId,
                name: productName,
                quantity: productQuantity,
                price: productPrice,
                total: productTotal,
            });

            addProducts(selectedProducts);
            updateTotal();
        }
    });

    // Function to add products to the table
    function addProducts(products) {
        // Clear the table body
        $("#selectedProducts").empty();

        products.forEach(function (product) {
            const newRow = $("<tr>");
            newRow.append($("<td>").text(product.id));
            newRow.append($("<td>").text(product.name));
            newRow.append($("<td>").html(`
                <button class="btn btn-sm btn-decrement" data-id="${product.id}"><</button>
                <span>${product.quantity}</span>
                <button class="btn btn-sm btn-increment" data-id="${product.id}">></button>
            `));
            newRow.append($("<td>").text("$" + product.price.toFixed(2)));
            newRow.append($("<td>").text("$" + product.total.toFixed(2)));
            newRow.append($('<td><button class="btn btn-danger btn-remove">remove</button></td>'));

            $("#selectedProducts").append(newRow);
            const rowCount = $("#selectedProducts tr").length;
            console.log(rowCount);
            $("#items").html(rowCount + " itmes ");
                     
        });
        // Event listeners for increment, decrement, and remove buttons
        $(".btn-increment").on("click", function () {
            const idToUpdate = $(this).data("id");
            const productToUpdate = selectedProducts.find(product => product.id === idToUpdate);

            if (productToUpdate) {
                productToUpdate.quantity++;
                productToUpdate.total = productToUpdate.quantity * productToUpdate.price;
                addProducts(selectedProducts);
                updateTotal();
            }
        });

        $(".btn-decrement").on("click", function () {
            const idToUpdate = $(this).data("id");
            const productToUpdate = selectedProducts.find(product => product.id === idToUpdate);

            if (productToUpdate && productToUpdate.quantity > 1) {
                productToUpdate.quantity--;
                productToUpdate.total = productToUpdate.quantity * productToUpdate.price;
                addProducts(selectedProducts);
                updateTotal();
            }
        });

        $(".btn-remove").on("click", function () {
            const row = $(this).closest("tr");
            const idToRemove = parseInt(row.find("td:first-child").text());

            const indexToRemove = selectedProducts.findIndex(function (product) {
                return product.id === idToRemove;
            });

            if (indexToRemove !== -1) {
                selectedProducts.splice(indexToRemove, 1);
                addProducts(selectedProducts);
                updateTotal();
            }
        });
    }

    $(document).on("keydown", function ( event ){
        if (event.key === "Enter")
        location.reload();
    });
});
