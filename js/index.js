document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ================= ELEMENTS ================= */

        const searchInput =
            document.getElementById(
                "movieSearch"
            );

        const searchButton =
            document.getElementById(
                "searchButton"
            );

        const searchMessage =
            document.getElementById(
                "searchMessage"
            );

        const movieCards =
            document.querySelectorAll(
                ".movie-card"
            );

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );

        const mobileNavigation =
            document.getElementById(
                "mobileNavigation"
            );

        const mobileNavLinks =
            document.querySelectorAll(
                ".mobile-nav-link"
            );

        const mobileLocationButton =
            document.getElementById(
                "mobileLocationButton"
            );


        /* ================= MOVIE SEARCH ================= */

        function searchMovies() {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (searchValue === "") {

                movieCards.forEach(
                    function (card) {

                        card.style.display =
                            "";

                    }
                );

                searchMessage.textContent =
                    "";

                return;
            }


            let foundMovies = 0;


            movieCards.forEach(
                function (card) {

                    const movieName =
                        card
                            .querySelector("h3")
                            .textContent
                            .toLowerCase();


                    const movieGenre =
                        card
                            .querySelector("p")
                            .textContent
                            .toLowerCase();


                    if (
                        movieName.includes(
                            searchValue
                        ) ||
                        movieGenre.includes(
                            searchValue
                        )
                    ) {

                        card.style.display =
                            "";

                        foundMovies++;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (foundMovies === 0) {

                searchMessage.textContent =
                    "No matching movie found.";

            } else {

                searchMessage.textContent =
                    foundMovies +
                    " movie found.";

            }

        }


        /* ================= SEARCH BUTTON ================= */

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchMovies
            );

        }


        /* ================= ENTER SEARCH ================= */

        if (searchInput) {

            searchInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        searchMovies();

                    }

                }
            );

        }


        /* ================= LOGIN ================= */

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "login.html";

                }
            );

        }


        /* ================= BOOK TICKETS ================= */

        const bookButtons =
            document.querySelectorAll(
                ".book-button"
            );


        bookButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "movie-details.html";

                    }
                );

            }
        );


        /* ================= CINEMA BUTTONS ================= */

        const cinemaButtons =
            document.querySelectorAll(
                ".cinema-details button"
            );


        cinemaButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "cinemas.html";

                    }
                );

            }
        );


        /* ================= MOBILE MENU ================= */

        if (
            mobileMenuButton &&
            mobileNavigation
        ) {

            mobileMenuButton.addEventListener(
                "click",
                function () {

                    const isOpen =
                        mobileNavigation.classList.toggle(
                            "open"
                        );


                    mobileMenuButton.classList.toggle(
                        "open",
                        isOpen
                    );


                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );

                }
            );

        }


        /* ================= MOBILE NAVIGATION ================= */

        mobileNavLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileNavigation.classList.remove(
                            "open"
                        );

                        mobileMenuButton.classList.remove(
                            "open"
                        );

                        mobileMenuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


        /* ================= MOBILE LOCATION ================= */

        if (mobileLocationButton) {

            mobileLocationButton.addEventListener(
                "click",
                function () {

                    mobileNavigation.classList.remove(
                        "open"
                    );

                    mobileMenuButton.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }

    }
);