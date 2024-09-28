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
    
        const watchedState = getWatchedState();

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const schema = string().url().notOneOf(watchedState.urls).required(); 

            schema.validate(input.value)
            .then(() => {

                axios.get(getURL(input.value))
                .then(response => parseResponse(response))
                .then(doc => doc.querySelector("channel"))
                .then(channel => {

                    set_Watched_State_For_Initial_Fetch(watchedState, channel, input)

                })
                .catch(() => {
                    watchedState.status = "lost internet connection";
                })
            })
            .catch((err) => {
                watchedState.error = i18n.t(err.errors[0]);
                watchedState.status = "invalid url";
                input.classList.add("is-invalid");
            });
        })
    })
}


const repeatedFetch = (watchedState) => {
    
    watchedState.urls.forEach((url, index) => {
    const timeoutTime = 5000;

        axios.get(getURL(url))
        .then(response => parseResponse(response))
        .then(doc => doc.querySelector("channel"))
        .then(channel => {

            set_Watched_State_For_Repeated_Fetch(watchedState, channel, timeoutTime, index);

        })
        .catch(() => {
            watchedState.status = "no internet connection";
        })
    })
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


const getRss = (channel) => {
    const rss = {
        title: getText(channel, "title"),
        description: getText(channel, "description"),
        items: ""
    }

    rss.items = getItems(channel);

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


const set_Watched_State_For_Initial_Fetch = (watchedState, channel, input) => {
    if (watchedState.timeout) {
        clearTimeout(watchedState.timeout)
    }
    
    watchedState.rss = getRss(channel);
    watchedState.urls.push(input.value);
    watchedState.error = "";
    watchedState.lastItems.push(watchedState.rss.items[0].title);
    watchedState.status = "successfuly loaded";

    watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), 5000);
}


const set_Watched_State_For_Repeated_Fetch = (watchedState, channel, timeoutTime, index) => {
    const newItems = [];
    const items = getItems(channel);
    const iIndex = getLastItemIndex(items, watchedState.lastItems[index]);

    for (let i = 0; i < iIndex; i++) {
        newItems.push(items[i]);
    }

    if (newItems[0]) {
        watchedState.lastItems[index] = newItems[0].title;
    }

    watchedState.newItems = newItems;

    if (newItems.length) {
        watchedState.status = "successfuly updated";
    } else {
        watchedState.status = "waiting for update";
    }
    watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), timeoutTime);
}


const getText = (element, name) => {
    return element.querySelector(name).innerHTML.replace("<![CDATA[", "").replace("]]>", "");
}


const parseResponse = (response) => {
    return new DOMParser().parseFromString(response.data.contents, "text/xml");
}


const getURL = (url) => {
    return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
}



export { index };