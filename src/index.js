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
                axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(input.value)}`)
                .then(response => new DOMParser().parseFromString(response.data.contents, "text/xml"))
                .then(doc => doc.querySelector("channel"))
                .then(channel => {
                    if (watchedState.timeout) {
                        clearTimeout(watchedState.timeout)
                    }
                    
                    watchedState.rss = getRss(channel);
                    watchedState.urls.push(input.value);
                    watchedState.error = "";
                    watchedState.lastItems.push(watchedState.rss.items[0].title);

                    watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), 5000);
                })
                .catch(() => {
                    console.log("Can't connect");
                })
            })
            .catch((err) => {
                watchedState.error = i18n.t(err.errors[0]);
                input.classList.add("is-invalid");
            });
        })
    })
}


const repeatedFetch = (watchedState) => {
    watchedState.urls.forEach((url, index) => {
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then(response => new DOMParser().parseFromString(response.data.contents, "text/xml"))
        .then(doc => doc.querySelector("channel"))
        .then(channel => {
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

            watchedState.timeout = setTimeout(() => repeatedFetch(watchedState), 5000);
        })
        .catch(() => {
            console.log("Connection was lost");
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


const getText = (element, name) => {
    return element.querySelector(name).innerHTML.replace("<![CDATA[", "").replace("]]>", "");
}


export { index };