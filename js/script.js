/* =========================================================
   THASHOWBOOK
   Main JavaScript
   Frontend Only - LocalStorage Based
   ========================================================= */


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
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    } catch (error) {
        console.error(
            "Storage error:",
            error
        );
    }
}


function generateBookingId() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const randomNumber =
        Math.floor(
            100 + Math.random() * 900
        );

    return (
        `TSB-${year}${month}${day}-${randomNumber}`
    );
}


function getSelectedShow() {

    const savedShow =
        getStorage(
            "thashowbookSelectedShow",
            null
        );

    if (savedShow) {
        return savedShow;
    }

    return {
        movie:
            "AAGAAZ",

        movieImage:
            "images/movies/movie-01.jpg",

        genre:
            "Action",

        cinema:
            "Thashow Central Cinema",

        date:
            "19 Sep 2026",

        time:
            "6:30 PM",

        format:
            "2D"
    };
}


function saveSelectedShow(show) {

    setStorage(
        "thashowbookSelectedShow",
        show
    );
}


/* =========================================================
   02. MOVIE DATABASE
   ========================================================= */

const movieDatabase = {

    "AAGAAZ": {
        title: "AAGAAZ",
        image: "images/movies/movie-01.jpg",
        genre: "Action",
        language: "Hindi",
        duration: "2h 24m",
        release: "2026",
        description:
            "A gripping Indian action drama filled with intense moments, powerful characters and an unforgettable cinematic journey."
    },

    "RAAZ": {
        title: "RAAZ",
        image: "images/movies/movie-02.jpg",
        genre: "Thriller",
        language: "Hindi",
        duration: "2h 16m",
        release: "2026",
        description:
            "A mysterious thriller where hidden secrets, strange clues and unexpected discoveries lead to a shocking mystery."
    },

    "DIL SE DIL TAK": {
        title: "DIL SE DIL TAK",
        image: "images/movies/movie-03.jpg",
        genre: "Romance",
        language: "Gujarati",
        duration: "2h 18m",
        release: "2026",
        description:
            "A heartfelt romantic drama about relationships, emotions and two people discovering what truly matters in life."
    },

    "HASO TOH JIVO": {
        title: "HASO TOH JIVO",
        image: "images/movies/movie-04.jpg",
        genre: "Comedy",
        language: "Hindi",
        duration: "2h 05m",
        release: "2026",
        description:
            "A fun-filled comedy about friendship, unforgettable situations and three friends who believe that life is better when you laugh."
    },

    "ANTARIKSH": {
        title: "ANTARIKSH",
        image: "images/movies/movie-05.jpg",
        genre: "Science Fiction",
        language: "Hindi",
        duration: "2h 28m",
        release: "2026",
        description:
            "A futuristic science-fiction adventure that takes the audience beyond Earth into an extraordinary journey through space."
    },

    "APNO GHAR": {
        title: "APNO GHAR",
        image: "images/movies/movie-06.jpg",
        genre: "Family Drama",
        language: "Hindi",
        duration: "2h 20m",
        release: "2026",
        description:
            "A warm family drama celebrating relationships, memories, togetherness and the meaning of having a place called home."
    },

    "RAHASYA": {
        title: "RAHASYA",
        image: "images/movies/movie-07.jpg",
        genre: "Mystery",
        language: "Hindi",
        duration: "2h 22m",
        release: "2026",
        description:
            "A suspenseful mystery filled with hidden clues, unexplained events and a journey to uncover the truth."
    },

    "SAFAR": {
        title: "SAFAR",
        image: "images/movies/movie-08.jpg",
        genre: "Adventure",
        language: "Hindi",
        duration: "2h 30m",
        release: "2026",
        description:
            "An adventurous journey across breathtaking landscapes where courage, friendship and discovery come together."
    },

    "JOSH": {
        title: "JOSH",
        image: "images/movies/movie-09.jpg",
        genre: "Sports Drama",
        language: "Hindi",
        duration: "2h 15m",
        release: "2026",
        description:
            "An inspiring sports drama about determination, discipline, teamwork and the journey towards achieving a dream."
    },

    "ANDHERI RAAT": {
        title: "ANDHERI RAAT",
        image: "images/movies/movie-10.jpg",
        genre: "Horror Mystery",
        language: "Hindi",
        duration: "2h 12m",
        release: "2026",
        description:
            "A dark mystery set around strange events and hidden secrets surrounding an isolated old mansion."
    }
};


/* =========================================================
   03. MOVIE SEARCH & FILTER
   ========================================================= */

