"use strict";

// let uri = `https://scheduleet.herokuapp.com/`;
let uri = `http://localhost:8000/`;
 
const overallProcedure = {

    centres: null,

    centreInfo: null,

    eventsOnDatabase: [],

    currentUserDetails: {},
     
    domElements: {
        // loadingDiv: null,
        // formWrapper: null,
        // usernameInput: null,

        // alertContainer: null,
        // alertSeatNumber: null,
        // alertUsername: null,
        // alertCloseIcon: null,
    },
    
    handlesEvents: {
        // form: null,
        // closeAlert: null,
    },

    afterCheck: {
        firstName: false,
        lastName: false,
        mailAddress: false,
        userName: false,
        telephone: false,
        centre: false
    },

    createOptions(arr, purpose, defaultChoice) {
        //If items in the array (i.e. arr) is more than one, create a default option before accessing array contents.
        // if it is not more than one, set it as null so that the only option is the only one created.
        let allTheOptions = (arr.length > 1) ? 
                            `<option value="null" data-id="null">
                                ${defaultChoice}
                            </option>`
                            : null;

        arr.forEach(param => {

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

    validClassName(action, targetElement) {
        // console.log(action, targetElement);
        if(action === "add") {
            targetElement.classList.remove('input--invalid');
            targetElement.classList.add('input--valid');
        } else {
            targetElement.classList.remove('input--valid');
            targetElement.classList.add('input--invalid');
        }
    },

    //starts operation
    initialize() {
        // this selects DOM elements
        this.selectDomElements();
        
        //calls for data for the different event options
        this.fetchData( uri + 'events/' )
        .then( events => {
            // this loops through the data fetched and destructures to get the event in particular, then pushes to eventsOnDatabase
            for (const {event} of events) { this.eventsOnDatabase.push(event) };

            // this logic calls the createOptions function to create user-selectable options for the events fetched
            this.domElements.theEvent.innerHTML = this.createOptions(events, "theEvents", "Choose an event");
            // this.domElements.loadingDiv.classList.add("hidden");
            // this.domElements.formWrapper.classList.remove("hidden");
        }).catch( err => {
            // window.location.assign("./404.html")
        });

    },

    selectDomElements() {
        const domObjectKey = this.domElements;
        
        //query-select the elements from the DOM
        domObjectKey.theForm = document.querySelector("#form-js");
        domObjectKey.firstName = document.querySelector("#first_name-js");
        domObjectKey.lastName = document.querySelector("#last_name-js");
        domObjectKey.userName = document.querySelector("#username-js");
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

    //fetch necessary data
    fetchData( uri ) {
        const response = fetch( uri ).then(res => {
            if( res.status !== 200 ) {
                throw new Error('wrong endpoint')
            }
            return res.json();
        });

        return response;
    },
    
    //attach event listeners
    attachEvents({ userName, firstName, lastName, mailAddress, telephoneNumber, submitButton, theEvent, theCentre }) {
        const handlerObjectKey = this.handlesEvents;

        //add event listeners
        handlerObjectKey.checkFirstName = firstName.addEventListener( "input", (e) => this.validateInput(e, "firstName"));
        handlerObjectKey.checkLastName = lastName.addEventListener( "input", (e) => this.validateInput(e, "lastName") );
        handlerObjectKey.checkMailAddress = mailAddress.addEventListener( "input", (e) => this.validateInput(e, "mailAddress") );
        handlerObjectKey.checkUserName = userName.addEventListener( "input", (e) => this.validateInput(e, "userName") );
        handlerObjectKey.checkTelephone = telephoneNumber.addEventListener( "input", (e) => this.validateInput(e, "telephone") );
        handlerObjectKey.checkEvent = theEvent.addEventListener( "change", (e) => this.availableEvents(e) );
        handlerObjectKey.checkCentre = theCentre.addEventListener( "change", (e) => this.storeDetails("centre", e) );
        handlerObjectKey.submit = submitButton.addEventListener( "click", (e) => this.submission(e) );
        // handlerObjectKey.form = formElem.addEventListener( "onsubmit", (e) => this.revealSeatNumber() );
        // handlerObjectKey.closeAlert = closeIcon.addEventListener( "click", (e) => this.redirectUserToAnotherPage() );
    },
    
    validateInput(e, label) {
        let regex,
            theResponse,
            theAction,
            theInputValue = e.target.value.trim();
        
        switch (label) {
            case "firstName":
            case "lastName":
                regex =  /^[a-zA-Z]{2,15}$/;
                break;
                
            case "telephone":
                regex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;
                break;
            
            case "userName":
                regex =  /^[a-z0-9A-Z]{2,10}$/;
                break;

            case "mailAddress":
                regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                break;
            
            default:
                console.log("nothing!");
                break;
        };

        theResponse = regex.test(theInputValue);
        theAction = (theResponse) ? "add" : "remove";
        
        this.afterCheck[`${label}`] = theResponse;
        this.validClassName(theAction, e.target);
        this.readyForSubmission();
        this.storeDetails(label, theInputValue);
    },

    availableEvents(e) {
        const chosenEvent  = e.target.value;

        if(chosenEvent === "null") {
            // set the centres options as "choose an hall"
            this.domElements.theCentre.innerHTML = `<option value="null">Choose an hall</option>`;

            // also disables the centres options, so it is unclickable
            this.domElements.theCentre.disabled = true;

            // then set its value as false: meaning it hasn't been filled
            this.afterCheck["centre"] = false;

            this.readyForSubmission();
        } else {
            // this populates the user details with the event chosen into eventRegisteredFor 
            this.storeDetails("eventRegisteredFor", chosenEvent)
            this.availableCentres(chosenEvent)
        }
    },

    availableCentres(theEvent) {
        let halls =  null;
        
        //  this goes through the eventHalls route and gets the hall(s) available to host that event
        this.fetchData( uri + `eventHalls?event=${theEvent}`)
        .then( data => {
            // the data will most likely always be a single-item array (i.e. data.length === 1)
            // so, we choose the first array item {data[0] i.e. data[1-1]}
            const theChosenOption = data[data.length - 1]

            // this is the array item chosen with data[0]. 
            // then its "halls" property value(s) is/are spread into "halls"
            // [{"id": 7,"event": "FOSIC 2020","halls": ["NEW"]}]
            halls = [...theChosenOption.halls];
            
            if(this.centres) {
                // if the centres have been fetched from database before, there is no need in fetching again
                // so, "this.centres" is collected by the ".then" as the data, instead of a response from a fetch
                // console.log("no fetch");
                return this.centres;
            } else {
                // console.log("fetch");
                // if centres haven't been fetched from database, a fetch process is used 
                // a promise is returned, and the ".then" collects the centres
                return this.fetchData( uri + "centres/")
            }
        })
        .then(data => {
            // store all the centres
            this.centres = [...data];

            // the 1st filter function checks for centres hallId that matches any of the "halls" array-item and creates an array of the centres
            // the 2nd filter function removes any of the hall where there's no vacant seat for candidates 
            // the map function then extracts only the hallName of the centres available for the event
            let result = data.filter(item => halls.includes(item.hallId))
                            .filter(centre => centre.numOfAvailableSeat !== 0)
                            // .map(item => item.hallName);
                            
            if(result.length > 1) {
                this.domElements.theCentre.disabled = false;
                this.afterCheck["centre"] = false;
                this.storeDetails("hallBookedFor", null)
            } else {
                this.domElements.theCentre.disabled = true;
                this.afterCheck["centre"] = true;
                this.centreInfo = result[0];
                this.storeDetails("hallBookedFor", result[0].hallName);
            }
            this.readyForSubmission();
            this.domElements.theCentre.innerHTML = this.createOptions(result, "theCentres", "Choose an hall");
        })
        .catch( err => {
            // window.location.assign("./404.html")
        });
    },

    storeDetails(param, val) {
        switch (param) {
            case "centre":
                const chosenCentre = val.target.value;

                //if selected list-option value is null, set "value" as false and store it as the afterCheck value, and submit button is still disabled.
                this.afterCheck[`${param}`] = (chosenCentre == "null") ? false : true;
                
                [this.centreInfo] = this.centres.filter(item => item.hallName === chosenCentre);
                this.currentUserDetails["hallBookedFor"] = chosenCentre;
                break;
        
            default:
                this.currentUserDetails[`${param}`] = val;
                break;
        }

    },
    
    // storeUserDetails({label, theInputValue}) {
    //     let dateFunc = new Date(),
    //         currentTime = dateFunc.toLocaleTimeString(),
    //         currentDate = dateFunc.toDateString();

    //     this.currentUserDetails[`${label}`] = theInputValue;
    //     this.currentUserDetails.timeOfRegistration = `${currentDate} ${currentTime}`;
    // },

    anyFalseValue( obj ) {
        let arr = [];
        for ( let [prop, val] of Object.entries(obj) ) {
            arr.push(val)
        };

        return arr.includes(false);
    },

    readyForSubmission() {
        // this checks if there's any false prop value in the afterCheck object. If there isn't, it enables the submit button.
        this.enableSubmitButton(this.anyFalseValue(this.afterCheck));
    },

    enableSubmitButton( response ) {
        // response = false;
        if(!response) {
            this.domElements.submitButton.disabled = false;
        } else {
            this.domElements.submitButton.disabled = true;
        }
    },
    
    submission( e ) {
        e.preventDefault();
        const theCentre = this.centreInfo;
        
        if ( theCentre.numOfAvailableSeat === 0 || theCentre.seatsOccupied.length === theCentre.capacity ) {
            alert('Oooops! No seat available. Try again later');
        } else {
            const randomNumber = this.getRandomNumber(theCentre.numOfAvailableSeat);
            this.checkIfSeatIsAvailable(randomNumber);
        }
    },
    
    getRandomNumber( range ) {
        let randomNumber = Math.floor(Math.random() * range);
        return randomNumber;
    },
    
    checkIfSeatIsAvailable( numberGenerated ) {
        let theCentre = this.centreInfo;
        
        if ( numberGenerated === 0 && !theCentre.seatsOccupied.includes(1) ) {
            // debugger;
            numberGenerated = 1;
            // theCentre.seatsOccupied.push(numberGenerated);
            theCentre.numOfAvailableSeat -= 1;
        } else if (numberGenerated !== 0 && !theCentre.seatsOccupied.includes(numberGenerated)) {
            // debugger;
            // theCentre.seatsOccupied.push(numberGenerated);
            // theCentre.numOfAvailableSeat -= 1;
        } else {
            // debugger;
            this.getRandomNumber(this.centresInfo.numOfAvailableSeat);
        }
        
        // if seat is available, before giving seat number, let's store userDetails
        
        let candidateNumber = this.addZeroes({
            theNumber: numberGenerated, 
            desiredLength: theCentre.capacity.toString().length
        });
        let year = new Date().getFullYear().toString().slice(2);

        theCentre.numOfAvailableSeat -= 1;
        theCentre.seatsOccupied.push(candidateNumber);

        this.currentUserDetails.userSeatNumber = candidateNumber;
        this.currentUserDetails.userId = "" + year + theCentre.hallId + candidateNumber;

        //then giveSeatNumber to user
        this.giveSeatNumber();
    },
    
    giveSeatNumber() {

        let data = this.centreInfo;
        this.sendToDatabase({
            uri,
            endpoint: `centres/${data.id}`,
            data,
            method: "PUT"
        });

        data = this.currentUserDetails;
        this.sendToDatabase({
            uri,
            endpoint: "userProfiles/",
            data,
            method: "POST"
        });

        // this.redirectUserToAnotherPage();
    },

    // it addZeroes to numbers: 23 becomes 0023 based on the desiredLength value passed
    addZeroes( {desiredLength, range, theNumber} ) {
        //if theNumber is not given, getRandomNumber with the given range
        let newNumber, 
            number = theNumber || this.getRandomNumber(range);
        
        if (number.length !== desiredLength) {
            // this checks the number of zeroes to add
            let toAdd = desiredLength - number.toString().length,
                arr = Array(toAdd).fill(0); // creates an array filled with zeroes needed
            arr.push(number);
            newNumber = arr.join('');
        } else {
            newNumber = number;
        }
    
        return Number(newNumber);
    },

    sendToDatabase({ uri, endpoint, method, data }) {
        const otherOptions = {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        fetch( uri + endpoint, otherOptions );

        // this.revealSeatNumber();
    },
    
    revealSeatNumber() {
        const domObjectKey = this.domElements;

        domObjectKey.alertSeatNumber.textContent = this.currentUserDetails.userSeatNumber;
        domObjectKey.alertUsername.innerHTML = this.currentUserDetails.userName;
        domObjectKey.alertContainer.classList.remove("hidden");
        domObjectKey.formWrapper.classList.add("hidden");
        // this.redirectUserToAnotherPage();
    },
    
    redirectUserToAnotherPage() {
        window.location.assign('./another.html');
    },
};

window.addEventListener( 
    'DOMContentLoaded', 
    () => overallProcedure.initialize()
);