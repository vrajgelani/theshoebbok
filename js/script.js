/* =========================================================
   THASHOWBOOK
   Main JavaScript
   Frontend Only - LocalStorage Based
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeMovieFilters();
    initializeMovieSelection();
    initializeSeatSelection();
    initializeCheckout();
    initializeLogin();
    initializeBookingTabs();
    loadBookingData();
});


/* =========================================================
   01. COMMON HELPERS
   ========================================================= */

function getStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}


function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


function generateBookingId() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const randomNumber = Math.floor(100 + Math.random() * 900);

    return `TSB-${year}${month}${day}-${randomNumber}`;
}


function getSelectedShow() {
    return getStorage("thashowbookSelectedShow", {
        movie: "Movie Title 01",
        movieImage: "images/movies/movie-01.jpg",
        genre: "Action · Drama · Hindi",
        cinema: "Thashow Central Cinema",
        date: "18 Sep 2026",
        time: "6:30 PM",
        format: "2D"
    });
}


function saveSelectedShow(show) {
    setStorage("thashowbookSelectedShow", show);
}


/* =========================================================
   02. MOVIE SEARCH & FILTER
   ========================================================= */

function initializeMovieFilters() {

    const movieGrid = document.getElementById("movieGrid");

    if (!movieGrid) {
        return;
    }

    const movieItems = Array.from(
        movieGrid.querySelectorAll(".movie-item")
    );

    const filterButtons = document.querySelectorAll(
        ".filter-button"
    );

    const searchInput = document.getElementById("movieSearch");

    let selectedFilter = "all";


    function filterMovies() {

        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleMovies = 0;

        movieItems.forEach((movie) => {

            const title = (
                movie.dataset.title || ""
            ).toLowerCase();

            const genre = (
                movie.dataset.genre || ""
            ).toLowerCase();

            const matchesSearch =
                title.includes(searchText);

            const matchesFilter =
                selectedFilter === "all" ||
                genre.includes(selectedFilter);

            const shouldShow =
                matchesSearch && matchesFilter;

            movie.hidden = !shouldShow;

            if (shouldShow) {
                visibleMovies++;
            }
        });


        const emptyState = document.getElementById(
            "movieEmptyState"
        );

        if (emptyState) {
            emptyState.hidden = visibleMovies !== 0;
        }
    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedFilter =
                button.dataset.filter || "all";

            filterMovies();
        });

    });


    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterMovies
        );
    }


    filterMovies();
}


/* =========================================================
   03. MOVIE DETAILS
   ========================================================= */

function initializeMovieSelection() {

    const dateButtons = document.querySelectorAll(
        ".date-button"
    );

    const showtimeButtons = document.querySelectorAll(
        ".showtime-button"
    );

    const cinemaInputs = document.querySelectorAll(
        'input[name="cinema"]'
    );


    if (
        dateButtons.length === 0 &&
        showtimeButtons.length === 0 &&
        cinemaInputs.length === 0
    ) {
        return;
    }


    let selectedDate =
        document.querySelector(".date-button.active");

    let selectedTime =
        document.querySelector(".showtime-button.active");

    let selectedCinema =
        document.querySelector(
            'input[name="cinema"]:checked'
        );


    dateButtons.forEach((button) => {

        button.addEventListener("click", () => {

            dateButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedDate = button;

            updateSelectedShow();
        });

    });


    showtimeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            showtimeButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedTime = button;

            updateSelectedShow();
        });

    });


    cinemaInputs.forEach((input) => {

        input.addEventListener("change", () => {

            selectedCinema = input;

            updateSelectedShow();
        });

    });


    function getDateText(button) {

        if (!button) {
            return "18 Sep 2026";
        }

        const day =
            button.querySelector(".date-day")?.textContent
            .trim() || "";

        const number =
            button.querySelector("strong")?.textContent
            .trim() || "";

        const month =
            button.querySelector(".date-month")?.textContent
            .trim() || "";

        return `${number} ${month} 2026`;
    }


    function getCinemaName() {

        if (!selectedCinema) {
            return "Thashow Central Cinema";
        }

        const card =
            selectedCinema.closest(
                ".show-cinema-card"
            );

        const name =
            card?.querySelector("h4")?.textContent
            .trim();

        return name || "Thashow Central Cinema";
    }


    function updateSelectedShow() {

        const previousShow = getSelectedShow();

        const show = {
            movie:
                previousShow.movie ||
                "Movie Title 01",

            movieImage:
                previousShow.movieImage ||
                "images/movies/movie-01.jpg",

            genre:
                previousShow.genre ||
                "Action · Drama · Hindi",

            cinema:
                getCinemaName(),

            date:
                getDateText(selectedDate),

            time:
                selectedTime?.dataset.time ||
                previousShow.time ||
                "6:30 PM",

            format:
                previousShow.format ||
                "2D"
        };

        saveSelectedShow(show);
    }


    updateSelectedShow();
}


