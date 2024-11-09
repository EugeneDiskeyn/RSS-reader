import "./styles.scss";
import 'bootstrap';
import { string, setLocale } from 'yup';
import { createInstance } from "i18next";
import { dictionary } from "./dictionary.js";
import getWatchedState from "./view.js";
import axios from "axios";


const index = () => {
    const i18n = createInstance();

    i18n.init(dictionary).then(() => {
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
        // const language = document.getElementById("language");
    
        const watchedState = getWatchedState(i18n);

        // language.addEventListener("click", () => {
        //     if (i18n.language === "rus") {
        //         i18n.changeLanguage("en");
        //         language.querySelector("p").innerHTML = "ENG";
        //     } else if (i18n.language === "en") {
        //         i18n.changeLanguage("rus");
        //         language.querySelector("p").innerHTML = "RUS";
        //     }
        // })

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const schema = string().url().notOneOf(watchedState.urls).required(); 

            schema.validate(input.value)
            .then(() => {

                axios.get(getURL(input.value))
                .then(response => parseResponse(response))
                .then(rss => {
                    set_Watched_State_For_Initial_Fetch(watchedState, rss, input);
                })
                .catch(() => {
                    watchedState.error = i18n.t("networkError");
                    watchedState.formStatus = "network error";
                })
            })
            .catch((err) => {
                watchedState.error = i18n.t(err.errors[0]);
                watchedState.formStatus = "invalid url";
                input.classList.add("is-invalid");
            });
        })
    })
}


const repeatedFetch = (watchedState) => {
    const timeoutTime = 5000;

    watchedState.urls.forEach((url, index) => {
        axios.get(getURL(url))
        .then(response => parseResponse(response))
        .then(rss => {
            set_Watched_State_For_Repeated_Fetch(watchedState, rss, index);
        })
    })

    watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), timeoutTime);
}


const set_Watched_State_For_Repeated_Fetch = (watchedState, rss, index) => {
    const newItems = [];
    const items = rss.items;
    const iIndex = getLastItemIndex(items, watchedState.lastItems[index]);

    for (let i = 0; i < iIndex; i++) {
        newItems.push(items[i]);
    }

    if (newItems[0]) {
        watchedState.lastItems[index] = newItems[0].title;
    }

    watchedState.newItems = newItems;
}



const parseResponse = (response) => {
    const doc = new DOMParser().parseFromString(response.data.contents, "text/xml");
    const channel = doc.querySelector("channel");
    const rss = getRss(channel);
    return rss;
}


const getRss = (channel) => {
    const rss = {
        title: getText(channel, "title"),
        description: getText(channel, "description"),
        items: getItems(channel)
    }
    return rss;
}


const getItems = (channel) => {
    const items = [];
    channel.querySelectorAll("item").forEach(docItem => {
        const item = {
            title: getText(docItem, "title"),
            description: getText(docItem, "description"),
            link: getText(docItem, "link")
        }

        items.push(item);
    })
    return items;
}


const set_Watched_State_For_Initial_Fetch = (watchedState, rss, input) => {
    if (watchedState.timeout) {
        clearTimeout(watchedState.timeout);
    }
    
    watchedState.rss = rss;
    watchedState.urls.push(input.value);
    watchedState.error = "";
    watchedState.lastItems.push(watchedState.rss.items[0].title);
    watchedState.formStatus = "successfuly loaded";

    watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), 5000);
}


const getLastItemIndex = (items, lastItem) => {
    let iIndex = -1;
    items.forEach((item, ind) => {
        if (lastItem === item.title) {
            iIndex = ind;
        }
    })
    return iIndex;
}


const getText = (element, name) => {
    return element.querySelector(name).innerHTML.replace("<![CDATA[", "").replace("]]>", "");
}


const getURL = (url) => {
    return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
}


export { index };