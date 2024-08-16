import "./styles.scss";
import 'bootstrap';
import { string, setLocale } from 'yup';
import { createInstance } from "i18next";
import getDictionary from "./dictionary.js";
import getWatchedState from "./view.js";


const index = () => {

    const i18n = createInstance();

    i18n.init(getDictionary()).then(() => {
    
        setLocale({
            mixed: {
                notOneOf: "repeatedError"
            },
            string: {
                url: "validationError"
            }
        })
        
        const form = document.querySelector("form");
        const input = document.querySelector("input");
    
        const watchedState = getWatchedState();
    
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const schema = string().url().notOneOf(watchedState.urls).required();

            schema.validate(input.value)
            .then(() => {
                watchedState.error = "";
                watchedState.urls.push(input.value);
            })
            .catch((err) => {
                watchedState.error = i18n.t(err.errors[0]);
                input.classList.add("is-invalid");
            });
        })
    })
}

export { index };