function initializeMovieFilters() {

    const movieGrid =
        document.getElementById(
            "movieGrid"
        );

    if (!movieGrid) {
        return;
    }

    const movieItems =
        Array.from(
            movieGrid.querySelectorAll(
                ".movie-item, .movie-card, [data-title]"
            )
        );

    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );

    const searchInput =
        document.getElementById(
            "movieSearch"
        );

    if (
        movieItems.length === 0
    ) {
        return;
    }

    let selectedFilter =
        "all";


    const filterAliases = {

        all: [
            "all"
        ],

        action: [
            "action"
        ],

        thriller: [
            "thriller"
        ],

        romance: [
            "romance",
            "romantic",
            "romantic drama"
        ],

        comedy: [
            "comedy"
        ],

        "sci-fi": [
            "sci-fi",
            "science fiction",
            "science-fiction",
            "scifi"
        ],

        family: [
            "family",
            "family drama"
        ],

        mystery: [
            "mystery"
        ],

        adventure: [
            "adventure"
        ],

        sports: [
            "sports",
            "sports drama"
        ],

        horror: [
            "horror",
            "horror mystery"
        ]
    };


    function getMovieTitle(movie) {

        return (
            movie.dataset.title ||

            movie.querySelector(
                ".movie-title"
            )?.textContent ||

            movie.querySelector(
                "h3"
            )?.textContent ||

            movie.querySelector(
                "h2"
            )?.textContent ||

            ""
        )
            .trim()
            .toLowerCase();
    }


    function getMovieGenre(movie) {

        const datasetGenre =
            movie.dataset.genre ||
            movie.getAttribute(
                "data-category"
            ) ||
            "";


        const textGenre =
            movie.querySelector(
                ".movie-genre"
            )?.textContent ||

            movie.querySelector(
                ".movie-meta"
            )?.textContent ||

            "";


        return (
            `${datasetGenre} ${textGenre}`
        )
            .trim()
            .toLowerCase();
    }


    function filterMovies() {

        const searchText =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const aliases =
            filterAliases[
                selectedFilter
            ] || [
                selectedFilter
            ];


        let visibleMovies = 0;


        movieItems.forEach(
            function (movie) {

                const title =
                    getMovieTitle(
                        movie
                    );


                const genre =
                    getMovieGenre(
                        movie
                    );


                const matchesSearch =
                    !searchText ||

                    title.includes(
                        searchText
                    ) ||

                    genre.includes(
                        searchText
                    );


                const matchesFilter =
                    selectedFilter === "all" ||

                    aliases.some(
                        function (alias) {

                            return genre.includes(
                                alias
                            );

                        }
                    );


                const shouldShow =
                    matchesSearch &&
                    matchesFilter;


                movie.hidden =
                    !shouldShow;


                if (shouldShow) {
                    visibleMovies++;
                }

            }
        );


        const emptyState =
            document.getElementById(
                "movieEmptyState"
            );


        if (emptyState) {

            emptyState.hidden =
                visibleMovies !== 0;

        }

    }


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedFilter =
                        (
                            button.dataset.filter ||
                            "all"
                        )
                            .trim()
                            .toLowerCase();


                    filterMovies();

                }
            );

        }
    );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterMovies
        );

    }


    const activeButton =
        document.querySelector(
            ".filter-button.active"
        );


    if (activeButton) {

        selectedFilter =
            (
                activeButton.dataset.filter ||
                "all"
            )
                .trim()
                .toLowerCase();

    }


    filterMovies();

}


/* =========================================================
   04. GET MOVIE FROM URL
   ========================================================= */

function getSelectedMovieName() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const movieParameter =
        urlParams.get(
            "movie"
        );


    if (!movieParameter) {
        return "AAGAAZ";
    }


    return decodeURIComponent(
        movieParameter
    )
        .trim()
        .toUpperCase();
}


/* =========================================================
   05. LOAD MOVIE DETAILS
   ========================================================= */

function loadMovieDetails() {

    const movieTitleElement =
        document.getElementById(
            "movieDetailsTitle"
        );


    if (!movieTitleElement) {
        return;
    }


    const selectedMovieName =
        getSelectedMovieName();


    const movie =
        movieDatabase[
            selectedMovieName
        ];


    if (!movie) {
        return;
    }


    const poster =
        document.getElementById(
            "movieDetailsPoster"
        );


    if (poster) {

        poster.src =
            movie.image;

        poster.alt =
            movie.title;

    }


    const fields = {

        movieDetailsTitle:
            movie.title,

        movieDetailsGenre:
            movie.genre,

        movieDetailsLanguage:
            movie.language,

        movieDetailsDuration:
            movie.duration,

        movieDetailsDescription:
            movie.description,

        movieDetailsRelease:
            movie.release,

        movieDetailsRuntime:
            movie.duration,

        movieDetailsLanguageInfo:
            movie.language,

        informationMovieName:
            movie.title,

        informationGenre:
            movie.genre,

        informationLanguage:
            movie.language,

        informationDuration:
            movie.duration,

        movieInformationDescription:
            movie.description
    };


    Object.keys(fields).forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    fields[id];

            }

        }
    );


    document.title =
        movie.title +
        " | thashowbook";


    localStorage.setItem(
        "selectedMovie",
        JSON.stringify(
            movie
        )
    );

}


/* =========================================================
   06. SHOWTIME SELECTION
   ========================================================= */

function setupShowtimeSelection() {

    const showtimeButtons =
        document.querySelectorAll(
            ".showtime-button"
        );


    showtimeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    showtimeButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    localStorage.setItem(
                        "selectedShowtime",
                        button.dataset.time ||
                        button.textContent.trim()
                    );

                }
            );

        }
    );

}


/* =========================================================
   07. CINEMA SELECTION
   ========================================================= */

