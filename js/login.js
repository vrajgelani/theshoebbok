/* =========================================================
   THASHOWBOOK
   LOGIN PAGE JAVASCRIPT
   ========================================================= */


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLoginPage();

    }
);


/* =========================================================
   LOGIN PAGE INITIALIZATION
   ========================================================= */

function initializeLoginPage() {


    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const registerForm =
        document.getElementById(
            "registerForm"
        );


    const loginPanel =
        document.getElementById(
            "loginPanel"
        );


    const registerPanel =
        document.getElementById(
            "registerPanel"
        );


    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    const loginPassword =
        document.getElementById(
            "loginPassword"
        );


    const openRegister =
        document.getElementById(
            "openRegister"
        );


    const backToLogin =
        document.getElementById(
            "backToLogin"
        );


    const loginMessage =
        document.getElementById(
            "loginMessage"
        );


    const registerMessage =
        document.getElementById(
            "registerMessage"
        );



    /* =====================================================
       SHOW / HIDE PASSWORD
       ===================================================== */

    if (
        togglePassword &&
        loginPassword
    ) {

        togglePassword.addEventListener(
            "click",
            function () {


                if (
                    loginPassword.type ===
                    "password"
                ) {

                    loginPassword.type =
                        "text";

                    togglePassword.textContent =
                        "Hide";

                }

                else {

                    loginPassword.type =
                        "password";

                    togglePassword.textContent =
                        "Show";

                }

            }
        );

    }



    /* =====================================================
       OPEN REGISTER
       ===================================================== */

    if (openRegister) {

        openRegister.addEventListener(
            "click",
            function () {

                loginPanel.hidden =
                    true;

                registerPanel.hidden =
                    false;


                clearMessage(
                    loginMessage
                );

            }
        );

    }



    /* =====================================================
       BACK TO LOGIN
       ===================================================== */

    if (backToLogin) {

        backToLogin.addEventListener(
            "click",
            function () {

                registerPanel.hidden =
                    true;

                loginPanel.hidden =
                    false;


                clearMessage(
                    registerMessage
                );

            }
        );

    }



    /* =====================================================
       LOGIN
       ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById(
                            "loginEmail"
                        )
                        .value
                        .trim();


                const password =
                    loginPassword
                        .value
                        .trim();


                const rememberMe =
                    document
                        .getElementById(
                            "rememberMe"
                        )
                        .checked;



                /* EMAIL */

                if (!isValidEmail(email)) {

                    showMessage(
                        loginMessage,
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;

                }



                /* PASSWORD */

                if (password.length < 4) {

                    showMessage(
                        loginMessage,
                        "Password must contain at least 4 characters.",
                        "error"
                    );

                    return;

                }



                /*
                   Check registered account
                */

                const savedUser =
                    localStorage.getItem(
                        "thashowbookUser"
                    );


                let userData = null;


                if (savedUser) {

                    try {

                        userData =
                            JSON.parse(
                                savedUser
                            );

                    }

                    catch (error) {

                        userData = null;

                    }

                }



                /*
                   If registered account exists,
                   check email and password.
                */

                if (
                    userData &&
                    userData.email &&
                    userData.password
                ) {

                    if (
                        userData.email !==
                        email
                    ) {

                        showMessage(
                            loginMessage,
                            "Email address is not registered.",
                            "error"
                        );

                        return;

                    }


                    if (
                        userData.password !==
                        password
                    ) {

                        showMessage(
                            loginMessage,
                            "Incorrect password.",
                            "error"
                        );

                        return;

                    }

                }



                /*
                   Demo login account
                   when no account exists.
                */

                const loggedInUser = {

                    name:
                        userData &&
                        userData.name
                            ? userData.name
                            : "thashowbook User",

                    email:
                        email,

                    loggedIn:
                        true,

                    loginTime:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "thashowbookLoggedIn",
                    JSON.stringify(
                        loggedInUser
                    )
                );


                /*
                   Remember me
                */

                if (rememberMe) {

                    localStorage.setItem(
                        "thashowbookRememberMe",
                        "true"
                    );

                }

                else {

                    localStorage.removeItem(
                        "thashowbookRememberMe"
                    );

                }



                /* SUCCESS */

                showMessage(
                    loginMessage,
                    "Login successful. Welcome to thashowbook!",
                    "success"
                );


                /*
                   Redirect after short delay
                */

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



    /* =====================================================
       REGISTER
       ===================================================== */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "registerName"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "registerEmail"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "registerPassword"
                        )
                        .value;


                const confirmPassword =
                    document
                        .getElementById(
                            "registerConfirmPassword"
                        )
                        .value;



                /* NAME */

                if (name.length < 2) {

                    showMessage(
                        registerMessage,
                        "Please enter your full name.",
                        "error"
                    );

                    return;

                }



                /* EMAIL */

                if (!isValidEmail(email)) {

                    showMessage(
                        registerMessage,
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;

                }



                /* PASSWORD */

                if (password.length < 4) {

                    showMessage(
                        registerMessage,
                        "Password must contain at least 4 characters.",
                        "error"
                    );

                    return;

                }



                /* CONFIRM PASSWORD */

                if (
                    password !==
                    confirmPassword
                ) {

                    showMessage(
                        registerMessage,
                        "Passwords do not match.",
                        "error"
                    );

                    return;

                }



                /* SAVE ACCOUNT */

                const userData = {

                    name:
                        name,

                    email:
                        email,

                    password:
                        password

                };


                localStorage.setItem(
                    "thashowbookUser",
                    JSON.stringify(
                        userData
                    )
                );



                /* SUCCESS */

                showMessage(
                    registerMessage,
                    "Account created successfully. You can now login.",
                    "success"
                );


                /*
                   Return to login after delay
                */

                setTimeout(
                    function () {

                        registerPanel.hidden =
                            true;

                        loginPanel.hidden =
                            false;


                        document
                            .getElementById(
                                "loginEmail"
                            )
                            .value =
                            email;


                        document
                            .getElementById(
                                "loginPassword"
                            )
                            .value =
                            "";


                        clearMessage(
                            registerMessage
                        );

                    },
                    900
                );

            }
        );

    }

}



/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}



/* =========================================================
   SHOW MESSAGE
   ========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.hidden =
        false;


    element.textContent =
        message;


    element.className =
        "auth-message " +
        type;

}



/* =========================================================
   CLEAR MESSAGE
   ========================================================= */

function clearMessage(element) {

    if (!element) {
        return;
    }


    element.hidden =
        true;


    element.textContent =
        "";


    element.className =
        "auth-message";

}