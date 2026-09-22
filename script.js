/* =========================================
   OLAYINKA PHOTOGRAPHY
   BOOKING SYSTEM
========================================= */


/* =========================================
   SETTINGS
========================================= */

// KEEP YOUR EXISTING PRIVATE N8N PRODUCTION WEBHOOK URL HERE
const N8N_BOOKING_WEBHOOK = "https://olayinka1-ph.app.n8n.cloud/webhook/olayinka-booking";


/* =========================================
   GENERATE BOOKING ID
========================================= */

function generateBookingId() {

    const number =
        Math.floor(100000 + Math.random() * 900000);

    return "OLY-" + number;
}


/* =========================================
   BOOKING FORM
========================================= */

const bookingForm =
    document.querySelector("#booking-form");

const bookingMessage =
    document.querySelector("#booking-message");

const confirmationSection =
    document.querySelector("#booking-confirmation");

const confirmationBookingId =
    document.querySelector("#confirmation-booking-id");


if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const bookingId =
                generateBookingId();

            const formData =
                new FormData(bookingForm);

            const bookingData = {

                bookingId: bookingId,

                name: formData.get("name"),

                email: formData.get("email"),

                phone: formData.get("phone"),

                service: formData.get("service"),

                date: formData.get("date"),

                time: formData.get("time"),

                location: formData.get("location"),

                message: formData.get("message"),

                status: "Pending",

                createdAt:
                    new Date().toISOString()
            };


            /* CHECK N8N URL */

            if (
                N8N_BOOKING_WEBHOOK ===
                "YOUR_EXISTING_N8N_PRODUCTION_WEBHOOK_URL"
            ) {

                if (bookingMessage) {

                    bookingMessage.textContent =
                        "Booking system is not connected yet.";

                    bookingMessage.style.display =
                        "block";
                }

                return;
            }


            /* SEND BOOKING TO N8N */

            try {

                const response =
                    await fetch(
                        N8N_BOOKING_WEBHOOK,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    bookingData
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "n8n request failed"
                    );
                }


                let result = {};

                try {

                    result =
                        await response.json();

                } catch (error) {

                    console.log(
                        "n8n returned no JSON response."
                    );

                }


                console.log(
                    "Booking sent to n8n:",
                    result
                );


                /* SUCCESS MESSAGE */

                if (bookingMessage) {

                    bookingMessage.textContent =
                        "Booking request sent successfully!";

                    bookingMessage.style.display =
                        "block";
                }


                /* BOOKING ID */

                if (confirmationBookingId) {

                    confirmationBookingId.textContent =
                        bookingId;
                }


                /* SHOW CONFIRMATION */

                if (confirmationSection) {

                    confirmationSection.style.display =
                        "block";

                    confirmationSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }


                /* RESET FORM */

                bookingForm.reset();


            } catch (error) {

                console.error(
                    "Booking submission failed:",
                    error
                );


                if (bookingMessage) {

                    bookingMessage.textContent =
                        "Sorry, your booking could not be sent. Please try again.";

                    bookingMessage.style.display =
                        "block";
                }

            }

        }
    );
}


/* =========================================
   MANAGE BOOKING
========================================= */

const manageBookingForm =
    document.querySelector("#manage-booking-form");

const bookingStatus =
    document.querySelector("#booking-status");


if (manageBookingForm) {

    manageBookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const bookingId =
                document
                    .querySelector("#booking-id")
                    .value
                    .trim();


            const bookingEmail =
                document
                    .querySelector("#booking-email")
                    .value
                    .trim();


            if (N8N_BOOKING_WEBHOOK === "") {

                alert(
                    "Booking management will be available after the backend is connected."
                );

                return;
            }


            fetch(
                N8N_BOOKING_WEBHOOK,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "check_booking",

                            bookingId:
                                bookingId,

                            email:
                                bookingEmail
                        })
                }
            )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Booking lookup failed"
                    );
                }

                return response.json();

            })

            .then(function (data) {

                console.log(
                    "Booking information:",
                    data
                );


                document.querySelector(
                    "#status-booking-id"
                ).textContent =
                    data.bookingId || bookingId;


                document.querySelector(
                    "#status-service"
                ).textContent =
                    data.service || "Not available";


                document.querySelector(
                    "#status-date"
                ).textContent =
                    data.date || "Not available";


                document.querySelector(
                    "#status-time"
                ).textContent =
                    data.time || "Not available";


                document.querySelector(
                    "#status-value"
                ).textContent =
                    data.status || "Pending";


                if (bookingStatus) {

                    bookingStatus.style.display =
                        "block";

                    bookingStatus.scrollIntoView({
                        behavior: "smooth"
                    });
                }

            })

            .catch(function () {

                alert(
                    "We could not find your booking. Please check your Booking ID and email."
                );

            });

        }
    );
}


/* =========================================
   CANCEL BOOKING
========================================= */