function setupCinemaSelection() {

    const cinemaInputs =
        document.querySelectorAll(
            'input[name="cinema"]'
        );


    cinemaInputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    localStorage.setItem(
                        "selectedCinema",
                        input.value
                    );

                }
            );

        }
    );

}


/* =========================================================
   08. CONTINUE TO SEATS
   ========================================================= */

function setupContinueButton() {

    const continueButton =
        document.getElementById(
            "continueToSeats"
        );


    if (!continueButton) {
        return;
    }


    continueButton.addEventListener(
        "click",
        function (event) {

            const selectedCinema =
                document.querySelector(
                    'input[name="cinema"]:checked'
                );


            const selectedDate =
                document.querySelector(
                    ".date-button.active"
                );


            const selectedShowtime =
                document.querySelector(
                    ".showtime-button.active"
                );


            if (!selectedCinema) {

                event.preventDefault();

                showMessage(
                    "Please select a cinema first.",
                    "error"
                );

                return;
            }


            if (!selectedDate) {

                event.preventDefault();

                showMessage(
                    "Please select a date first.",
                    "error"
                );

                return;
            }


            if (!selectedShowtime) {

                event.preventDefault();

                showMessage(
                    "Please select a showtime first.",
                    "error"
                );

                return;
            }


            const movieName =
                getSelectedMovieName();


            const movie =
                movieDatabase[
                    movieName
                ];


            const show = {

                movie:
                    movie
                        ? movie.title
                        : movieName,

                movieImage:
                    movie
                        ? movie.image
                        : "images/movies/movie-01.jpg",

                genre:
                    movie
                        ? movie.genre
                        : "Movie",

                cinema:
                    selectedCinema.value,

                date:
                    selectedDate.dataset.date,

                time:
                    selectedShowtime.dataset.time ||
                    selectedShowtime.textContent.trim(),

                format:
                    selectedShowtime.dataset.format ||
                    "2D"
            };


            saveSelectedShow(
                show
            );


            localStorage.setItem(
                "selectedDate",
                selectedDate.dataset.date
            );


            localStorage.setItem(
                "selectedCinema",
                selectedCinema.value
            );


            localStorage.setItem(
                "selectedShowtime",
                selectedShowtime.dataset.time ||
                selectedShowtime.textContent.trim()
            );

        }
    );

}


/* =========================================================
   09. SEAT SELECTION
   ========================================================= */

function initializeSeatSelection() {

    const seatMap =
        document.getElementById(
            "seatMap"
        );


    if (!seatMap) {
        return;
    }


    const seats =
        Array.from(
            seatMap.querySelectorAll(
                ".seat"
            )
        );


    const selectedSeatsElement =
        document.getElementById(
            "selectedSeats"
        );


    const ticketCountElement =
        document.getElementById(
            "ticketCount"
        );


    const totalElement =
        document.getElementById(
            "seatTotal"
        );


    const continueButton =
        document.getElementById(
            "continueToCheckout"
        );


    let selectedSeats =
        getStorage(
            "thashowbookSelectedSeats",
            []
        );


    if (!Array.isArray(selectedSeats)) {
        selectedSeats = [];
    }


    function updateSeatUI() {

        seats.forEach(
            function (seat) {

                const seatName =
                    seat.dataset.seat;


                const isSelected =
                    selectedSeats.some(
                        function (item) {

                            return (
                                item.seat ===
                                seatName
                            );

                        }
                    );


                if (isSelected) {

                    seat.classList.add(
                        "selected"
                    );

                } else {

                    seat.classList.remove(
                        "selected"
                    );

                }

            }
        );


        if (selectedSeatsElement) {

            selectedSeatsElement.textContent =
                selectedSeats.length > 0
                    ? selectedSeats
                        .map(
                            function (item) {
                                return item.seat;
                            }
                        )
                        .join(", ")
                    : "No seats selected";

        }


        if (ticketCountElement) {

            ticketCountElement.textContent =
                selectedSeats.length;

        }


        const total =
            selectedSeats.reduce(
                function (sum, item) {

                    return (
                        sum +
                        Number(
                            item.price || 0
                        )
                    );

                },
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


    seats.forEach(
        function (seat) {

            seat.addEventListener(
                "click",
                function () {

                    if (
                        seat.disabled ||
                        seat.classList.contains(
                            "booked"
                        )
                    ) {
                        return;
                    }


                    const seatName =
                        seat.dataset.seat;


                    if (!seatName) {
                        return;
                    }


                    const price =
                        Number(
                            seat.dataset.price
                        ) || 0;


                    const existingIndex =
                        selectedSeats.findIndex(
                            function (item) {

                                return (
                                    item.seat ===
                                    seatName
                                );

                            }
                        );


                    if (
                        existingIndex >= 0
                    ) {

                        selectedSeats.splice(
                            existingIndex,
                            1
                        );

                    } else {

                        selectedSeats.push(
                            {
                                seat:
                                    seatName,

                                price:
                                    price
                            }
                        );

                    }


                    updateSeatUI();

                }
            );

        }
    );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function (event) {

                if (
                    selectedSeats.length === 0
                ) {

                    event.preventDefault();

                    showMessage(
                        "Please select at least one seat.",
                        "error"
                    );

                    return;
                }


                const show =
                    getSelectedShow();


                setStorage(
                    "thashowbookBookingDraft",
                    {
                        show:
                            show,

                        seats:
                            selectedSeats
                    }
                );

            }
        );

    }


    updateSeatUI();

}


