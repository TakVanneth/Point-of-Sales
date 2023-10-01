$(document).ready(function () {
    const selectedProducts = [];
    const exchangeRate = 4150;

    // Set the exchange rate
    $("#exchangeRate").html("&nbsp;&nbsp;(" + exchangeRate + ")");

    // Function to update the total and display
    function updateTotal() {
        let total = 0;

        // Calculate the total based on selected products by array all products
        selectedProducts.forEach(function (product) {
            total += product.total;
        });

        const taxRate = 0.1; // 10% tax rate
        const taxAmount = total * taxRate;
        const grandTotal = total + taxAmount;

        // Display the total, tax amount, and grand total in dollars
        $("#totalAmount").text("$" + total.toFixed(2));
        $("#taxAmount").text("$" + taxAmount.toFixed(2));
        $("#grandTotal").text("$" + grandTotal.toFixed(2));

        // Calculate amounts in riel based on the exchange rate
        const totalInRiel = total * exchangeRate;
        const taxAmountInRiel = taxAmount * exchangeRate;
        const grandTotalInRiel = grandTotal * exchangeRate;

        // Display amounts in riel
        $("#totalAmountRiel").text(totalInRiel.toLocaleString() + " Riel");
        $("#taxAmountRiel").text(taxAmountInRiel.toLocaleString() + " Riel");
        $("#grandTotalRiel").text(grandTotalInRiel.toLocaleString() + " Riel");

        // Display the total amounts in both Dollars and Riel with formatting
        const totalAmountRielText = total.toFixed(2) + " $" + " / " + totalInRiel.toLocaleString() + " Riel";
        const taxAmountRielText = taxAmount.toFixed(2) + " $" + " / " + taxAmountInRiel.toLocaleString() + " Riel";
        const grandTotalText = grandTotal.toFixed(2) + " $" + " / " + grandTotalInRiel.toLocaleString() + " Riel";

        $("#totalAmount").text(totalAmountRielText);
        $("#taxAmount").text(taxAmountRielText);
        $("#grandTotal").text(grandTotalText);
    }

    // Call the updateTotal function to initialize the total amounts
    updateTotal();

    // Event listener for currency change (Dollar / Riel)
    $("input[name='currency']").on("change", function () {
        const selectedCurrency = $(this).val();

        if (selectedCurrency === "riel") {
            // Set the input step to 100 for Riel
            $("#paymentReceived").attr("step", "100");
        } else {
            // Set the input step to 1 for Dollar
            $("#paymentReceived").attr("step", "1");
        }
    });

    // Event listener for "Payment Received" input
    $("#paymentReceived").on("input", function () {
        // Call the ChangeReturned function to calculate and display change
        ChangeReturned();
    });

    // Function to calculate change and display it in both Dollars and Riel
    function ChangeReturned() {
        const selectedCurrency = $("input[name='currency']:checked").val();
        const paymentReceived = parseFloat($("#paymentReceived").val()) || 0;
        const grandTotal = parseFloat($("#grandTotal").text().replace("$", ""));

        if (selectedCurrency === "riel") {
            // Calculate change in Dollars and Riel
            const paymentInDollars = paymentReceived / exchangeRate;
            const changeInDollars = paymentInDollars - grandTotal;
            const changeInRiel = changeInDollars * exchangeRate;

            // Display the change in both Dollars and Riel
            $("#changeReturned").text(changeInDollars.toFixed(2) + " $" + " / " + changeInRiel.toLocaleString() + " Riel");
        } else {
            // Calculate change in Dollars
            const changeReturned = paymentReceived - grandTotal;
            const changeInRiel = changeReturned * exchangeRate;

            // Display the change in both Dollars and Riel
            $("#changeReturned").text(changeReturned.toFixed(2) + " $" + " / " + changeInRiel.toLocaleString() + " Riel");
        }
    }

    // Function to add products to the table
    function addProducts(products) {
        // Clear the table body
        $("#selectedProducts").empty();

        // Loop through selected products and add them to the table
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

            // Append the new row to the table
            $("#selectedProducts").append(newRow);

            // Count the number of rows in the table and display it
            const rowCount = $("#selectedProducts tr").length;
            $("#items").html(rowCount + " items ");
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
                // Remove the product from the selectedProducts array using splice
                selectedProducts.splice(indexToRemove, 1);

                // Update the displayed products and total
                addProducts(selectedProducts);
                updateTotal();
            }
        });
    }

    // Event listener for the Enter key to reload or refresh the page
    $(document).on("keydown", function (event) {
        if (event.key === "Enter") {
            location.reload();
        }
    });

    // Function to create and populate an HTML card
    function createCard(productData) {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'col-sm-4', 'product-card');
        card.innerHTML = `
            <div class="card">
                <img src="${productData.imageurl}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${productData.name}</h5>
                    <p class="card-text">Price: ${productData.price}$</p>
                    <button type="button" class="btn btn-primary order-button" data-product="${productData.name}" data-price="${productData.price}" data-id="${productData.id}">Order</button>
                </div>
            </div>
        `;

            // Add an event listener to the "Order" button
        const orderButton = card.querySelector('.order-button');
        orderButton.addEventListener('click', function () {
        const productName = this.getAttribute('data-product');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        const productId = parseInt(this.getAttribute('data-id'));
        
        // Check if the product is already in the order by productId
        const existingProduct = selectedProducts.find(product => product.id === productId);

        if (existingProduct) {
            alert("This product is already in your order.");
        } else {
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

    return card;
    }

    // Function to populate the product section with data
    function populateProductSection(data) {
        const productContainer = document.getElementById('productContainer');

        data.forEach((productData) => {
            const card = createCard(productData);
            productContainer.appendChild(card);
        });
    }

    // Fetch data from the API and populate the product section
    function fetchDataFromAPI() {
        return fetch('http://127.0.0.1:8000/products')
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    fetchDataFromAPI()
        .then((data) => {
            populateProductSection(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
