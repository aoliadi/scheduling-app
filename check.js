"use strict";

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

// sort based on capacity in descending order
// fetch("http://localhost:8000/centres?_sort=hallName&_order=desc")
// fetch("http://localhost:8000/centres")
// .then(res => res.json())
// .then(data => {
//     console.log(data);
//     let halls = [1, 5];
//     let res = data.filter(item => halls.includes(item.id));
//     console.log(res);
// });