/* =========================================================
   10. CHECKOUT
   ========================================================= */

function initializeCheckout() {

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


    const confirmButton =
        document.getElementById(
            "confirmBookingButton"
        );


    if (
        !checkoutForm &&
        !confirmButton
    ) {
        return;
    }


    const draft =
        getStorage(
            "thashowbookBookingDraft",
            null
        );


    const show =
        draft?.show ||
        getSelectedShow();


    let seats =
        Array.isArray(
            draft?.seats
        )
            ? draft.seats
            : getStorage(
                "thashowbookSelectedSeats",
                []
            );


    if (!Array.isArray(seats)) {
        seats = [];
    }


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
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item?.price || 0
                    )
                );

            },
            0
        );


    const convenience =
        seats.length > 0
            ? seats.length * 25
            : 0;


    const tax =
        Math.round(
            (
                baseTicketPrice +
                convenience
            ) * 0.18
        );


    const total =
        baseTicketPrice +
        convenience +
        tax;


    if (checkoutSeats) {

        checkoutSeats.textContent =
            seats.length > 0
                ? seats
                    .map(
                        function (item) {
                            return item.seat;
                        }
                    )
                    .join(", ")
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


    updateCheckoutMovie(
        show
    );


    initializePaymentMethods();


    function getField(
        name,
        id
    ) {

        return (
            checkoutForm?.elements?.namedItem(
                name
            ) ||

            document.getElementById(
                id
            )
        );

    }


    function validateCustomerDetails() {

        const nameInput =
            getField(
                "fullName",
                "fullName"
            );


        const emailInput =
            getField(
                "email",
                "email"
            );


        const phoneInput =
            getField(
                "phone",
                "phone"
            );


        const cityInput =
            getField(
                "city",
                "city"
            );


        const name =
            nameInput?.value.trim() ||
            "";


        const email =
            emailInput?.value.trim() ||
            "";


        const phone =
            phoneInput?.value.trim() ||
            "";


        const city =
            cityInput?.value.trim() ||
            "";


        if (
            name.length < 2
        ) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            nameInput?.focus();

            return false;
        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email)
        ) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput?.focus();

            return false;
        }


        if (
            !/^\d{10}$/.test(
                phone
            )
        ) {

            showMessage(
                "Please enter a valid 10-digit mobile number.",
                "error"
            );

            phoneInput?.focus();

            return false;
        }


        if (
            city.length < 2
        ) {

            showMessage(
                "Please enter your city.",
                "error"
            );

            cityInput?.focus();

            return false;
        }


        return true;
    }


    function saveCustomerDetails() {

        const nameInput =
            getField(
                "fullName",
                "fullName"
            );


        const emailInput =
            getField(
                "email",
                "email"
            );


        const phoneInput =
            getField(
                "phone",
                "phone"
            );


        const cityInput =
            getField(
                "city",
                "city"
            );


        const customer = {

            name:
                nameInput?.value.trim() ||
                "",

            email:
                emailInput?.value.trim() ||
                "",

            phone:
                phoneInput?.value.trim() ||
                "",

            city:
                cityInput?.value.trim() ||
                ""
        };


        setStorage(
            "thashowbookCustomer",
            customer
        );


        return customer;
    }


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !validateCustomerDetails()
                ) {
                    return;
                }


                saveCustomerDetails();


                showMessage(
                    "Customer details saved.",
                    "success"
                );

            }
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    seats.length === 0
                ) {

                    showMessage(
                        "Please select your seats first.",
                        "error"
                    );

                    return;
                }


                if (!checkoutForm) {

                    showMessage(
                        "Checkout form not found.",
                        "error"
                    );

                    return;
                }


                if (
                    !validateCustomerDetails()
                ) {
                    return;
                }


                const customer =
                    saveCustomerDetails();


                const paymentInput =
                    document.querySelector(
                        'input[name="paymentMethod"]:checked'
                    );


                const paymentMethod =
                    paymentInput?.value ||
                    "cash";


                const movieName =
                    show.movie ||
                    "AAGAAZ";


                const movie =
                    movieDatabase[
                        movieName
                    ];


                const booking = {

                    bookingId:
                        generateBookingId(),

                    movie:
                        movieName,

                    movieImage:
                        show.movieImage ||

                        movie?.image ||

                        "images/movies/movie-01.jpg",

                    genre:
                        show.genre ||

                        movie?.genre ||

                        "Movie",

                    cinema:
                        show.cinema ||

                        "Thashow Central Cinema",

                    date:
                        show.date ||

                        "",

                    time:
                        show.time ||

                        "",

                    format:
                        show.format ||

                        "2D",

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
                        new Date()
                            .toISOString()
                };


                const savedBookings =
                    getStorage(
                        "thashowbookBookings",
                        []
                    );


                const bookings =
                    Array.isArray(
                        savedBookings
                    )
                        ? savedBookings
                        : [];


                bookings.push(
                    booking
                );


                setStorage(
                    "thashowbookBookings",
                    bookings
                );


                setStorage(
                    "thashowbookLatestBooking",
                    booking
                );


                localStorage.removeItem(
                    "thashowbookBookingDraft"
                );


                localStorage.removeItem(
                    "thashowbookSelectedSeats"
                );


                window.location.href =
                    "confirmation.html";

            }
        );

    }

}


