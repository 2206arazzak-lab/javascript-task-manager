
const button = document.getElementById("changeBtn");
const message = document.getElementById("message");

button.addEventListener("click", function () {
    message.textContent = "Awesome! Your website is interactive now 🎉";
    button.textContent = "Clicked!";
    document.body.style.background =
        "linear-gradient(135deg, #11998e, #38ef7d)";
});
