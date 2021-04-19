# Welcome

## What app should do 

### User's side
- collect users' name
- save the name on DB/local storage
- save users' name with seat (maybe as key-value pairs)

### Dev's side
- input/save number of available space/seat
- never give two users' the same seat number

### What has been done?
- Simple UI
- An input to collect user's name.
- A disabled button, that only enables when input has two character (has to be two characters, but will be refactored later)
- A DB that holds all information. *N.B:- JSON-Server serves as the DB for now.*
    It has two resources: **the centres** and **the candidates**(users). The **centres resource** contains the hall name, its capacity, seats occupied *(the seat number)*  and seats unoccupied *(total number of seats remaining)* while the users resources contains the candidate's name, seat number (and to be included, hall).
- 

### Later things.
- More regex for input
- Use a DB
- Handle error from fetch, so the button doesn't just stay disabled if data is fetched. Maybe, show an error or "system down" or "come back later".

### What is the problem right now? (N.B: Once solved, the list point is deleted and a commit is made)
- Sending a request to DB to update hall informations after a seat is allocated to a candidate: it keeps creating a new endpoint (i.e. new id; it duplicates)



## Stack to be used
- HTML
- CSS
- Vanilla JS
- JSON Server