/* =========================================================
   11. CHECKOUT MOVIE SUMMARY
   ========================================================= */

function updateCheckoutMovie(
    show
) {

    if (!show) {
        return;
    }


    const movieTitle =
        document.getElementById(
            "checkoutMovie"
        );


    const cinema =
        document.getElementById(
            "checkoutCinema"
        );


    const date =
        document.getElementById(
            "checkoutDate"
        );


    const time =
        document.getElementById(
            "checkoutTime"
        );


    const movieImage =
        document.getElementById(
            "checkoutMovieImage"
        );


    if (movieTitle) {

        movieTitle.textContent =
            show.movie ||
            "Movie";

    }


    if (cinema) {

        cinema.textContent =
            show.cinema ||
            "Cinema";

    }


    if (date) {

        date.textContent =
            show.date ||
            "Date";

    }


    if (time) {

        time.textContent =
            show.time ||
            "Time";

    }


    if (movieImage) {

        movieImage.src =
            show.movieImage ||

            movieDatabase[
                show.movie
            ]?.image ||

            "images/movies/movie-01.jpg";


        movieImage.alt =
            `${show.movie || "Movie"} poster`;

    }

}


/* =========================================================
   12. PAYMENT METHODS
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
        paymentInputs.length === 0
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


    paymentInputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                updatePaymentFields
            );

        }
    );


    updatePaymentFields();

}


/* =========================================================
   13. LOGIN / REGISTER
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


    const loginSection =
        document.getElementById(
            "loginSection"
        );


    const registerSection =
        document.getElementById(
            "registerSection"
        );


    const showRegisterButton =
        document.getElementById(
            "showRegister"
        );


    const showLoginButton =
        document.getElementById(
            "showLogin"
        );


    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    const toggleRegisterPassword =
        document.getElementById(
            "toggleRegisterPassword"
        );


    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            function () {

                const input =
                    document.getElementById(
                        "loginPassword"
                    );


                if (!input) {
                    return;
                }


                input.type =
                    input.type === "password"
                        ? "text"
                        : "password";

            }
        );

    }


    if (toggleRegisterPassword) {

        toggleRegisterPassword.addEventListener(
            "click",
            function () {

                const input =
                    document.getElementById(
                        "registerPassword"
                    );


                if (!input) {
                    return;
                }


                input.type =
                    input.type === "password"
                        ? "text"
                        : "password";

            }
        );

    }


    if (showRegisterButton) {

        showRegisterButton.addEventListener(
            "click",
            function () {

                if (loginSection) {
                    loginSection.hidden =
                        true;
                }


                if (registerSection) {
                    registerSection.hidden =
                        false;
                }

            }
        );

    }


    if (showLoginButton) {

        showLoginButton.addEventListener(
            "click",
            function () {

                if (registerSection) {
                    registerSection.hidden =
                        true;
                }


                if (loginSection) {
                    loginSection.hidden =
                        false;
                }

            }
        );

    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "loginEmail"
                    );


                const passwordInput =
                    document.getElementById(
                        "loginPassword"
                    );


                const rememberInput =
                    document.getElementById(
                        "rememberMe"
                    );


                const email =
                    emailInput
                        ? emailInput.value
                            .trim()
                            .toLowerCase()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                const rememberMe =
                    rememberInput
                        ? rememberInput.checked
                        : false;


                if (!email) {

                    showMessage(
                        "Please enter your email.",
                        "error"
                    );

                    return;
                }


                if (!password) {

                    showMessage(
                        "Please enter your password.",
                        "error"
                    );

                    return;
                }


                let userData =
                    getStorage(
                        "thashowbookUser",
                        null
                    );


                const users =
                    getStorage(
                        "thashowbookUsers",
                        []
                    );


                if (
                    !userData &&
                    Array.isArray(users)
                ) {

                    userData =
                        users.find(
                            function (user) {

                                return (
                                    user.email
                                        ?.toLowerCase() ===
                                    email
                                );

                            }
                        ) || null;

                }


                if (
                    userData &&
                    userData.email
                ) {

                    if (
                        userData.email
                            .toLowerCase() !==
                        email
                    ) {

                        showMessage(
                            "Email address is not registered.",
                            "error"
                        );

                        return;
                    }


                    if (
                        userData.password &&
                        userData.password !==
                        password
                    ) {

                        showMessage(
                            "Incorrect password.",
                            "error"
                        );

                        return;
                    }

                }


                const loggedInUser = {

                    name:
                        userData?.name ||
                        "thashowbook User",

                    email:
                        email,

                    phone:
                        userData?.phone ||
                        "",

                    loggedIn:
                        true,

                    loginTime:
                        new Date()
                            .toISOString()
                };


                setStorage(
                    "thashowbookLoggedIn",
                    loggedInUser
                );


                if (rememberMe) {

                    localStorage.setItem(
                        "thashowbookRememberMe",
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        "thashowbookRememberMe"
                    );

                }


                showMessage(
                    "Login successful. Welcome to thashowbook!",
                    "success"
                );


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


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "registerName"
                    );


                const emailInput =
                    document.getElementById(
                        "registerEmail"
                    );


                const phoneInput =
                    document.getElementById(
                        "registerPhone"
                    );


                const passwordInput =
                    document.getElementById(
                        "registerPassword"
                    );


                const confirmPasswordInput =
                    document.getElementById(
                        "registerConfirmPassword"
                    );


                const name =
                    nameInput?.value.trim() ||
                    "";


                const email =
                    emailInput?.value
                        .trim()
                        .toLowerCase() ||
                    "";


                const phone =
                    phoneInput?.value.trim() ||
                    "";


                const password =
                    passwordInput?.value ||
                    "";


                const confirmPassword =
                    confirmPasswordInput?.value ||
                    "";


                if (
                    name.length < 2
                ) {

                    showMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    return;
                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                if (
                    phone &&
                    !/^\d{10}$/.test(
                        phone
                    )
                ) {

                    showMessage(
                        "Please enter a valid 10-digit mobile number.",
                        "error"
                    );

                    return;
                }


                if (
                    password.length < 4
                ) {

                    showMessage(
                        "Password must contain at least 4 characters.",
                        "error"
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }


                let users =
                    getStorage(
                        "thashowbookUsers",
                        []
                    );


                if (!Array.isArray(users)) {
                    users = [];
                }


                const emailExists =
                    users.some(
                        function (user) {

                            return (
                                user.email
                                    ?.toLowerCase() ===
                                email
                            );

                        }
                    );


                if (emailExists) {

                    showMessage(
                        "An account with this email already exists.",
                        "error"
                    );

                    return;
                }


                const newUser = {

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone,

                    password:
                        password
                };


                users.push(
                    newUser
                );


                setStorage(
                    "thashowbookUsers",
                    users
                );


                setStorage(
                    "thashowbookUser",
                    newUser
                );


                showMessage(
                    "Registration successful. Please login.",
                    "success"
                );


                if (registerSection) {
                    registerSection.hidden =
                        true;
                }


                if (loginSection) {
                    loginSection.hidden =
                        false;
                }

            }
        );

    }

}


/* =========================================================
   14. MOVIE SELECTION
   ========================================================= */