/* =========================================================
   04. SEAT SELECTION
   ========================================================= */

function initializeSeatSelection() {

    const seatMap = document.getElementById("seatMap");

    if (!seatMap) {
        return;
    }

    const seats = Array.from(
        seatMap.querySelectorAll(".seat")
    );

    const selectedSeatsElement =
        document.getElementById("selectedSeats");

    const ticketCountElement =
        document.getElementById("ticketCount");

    const totalElement =
        document.getElementById("seatTotal");

    const continueButton =
        document.getElementById("continueToCheckout");


    let selectedSeats = getStorage(
        "thashowbookSelectedSeats",
        []
    );


    function updateSeatUI() {

        seats.forEach((seat) => {

            const seatName =
                seat.dataset.seat;

            if (
                selectedSeats.some(
                    (item) =>
                        item.seat === seatName
                )
            ) {
                seat.classList.add("selected");
            } else {
                seat.classList.remove("selected");
            }

        });


        if (selectedSeatsElement) {

            if (selectedSeats.length === 0) {

                selectedSeatsElement.textContent =
                    "No seats selected";

            } else {

                selectedSeatsElement.textContent =
                    selectedSeats
                        .map((item) => item.seat)
                        .join(", ");
            }
        }


        if (ticketCountElement) {

            ticketCountElement.textContent =
                selectedSeats.length;
        }


        const total = selectedSeats.reduce(
            (sum, item) =>
                sum + Number(item.price),
            0
        );


        if (totalElement) {

            totalElement.textContent =
                `₹${total}`;
        }


        setStorage(
            "thashowbookSelectedSeats",
            selectedSeats
        );
    }


    seats.forEach((seat) => {

        seat.addEventListener("click", () => {

            if (seat.disabled) {
                return;
            }

            const seatName =
                seat.dataset.seat;

            const price =
                Number(seat.dataset.price) || 0;

            const existingIndex =
                selectedSeats.findIndex(
                    (item) =>
                        item.seat === seatName
                );


            if (existingIndex >= 0) {

                selectedSeats.splice(
                    existingIndex,
                    1
                );

            } else {

                selectedSeats.push({
                    seat: seatName,
                    price: price
                });

            }


            updateSeatUI();
        });

    });


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            (event) => {

                if (selectedSeats.length === 0) {

                    event.preventDefault();

                    showMessage(
                        "Please select at least one seat.",
                        "error"
                    );

                    return;
                }

                const show = getSelectedShow();

                setStorage(
                    "thashowbookBookingDraft",
                    {
                        show: show,
                        seats: selectedSeats
                    }
                );
            }
        );
    }


    updateSeatUI();
}


/* =========================================================
   05. CHECKOUT
   ========================================================= */

