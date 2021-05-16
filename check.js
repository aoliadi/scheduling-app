// "use strict";

// let choice = document.querySelector("select#purpose-js");
// let hall = document.querySelector("select#centre-js"),
//   events = [],
//   hall1 = ["room1", "room2", "room3"],
//   hall2 = ["front", "back", "up", "down"],
//   hall3 = ["lorem", "ipsum", "dolor", "sit", "amet"];
// // console.log(choice);
// choice.addEventListener("change", function(e) {
//   let use = `<option value="null">Choose a hall</option>`;
  
//   switch (e.target.value) {
    
//     case "event1":
//       hall1.forEach(val => {
//         use += `<option value="${val}">${val}</option>`;
//         // hall.innerHTML = use;
//       });
//       hall.disabled = false;
//       break;

//     case "event2":
//       hall2.forEach(val => {
//         use += `<option value="${val}">${val}</option>`;
//         // hall.innerHTML = use;
//       });
//       hall.disabled = false;
//       break;

//     case "event3":
//       hall3.forEach(val => {
//         use += `<option value="${val}">${val}</option>`;
//         // hall.innerHTML = use;
//       });
//       hall.disabled = false;
//       break;
  
//     default:
//       // console.log("error");
//       hall.disabled = true;
//       break;
//   }

//   hall.innerHTML = use;
//   // console.log(use);
// })