function initializeMovieSelection() {

    const movieItems =
        document.querySelectorAll(
            ".movie-item, .movie-card"
        );


    if (
        movieItems.length === 0
    ) {
        return;
    }


    movieItems.forEach(
        function (movie) {

            movie.addEventListener(
                "click",
                function (event) {

                    const clickedButton =
                        event.target.closest(
                            "button, a"
                        );


                    if (
                        clickedButton &&
                        clickedButton.href
                    ) {
                        return;
                    }


                    const title =
                        movie.dataset.title ||

                        movie.querySelector(
                            ".movie-title"
                        )?.textContent ||

                        movie.querySelector(
                            "h3"
                        )?.textContent ||

                        "";


                    if (!title.trim()) {
                        return;
                    }


                    const encodedTitle =
                        encodeURIComponent(
                            title.trim()
                        );


                    window.location.href =
                        "movie-details.html?movie=" +
                        encodedTitle;

                }
            );

        }
    );

}


/* =========================================================
   15. BOOKING TABS
   ========================================================= */

function initializeBookingTabs() {

    const tabButtons =
        document.querySelectorAll(
            ".booking-tab"
        );


    const tabPanels =
        document.querySelectorAll(
            ".booking-panel"
        );


    if (
        tabButtons.length === 0
    ) {
        return;
    }


    tabButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const target =
                        button.dataset.target;


                    tabButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tabPanels.forEach(
                        function (panel) {

                            panel.hidden =
                                true;

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const targetPanel =
                        document.getElementById(
                            target
                        );


                    if (targetPanel) {

                        targetPanel.hidden =
                            false;

                    }

                }
            );

        }
    );

}


/* =========================================================
   16. BOOKING DATA
   ========================================================= */