function initializeCheckout() {

    const checkoutForm =
        document.getElementById("checkoutForm");

    const confirmButton =
        document.getElementById(
            "confirmBookingButton"
        );

    if (!checkoutForm && !confirmButton) {
        return;
    }


    const draft = getStorage(
        "thashowbookBookingDraft",
        null
    );

    const show =
        draft?.show || getSelectedShow();

    const seats =
        draft?.seats ||
        getStorage(
            "thashowbookSelectedSeats",
            []
        );


    const checkoutSeats =
        document.getElementById(
            "checkoutSeats"
        );

    const ticketPrice =
        document.getElementById(
            "ticketPrice"
        );

    const convenienceFee =
        document.getElementById(
            "convenienceFee"
        );

    const taxAmount =
        document.getElementById(
            "taxAmount"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    const baseTicketPrice =
        seats.reduce(
            (sum, item) =>
                sum + Number(item.price),
            0
        );

    const convenience =
        seats.length > 0
            ? 20 * seats.length
            : 0;

    const tax =
        Math.round(
            baseTicketPrice * 0.05
        );

    const total =
        baseTicketPrice +
        convenience +
        tax;


    if (checkoutSeats) {

        checkoutSeats.textContent =
            seats.length > 0
                ? seats.map(
                    (item) => item.seat
                ).join(", ")
                : "No seats selected";
    }


    if (ticketPrice) {
        ticketPrice.textContent =
            `₹${baseTicketPrice}`;
    }


    if (convenienceFee) {
        convenienceFee.textContent =
            `₹${convenience}`;
    }


    if (taxAmount) {
        taxAmount.textContent =
            `₹${tax}`;
    }


    if (checkoutTotal) {
        checkoutTotal.textContent =
            `₹${total}`;
    }


    updateCheckoutMovie(show);


    initializePaymentMethods();


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            () => {

                if (seats.length === 0) {

                    showMessage(
                        "Please select your seats first.",
                        "error"
                    );

                    return;
                }


                if (!checkoutForm) {
                    return;
                }


                if (!validateCheckoutForm()) {
                    return;
                }


                const formData =
                    new FormData(checkoutForm);

                const paymentMethod =
                    document.querySelector(
                        'input[name="paymentMethod"]:checked'
                    )?.value || "upi";


                const customer = {
                    name:
                        String(
                            formData.get("fullName")
                        ).trim(),

                    email:
                        String(
                            formData.get("email")
                        ).trim(),

                    phone:
                        String(
                            formData.get("phone")
                        ).trim(),

                    city:
                        String(
                            formData.get("city")
                        ).trim()
                };


                const booking = {

                    bookingId:
                        generateBookingId(),

                    movie:
                        show.movie,

                    movieImage:
                        show.movieImage,

                    genre:
                        show.genre,

                    cinema:
                        show.cinema,

                    date:
                        show.date,

                    time:
                        show.time,

                    format:
                        show.format,

                    seats:
                        seats,

                    customer:
                        customer,

                    payment:
                        paymentMethod,

                    ticketPrice:
                        baseTicketPrice,

                    convenienceFee:
                        convenience,

                    tax:
                        tax,

                    total:
                        total,

                    createdAt:
                        new Date().toISOString()

                };


                const bookings =
                    getStorage(
                        "thashowbookBookings",
                        []
                    );


                bookings.unshift(booking);


                setStorage(
                    "thashowbookBookings",
                    bookings
                );


                setStorage(
                    "thashowbookLatestBooking",
                    booking
                );


                window.location.href =
                    "confirmation.html";
            }
        );
    }
}


/* =========================================================
   06. CHECKOUT MOVIE DATA
   ========================================================= */

function updateCheckoutMovie(show) {

    const movieImage =
        document.querySelector(
            ".summary-movie img"
        );

    const movieTitle =
        document.querySelector(
            ".summary-movie h3"
        );

    const movieGenre =
        document.querySelector(
            ".summary-movie p"
        );

    if (movieImage) {
        movieImage.src =
            show.movieImage;
        movieImage.alt =
            `${show.movie} poster`;
    }

    if (movieTitle) {
        movieTitle.textContent =
            show.movie;
    }

    if (movieGenre) {
        movieGenre.textContent =
            show.genre;
    }


    const summaryRows =
        document.querySelectorAll(
            ".booking-summary-row"
        );


    summaryRows.forEach((row) => {

        const label =
            row.querySelector("span")
                ?.textContent
                .trim()
                .toLowerCase();

        const value =
            row.querySelector("strong");

        if (!value) {
            return;
        }

        if (label === "cinema") {
            value.textContent =
                show.cinema;
        }

        if (label === "date") {
            value.textContent =
                show.date;
        }

        if (label === "showtime") {
            value.textContent =
                show.time;
        }

    });
}


