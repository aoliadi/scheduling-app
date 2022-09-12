"use strict";

let val;

const FORM = document.querySelector("#form-js"),
  INPUT = document.querySelector("#email-js"),
  SUBMIT_BTN = document.querySelector("#btn--submit-js"),
  MAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function checkInput(inputVal) {
  if (MAIL_REGEX.test(inputVal)) {
    SUBMIT_BTN.disabled = false;
    return;
  }

  SUBMIT_BTN.disabled = true;
}

function showInformation(dataObj) {
  return Swal.fire({
    title: `Booking Information`,
    html: `
            <table style="width:100%">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>${dataObj.lastName} ${dataObj.firstName}</td>		
                    </tr>
                    <tr>
                        <td>Identification Code</td>
                        <td>${dataObj.userId}</td>		
                    </tr>
                    <tr>
                        <td>Event</td>
                        <td>${dataObj.eventRegisteredFor}</td>		
                    </tr>
                    <tr>
                        <td>Event Centre</td>
                        <td>${dataObj.hallBookedFor}</td>		
                    </tr>
                    <tr>
                        <td>Seat Number</td>
                        <td>${dataObj.userSeatNumber}</td>		
                    </tr>
                    <tr>
                        <td>Telephone</td>
                        <td>${dataObj.telephone}</td>		
                    </tr>
                    <tr>
                        <td>Mail Address</td>
                        <td>${dataObj.mailAddress}</td>		
                    </tr>
                    <tr>
                        <td>Time of Registration</td>
                        <td>${dataObj.timeOfRegistration}</td>		
                    </tr>
                </tbody>
            </table>
            `,
    showConfirmButton: false,
    footer: `
                <a href="./check.html" class="decoration">
                    Thank you!
                </a>
            `,
    allowOutsideClick: false,
  });
}

function notFoundModal() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "This email address does not exist",
  });
}

function tryAgain() {
  Swal.fire({
    icon: "info",
    title: "Oops...",
    text: "Something went wrong! Please, try again.",
  });
}

function showRegInfo(userInfo) {
  let { lastName, userSeatNumber, hallBookedFor, eventRegisteredFor } =
    userInfo;

  return Swal.fire({
    icon: "success",
    title: `Hi, ${lastName}.`,
    html: `You are booked for ${eventRegisteredFor} at the ${hallBookedFor}.`,
    showCancelButton: true,
    confirmButtonText: "More information",
    cancelButtonText: `
                    <a href="./check.html" class="inherit--color">
                        Thank you!
                    </a>
                    `,
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    preConfirm: () => userInfo,
  });
}

function provideMoreInfo(searchResultArr) {
  let additionalInfo;

  Swal.fire({
    icon: "question",
    title: `Can you please provide more information?`,
    input: "select",
    inputOptions: {
      telephone: "Telephone",
      username: "Username",
      eventRegisteredFor: "Event you registered for",
      userId: "User ID",
    },
    inputPlaceholder: "Select an option",
    allowOutsideClick: false,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to select an option";
      }
      additionalInfo = value;
    },
    preConfirm: () => additionalInfo,
  })
    .then((newInfoTitle) => {
      Swal.fire({
        icon: "question",
        input: "text",
        inputPlaceholder: "Select an option",
        allowOutsideClick: false,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Input cannot be empty";
          }
          additionalInfo = value.toLowerCase();
        },
        preConfirm: () => additionalInfo,
      }).then((newInfoValue) => {
        let [newData] = searchResultArr.filter(
          (arrItem) => arrItem[newInfoTitle.value] == newInfoValue.value
        );
        showModal("FULL_INFO", newData);
        //   showInformation(newData);
      });
    })
    .then();
}

function showModal(action, data) {
  switch (action) {
    case "FULL_INFO":
      showInformation(data);
      break;

    case "NOT_FOUND":
      notFoundModal();
      break;

    case "MORE_INFO":
      provideMoreInfo(data);
      break;

    case "INFO_FOUND":
      showRegInfo(data);
      break;

    default:
      tryAgain();
      break;
  }
}

SUBMIT_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  // fetch("https://scheduleet.herokuapp.com/userProfiles?userId=" + `${val}`)
  fetch("http://localhost:8000/userProfiles?mailAddress=" + `${val}`)
    .then((res) => res.json())
    .then((searchResult) => {
      if (searchResult.length > 1) {
        showModal("MORE_INFO", searchResult);
        return;
      }

      if (searchResult.length < 1) {
        showModal("NOT_FOUND");
        return;
      }

      showModal("INFO_FOUND", [searchResult]).then((data) => {
        if (data.isConfirmed) {
          showModal("FULL_INFO", data.value);
        }
      });
    })
    .catch((err) => console.log(err.message));
  SUBMIT_BTN.disabled = true;
  FORM.reset();
});

INPUT.addEventListener("keyup", (e) => {
  val = e.target.value.toLowerCase();
  checkInput(val);
});
