import "./styles.scss";
import 'bootstrap';
import { string } from 'yup';
import onChange from "on-change";

const state = { urls: [""] };
const form = document.querySelector("form");
const input = document.querySelector("input");
const message = document.querySelector("p");

const watchedObject = onChange(state, () => {
    input.value = "";
    input.focus();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const schema = string().url().notOneOf(watchedObject.urls);
    schema.validate(input.value)
    .then(() => {
        message.innerHTML = "";
        input.classList.remove("is-invalid");
        watchedObject.urls.push(input.value);
    })
    .catch(() => {
        message.innerHTML = "Invalid url";
        input.classList.add("is-invalid");
    });
})