/* =========================================================
   07. PAYMENT METHODS
   ========================================================= */

function initializePaymentMethods() {

    const paymentInputs =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    const upiPayment =
        document.getElementById(
            "upiPayment"
        );

    const cardPayment =
        document.getElementById(
            "cardPayment"
        );


    if (
        paymentInputs.length === 0 ||
        (!upiPayment && !cardPayment)
    ) {
        return;
    }


    function updatePaymentFields() {

        const selected =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            )?.value;


        if (upiPayment) {
            upiPayment.hidden =
                selected !== "upi";
        }


        if (cardPayment) {
            cardPayment.hidden =
                selected !== "card";
        }

    }


    paymentInputs.forEach((input) => {

        input.addEventListener(
            "change",
            updatePaymentFields
        );

    });


    updatePaymentFields();
}


/* =========================================================
   08. CHECKOUT VALIDATION
   ========================================================= */

function validateCheckoutForm() {

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const city =
        document.getElementById("city");


    let valid = true;


    clearFieldError(
        fullName,
        document.getElementById(
            "fullNameError"
        )
    );

    clearFieldError(
        email,
        document.getElementById(
            "emailError"
        )
    );

    clearFieldError(
        phone,
        document.getElementById(
            "phoneError"
        )
    );

    clearFieldError(
        city,
        document.getElementById(
            "cityError"
        )
    );


    if (
        !fullName ||
        fullName.value.trim().length < 2
    ) {

        setFieldError(
            fullName,
            document.getElementById(
                "fullNameError"
            ),
            "Please enter your full name."
        );

        valid = false;
    }


    if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.value.trim()
        )
    ) {

        setFieldError(
            email,
            document.getElementById(
                "emailError"
            ),
            "Please enter a valid email address."
        );

        valid = false;
    }


    if (
        !phone ||
        !/^\d{10}$/.test(
            phone.value.trim()
        )
    ) {

        setFieldError(
            phone,
            document.getElementById(
                "phoneError"
            ),
            "Please enter a valid 10-digit mobile number."
        );

        valid = false;
    }


    if (
        !city ||
        city.value.trim().length < 2
    ) {

        setFieldError(
            city,
            document.getElementById(
                "cityError"
            ),
            "Please enter your city."
        );

        valid = false;
    }


    return valid;
}


function setFieldError(
    input,
    errorElement,
    message
) {

    if (input) {
        input.classList.add(
            "input-error"
        );
    }

    if (errorElement) {
        errorElement.textContent =
            message;
    }
}


function clearFieldError(
    input,
    errorElement
) {

    if (input) {
        input.classList.remove(
            "input-error"
        );
    }

    if (errorElement) {
        errorElement.textContent = "";
    }
}


/* =========================================================
   09. LOGIN / REGISTER
   ========================================================= */

