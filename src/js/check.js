"use strict";

// fetch("https://scheduleet.herokuapp.com/userProfiles", {
//     method: "DELETE",
// })
// .then(res => res.json())
// .then(data => console.log(data))

const btn = document.querySelector(".swal");
btn.addEventListener("click", () => {
    console.log(Swal.isLoading);
  Swal.fire({
    // position: "top-end",
    icon: "success",
    title: "Your reservation has been made for the event.",
    showCancelButton: true,
    confirmButtonText: "My seat number",
    cancelButtonText: "Thank you!",
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    preConfirm: (a) => {
      return fetch("http://localhost:8000/userProfiles?firstName=admin")
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .catch((err) => {
          Swal.showValidationMessage(`Request failed: ${err}`);
        });
    },
  }).then((data) => {
    if (data.isConfirmed) {
      console.log(data);
      Swal.fire({
        title: `Hello, ${data.value[0].lastName}`,
        html: `
            Your user ID is ${data.value[0].userId}.
            <br/>
            <strong>Goodluck!</strong>
        `,
        footer: '<a href="./another.html">Register another user</a>',
        allowOutsideClick: false
      });
    }
  });
});
