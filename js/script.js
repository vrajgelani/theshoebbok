document.addEventListener("DOMContentLoaded", function () {

    console.log("thashowbook Customer Frontend Loaded");


    /* =========================
       MOVIE SEARCH
    ========================= */

    const searchInput = document.getElementById("movieSearch");
    const searchButton = document.getElementById("searchButton");
    const movieCards = document.querySelectorAll(".movie-card");


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

    let selectedMovie = "AAGAAZ";


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

    let selectedDate = "Today";


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

    let selectedTime = "";


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

    const continueButton =
        document.getElementById("continueBookingButton");


    function updateBookingMessage() {

        if (!selectionMessage || !continueButton) {
            return;
        }


        if (!selectedMovie || !selectedDate || !selectedTime) {

            selectionMessage.textContent =
                "Select a movie, date and showtime.";

            continueButton.disabled = true;

            return;
        }


        selectionMessage.textContent =
            selectedMovie +
            " • " +
            selectedDate +
            " • " +
            selectedTime;

        continueButton.disabled = false;

    }


    /* =========================
       CONTINUE TO SEAT SELECTION
    ========================= */

    if (continueButton) {

        continueButton.addEventListener("click", function () {

            if (continueButton.disabled) {
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

        });

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

});