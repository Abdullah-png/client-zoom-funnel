const hamburger = document.querySelector(".ham");
const menuBar = document.querySelector(".menu-bar");
const xMark = document.querySelector(".x");
const axios = require("axios");

hamburger.addEventListener("click", function (e) {
	e.preventDefault();
	console.log("cllicked");
	menuBar.classList.toggle("active");
});

// xMark.addEventListener("click", (e) => {
// 	menuBar.classList.remove("active");
// });
