document.addEventListener("DOMContentLoaded", function () {

    console.log("thashowbook Customer Frontend Loaded");


    /* =========================================================
       COMMON LOGIN FUNCTIONS
       ========================================================= */

    function isUserLoggedIn() {
        return localStorage.getItem("thashowbookLoggedIn") === "true";
    }


    function redirectToLogin() {
        window.location.href = "login.html";
    }


    function requireLogin(event) {

        if (!isUserLoggedIn()) {

            event.preventDefault();

            alert("Please login first.");

            redirectToLogin();

        }

    }


    /* =========================================================
       LOGIN STATE
       ========================================================= */

    const loginLinks =
        document.querySelectorAll(".login-link");


    loginLinks.forEach(function (link) {

        if (isUserLoggedIn()) {

            link.textContent = "Logged In";

        }

    });


    /* =========================================================
       PROTECTED LINKS
       ========================================================= */

    const protectedLinks =
        document.querySelectorAll(".protected-action");


    protectedLinks.forEach(function (link) {

        link.addEventListener("click", requireLogin);

    });


    /* =========================================================
       PROTECTED BUTTONS
       ========================================================= */

    const protectedButtons =
        document.querySelectorAll(".protected-button");


    protectedButtons.forEach(function (button) {

        button.addEventListener("click", requireLogin);

    });


    /* =========================================================
       MY BOOKINGS LINKS
       ========================================================= */

    const myBookingsLinks =
        document.querySelectorAll(
            'a[href="my-bookings.html"]'
        );


    myBookingsLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                if (!isUserLoggedIn()) {

                    event.preventDefault();

                    alert("Please login first.");

                    redirectToLogin();

                }

            }
        );

    });


    /* =========================================================
       MOVIE SEARCH
       ========================================================= */

    const searchInput =
        document.getElementById("movieSearch");

    const searchButton =
        document.getElementById("searchButton");

    const movieCards =
        document.querySelectorAll(".movie-card");


    function searchMovies() {

        if (!searchInput) {
            return;
        }


        const searchValue =
            searchInput.value.trim().toLowerCase();


        movieCards.forEach(function (card) {

            const movieName =
                card.querySelector("h3");


            if (!movieName) {
                return;
            }


            const name =
                movieName.textContent.toLowerCase();


            if (name.includes(searchValue)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchMovies
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchMovies();

                }

            }
        );

    }


    /* =========================================================
       MOVIE SELECTION
       ========================================================= */

    const movieSelection =
        document.querySelectorAll(
            ".movie-selection"
        );


    let selectedMovie =
        localStorage.getItem("selectedMovie") ||
        "AAGAAZ";


    movieSelection.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                movieSelection.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                selectedMovie =
                    button.getAttribute(
                        "data-movie"
                    );


                localStorage.setItem(
                    "selectedMovie",
                    selectedMovie
                );


                updateBookingMessage();

            }
        );

    });


    /* =========================================================
       DATE SELECTION
       ========================================================= */

    const dateCards =
        document.querySelectorAll(".date-card");


    let selectedDate =
        localStorage.getItem("selectedDate") ||
        "Today";


    dateCards.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                dateCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                selectedDate =
                    button.getAttribute(
                        "data-date"
                    );


                localStorage.setItem(
                    "selectedDate",
                    selectedDate
                );


                updateBookingMessage();

            }
        );

    });


    /* =========================================================
       SHOWTIME SELECTION
       ========================================================= */

    const showtimeCards =
        document.querySelectorAll(
            ".showtime-card"
        );


    let selectedTime =
        localStorage.getItem("selectedTime") ||
        "";


    showtimeCards.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                showtimeCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                selectedTime =
                    button.getAttribute(
                        "data-time"
                    );


                localStorage.setItem(
                    "selectedTime",
                    selectedTime
                );


                updateBookingMessage();

            }
        );

    });


    /* =========================================================
       BOOKING MESSAGE
       ========================================================= */

    const selectionMessage =
        document.getElementById(
            "selectionMessage"
        );


    const continueBookingButton =
        document.getElementById(
            "continueBookingButton"
        );


    function updateBookingMessage() {

        if (
            !selectionMessage ||
            !continueBookingButton
        ) {

            return;

        }


        if (
            !selectedMovie ||
            !selectedDate ||
            !selectedTime
        ) {

            selectionMessage.textContent =
                "Select a movie, date and showtime.";

            continueBookingButton.disabled =
                true;

            return;

        }


        selectionMessage.textContent =
            selectedMovie +
            " • " +
            selectedDate +
            " • " +
            selectedTime;


        continueBookingButton.disabled =
            false;

    }


    if (continueBookingButton) {

        updateBookingMessage();


        continueBookingButton.addEventListener(
            "click",
            function (event) {

                if (
                    !selectedMovie ||
                    !selectedDate ||
                    !selectedTime
                ) {

                    return;

                }


                if (!isUserLoggedIn()) {

                    event.preventDefault();

                    alert("Please login first.");

                    redirectToLogin();

                    return;

                }


                localStorage.setItem(
                    "selectedMovie",
                    selectedMovie
                );


                localStorage.setItem(
                    "selectedDate",
                    selectedDate
                );


                localStorage.setItem(
                    "selectedTime",
                    selectedTime
                );


                localStorage.setItem(
                    "selectedCinema",
                    "Thashow Grand Cinema"
                );


                window.location.href =
                    "seat-selection.html";

            }
        );

    }


    /* =========================================================
       SEAT PAGE
       ========================================================= */

    const seatLayout =
        document.getElementById(
            "seatLayout"
        );


    if (seatLayout) {

        const bookingMovie =
            document.getElementById(
                "bookingMovie"
            );


        const bookingCinema =
            document.getElementById(
                "bookingCinema"
            );


        const bookingDate =
            document.getElementById(
                "bookingDate"
            );


        const bookingTime =
            document.getElementById(
                "bookingTime"
            );


        if (bookingMovie) {

            bookingMovie.textContent =
                localStorage.getItem(
                    "selectedMovie"
                ) || "AAGAAZ";

        }


        if (bookingCinema) {

            bookingCinema.textContent =
                localStorage.getItem(
                    "selectedCinema"
                ) ||
                "Thashow Grand Cinema";

        }


        if (bookingDate) {

            bookingDate.textContent =
                localStorage.getItem(
                    "selectedDate"
                ) || "Today";

        }


        if (bookingTime) {

            bookingTime.textContent =
                localStorage.getItem(
                    "selectedTime"
                ) || "10:00 AM";

        }


        createSeats();

    }


    /* =========================================================
       HALL SELECTION
       ========================================================= */

    const hallSelectionCards =
        document.querySelectorAll(
            ".hall-selection-card"
        );


    let selectedHall =
        localStorage.getItem("selectedHall") ||
        "Hall 01";


    hallSelectionCards.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    hallSelectionCards.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedHall =
                        button.getAttribute(
                            "data-hall"
                        );


                    localStorage.setItem(
                        "selectedHall",
                        selectedHall
                    );


                    const seatSectionHeading =
                        document.querySelector(
                            ".seat-section-heading h2"
                        );


                    if (seatSectionHeading) {

                        seatSectionHeading.textContent =
                            selectedHall;

                    }


                    createSeats();

                }
            );

        }
    );


    /* =========================================================
       CREATE SEATS
       ========================================================= */

    function createSeats() {

        if (!seatLayout) {
            return;
        }


        seatLayout.innerHTML = "";


        const rows = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H"
        ];


        rows.forEach(function (row) {

            const rowContainer =
                document.createElement(
                    "div"
                );


            rowContainer.className =
                "seat-row";


            const rowLabel =
                document.createElement(
                    "span"
                );


            rowLabel.className =
                "seat-row-label";


            rowLabel.textContent =
                row;


            rowContainer.appendChild(
                rowLabel
            );


            for (
                let number = 1;
                number <= 10;
                number++
            ) {

                const seat =
                    document.createElement(
                        "button"
                    );


                seat.className =
                    "seat available";


                seat.type =
                    "button";


                seat.textContent =
                    number;


                seat.setAttribute(
                    "data-seat",
                    row + number
                );


                const bookedSeat =
                    (
                        row === "A" &&
                        number === 4
                    ) ||
                    (
                        row === "A" &&
                        number === 5
                    ) ||
                    (
                        row === "C" &&
                        number === 7
                    ) ||
                    (
                        row === "D" &&
                        number === 3
                    ) ||
                    (
                        row === "F" &&
                        number === 8
                    );


                if (bookedSeat) {

                    seat.classList.remove(
                        "available"
                    );


                    seat.classList.add(
                        "booked"
                    );


                    seat.disabled =
                        true;

                }


                seat.addEventListener(
                    "click",
                    function (event) {

                        if (
                            !isUserLoggedIn()
                        ) {

                            event.preventDefault();

                            alert(
                                "Please login first."
                            );

                            redirectToLogin();

                            return;

                        }


                        if (
                            seat.classList.contains(
                                "booked"
                            )
                        ) {

                            return;

                        }


                        seat.classList.toggle(
                            "selected"
                        );


                        updateSeatSummary();

                    }
                );


                rowContainer.appendChild(
                    seat
                );

            }


            seatLayout.appendChild(
                rowContainer
            );

        });


        updateSeatSummary();

    }


    /* =========================================================
       SEAT SUMMARY
       ========================================================= */

    function updateSeatSummary() {

        const selectedSeatsElement =
            document.getElementById(
                "selectedSeats"
            );


        const seatTotalElement =
            document.getElementById(
                "seatTotal"
            );


        const continueSeatButton =
            document.getElementById(
                "continueSeatButton"
            );


        if (
            !selectedSeatsElement ||
            !seatTotalElement ||
            !continueSeatButton
        ) {

            return;

        }


        const selectedSeats =
            document.querySelectorAll(
                ".seat.selected"
            );


        const seatNames = [];


        selectedSeats.forEach(
            function (seat) {

                seatNames.push(
                    seat.getAttribute(
                        "data-seat"
                    )
                );

            }
        );


        const total =
            selectedSeats.length * 250;


        if (seatNames.length === 0) {

            selectedSeatsElement.textContent =
                "None";

        } else {

            selectedSeatsElement.textContent =
                seatNames.join(", ");

        }


        seatTotalElement.textContent =
            "₹" + total;


        continueSeatButton.disabled =
            selectedSeats.length === 0;

    }


    /* =========================================================
       CONTINUE AFTER SEATS
       ========================================================= */

    const continueSeatButton =
        document.getElementById(
            "continueSeatButton"
        );


    if (continueSeatButton) {

        continueSeatButton.addEventListener(
            "click",
            function (event) {

                if (!isUserLoggedIn()) {

                    event.preventDefault();

                    alert("Please login first.");

                    redirectToLogin();

                    return;

                }


                const selectedSeats =
                    document.querySelectorAll(
                        ".seat.selected"
                    );


                const seatNames = [];


                selectedSeats.forEach(
                    function (seat) {

                        seatNames.push(
                            seat.getAttribute(
                                "data-seat"
                            )
                        );

                    }
                );


                if (seatNames.length === 0) {

                    return;

                }


                localStorage.setItem(
                    "selectedHall",
                    selectedHall
                );


                localStorage.setItem(
                    "selectedSeats",
                    JSON.stringify(
                        seatNames
                    )
                );


                localStorage.setItem(
                    "seatTotal",
                    String(
                        seatNames.length * 250
                    )
                );


                window.location.href =
                    "booking-summary.html";

            }
        );

    }


    /* =========================================================
       BOOKING SUMMARY
       ========================================================= */

    const summaryMovie =
        document.getElementById(
            "summaryMovie"
        );


    if (summaryMovie) {

        const summaryCinema =
            document.getElementById(
                "summaryCinema"
            );


        const summaryHall =
            document.getElementById(
                "summaryHall"
            );


        const summaryDate =
            document.getElementById(
                "summaryDate"
            );


        const summaryTime =
            document.getElementById(
                "summaryTime"
            );


        const summarySeats =
            document.getElementById(
                "summarySeats"
            );


        const summaryTicketPrice =
            document.getElementById(
                "summaryTicketPrice"
            );


        const summarySeatCount =
            document.getElementById(
                "summarySeatCount"
            );


        const summaryTotal =
            document.getElementById(
                "summaryTotal"
            );


        const movie =
            localStorage.getItem(
                "selectedMovie"
            ) || "AAGAAZ";


        const cinema =
            localStorage.getItem(
                "selectedCinema"
            ) ||
            "Thashow Grand Cinema";


        const hall =
            localStorage.getItem(
                "selectedHall"
            ) || "Hall 01";


        const date =
            localStorage.getItem(
                "selectedDate"
            ) || "Today";


        const time =
            localStorage.getItem(
                "selectedTime"
            ) || "10:00 AM";


        let seats = [];


        try {

            seats =
                JSON.parse(
                    localStorage.getItem(
                        "selectedSeats"
                    )
                ) || [];

        } catch (error) {

            seats = [];

        }


        const ticketPrice =
            250;


        const seatCount =
            seats.length;


        const total =
            seatCount * ticketPrice;


        summaryMovie.textContent =
            movie;


        if (summaryCinema) {

            summaryCinema.textContent =
                cinema;

        }


        if (summaryHall) {

            summaryHall.textContent =
                hall;

        }


        if (summaryDate) {

            summaryDate.textContent =
                date;

        }


        if (summaryTime) {

            summaryTime.textContent =
                time;

        }


        if (summarySeats) {

            summarySeats.textContent =
                seats.length > 0
                    ? seats.join(", ")
                    : "No seats selected";

        }


        if (summaryTicketPrice) {

            summaryTicketPrice.textContent =
                "₹" + ticketPrice;

        }


        if (summarySeatCount) {

            summarySeatCount.textContent =
                seatCount;

        }


        if (summaryTotal) {

            summaryTotal.textContent =
                "₹" + total;

        }


        const continueToFoodButton =
            document.getElementById(
                "continueToFoodButton"
            );


        if (continueToFoodButton) {

            continueToFoodButton.addEventListener(
                "click",
                function (event) {

                    if (!isUserLoggedIn()) {

                        event.preventDefault();

                        alert(
                            "Please login first."
                        );

                        redirectToLogin();

                    }

                }
            );

        }

    }


    /* =========================================================
       FOOD CART
       ========================================================= */

    const addFoodButtons =
        document.querySelectorAll(
            ".add-food-button"
        );


    let foodCart = [];


    try {

        foodCart =
            JSON.parse(
                localStorage.getItem(
                    "foodCart"
                )
            ) || [];

    } catch (error) {

        foodCart = [];

    }


    addFoodButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    if (!isUserLoggedIn()) {

                        event.preventDefault();

                        alert(
                            "Please login first."
                        );

                        redirectToLogin();

                        return;

                    }


                    const foodName =
                        button.getAttribute(
                            "data-food"
                        );


                    const foodPrice =
                        Number(
                            button.getAttribute(
                                "data-price"
                            )
                        );


                    const existingItem =
                        foodCart.find(
                            function (item) {

                                return (
                                    item.name ===
                                    foodName
                                );

                            }
                        );


                    if (existingItem) {

                        existingItem.quantity +=
                            1;

                    } else {

                        foodCart.push({
                            name: foodName,
                            price: foodPrice,
                            quantity: 1
                        });

                    }


                    localStorage.setItem(
                        "foodCart",
                        JSON.stringify(
                            foodCart
                        )
                    );


                    button.textContent =
                        "Added";


                    renderFoodCart();

                }
            );

        }
    );


    /* =========================================================
       RENDER FOOD CART
       ========================================================= */

    function renderFoodCart() {

        const foodCartList =
            document.getElementById(
                "foodCartList"
            );


        const foodCartTotal =
            document.getElementById(
                "foodCartTotal"
            );


        if (
            !foodCartList ||
            !foodCartTotal
        ) {

            return;

        }


        foodCartList.innerHTML =
            "";


        if (foodCart.length === 0) {

            const emptyMessage =
                document.createElement(
                    "p"
                );


            emptyMessage.className =
                "empty-food-cart";


            emptyMessage.textContent =
                "No food items added yet.";


            foodCartList.appendChild(
                emptyMessage
            );


            foodCartTotal.textContent =
                "₹0";


            return;

        }


        let total = 0;


        foodCart.forEach(
            function (item) {

                const itemRow =
                    document.createElement(
                        "div"
                    );


                itemRow.className =
                    "food-summary-item";


                const itemInfo =
                    document.createElement(
                        "div"
                    );


                const itemName =
                    document.createElement(
                        "strong"
                    );


                itemName.textContent =
                    item.name;


                const itemQuantity =
                    document.createElement(
                        "span"
                    );


                itemQuantity.textContent =
                    "Qty: " +
                    item.quantity;


                itemInfo.appendChild(
                    itemName
                );


                itemInfo.appendChild(
                    itemQuantity
                );


                const itemPrice =
                    document.createElement(
                        "strong"
                    );


                const itemTotal =
                    item.price *
                    item.quantity;


                itemPrice.textContent =
                    "₹" + itemTotal;


                itemRow.appendChild(
                    itemInfo
                );


                itemRow.appendChild(
                    itemPrice
                );


                foodCartList.appendChild(
                    itemRow
                );


                total += itemTotal;

            }
        );


        foodCartTotal.textContent =
            "₹" + total;

    }


    renderFoodCart();


    /* =========================================================
       CONTINUE TO CONFIRMATION
       ========================================================= */

    const continueToConfirmationButton =
        document.getElementById(
            "continueToConfirmationButton"
        );


    if (continueToConfirmationButton) {

        continueToConfirmationButton.addEventListener(
            "click",
            function (event) {

                if (!isUserLoggedIn()) {

                    event.preventDefault();

                    alert(
                        "Please login first."
                    );

                    redirectToLogin();

                    return;

                }


                window.location.href =
                    "booking-confirmation.html";

            }
        );

    }


    /* =========================================================
       BOOKING CONFIRMATION
       ========================================================= */

    const confirmationMovie =
        document.getElementById(
            "confirmationMovie"
        );


    if (confirmationMovie) {

        const confirmationCinema =
            document.getElementById(
                "confirmationCinema"
            );


        const confirmationHall =
            document.getElementById(
                "confirmationHall"
            );


        const confirmationDate =
            document.getElementById(
                "confirmationDate"
            );


        const confirmationTime =
            document.getElementById(
                "confirmationTime"
            );


        const confirmationSeats =
            document.getElementById(
                "confirmationSeats"
            );


        const confirmationTicketTotal =
            document.getElementById(
                "confirmationTicketTotal"
            );


        const confirmationFoodTotal =
            document.getElementById(
                "confirmationFoodTotal"
            );


        const confirmationGrandTotal =
            document.getElementById(
                "confirmationGrandTotal"
            );


        const confirmationFoodList =
            document.getElementById(
                "confirmationFoodList"
            );


        const movie =
            localStorage.getItem(
                "selectedMovie"
            ) || "AAGAAZ";


        const cinema =
            localStorage.getItem(
                "selectedCinema"
            ) ||
            "Thashow Grand Cinema";


        const hall =
            localStorage.getItem(
                "selectedHall"
            ) || "Hall 01";


        const date =
            localStorage.getItem(
                "selectedDate"
            ) || "Today";


        const time =
            localStorage.getItem(
                "selectedTime"
            ) || "10:00 AM";


        let seats = [];


        try {

            seats =
                JSON.parse(
                    localStorage.getItem(
                        "selectedSeats"
                    )
                ) || [];

        } catch (error) {

            seats = [];

        }


        let storedFoodCart = [];


        try {

            storedFoodCart =
                JSON.parse(
                    localStorage.getItem(
                        "foodCart"
                    )
                ) || [];

        } catch (error) {

            storedFoodCart = [];

        }


        const ticketPrice =
            250;


        const ticketTotal =
            seats.length *
            ticketPrice;


        let foodTotal = 0;


        storedFoodCart.forEach(
            function (item) {

                foodTotal +=
                    Number(item.price) *
                    Number(item.quantity);

            }
        );


        const grandTotal =
            ticketTotal +
            foodTotal;


        confirmationMovie.textContent =
            movie;


        if (confirmationCinema) {

            confirmationCinema.textContent =
                cinema;

        }


        if (confirmationHall) {

            confirmationHall.textContent =
                hall;

        }


        if (confirmationDate) {

            confirmationDate.textContent =
                date;

        }


        if (confirmationTime) {

            confirmationTime.textContent =
                time;

        }


        if (confirmationSeats) {

            confirmationSeats.textContent =
                seats.length > 0
                    ? seats.join(", ")
                    : "No seats selected";

        }


        if (confirmationTicketTotal) {

            confirmationTicketTotal.textContent =
                "₹" + ticketTotal;

        }


        if (confirmationFoodTotal) {

            confirmationFoodTotal.textContent =
                "₹" + foodTotal;

        }


        if (confirmationGrandTotal) {

            confirmationGrandTotal.textContent =
                "₹" + grandTotal;

        }


        if (confirmationFoodList) {

            confirmationFoodList.innerHTML =
                "";


            if (storedFoodCart.length === 0) {

                const emptyMessage =
                    document.createElement(
                        "p"
                    );


                emptyMessage.textContent =
                    "No food items selected.";


                confirmationFoodList.appendChild(
                    emptyMessage
                );

            } else {

                storedFoodCart.forEach(
                    function (item) {

                        const foodItem =
                            document.createElement(
                                "div"
                            );


                        foodItem.className =
                            "confirmation-food-item";


                        const foodName =
                            document.createElement(
                                "strong"
                            );


                        foodName.textContent =
                            item.name;


                        const foodQuantity =
                            document.createElement(
                                "span"
                            );


                        foodQuantity.textContent =
                            "Qty: " +
                            item.quantity;


                        const foodPrice =
                            document.createElement(
                                "strong"
                            );


                        foodPrice.textContent =
                            "₹" +
                            (
                                Number(
                                    item.price
                                ) *
                                Number(
                                    item.quantity
                                )
                            );


                        foodItem.appendChild(
                            foodName
                        );


                        foodItem.appendChild(
                            foodQuantity
                        );


                        foodItem.appendChild(
                            foodPrice
                        );


                        confirmationFoodList.appendChild(
                            foodItem
                        );

                    }
                );

            }

        }


        const confirmBookingButton =
            document.getElementById(
                "confirmBookingButton"
            );


        if (confirmBookingButton) {

            confirmBookingButton.addEventListener(
                "click",
                function (event) {

                    if (!isUserLoggedIn()) {

                        event.preventDefault();

                        alert(
                            "Please login first."
                        );

                        redirectToLogin();

                        return;

                    }


                    let bookingId =
                        localStorage.getItem(
                            "bookingId"
                        );


                    if (!bookingId) {

                        bookingId =
                            generateBookingId();


                        localStorage.setItem(
                            "bookingId",
                            bookingId
                        );

                    }


                    localStorage.setItem(
                        "bookingConfirmed",
                        "true"
                    );


                    window.location.href =
                        "booking-success.html";

                }
            );

        }

    }


    /* =========================================================
       BOOKING ID
       ========================================================= */

    function generateBookingId() {

        const randomNumber =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        return "TSB" + randomNumber;

    }


    /* =========================================================
       BOOKING SUCCESS PAGE
       ========================================================= */

    const bookingSuccessPage =
        document.querySelector(
            ".booking-success-page"
        );


    if (bookingSuccessPage) {

        if (!isUserLoggedIn()) {

            alert("Please login first.");

            redirectToLogin();

            return;

        }


        const bookingConfirmed =
            localStorage.getItem(
                "bookingConfirmed"
            );


        if (bookingConfirmed !== "true") {

            window.location.href =
                "index.html";

            return;

        }


        const successBookingId =
            document.getElementById(
                "successBookingId"
            );


        const successMovie =
            document.getElementById(
                "successMovie"
            );


        const successCinema =
            document.getElementById(
                "successCinema"
            );


        const successDate =
            document.getElementById(
                "successDate"
            );


        const successTime =
            document.getElementById(
                "successTime"
            );


        const successHall =
            document.getElementById(
                "successHall"
            );


        const successSeats =
            document.getElementById(
                "successSeats"
            );


        const successFoodList =
            document.getElementById(
                "successFoodList"
            );


        const successTicketTotal =
            document.getElementById(
                "successTicketTotal"
            );


        const successFoodTotal =
            document.getElementById(
                "successFoodTotal"
            );


        const successGrandTotal =
            document.getElementById(
                "successGrandTotal"
            );


        let bookingId =
            localStorage.getItem(
                "bookingId"
            );


        if (!bookingId) {

            bookingId =
                generateBookingId();


            localStorage.setItem(
                "bookingId",
                bookingId
            );

        }


        const movie =
            localStorage.getItem(
                "selectedMovie"
            ) || "Movie";


        const cinema =
            localStorage.getItem(
                "selectedCinema"
            ) ||
            "Cinema";


        const date =
            localStorage.getItem(
                "selectedDate"
            ) || "-";


        const time =
            localStorage.getItem(
                "selectedTime"
            ) || "-";


        const hall =
            localStorage.getItem(
                "selectedHall"
            ) || "-";


        let seats = [];


        try {

            seats =
                JSON.parse(
                    localStorage.getItem(
                        "selectedSeats"
                    )
                ) || [];

        } catch (error) {

            seats = [];

        }


        const ticketTotal =
            Number(
                localStorage.getItem(
                    "seatTotal"
                )
            ) ||
            seats.length * 250;


        let successFoodCart = [];


        try {

            successFoodCart =
                JSON.parse(
                    localStorage.getItem(
                        "foodCart"
                    )
                ) || [];

        } catch (error) {

            successFoodCart = [];

        }


        let foodTotal = 0;


        successFoodCart.forEach(
            function (food) {

                foodTotal +=
                    Number(food.price) *
                    Number(food.quantity);

            }
        );


        const grandTotal =
            ticketTotal +
            foodTotal;


        if (successBookingId) {

            successBookingId.textContent =
                bookingId;

        }


        if (successMovie) {

            successMovie.textContent =
                movie;

        }


        if (successCinema) {

            successCinema.textContent =
                cinema;

        }


        if (successDate) {

            successDate.textContent =
                date;

        }


        if (successTime) {

            successTime.textContent =
                time;

        }


        if (successHall) {

            successHall.textContent =
                hall;

        }


        if (successSeats) {

            successSeats.textContent =
                seats.length > 0
                    ? seats.join(", ")
                    : "No seats";

        }


        if (successTicketTotal) {

            successTicketTotal.textContent =
                "₹" + ticketTotal;

        }


        if (successFoodTotal) {

            successFoodTotal.textContent =
                "₹" + foodTotal;

        }


        if (successGrandTotal) {

            successGrandTotal.textContent =
                "₹" + grandTotal;

        }


        if (successFoodList) {

            successFoodList.innerHTML =
                "";


            if (
                successFoodCart.length === 0
            ) {

                const noFood =
                    document.createElement(
                        "p"
                    );


                noFood.textContent =
                    "No food items added.";


                successFoodList.appendChild(
                    noFood
                );

            } else {

                successFoodCart.forEach(
                    function (food) {

                        const foodItem =
                            document.createElement(
                                "div"
                            );


                        foodItem.className =
                            "success-food-item";


                        const foodName =
                            document.createElement(
                                "span"
                            );


                        foodName.className =
                            "success-food-name";


                        foodName.textContent =
                            food.name +
                            " × " +
                            food.quantity;


                        const foodPrice =
                            document.createElement(
                                "span"
                            );


                        foodPrice.className =
                            "success-food-price";


                        foodPrice.textContent =
                            "₹" +
                            (
                                Number(
                                    food.price
                                ) *
                                Number(
                                    food.quantity
                                )
                            );


                        foodItem.appendChild(
                            foodName
                        );


                        foodItem.appendChild(
                            foodPrice
                        );


                        successFoodList.appendChild(
                            foodItem
                        );

                    }
                );

            }

        }

    }


    /* =========================================================
       MY BOOKINGS PAGE
       ========================================================= */

    const myBookingCard =
        document.getElementById(
            "myBookingCard"
        );


    const emptyBookingMessage =
        document.getElementById(
            "emptyBookingMessage"
        );


    if (
        myBookingCard &&
        emptyBookingMessage
    ) {

        if (!isUserLoggedIn()) {

            alert("Please login first.");

            redirectToLogin();

            return;

        }


        const bookingConfirmed =
            localStorage.getItem(
                "bookingConfirmed"
            );


        if (bookingConfirmed !== "true") {

            myBookingCard.style.display =
                "none";


            emptyBookingMessage.style.display =
                "block";


        } else {

            myBookingCard.style.display =
                "block";


            emptyBookingMessage.style.display =
                "none";


            const bookingId =
                localStorage.getItem(
                    "bookingId"
                ) || "TSB000000";


            const movie =
                localStorage.getItem(
                    "selectedMovie"
                ) || "Movie";


            const cinema =
                localStorage.getItem(
                    "selectedCinema"
                ) ||
                "Cinema";


            const date =
                localStorage.getItem(
                    "selectedDate"
                ) || "-";


            const time =
                localStorage.getItem(
                    "selectedTime"
                ) || "-";


            const hall =
                localStorage.getItem(
                    "selectedHall"
                ) || "-";


            let seats = [];


            try {

                seats =
                    JSON.parse(
                        localStorage.getItem(
                            "selectedSeats"
                        )
                    ) || [];

            } catch (error) {

                seats = [];

            }


            const ticketTotal =
                Number(
                    localStorage.getItem(
                        "seatTotal"
                    )
                ) ||
                seats.length * 250;


            let myFoodCart = [];


            try {

                myFoodCart =
                    JSON.parse(
                        localStorage.getItem(
                            "foodCart"
                        )
                    ) || [];

            } catch (error) {

                myFoodCart = [];

            }


            let foodTotal = 0;


            myFoodCart.forEach(
                function (food) {

                    foodTotal +=
                        Number(food.price) *
                        Number(food.quantity);

                }
            );


            const grandTotal =
                ticketTotal +
                foodTotal;


            /* Booking ID */

            const myBookingId =
                document.getElementById(
                    "myBookingId"
                );


            if (myBookingId) {

                myBookingId.textContent =
                    bookingId;

            }


            /* Movie */

            const myBookingMovie =
                document.getElementById(
                    "myBookingMovie"
                );


            if (myBookingMovie) {

                myBookingMovie.textContent =
                    movie;

            }


            /* Cinema */

            const myBookingCinema =
                document.getElementById(
                    "myBookingCinema"
                );


            if (myBookingCinema) {

                myBookingCinema.textContent =
                    cinema;

            }


            /* Hall */

            const myBookingHall =
                document.getElementById(
                    "myBookingHall"
                );


            if (myBookingHall) {

                myBookingHall.textContent =
                    hall;

            }


            /* Date */

            const myBookingDate =
                document.getElementById(
                    "myBookingDate"
                );


            if (myBookingDate) {

                myBookingDate.textContent =
                    date;

            }


            /* Time */

            const myBookingTime =
                document.getElementById(
                    "myBookingTime"
                );


            if (myBookingTime) {

                myBookingTime.textContent =
                    time;

            }


            /* Seats */

            const myBookingSeats =
                document.getElementById(
                    "myBookingSeats"
                );


            if (myBookingSeats) {

                myBookingSeats.textContent =
                    seats.length > 0
                        ? seats.join(", ")
                        : "No seats";

            }


            /* Ticket Total */

            const myBookingTicketTotal =
                document.getElementById(
                    "myBookingTicketTotal"
                );


            if (myBookingTicketTotal) {

                myBookingTicketTotal.textContent =
                    "₹" + ticketTotal;

            }


            /* Food Total */

            const myBookingFoodTotal =
                document.getElementById(
                    "myBookingFoodTotal"
                );


            if (myBookingFoodTotal) {

                myBookingFoodTotal.textContent =
                    "₹" + foodTotal;

            }


            /* Grand Total */

            const myBookingGrandTotal =
                document.getElementById(
                    "myBookingGrandTotal"
                );


            if (myBookingGrandTotal) {

                myBookingGrandTotal.textContent =
                    "₹" + grandTotal;

            }


            /* Food List */

            const myBookingFoodList =
                document.getElementById(
                    "myBookingFoodList"
                );


            if (myBookingFoodList) {

                myBookingFoodList.innerHTML =
                    "";


                if (
                    myFoodCart.length === 0
                ) {

                    const noFood =
                        document.createElement(
                            "p"
                        );


                    noFood.textContent =
                        "No food items added.";


                    myBookingFoodList.appendChild(
                        noFood
                    );

                } else {

                    myFoodCart.forEach(
                        function (food) {

                            const foodItem =
                                document.createElement(
                                    "div"
                                );


                            foodItem.className =
                                "booking-food-item";


                            const foodName =
                                document.createElement(
                                    "span"
                                );


                            foodName.className =
                                "booking-food-name";


                            foodName.textContent =
                                food.name;


                            const foodQuantity =
                                document.createElement(
                                    "span"
                                );


                            foodQuantity.className =
                                "booking-food-quantity";


                            foodQuantity.textContent =
                                "Qty: " +
                                food.quantity;


                            const foodPrice =
                                document.createElement(
                                    "span"
                                );


                            foodPrice.className =
                                "booking-food-price";


                            foodPrice.textContent =
                                "₹" +
                                (
                                    Number(
                                        food.price
                                    ) *
                                    Number(
                                        food.quantity
                                    )
                                );


                            foodItem.appendChild(
                                foodName
                            );


                            foodItem.appendChild(
                                foodQuantity
                            );


                            foodItem.appendChild(
                                foodPrice
                            );


                            myBookingFoodList.appendChild(
                                foodItem
                            );

                        }
                    );

                }

            }

        }

    }


    /* =========================================================
       REGISTER FORM
       ========================================================= */

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const registerName =
                    document.getElementById(
                        "registerName"
                    );


                const registerEmail =
                    document.getElementById(
                        "registerEmail"
                    );


                const registerPassword =
                    document.getElementById(
                        "registerPassword"
                    );


                const registerConfirmPassword =
                    document.getElementById(
                        "registerConfirmPassword"
                    );


                if (
                    !registerName ||
                    !registerEmail ||
                    !registerPassword ||
                    !registerConfirmPassword
                ) {

                    return;

                }


                const name =
                    registerName.value.trim();


                const email =
                    registerEmail.value.trim();


                const password =
                    registerPassword.value;


                const confirmPassword =
                    registerConfirmPassword.value;


                if (
                    name === "" ||
                    email === "" ||
                    password === "" ||
                    confirmPassword === ""
                ) {

                    registerMessage.textContent =
                        "Please fill all fields.";

                    return;

                }


                if (password.length < 6) {

                    registerMessage.textContent =
                        "Password must be at least 6 characters.";

                    return;

                }


                if (
                    password !==
                    confirmPassword
                ) {

                    registerMessage.textContent =
                        "Passwords do not match.";

                    return;

                }


                const userData = {

                    name: name,

                    email: email,

                    password: password

                };


                localStorage.setItem(
                    "thashowbookUser",
                    JSON.stringify(
                        userData
                    )
                );


                localStorage.removeItem(
                    "thashowbookLoggedIn"
                );


                registerMessage.textContent =
                    "Account created successfully. Please login.";


                registerForm.reset();


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1000
                );

            }
        );

    }


    /* =========================================================
       LOGIN FORM
       ========================================================= */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const loginMessage =
        document.getElementById(
            "loginMessage"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                const loginPassword =
                    document.getElementById(
                        "loginPassword"
                    );


                if (
                    !loginEmail ||
                    !loginPassword
                ) {

                    return;

                }


                const email =
                    loginEmail.value.trim();


                const password =
                    loginPassword.value;


                const savedUser =
                    localStorage.getItem(
                        "thashowbookUser"
                    );


                if (!savedUser) {

                    loginMessage.textContent =
                        "Please register first.";

                    return;

                }


                let userData;


                try {

                    userData =
                        JSON.parse(
                            savedUser
                        );

                } catch (error) {

                    loginMessage.textContent =
                        "Account data is invalid.";

                    return;

                }


                if (
                    email !==
                    userData.email ||
                    password !==
                    userData.password
                ) {

                    loginMessage.textContent =
                        "Invalid email or password.";

                    return;

                }


                localStorage.setItem(
                    "thashowbookLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "thashowbookUserName",
                    userData.name
                );


                loginMessage.textContent =
                    "Login successful!";


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }
        );

    }

    /* =========================================================
   PROFILE PAGE
   ========================================================= */

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileFullName =
    document.getElementById("profileFullName");