function initializeLogin() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const showRegisterButton =
        document.getElementById(
            "showRegister"
        );

    const registerSection =
        document.getElementById(
            "registerSection"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    if (
        !loginForm &&
        !registerForm
    ) {
        return;
    }


    if (showRegisterButton) {

        showRegisterButton.addEventListener(
            "click",
            () => {

                if (!registerSection) {
                    return;
                }

                registerSection.hidden =
                    !registerSection.hidden;

                if (
                    !registerSection.hidden
                ) {
                    registerSection.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        );
    }


    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            () => {

                const password =
                    document.getElementById(
                        "loginPassword"
                    );

                if (!password) {
                    return;
                }


                if (
                    password.type === "password"
                ) {

                    password.type =
                        "text";

                    togglePassword.textContent =
                        "Hide";

                } else {

                    password.type =
                        "password";

                    togglePassword.textContent =
                        "Show";
                }

            }
        );
    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const email =
                    document.getElementById(
                        "loginEmail"
                    );

                const password =
                    document.getElementById(
                        "loginPassword"
                    );

                const emailError =
                    document.getElementById(
                        "loginEmailError"
                    );

                const passwordError =
                    document.getElementById(
                        "loginPasswordError"
                    );

                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                clearFieldError(
                    email,
                    emailError
                );

                clearFieldError(
                    password,
                    passwordError
                );


                let valid = true;


                if (
                    !email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        email.value.trim()
                    )
                ) {

                    setFieldError(
                        email,
                        emailError,
                        "Please enter a valid email address."
                    );

                    valid = false;
                }


                if (
                    !password ||
                    password.value.length < 4
                ) {

                    setFieldError(
                        password,
                        passwordError,
                        "Password must contain at least 4 characters."
                    );

                    valid = false;
                }


                if (!valid) {
                    return;
                }


                const users =
                    getStorage(
                        "thashowbookUsers",
                        []
                    );


                const user =
                    users.find(
                        (item) =>
                            item.email.toLowerCase() ===
                            email.value
                                .trim()
                                .toLowerCase() &&
                            item.password ===
                            password.value
                    );


                if (!user) {

                    showAuthMessage(
                        message,
                        "Account not found or password is incorrect.",
                        "error"
                    );

                    return;
                }


                setStorage(
                    "thashowbookCurrentUser",
                    {
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                );


                showAuthMessage(
                    message,
                    `Welcome back, ${user.name}!`,
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 700);

            }
        );
    }


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "registerName"
                    );

                const email =
                    document.getElementById(
                        "registerEmail"
                    );

                const phone =
                    document.getElementById(
                        "registerPhone"
                    );

                const password =
                    document.getElementById(
                        "registerPassword"
                    );

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    );

                const message =
                    document.getElementById(
                        "registerMessage"
                    );


                const errors = {

                    name:
                        document.getElementById(
                            "registerNameError"
                        ),

                    email:
                        document.getElementById(
                            "registerEmailError"
                        ),

                    phone:
                        document.getElementById(
                            "registerPhoneError"
                        ),

                    password:
                        document.getElementById(
                            "registerPasswordError"
                        ),

                    confirm:
                        document.getElementById(
                            "confirmPasswordError"
                        )

                };


                clearFieldError(
                    name,
                    errors.name
                );

                clearFieldError(
                    email,
                    errors.email
                );

                clearFieldError(
                    phone,
                    errors.phone
                );

                clearFieldError(
                    password,
                    errors.password
                );

                clearFieldError(
                    confirmPassword,
                    errors.confirm
                );


                let valid = true;


                if (
                    !name ||
                    name.value.trim().length < 2
                ) {

                    setFieldError(
                        name,
                        errors.name,
                        "Please enter your full name."
                    );

                    valid = false;
                }


                if (
                    !email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        email.value.trim()
                    )
                ) {

                    setFieldError(
                        email,
                        errors.email,
                        "Please enter a valid email address."
                    );

                    valid = false;
                }


                if (
                    !phone ||
                    !/^\d{10}$/.test(
                        phone.value.trim()
                    )
                ) {

                    setFieldError(
                        phone,
                        errors.phone,
                        "Please enter a valid 10-digit mobile number."
                    );

                    valid = false;
                }


                if (
                    !password ||
                    password.value.length < 4
                ) {

                    setFieldError(
                        password,
                        errors.password,
                        "Password must contain at least 4 characters."
                    );

                    valid = false;
                }


                if (
                    !confirmPassword ||
                    confirmPassword.value !==
                    password.value
                ) {

                    setFieldError(
                        confirmPassword,
                        errors.confirm,
                        "Passwords do not match."
                    );

                    valid = false;
                }


                if (!valid) {
                    return;
                }


                const users =
                    getStorage(
                        "thashowbookUsers",
                        []
                    );


                const emailExists =
                    users.some(
                        (user) =>
                            user.email.toLowerCase() ===
                            email.value
                                .trim()
                                .toLowerCase()
                    );


                if (emailExists) {

                    showAuthMessage(
                        message,
                        "An account with this email already exists.",
                        "error"
                    );

                    return;
                }


                const newUser = {

                    name:
                        name.value.trim(),

                    email:
                        email.value
                            .trim()
                            .toLowerCase(),

                    phone:
                        phone.value.trim(),

                    password:
                        password.value

                };


                users.push(newUser);


                setStorage(
                    "thashowbookUsers",
                    users
                );


                setStorage(
                    "thashowbookCurrentUser",
                    {
                        name: newUser.name,
                        email: newUser.email,
                        phone: newUser.phone
                    }
                );


                showAuthMessage(
                    message,
                    "Account created successfully!",
                    "success"
                );


                registerForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 800);

            }
        );
    }
}