function loadBookingData() {

    const container =
        document.getElementById(
            "bookingList"
        );


    if (!container) {
        return;
    }


    const bookings =
        getStorage(
            "thashowbookBookings",
            []
        );


    container.innerHTML =
        "";


    const emptyState =
        document.getElementById(
            "bookingEmptyState"
        );


    if (
        !Array.isArray(bookings) ||
        bookings.length === 0
    ) {

        if (emptyState) {
            emptyState.hidden =
                false;
        }

        return;
    }


    if (emptyState) {
        emptyState.hidden =
            true;
    }


    bookings
        .slice()
        .reverse()
        .forEach(
            function (booking) {

                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "booking-card";


                const posterWrapper =
                    document.createElement(
                        "div"
                    );


                posterWrapper.className =
                    "booking-poster";


                const poster =
                    document.createElement(
                        "img"
                    );


                poster.src =
                    booking.movieImage ||
                    "images/movies/movie-01.jpg";


                poster.alt =
                    booking.movie ||
                    "Movie";


                posterWrapper.appendChild(
                    poster
                );


                const main =
                    document.createElement(
                        "div"
                    );


                main.className =
                    "booking-main";


                const top =
                    document.createElement(
                        "div"
                    );


                top.className =
                    "booking-top";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    booking.movie ||
                    "Movie";


                const bookingId =
                    document.createElement(
                        "span"
                    );


                bookingId.textContent =
                    booking.bookingId ||
                    "";


                top.appendChild(
                    title
                );


                top.appendChild(
                    bookingId
                );


                const details =
                    document.createElement(
                        "div"
                    );


                details.className =
                    "booking-details";


                addBookingDetail(
                    details,
                    "Cinema",
                    booking.cinema ||
                    "Cinema"
                );


                addBookingDetail(
                    details,
                    "Date",
                    booking.date ||
                    "Date"
                );


                addBookingDetail(
                    details,
                    "Time",
                    booking.time ||
                    "Time"
                );


                const seatText =
                    Array.isArray(
                        booking.seats
                    )
                        ? booking.seats
                            .map(
                                function (seat) {
                                    return seat.seat;
                                }
                            )
                            .join(", ")
                        : "Not available";


                addBookingDetail(
                    details,
                    "Seats",
                    seatText
                );


                addBookingDetail(
                    details,
                    "Payment",
                    formatPaymentMethod(
                        booking.payment
                    )
                );


                const bottom =
                    document.createElement(
                        "div"
                    );


                bottom.className =
                    "booking-bottom";


                const total =
                    document.createElement(
                        "strong"
                    );


                total.textContent =
                    `₹${booking.total || 0}`;


                bottom.appendChild(
                    total
                );


                main.appendChild(
                    top
                );


                main.appendChild(
                    details
                );


                main.appendChild(
                    bottom
                );


                article.appendChild(
                    posterWrapper
                );


                article.appendChild(
                    main
                );


                container.appendChild(
                    article
                );

            }
        );

}


function addBookingDetail(
    parent,
    label,
    value
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "booking-detail-item";


    const labelElement =
        document.createElement(
            "span"
        );


    labelElement.textContent =
        label;


    const valueElement =
        document.createElement(
            "strong"
        );


    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );


    item.appendChild(
        valueElement
    );


    parent.appendChild(
        item
    );

}


/* =========================================================
   17. CONFIRMATION PAGE
   ========================================================= */

function updateConfirmationPage() {

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


    if (bookingId) {

        bookingId.textContent =
            latestBooking.bookingId ||
            "";

    }


    const seats =
        Array.isArray(
            latestBooking.seats
        )
            ? latestBooking.seats
            : [];


    if (confirmedSeats) {

        confirmedSeats.textContent =
            seats.length > 0

                ? seats
                    .map(
                        function (seat) {
                            return seat.seat;
                        }
                    )
                    .join(", ")

                : "Not available";

    }


    if (confirmedTicketCount) {

        confirmedTicketCount.textContent =
            seats.length;

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


    const movieTicket =
        document.getElementById(
            "movieTicket"
        );


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
            `${latestBooking.movie || "Movie"} poster`;

    }


    if (movieTitle) {

        movieTitle.textContent =
            latestBooking.movie ||
            "Movie";

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


    ticketDetails.forEach(
        function (detail) {

            const labelElement =
                detail.querySelector(
                    "span"
                );


            const valueElement =
                detail.querySelector(
                    "strong"
                );


            if (
                !labelElement ||
                !valueElement
            ) {
                return;
            }


            const label =
                labelElement
                    .textContent
                    .trim()
                    .toLowerCase();


            if (
                label.includes(
                    "cinema"
                )
            ) {

                valueElement.textContent =
                    latestBooking.cinema ||
                    "";

            }


            if (
                label.includes(
                    "date"
                )
            ) {

                valueElement.textContent =
                    latestBooking.date ||
                    "";

            }


            if (
                label.includes(
                    "time"
                )
            ) {

                valueElement.textContent =
                    latestBooking.time ||
                    "";

            }


            if (
                label.includes(
                    "seat"
                )
            ) {

                valueElement.textContent =
                    seats
                        .map(
                            function (seat) {
                                return seat.seat;
                            }
                        )
                        .join(", ");

            }

        }
    );

}


/* =========================================================
   18. DATE SELECTION
   ========================================================= */

function setupDynamicDates() {

    const dayNames = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"
    ];


    const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];


    const today =
        new Date();


    let dateButtonsFound =
        false;


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const date =
            new Date(
                today
            );


        date.setDate(
            today.getDate() + i
        );


        const dayElement =
            document.getElementById(
                "dateDay" +
                (i + 1)
            );


        const numberElement =
            document.getElementById(
                "dateNumber" +
                (i + 1)
            );


        const monthElement =
            document.getElementById(
                "dateMonth" +
                (i + 1)
            );


        const buttonElement =
            document.getElementById(
                "dateButton" +
                (i + 1)
            );


        if (
            !dayElement ||
            !numberElement ||
            !monthElement ||
            !buttonElement
        ) {
            continue;
        }


        dateButtonsFound =
            true;


        dayElement.textContent =
            dayNames[
                date.getDay()
            ];


        numberElement.textContent =
            date.getDate();


        monthElement.textContent =
            monthNames[
                date.getMonth()
            ];


        buttonElement.dataset.date =
            formatDateForStorage(
                date
            );


        buttonElement.dataset.displayDate =
            date.toDateString();

    }


    if (dateButtonsFound) {

        const firstButton =
            document.getElementById(
                "dateButton1"
            );


        if (firstButton) {

            const buttons =
                document.querySelectorAll(
                    ".date-button"
                );


            buttons.forEach(
                function (button) {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            firstButton.classList.add(
                "active"
            );


            localStorage.setItem(
                "selectedDate",
                firstButton.dataset.date
            );

        }

    }


    setupDateButtonClicks();

}


function formatDateForStorage(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


function setupDateButtonClicks() {

    const dateButtons =
        document.querySelectorAll(
            ".date-button"
        );


    dateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    dateButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    localStorage.setItem(
                        "selectedDate",
                        button.dataset.date
                    );

                }
            );

        }
    );

}


