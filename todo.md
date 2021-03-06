# Welcome

## What app should do 

### User's side
- collect users' name
- save the name on DB/local storage
- save users' name with seat (maybe as key-value pairs)

### Dev's side
- input/save number of available space/seat
- never give two users' the same seat number

## What has been done?
- Simple UI
- An input to collect user's name.
- A disabled button, that only enables when input has two character (has to be two characters, but will be refactored later)
- A DB that holds all information. *N.B:- JSON-Server serves as the DB for now.*
    It has two resources: **the centres** and **the candidates**(users). The **centres resource** contains the hall name, its capacity, seats occupied *(the seat number)*  and seats unoccupied *(total number of seats remaining)* while the **users resources** contains the candidate's name, seat number (and to be included, hall).
- Generate a user ID that contains of 8 digits gotten from the year, hall ID and seat number. Year will be 2 digits, seat number is 3 and hall ID will/can be alphanumeric with 3 characters. To be sent to DB also.
- add an entry to the users resource that holds the date and time a candidate booked a seat.
- Added *loading* to the page if data to be fetched is not ready.
- Handle error from fetch, so the button doesn't just stay disabled if data is fetched. Maybe, show an error or "system down" or "come back later".

## Later things.
- More regex for input
- Use a DB
- Handle fetch 'PUT' error
- a radio button in the UI with id attached, which will correspond with the different halls.
- Show user a response in form of a CSS styled alert instead of the JavaScript *window.alert* function.
- Input box doesn't remember last input.
- add input for first and middle name, so username becomes *first-middle*
- ability to school organization/institution the user is coming from. Once it is chosen, the data for that institution is fetched.

## What is the problem right now? (N.B: Once solved, the list point is deleted and a commit is made)
- Sending a request to DB to update hall informations after a seat is allocated to a candidate: it keeps creating a new endpoint (i.e. new id; it duplicates)
**SOLVED**: I wasn't adding the specific uri for it to change.
was sending with endpoint as *`http://localhost:8000/centres/`*, instead of *`http://localhost:8000/centres/2`*.
N.B: 2 because I haven't added the ability to choose a specific hall. It should be ${hall_id} or something.

- Unable to show/reveal seat number to candidate/user through a pop-up because the fetch (PATCH) request reloads the page. I think I have to wait for the fetch request before pop up shows or something. Fingers crossed shaaa.

## TODO
- Put two buttons in homepage (i.e. index.html) that navigates to registering/booking a seat and the other to checking your seat after registration.
- Reconstruct JS file to fetch from and send to Firestore
- Reconstruct JS file for the new page (i.e. form.html)
- Hall doesn't show until the event/purpose is choosen/selected. This is because, an hall might be specifically for an event.
- 

## Stack to be used
- HTML
- CSS
- Vanilla JS
- JSON Server