/* =========================================================
   10. AUTH MESSAGE
   ========================================================= */

function showAuthMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `auth-message ${type}`;

    element.hidden = false;
}


/* =========================================================
   11. BOOKING TABS
   ========================================================= */

function initializeBookingTabs() {

    const tabs =
        document.querySelectorAll(
            ".booking-tab"
        );

    const upcomingPanel =
        document.getElementById(
            "upcomingBookings"
        );

    const pastPanel =
        document.getElementById(
            "pastBookings"
        );


    if (
        tabs.length === 0 ||
        !upcomingPanel ||
        !pastPanel
    ) {
        return;
    }


    tabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach((item) => {
                    item.classList.remove(
                        "active"
                    );
                });

                tab.classList.add(
                    "active"
                );


                const target =
                    tab.dataset.bookingTab;


                if (target === "past") {

                    upcomingPanel.hidden =
                        true;

                    pastPanel.hidden =
                        false;

                } else {

                    upcomingPanel.hidden =
                        false;

                    pastPanel.hidden =
                        true;
                }

            }
        );

    });
}


/* =========================================================
   12. LOAD BOOKINGS
   ========================================================= */

function loadBookingData() {

    const bookings =
        getStorage(
            "thashowbookBookings",
            []
        );


    updateBookingsPage(bookings);
    updateConfirmationPage(bookings);
}


/* =========================================================
   13. UPDATE BOOKINGS PAGE
   ========================================================= */

function updateBookingsPage(bookings) {

    const upcomingList =
        document.getElementById(
            "upcomingBookingList"
        );

    const pastList =
        document.getElementById(
            "pastBookingList"
        );


    if (
        !upcomingList &&
        !pastList
    ) {
        return;
    }


    if (upcomingList) {

        const upcomingBookings =
            bookings.filter(
                (booking) =>
                    !isPastBooking(booking)
            );

        renderBookingList(
            upcomingList,
            upcomingBookings
        );


        const empty =
            document.getElementById(
                "upcomingEmptyState"
            );

        if (empty) {
            empty.hidden =
                upcomingBookings.length !== 0;
        }
    }


    if (pastList) {

        const pastBookings =
            bookings.filter(
                (booking) =>
                    isPastBooking(booking)
            );

        renderBookingList(
            pastList,
            pastBookings
        );


        const empty =
            document.getElementById(
                "pastEmptyState"
            );

        if (empty) {
            empty.hidden =
                pastBookings.length !== 0;
        }
    }
}


function isPastBooking(booking) {

    if (!booking.date) {
        return false;
    }


    const dateMatch =
        booking.date.match(
            /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/
        );


    if (!dateMatch) {
        return false;
    }


    const day =
        Number(dateMatch[1]);

    const monthText =
        dateMatch[2].toLowerCase();

    const year =
        Number(dateMatch[3]);


    const months = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    };


    const month =
        months[monthText];


    if (month === undefined) {
        return false;
    }


    const bookingDate =
        new Date(
            year,
            month,
            day
        );


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    return bookingDate < today;
}


/* =========================================================
   14. RENDER BOOKING LIST
   ========================================================= */