/* =========================================================
   19. PAYMENT FORMAT
   ========================================================= */

function formatPaymentMethod(
    payment
) {

    if (
        payment === "upi"
    ) {
        return "UPI";
    }


    if (
        payment === "card"
    ) {
        return "Credit / Debit Card";
    }


    if (
        payment === "cash"
    ) {
        return "Cash at Cinema";
    }


    return "Cash at Cinema";
}


/* =========================================================
   20. GENERAL MESSAGE
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


        existing.setAttribute(
            "role",
            "status"
        );


        document.body.appendChild(
            existing
        );

    }


    existing.textContent =
        message;


    existing.style.position =
        "fixed";


    existing.style.left =
        "50%";


    existing.style.bottom =
        "25px";


    existing.style.transform =
        "translateX(-50%)";


    existing.style.zIndex =
        "99999";


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
        setTimeout(
            function () {

                existing.remove();

            },
            2800
        );

}


/* =========================================================
   21. HEADER LOGIN / PROFILE
   ========================================================= */

function initializeHeaderAccount() {

    const loginButton =
        document.querySelector(
            ".header-actions .login-button"
        );


    if (!loginButton) {
        return;
    }


    const savedLogin =
        localStorage.getItem(
            "thashowbookLoggedIn"
        );


    if (!savedLogin) {

        loginButton.textContent =
            "Login";


        loginButton.href =
            "login.html";


        loginButton.classList.remove(
            "profile-button"
        );


        return;
    }


    let user =
        null;


    try {

        user =
            JSON.parse(
                savedLogin
            );

    } catch (error) {

        user = null;

    }


    if (
        user &&
        user.loggedIn === true
    ) {

        loginButton.textContent =
            "Profile";


        loginButton.href =
            "profile.html";


        loginButton.classList.add(
            "profile-button"
        );

    } else {

        localStorage.removeItem(
            "thashowbookLoggedIn"
        );


        loginButton.textContent =
            "Login";


        loginButton.href =
            "login.html";


        loginButton.classList.remove(
            "profile-button"
        );

    }

}


/* =========================================================
   22. PROFILE PAGE
   ========================================================= */

function initializeProfilePage() {

    const profileName =
        document.getElementById(
            "profileName"
        );


    if (!profileName) {
        return;
    }


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileNameRow =
        document.getElementById(
            "profileNameRow"
        );


    const profileEmailRow =
        document.getElementById(
            "profileEmailRow"
        );


    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const savedLogin =
        localStorage.getItem(
            "thashowbookLoggedIn"
        );


    if (!savedLogin) {

        window.location.href =
            "login.html";

        return;
    }


    let user =
        null;


    try {

        user =
            JSON.parse(
                savedLogin
            );

    } catch (error) {

        localStorage.removeItem(
            "thashowbookLoggedIn"
        );


        window.location.href =
            "login.html";

        return;

    }


    if (
        !user ||
        user.loggedIn !== true
    ) {

        localStorage.removeItem(
            "thashowbookLoggedIn"
        );


        window.location.href =
            "login.html";

        return;
    }


    const name =
        user.name ||
        "thashowbook User";


    const email =
        user.email ||
        "";


    profileName.textContent =
        name;


    if (profileEmail) {

        profileEmail.textContent =
            email;

    }


    if (profileNameRow) {

        profileNameRow.textContent =
            name;

    }


    if (profileEmailRow) {

        profileEmailRow.textContent =
            email;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                localStorage.removeItem(
                    "thashowbookLoggedIn"
                );


                localStorage.removeItem(
                    "thashowbookRememberMe"
                );


                window.location.href =
                    "index.html";

            }
        );

    }

}


/* =========================================================
   23. PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* HEADER */

        initializeHeaderAccount();

        initializeProfilePage();


        /* MOVIES */

        initializeMovieFilters();

        initializeMovieSelection();

        loadMovieDetails();


        /* SHOW / BOOKING */

        setupDynamicDates();

        setupShowtimeSelection();

        setupCinemaSelection();

        setupContinueButton();


        /* SEATS */

        initializeSeatSelection();


        /* CHECKOUT */

        initializeCheckout();

        initializePaymentMethods();


        /* LOGIN */

        initializeLogin();


        /* BOOKINGS */

        initializeBookingTabs();

        loadBookingData();


        /* CONFIRMATION */

        updateConfirmationPage();

    }
);