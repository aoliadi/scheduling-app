"use strict";

let uri = `https://scheduleet.herokuapp.com/`;
// let uri = `http://localhost:8000/`;

const overallProcedure = {
  centres: null,

  centreInfo: null,

  eventsOnDatabase: [],

  currentUserDetails: {},

  domElements: {},

  handlesEvents: {},

  afterCheck: {
    firstName: false,
    lastName: false,
    mailAddress: false,
    username: false,
    telephone: false,
    centre: false,
  },

  createOptions(arr, purpose, defaultChoice) {
    //If items in arr is more than one, create a default option before accessing array contents.
    // if it is not more than one, set it as null so that the only option available is the only option created.
    let allTheOptions =
      arr.length > 1
        ? `<option value="null" data-id="null">
                                ${defaultChoice}
                            </option>`
        : null;

    arr.forEach((param) => {
      switch (purpose) {
        case "theEvents":
          // this is the arr (which is "param" in this block) recieved as theEvents.
          // [{"event": "FOSIC 2020","id": 7}]
          allTheOptions += `
                        <option value="${param.event}"">
                            ${param.event}
                        </option>
                    `;
          break;

        case "theCentres":
          // this is the arr (which is also "param" in this block) recieved as theCentres.
          // [{"id": 7,"hallName": "Old Town","hallId":"OLD", "capacity": 2500,"numOfAvailableSeat": 2500,"seatsOccupied": []}]
          allTheOptions += `
                        <option value="${param.hallName}" data-hallId="${param.hallId}">
                            ${param.hallName}
                        </option>
                    `;
          break;

        default:
          break;
      }
    });
    return allTheOptions;
  },

  addClassName(action, targetElement) {
    switch (action) {
      case "valid":
        targetElement.classList.remove("input--invalid");
        targetElement.classList.add("input--valid");
        break;

      case "invalid":
        targetElement.classList.remove("input--valid");
        targetElement.classList.add("input--invalid");
        break;

      case "normal":
        targetElement.classList.remove("input--invalid");
        targetElement.classList.remove("input--valid");
        targetElement.classList.add("input--normal");
        break;

      default:
        break;
    }
  },

  //starts operation
  initialize() {
    // this selects DOM elements
    this.selectDomElements();

    //calls for data for the different event options
    this.fetchData(uri + "events/")
      .then((events) => {
        // this loops through the data fetched and destructures to get the event in particular, then pushes to eventsOnDatabase
        for (const { event } of events) {
          this.eventsOnDatabase.push(event);
        }

        // this logic calls the createOptions function to create user-selectable options for the events fetched
        this.domElements.theEvent.innerHTML = this.createOptions(
          events,
          "theEvents",
          "Choose an event"
        );
        // this.domElements.loadingDiv.classList.add("hidden");
        // this.domElements.formWrapper.classList.remove("hidden");
      })
      .catch((err) => {
        // window.location.assign("./404.html")
      });
  },

  selectDomElements() {
    const domObjectKey = this.domElements;

    //query-select the elements from the DOM
    domObjectKey.theForm = document.querySelector("#form-js");
    domObjectKey.firstName = document.querySelector("#first_name-js");
    domObjectKey.lastName = document.querySelector("#last_name-js");
    domObjectKey.username = document.querySelector("#username-js");
    domObjectKey.mailAddress = document.querySelector("#email-js");
    domObjectKey.telephoneNumber = document.querySelector("#tel-js");
    domObjectKey.theEvent = document.querySelector("select#purpose-js");
    domObjectKey.theCentre = document.querySelector("select#centre-js");
    domObjectKey.submitButton = document.querySelector("#btn--submit-js");
    this.attachEvents(domObjectKey);

    // domObjectKey.alertUsername = document.querySelector('#alert__username-js');
    // domObjectKey.alertSeatNumber = document.querySelector('#alert__seat-number-js');
    // domObjectKey.alertContainer = document.querySelector('#alert__container-js');
    // domObjectKey.formElement = document.querySelector('#form__container-js');
    // domObjectKey.formWrapper = document.querySelector('.form__wrapper');
    // domObjectKey.loadingDiv = document.querySelector('#loading-js');
    // domObjectKey.alertCloseIcon = document.querySelector('#icon--close-js');
  },

  fetchData(uri) {
    const response = fetch(uri).then((res) => {
      if (res.status !== 200) {
        throw new Error("wrong endpoint");
      }
      return res.json();
    });

    return response;
  },

  attachEvents({
    username,
    firstName,
    lastName,
    mailAddress,
    telephoneNumber,
    submitButton,
    theEvent,
    theCentre,
    theForm,
  }) {
    const handlerObjectKey = this.handlesEvents;

    //add event listeners
    handlerObjectKey.checkFirstName = firstName.addEventListener("input", (e) =>
      this.validateInput(e, "firstName")
    );
    handlerObjectKey.checkLastName = lastName.addEventListener("input", (e) =>
      this.validateInput(e, "lastName")
    );
    handlerObjectKey.checkMailAddress = mailAddress.addEventListener(
      "input",
      (e) => this.validateInput(e, "mailAddress")
    );
    handlerObjectKey.checkUserName = username.addEventListener("input", (e) =>
      this.validateInput(e, "username")
    );
    handlerObjectKey.checkTelephone = telephoneNumber.addEventListener(
      "input",
      (e) => this.validateInput(e, "telephone")
    );
    handlerObjectKey.checkEvent = theEvent.addEventListener("change", (e) =>
      this.availableEvents(e)
    );
    handlerObjectKey.checkCentre = theCentre.addEventListener("change", (e) => {
      this.storeDetails("centre", e);
      this.readyForSubmission();
    });
    handlerObjectKey.submit = theForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submission();
    });
  },

  validateInput(e, label) {
    let regex,
      theResponse,
      theAction,
      theInputValue = e.target.value.trim();

    switch (label) {
      case "firstName":
      case "lastName":
        regex = /^[a-zA-Z]{2,15}$/;
        break;

      case "telephone":
        regex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;
        break;

      case "username":
        regex = /^[a-z0-9A-Z]{2,10}$/;
        break;

      case "mailAddress":
        regex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        break;

      default:
        console.log("nothing!");
        break;
    }

    theResponse = regex.test(theInputValue);
    theAction = theResponse ? "valid" : "invalid";

    this.afterCheck[`${label}`] = theResponse;
    this.addClassName(theAction, e.target);
    this.readyForSubmission();
    this.storeDetails(label, theInputValue);
  },

  availableEvents(e) {
    const chosenEvent = e.target.value;

    if (chosenEvent === "null") {
      // set the centres options as "choose an hall"
      this.domElements.theCentre.innerHTML = `<option value="null">Choose an hall</option>`;

      // also disables the centres options, so it is unclickable
      this.domElements.theCentre.disabled = true;

      // then set its value as false: meaning it hasn't been filled
      this.afterCheck["centre"] = false;

      this.readyForSubmission();
    } else {
      // this populates the user details with the event chosen into eventRegisteredFor
      this.storeDetails("eventRegisteredFor", chosenEvent);
      this.availableCentres(chosenEvent);
    }
  },

  availableCentres(theEvent) {
    let halls = null;

    //  this returns the chosen event after filter
    this.fetchData(uri + `events?event=${theEvent}`)
      .then((data) => {
        // the data will most likely always be a single-item array
        // so, we destructure its first (and only) item into theChosenOption
        const [theChosenOption] = data;

        // then its "halls" property value(s) is/are spread into "halls"
        // [{"id": 7,"event": "FOSIC 2020","halls": ["NEW"]}]
        halls = [...theChosenOption.halls];

        if (this.centres) {
          // if the centres have been fetched from database before, there is no need in fetching again
          // so, "this.centres" is collected by the ".then" as the data, instead of a response from a fetch
          return this.centres;
        } else {
          // if centres haven't been fetched from database, a fetch process is used
          // a promise is returned, and the ".then" collects the centres
          return this.fetchData(uri + "centres/");
        }
      })
      .then((data) => {
        // store all the centres
        this.centres = [...data];

        // the 1st filter function checks for centres hallId that matches any of the "halls" array-item and creates an array of the centres
        // the 2nd filter function removes any of the hall where there's no vacant seat for candidates
        let result = data
          .filter((item) => halls.includes(item.hallId))
          .filter((centre) => centre.numOfAvailableSeat !== 0);

        if (result.length > 1) {
          this.domElements.theCentre.disabled = false;
          this.afterCheck["centre"] = false;
          this.storeDetails("hallBookedFor", null);
        } else {
          this.domElements.theCentre.disabled = true;
          this.afterCheck["centre"] = true;
          this.centreInfo = result[0];
          this.storeDetails("hallBookedFor", result[0].hallName);
        }
        this.readyForSubmission();
        this.domElements.theCentre.innerHTML = this.createOptions(
          result,
          "theCentres",
          "Choose an hall"
        );
      })
      .catch((err) => {
        // window.location.assign("./404.html")
      });
  },

  storeDetails(param, val) {
    switch (param) {
      case "centre":
        const chosenCentre = val.target.value;

        //if selected list-option value is null, set "value" as false and store it as the afterCheck value, and submit button is still disabled.
        this.afterCheck[`${param}`] = chosenCentre == "null" ? false : true;

        [this.centreInfo] = this.centres.filter(
          (item) => item.hallName === chosenCentre
        );
        this.currentUserDetails["hallBookedFor"] = chosenCentre;
        break;

      default:
        this.currentUserDetails[`${param}`] = val;
        break;
    }
  },

  anyFalseValue(obj) {
    let arr = [];
    for (let [prop, val] of Object.entries(obj)) {
      arr.push(val);
    }

    return arr.includes(false);
  },

  readyForSubmission() {
    // this checks if there's any false prop value in the afterCheck object. If there isn't, it enables the submit button.
    this.enableSubmitButton(this.anyFalseValue(this.afterCheck));
  },

  enableSubmitButton(response) {
    // response = false;
    if (!response) {
      this.domElements.submitButton.disabled = false;
    } else {
      this.domElements.submitButton.disabled = true;
    }
  },

  submission() {
    const theCentre = this.centreInfo;

    if (
      theCentre.numOfAvailableSeat === 0 ||
      theCentre.seatsOccupied.length === theCentre.capacity
    ) {
      alert("Oooops! No seat available. Try again later");
    } else {
      const randomNumber = this.getRandomNumber(theCentre.numOfAvailableSeat);
      this.checkIfSeatIsAvailable(randomNumber);
    }
  },

  getRandomNumber(range) {
    let randomNumber = Math.floor(Math.random() * range);
    return randomNumber;
  },

  checkIfSeatIsAvailable(numberGenerated) {
    let theCentre = this.centreInfo;

    if (numberGenerated === 0 && !theCentre.seatsOccupied.includes(1)) {
      // debugger;
      numberGenerated = 1;
      // theCentre.seatsOccupied.push(numberGenerated);
      theCentre.numOfAvailableSeat -= 1;
    } else {
      // debugger;
      this.getRandomNumber(theCentre.numOfAvailableSeat);
    }

    // if seat is available, before giving seat number, let's store remaining userDetails

    let candidateNumber = this.addZeroes({
        theNumber: numberGenerated,
        desiredLength: theCentre.capacity.toString().length,
      }),
      dateFunc = new Date(),
      currentTime = dateFunc.toLocaleTimeString(),
      currentDate = dateFunc.toDateString(),
      currentYear = dateFunc.getFullYear().toString().slice(2);

    theCentre.numOfAvailableSeat -= 1;
    theCentre.seatsOccupied.push(candidateNumber);

    this.currentUserDetails.timeOfRegistration = `${currentDate} ${currentTime}`;
    this.currentUserDetails.userSeatNumber = candidateNumber;
    this.currentUserDetails.userId =
      "" + currentYear + theCentre.hallId + candidateNumber;

    //then giveSeatNumber to user
    this.giveSeatNumber();
  },

  giveSeatNumber() {
    let data = this.centreInfo;

    this.sendToDatabase({
      uri,
      endpoint: `centres/${data.id}`,
      data,
      method: "PUT",
    });

    data = this.currentUserDetails;
    this.sendToDatabase({
      uri,
      endpoint: "userProfiles/",
      data,
      method: "POST",
    });

    // this.redirectUserToAnotherPage();
  },

  // it addZeroes to numbers: 23 becomes 0023 based on the desiredLength value passed
  addZeroes({ desiredLength, range, theNumber }) {
    //if theNumber is not given, getRandomNumber with the given range
    let newNumber,
      number = theNumber || this.getRandomNumber(range);

    if (number.length !== desiredLength) {
      // this checks the number of zeroes to add
      let toAdd = desiredLength - number.toString().length,
        arr = Array(toAdd).fill(0); // creates an array filled with zeroes needed
      arr.push(number);
      newNumber = arr.join("");
    } else {
      newNumber = number;
    }

    return Number(newNumber);
  },

  sendToDatabase({ uri, endpoint, method, data }) {
    const otherOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(uri + endpoint, otherOptions);

    this.revealSeatNumber();
  },

  revealSeatNumber() {
    const { currentUserDetails: userInfo } = this;

    Swal.fire({
      icon: "success",
      title: `Your reservation has been made for ${userInfo.eventRegisteredFor}.`,
      showCancelButton: true,
      confirmButtonText: "My seat number",
      cancelButtonText: `
        <a href="./form.html" class="inherit--color">
          Reserve seat for another participant.
        </a>
      `,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: () => userInfo,
    }).then((data) => {
      if (data.isConfirmed) {
        Swal.fire({
          title: `Hello, ${data.value.lastName}`,
          html: `
              Your user ID is 
              <strong>${data.value.userId}</strong>.
              <br/>
          `,
          showConfirmButton: false,
          footer: `
              <a href="./form.html" class="decoration">
                Reserve seat for another participant.
              </a>
            `,
          allowOutsideClick: false,
        });
      }
    });
  },
};

window.addEventListener("DOMContentLoaded", () =>
  overallProcedure.initialize()
);