const cancelButton =
    document.querySelector(
        "#cancel-booking-button"
    );


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        async function () {

            /* ================================
               GET BOOKING INFORMATION
            ================================= */

            const bookingId =
                document
                    .querySelector("#booking-id")
                    .value
                    .trim();


            const bookingEmail =
                document
                    .querySelector("#booking-email")
                    .value
                    .trim();


            const customerName =
                document
                    .querySelector("#name")
                    ?.value
                    .trim() || "";


            const customerPhone =
                document
                    .querySelector("#phone")
                    ?.value
                    .trim() || "";


            const service =
                document
                    .querySelector("#status-service")
                    ?.textContent
                    .trim() || "";


            const originalDate =
                document
                    .querySelector("#status-date")
                    ?.textContent
                    .trim() || "";


            const originalTime =
                document
                    .querySelector("#status-time")
                    ?.textContent
                    .trim() || "";


            const cancellationReason =
                document
                    .querySelector("#cancellation-reason")
                    ?.value
                    .trim() || "";


            /* ================================
               CHECK BOOKING
            ================================= */

            if (!bookingId || !bookingEmail) {

                alert(
                    "Please check your booking first."
                );

                return;
            }


            /* ================================
               CHECK CANCELLATION REASON
            ================================= */

            if (!cancellationReason) {

                alert(
                    "Please enter a reason for cancelling your booking."
                );

                document
                    .querySelector("#cancellation-reason")
                    ?.focus();

                return;
            }


            /* ================================
               CONFIRM CANCELLATION
            ================================= */

            const confirmed =
                confirm(
                    "Are you sure you want to cancel this booking?"
                );


            if (!confirmed) {
                return;
            }


            /* ================================
               SEND TO N8N
            ================================= */

            try {

                const response =
                    await fetch(
                        N8N_BOOKING_WEBHOOK,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "cancel_booking",

                                    bookingId:
                                        bookingId,

                                    name:
                                        customerName,

                                    email:
                                        bookingEmail,

                                    phone:
                                        customerPhone,

                                    service:
                                        service,

                                    date:
                                        originalDate,

                                    time:
                                        originalTime,

                                    cancellationReason:
                                        cancellationReason,

                                    status:
                                        "Cancellation Requested"
                                })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Cancellation request failed"
                    );
                }


                let data = {};

                try {

                    data =
                        await response.json();

                } catch (error) {

                    console.log(
                        "n8n returned no JSON response."
                    );

                }


                console.log(
                    "Cancellation result:",
                    data
                );


                /* UPDATE STATUS */

                document.querySelector(
                    "#status-value"
                ).textContent =
                    data.status ||
                    "Cancellation Requested";


                /* CLEAR REASON */

                const reasonField =
                    document.querySelector(
                        "#cancellation-reason"
                    );

                if (reasonField) {
                    reasonField.value = "";
                }


                alert(
                    "Your cancellation request has been sent successfully."
                );


            } catch (error) {

                console.error(
                    "Cancellation submission failed:",
                    error
                );


                alert(
                    "We could not send your cancellation request. Please try again."
                );

            }

        }
    );
}


/* =========================================
   RESCHEDULE BOOKING
========================================= */

const rescheduleButton =
    document.querySelector(
        "#reschedule-booking-button"
    );


if (rescheduleButton) {

    rescheduleButton.addEventListener(
        "click",
        async function () {

            const bookingId =
                document
                    .querySelector("#booking-id")
                    .value
                    .trim();


            const bookingEmail =
                document
                    .querySelector("#booking-email")
                    .value
                    .trim();


            const newDate =
                document
                    .querySelector("#new-booking-date")
                    .value;


            const newTime =
                document
                    .querySelector("#new-booking-time")
                    .value;


            /* CHECK BOOKING */

            if (!bookingId || !bookingEmail) {

                alert(
                    "Please check your booking first."
                );

                return;
            }


            /* CHECK NEW DATE AND TIME */

            if (!newDate || !newTime) {

                alert(
                    "Please select a new date and exact time."
                );

                return;
            }


            /* CHECK N8N */

            if (N8N_BOOKING_WEBHOOK === "") {

                alert(
                    "Rescheduling will be available after the backend is connected."
                );

                return;
            }


            /* CONFIRM */

            const confirmed =
                confirm(
                    "Are you sure you want to request this new date and time?"
                );


            if (!confirmed) {
                return;
            }


            /* SEND RESCHEDULE REQUEST */

            try {

                const response =
                    await fetch(
                        N8N_BOOKING_WEBHOOK,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "reschedule_booking",

                                    bookingId:
                                        bookingId,

                                    email:
                                        bookingEmail,

                                    newDate:
                                        newDate,

                                    newTime:
                                        newTime
                                })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Reschedule request failed"
                    );
                }


                console.log(
                    "Reschedule request sent successfully."
                );


                /* UPDATE DISPLAY */

                document.querySelector(
                    "#status-date"
                ).textContent =
                    newDate;


                document.querySelector(
                    "#status-time"
                ).textContent =
                    newTime;


                document.querySelector(
                    "#status-value"
                ).textContent =
                    "Reschedule Requested";


                alert(
                    "Your reschedule request has been sent successfully."
                );


            } catch (error) {

                console.error(
                    "Reschedule submission failed:",
                    error
                );


                alert(
                    "We could not send your reschedule request. Please try again."
                );

            }

        }
    );
}


/* =========================================
   PREVENT PAST BOOKING DATES
========================================= */

const dateInput =
    document.querySelector("#date");


if (dateInput) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.min = today;
}


/* =========================================
   PREVENT PAST RESCHEDULE DATES
========================================= */

const newBookingDate =
    document.querySelector("#new-booking-date");


if (newBookingDate) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    newBookingDate.min = today;
}


/* =========================================
   WEBSITE READY
========================================= */

console.log(
    "Olayinka Photography booking system loaded successfully."
);