function renderBookingList(
    container,
    bookings
) {

    container.innerHTML = "";


    bookings.forEach((booking) => {

        const article =
            document.createElement("article");

        article.className =
            "booking-card";


        const posterWrapper =
            document.createElement("div");

        posterWrapper.className =
            "booking-card-poster";


        const poster =
            document.createElement("img");

        poster.src =
            booking.movieImage ||
            "images/movies/movie-01.jpg";

        poster.alt =
            `${booking.movie} poster`;


        posterWrapper.appendChild(
            poster
        );


        const main =
            document.createElement("div");

        main.className =
            "booking-card-main";


        const top =
            document.createElement("div");

        top.className =
            "booking-card-top";


        const titleArea =
            document.createElement("div");


        const status =
            document.createElement("span");

        status.className =
            "booking-status";


        if (isPastBooking(booking)) {

            status.classList.add(
                "past-status"
            );

            status.textContent =
                "COMPLETED";

        } else {

            status.textContent =
                "CONFIRMED";
        }


        const title =
            document.createElement("h2");

        title.textContent =
            booking.movie;


        const genre =
            document.createElement("p");

        genre.className =
            "booking-genre";

        genre.textContent =
            booking.genre ||
            "Movie";


        titleArea.appendChild(status);
        titleArea.appendChild(title);
        titleArea.appendChild(genre);


        const bookingId =
            document.createElement("div");

        bookingId.className =
            "booking-id";


        const idLabel =
            document.createElement("span");

        idLabel.textContent =
            "BOOKING ID";


        const idValue =
            document.createElement("strong");

        idValue.textContent =
            booking.bookingId;


        bookingId.appendChild(idLabel);
        bookingId.appendChild(idValue);


        top.appendChild(titleArea);
        top.appendChild(bookingId);


        const details =
            document.createElement("div");

        details.className =
            "booking-details";


        addBookingDetail(
            details,
            "CINEMA",
            booking.cinema
        );

        addBookingDetail(
            details,
            "DATE",
            booking.date
        );

        addBookingDetail(
            details,
            "SHOWTIME",
            booking.time
        );

        addBookingDetail(
            details,
            "SEATS",
            booking.seats
                ?.map(
                    (seat) => seat.seat
                )
                .join(", ") ||
                "Not available"
        );


        const bottom =
            document.createElement("div");

        bottom.className =
            "booking-card-bottom";


        const price =
            document.createElement("div");

        price.className =
            "booking-price";


        const priceLabel =
            document.createElement("span");

        priceLabel.textContent =
            "TOTAL";


        const priceValue =
            document.createElement("strong");

        priceValue.textContent =
            `₹${booking.total || 0}`;


        price.appendChild(
            priceLabel
        );

        price.appendChild(
            priceValue
        );


        const actions =
            document.createElement("div");

        actions.className =
            "booking-actions";


        const viewButton =
            document.createElement("a");

        viewButton.href =
            "confirmation.html";

        viewButton.className =
            "booking-view-button";

        viewButton.textContent =
            "View Ticket";


        actions.appendChild(
            viewButton
        );


        bottom.appendChild(price);
        bottom.appendChild(actions);


        main.appendChild(top);
        main.appendChild(details);
        main.appendChild(bottom);


        article.appendChild(
            posterWrapper
        );

        article.appendChild(main);


        container.appendChild(
            article
        );
    });
}


function addBookingDetail(
    parent,
    label,
    value
) {

    const item =
        document.createElement("div");

    item.className =
        "booking-detail-item";


    const labelElement =
        document.createElement("span");

    labelElement.textContent =
        label;


    const valueElement =
        document.createElement("strong");

    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );

    item.appendChild(
        valueElement
    );


    parent.appendChild(item);
}


/* =========================================================
   15. CONFIRMATION PAGE
   ========================================================= */