const profileEmailAddress =
    document.getElementById("profileEmailAddress");

const profileInitial =
    document.getElementById("profileInitial");


if (
    profileName &&
    profileEmail &&
    profileFullName &&
    profileEmailAddress
) {

    if (!isUserLoggedIn()) {

        alert("Please login first.");

        redirectToLogin();

        return;

    }


    const savedUser =
        localStorage.getItem(
            "thashowbookUser"
        );


    if (!savedUser) {

        alert("Please register first.");

        redirectToLogin();

        return;

    }


    let userData;


    try {

        userData =
            JSON.parse(savedUser);

    } catch (error) {

        alert("Account data is invalid.");

        redirectToLogin();

        return;

    }


    profileName.textContent =
        userData.name || "User";


    profileEmail.textContent =
        userData.email || "-";


    profileFullName.textContent =
        userData.name || "-";


    profileEmailAddress.textContent =
        userData.email || "-";


    if (profileInitial) {

        const name =
            userData.name || "U";


        profileInitial.textContent =
            name.charAt(0).toUpperCase();

    }

}


    /* =========================================================
       LOGOUT
       ========================================================= */

    const logoutButtons =
        document.querySelectorAll(
            ".logout-button"
        );


    logoutButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    localStorage.removeItem(
                        "thashowbookLoggedIn"
                    );


                    localStorage.removeItem(
                        "thashowbookUserName"
                    );


                    window.location.href =
                        "index.html";

                }
            );

        }
    );


});