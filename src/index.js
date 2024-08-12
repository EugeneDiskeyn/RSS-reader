import "./styles.scss";
import 'bootstrap';
import { string, setLocale } from 'yup';
import onChange from "on-change";
import i18next from "i18next";
import initDictionary from "./dictionary.js";

const index = () => {

    initDictionary();

    const state = { 
        urls: [],
        errors: {
            "validation": "validationError",
            "repeatance": "repeatanceError"
        }
    };
    const form = document.querySelector("form");
    const input = document.querySelector("input");
    const message = document.querySelector("p");

    setLocale({
        mixed: {
            notOneOf: i18next.t(state.errors.repeatance)
        },
        string: {
            url: i18next.t(state.errors.validation)
        }
    })

    const watchedObject = onChange(state, () => {
        input.value = "";
        input.focus();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const schema = string().url().notOneOf(watchedObject.urls).required();
        schema.validate(input.value)
        .then(() => {
            message.innerHTML = "";
            input.classList.remove("is-invalid");
            watchedObject.urls.push(input.value);
        })
        .catch((error) => {
            message.innerHTML = error.errors[0];
            input.classList.add("is-invalid");
        });
    })
}

export { index };