function updateConfirmationPage(
    bookings
) {

    const latestBooking =
        getStorage(
            "thashowbookLatestBooking",
            null
        );


    if (!latestBooking) {
        return;
    }


    const bookingId =
        document.getElementById(
            "bookingId"
        );

    const confirmedSeats =
        document.getElementById(
            "confirmedSeats"
        );

    const confirmedTicketCount =
        document.getElementById(
            "confirmedTicketCount"
        );

    const confirmedCustomerName =
        document.getElementById(
            "confirmedCustomerName"
        );

    const confirmedPayment =
        document.getElementById(
            "confirmedPayment"
        );

    const confirmedTotal =
        document.getElementById(
            "confirmedTotal"
        );


    const movieTicket =
        document.getElementById(
            "movieTicket"
        );


    if (bookingId) {
        bookingId.textContent =
            latestBooking.bookingId;
    }


    if (confirmedSeats) {

        confirmedSeats.textContent =
            latestBooking.seats
                ?.map(
                    (seat) => seat.seat
                )
                .join(", ") ||
                "Not available";
    }


    if (confirmedTicketCount) {

        confirmedTicketCount.textContent =
            latestBooking.seats
                ?.length || 0;
    }


    if (confirmedCustomerName) {

        confirmedCustomerName.textContent =
            latestBooking.customer?.name ||
            "Movie Guest";
    }


    if (confirmedPayment) {

        confirmedPayment.textContent =
            formatPaymentMethod(
                latestBooking.payment
            );
    }


    if (confirmedTotal) {

        confirmedTotal.textContent =
            `₹${latestBooking.total || 0}`;
    }


    if (!movieTicket) {
        return;
    }


    const movieImage =
        movieTicket.querySelector(
            ".ticket-movie img"
        );

    const movieTitle =
        movieTicket.querySelector(
            ".ticket-movie h2"
        );

    const movieGenre =
        movieTicket.querySelector(
            ".ticket-movie p"
        );


    if (movieImage) {

        movieImage.src =
            latestBooking.movieImage ||
            "images/movies/movie-01.jpg";

        movieImage.alt =
            `${latestBooking.movie} poster`;
    }


    if (movieTitle) {

        movieTitle.textContent =
            latestBooking.movie;
    }


    if (movieGenre) {

        movieGenre.textContent =
            latestBooking.genre ||
            "Movie";
    }


    const ticketDetails =
        movieTicket.querySelectorAll(
            ".ticket-detail"
        );


    ticketDetails.forEach((detail) => {

        const label =
            detail.querySelector("span")
                ?.textContent
                .trim()
                .toLowerCase();

        const value =
            detail.querySelector("strong");

        if (!value) {
            return;
        }


        if (label === "cinema") {
            value.textContent =
                latestBooking.cinema;
        }

        if (label === "date") {
            value.textContent =
                latestBooking.date;
        }

        if (label === "showtime") {
            value.textContent =
                latestBooking.time;
        }

        if (label === "format") {
            value.textContent =
                latestBooking.format;
        }

        if (label === "seats") {

            value.textContent =
                latestBooking.seats
                    ?.map(
                        (seat) =>
                            seat.seat
                    )
                    .join(", ") ||
                    "Not available";
        }

        if (label === "tickets") {

            value.textContent =
                latestBooking.seats
                    ?.length || 0;
        }

    });
}


/* =========================================================
   16. PAYMENT NAME
   ========================================================= */

function formatPaymentMethod(
    payment
) {

    if (payment === "upi") {
        return "UPI";
    }

    if (payment === "card") {
        return "Credit / Debit Card";
    }

    if (payment === "cash") {
        return "Cash at Cinema";
    }

    return "UPI";
}


/* =========================================================
   17. GENERAL MESSAGE
   ========================================================= */

function showMessage(
    message,
    type
) {

    let existing =
        document.getElementById(
            "siteMessage"
        );


    if (!existing) {

        existing =
            document.createElement(
                "div"
            );

        existing.id =
            "siteMessage";

        document.body.appendChild(
            existing
        );


        existing.style.position =
            "fixed";

        existing.style.left =
            "50%";

        existing.style.bottom =
            "25px";

        existing.style.zIndex =
            "2000";

        existing.style.transform =
            "translateX(-50%)";

        existing.style.maxWidth =
            "calc(100% - 30px)";

        existing.style.padding =
            "13px 18px";

        existing.style.borderRadius =
            "8px";

        existing.style.fontSize =
            "13px";

        existing.style.fontWeight =
            "700";

        existing.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.18)";
    }


    existing.textContent =
        message;


    existing.style.background =
        type === "error"
            ? "#fff0f0"
            : "#eaf8f0";

    existing.style.color =
        type === "error"
            ? "#d83b3b"
            : "#168a4b";


    clearTimeout(
        existing.messageTimer
    );


    existing.messageTimer =
        setTimeout(() => {

            existing.remove();

        }, 2800);
}