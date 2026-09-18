document.addEventListener("DOMContentLoaded", function () {

    console.log("thashowbook Customer Frontend Loaded");


    /* =========================
       MOVIE SEARCH
    ========================= */

    const searchInput =
        document.getElementById("movieSearch");

    const searchButton =
        document.getElementById("searchButton");

    const movieCards =
        document.querySelectorAll(".movie-card");


    if (searchButton && searchInput) {

        searchButton.addEventListener("click", function () {

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

        });

    }


    /* =========================
       MOVIE SELECTION
    ========================= */

    const movieSelection =
        document.querySelectorAll(".movie-selection");

    let selectedMovie =
        localStorage.getItem("selectedMovie") || "AAGAAZ";


    movieSelection.forEach(function (button) {

        button.addEventListener("click", function () {

            movieSelection.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedMovie =
                button.getAttribute("data-movie");

            updateBookingMessage();

        });

    });


    /* =========================
       DATE SELECTION
    ========================= */

    const dateCards =
        document.querySelectorAll(".date-card");

    let selectedDate =
        localStorage.getItem("selectedDate") || "Today";


    dateCards.forEach(function (button) {

        button.addEventListener("click", function () {

            dateCards.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedDate =
                button.getAttribute("data-date");

            updateBookingMessage();

        });

    });


    /* =========================
       SHOWTIME SELECTION
    ========================= */

    const showtimeCards =
        document.querySelectorAll(".showtime-card");

    let selectedTime =
        localStorage.getItem("selectedTime") || "";


    showtimeCards.forEach(function (button) {

        button.addEventListener("click", function () {

            showtimeCards.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedTime =
                button.getAttribute("data-time");

            updateBookingMessage();

        });

    });


    /* =========================
       BOOKING MESSAGE
    ========================= */

    const selectionMessage =
        document.getElementById("selectionMessage");

    const continueBookingButton =
        document.getElementById("continueBookingButton");


    function updateBookingMessage() {

        if (!selectionMessage || !continueBookingButton) {
            return;
        }


        if (!selectedMovie || !selectedDate || !selectedTime) {

            selectionMessage.textContent =
                "Select a movie, date and showtime.";

            continueBookingButton.disabled = true;

            return;

        }


        selectionMessage.textContent =
            selectedMovie +
            " • " +
            selectedDate +
            " • " +
            selectedTime;

        continueBookingButton.disabled = false;

    }


    /* =========================
       CONTINUE TO SEAT SELECTION
    ========================= */

    if (continueBookingButton) {

        continueBookingButton.addEventListener(
            "click",
            function () {

                if (continueBookingButton.disabled) {
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


    /* =========================
       FOOD CART BUTTON
    ========================= */

    const foodButtons =
        document.querySelectorAll(".food-button");


    foodButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const foodCard =
                button.closest(".food-card");

            if (!foodCard) {
                return;
            }

            const foodName =
                foodCard.querySelector("h3");

            if (!foodName) {
                return;
            }

            button.textContent = "Added";

        });

    });


    /* =========================
       SEAT PAGE DATA
    ========================= */

    const seatLayout =
        document.getElementById("seatLayout");


    if (seatLayout) {

        const bookingMovie =
            document.getElementById("bookingMovie");

        const bookingCinema =
            document.getElementById("bookingCinema");

        const bookingDate =
            document.getElementById("bookingDate");

        const bookingTime =
            document.getElementById("bookingTime");


        if (bookingMovie) {
            bookingMovie.textContent =
                localStorage.getItem("selectedMovie") || "AAGAAZ";
        }

        if (bookingCinema) {
            bookingCinema.textContent =
                localStorage.getItem("selectedCinema") ||
                "Thashow Grand Cinema";
        }

        if (bookingDate) {
            bookingDate.textContent =
                localStorage.getItem("selectedDate") ||
                "Today";
        }

        if (bookingTime) {
            bookingTime.textContent =
                localStorage.getItem("selectedTime") ||
                "10:00 AM";
        }


        createSeats();

    }


    /* =========================
       HALL SELECTION
    ========================= */

    const hallSelectionCards =
        document.querySelectorAll(".hall-selection-card");


    let selectedHall =
        localStorage.getItem("selectedHall") || "Hall 01";


    hallSelectionCards.forEach(function (button) {

        button.addEventListener("click", function () {

            hallSelectionCards.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedHall =
                button.getAttribute("data-hall");


            const seatSectionHeading =
                document.querySelector(
                    ".seat-section-heading h2"
                );


            if (seatSectionHeading) {

                seatSectionHeading.textContent =
                    selectedHall;

            }


            createSeats();

        });

    });


    /* =========================
       CREATE SEATS
    ========================= */

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
                document.createElement("div");

            rowContainer.className =
                "seat-row";


            const rowLabel =
                document.createElement("span");

            rowLabel.className =
                "seat-row-label";

            rowLabel.textContent =
                row;


            rowContainer.appendChild(rowLabel);


            for (let number = 1; number <= 10; number++) {

                const seat =
                    document.createElement("button");

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


                if (
                    (row === "A" && number === 4) ||
                    (row === "A" && number === 5) ||
                    (row === "C" && number === 7) ||
                    (row === "D" && number === 3) ||
                    (row === "F" && number === 8)
                ) {

                    seat.classList.remove("available");

                    seat.classList.add("booked");

                    seat.disabled = true;

                }


                seat.addEventListener(
                    "click",
                    function () {

                        if (
                            seat.classList.contains("booked")
                        ) {
                            return;
                        }


                        seat.classList.toggle("selected");

                        updateSeatSummary();

                    }
                );


                rowContainer.appendChild(seat);

            }


            seatLayout.appendChild(rowContainer);

        });


        updateSeatSummary();

    }


    /* =========================
       SEAT SUMMARY
    ========================= */

    function updateSeatSummary() {

        const selectedSeatsElement =
            document.getElementById("selectedSeats");

        const seatTotalElement =
            document.getElementById("seatTotal");

        const continueSeatButton =
            document.getElementById("continueSeatButton");


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


        selectedSeats.forEach(function (seat) {

            seatNames.push(
                seat.getAttribute("data-seat")
            );

        });


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


    /* =========================
       CONTINUE AFTER SEATS
    ========================= */

    const continueSeatButton =
        document.getElementById("continueSeatButton");


    if (continueSeatButton) {

        continueSeatButton.addEventListener(
            "click",
            function () {

                const selectedSeats =
                    document.querySelectorAll(
                        ".seat.selected"
                    );


                const seatNames = [];


                selectedSeats.forEach(function (seat) {

                    seatNames.push(
                        seat.getAttribute("data-seat")
                    );

                });


                if (seatNames.length === 0) {
                    return;
                }


                localStorage.setItem(
                    "selectedHall",
                    selectedHall
                );

                localStorage.setItem(
                    "selectedSeats",
                    JSON.stringify(seatNames)
                );

                localStorage.setItem(
                    "seatTotal",
                    String(seatNames.length * 250)
                );


                window.location.href =
                    "booking-summary.html";

            }
        );

    }


    /* =========================
       BOOKING SUMMARY PAGE
    ========================= */

    const summaryMovie =
        document.getElementById("summaryMovie");


    if (summaryMovie) {

        const summaryCinema =
            document.getElementById("summaryCinema");

        const summaryHall =
            document.getElementById("summaryHall");

        const summaryDate =
            document.getElementById("summaryDate");

        const summaryTime =
            document.getElementById("summaryTime");

        const summarySeats =
            document.getElementById("summarySeats");

        const summaryTicketPrice =
            document.getElementById("summaryTicketPrice");

        const summarySeatCount =
            document.getElementById("summarySeatCount");

        const summaryTotal =
            document.getElementById("summaryTotal");


        const movie =
            localStorage.getItem("selectedMovie") ||
            "AAGAAZ";

        const cinema =
            localStorage.getItem("selectedCinema") ||
            "Thashow Grand Cinema";

        const hall =
            localStorage.getItem("selectedHall") ||
            "Hall 01";

        const date =
            localStorage.getItem("selectedDate") ||
            "Today";

        const time =
            localStorage.getItem("selectedTime") ||
            "10:00 AM";


        let seats = [];


        try {

            seats =
                JSON.parse(
                    localStorage.getItem("selectedSeats")
                ) || [];

        } catch (error) {

            seats = [];

        }


        const ticketPrice = 250;

        const seatCount =
            seats.length;

        const total =
            seatCount * ticketPrice;


        summaryMovie.textContent =
            movie;


        summaryCinema.textContent =
            cinema;


        summaryHall.textContent =
            hall;


        summaryDate.textContent =
            date;


        summaryTime.textContent =
            time;


        if (seats.length > 0) {

            summarySeats.textContent =
                seats.join(", ");

        } else {

            summarySeats.textContent =
                "No seats selected";

        }


        summaryTicketPrice.textContent =
            "₹" + ticketPrice;


        summarySeatCount.textContent =
            seatCount;


        summaryTotal.textContent =
            "₹" + total;


        const continueToFoodButton =
            document.getElementById(
                "continueToFoodButton"
            );


        if (continueToFoodButton) {

            continueToFoodButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "cinema-details.html#food";

                }
            );

        }

    }

});