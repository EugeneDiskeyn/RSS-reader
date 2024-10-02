import onChange from "on-change";


const getWatchedState = (i18n) => {

    setHTMLelements(i18n);

    const state = {
        formStatus: "", 
        urls: [],
        lastItems: [],
        newItems: [],
        rss: "",
        // currentLanguage: "rus",
        error: "",
        timeout: ""
    };

    const input = document.querySelector("input");
    const message = document.querySelector("p");

    
    const watchedState = onChange(state, (path) => {
        if (path === "newItems") {
            createNewPosts(watchedState.newItems, i18n);
        }
        
        switch (watchedState.formStatus) {
            case "successfuly loaded":
                handleUpdateInput(input, message);
                handlePosts(watchedState.rss, i18n);
                break;
            case "network error":
            case "invalid url":
                handleError(watchedState, message);

        }
        watchedState.formStatus = "";
    });

    return watchedState;
}


const handlePosts = (rss, i18n) => {
    createNewFeed(rss);
    createNewPosts(rss.items, i18n);
}


const handleUpdateInput = (input, message) => {
    input.value = "";
    message.innerHTML = "";
    input.classList.remove("is-invalid");
    input.focus();
}


const handleError = (watchedState, message) => {
    message.innerHTML = watchedState.error;
}


const createNewFeed = (rss) => {
    const feeds = document.getElementById("feeds");
    const feedLi = document.createElement("li");

    feedLi.classList.add("list-group-item", "border-0", "pt-2");
    feedLi.innerHTML = rss.title;

    feeds.querySelector("ul").prepend(feedLi);    
    feeds.classList.remove("invisible");
}


const createNewPosts = (items, i18n) => {
    const posts = document.getElementById("posts");

    const reverseItems = [];
    for (let item of items) {
        reverseItems.unshift(item);
    }

    reverseItems.forEach(item => {
        const postLi = document.createElement("li");
        const button = document.createElement("button");
        const a = document.createElement("a");
        
        postLi.classList.add("list-group-item", "border-0", "pt-2", "d-flex", "justify-content-between", "align-items-center");
        button.classList.add("btn", "btn-outline-primary", "btn-sm");
        button.dataset.bsTarget = "#modal";
        button.dataset.bsToggle = "modal";

        button.innerHTML = i18n.t("view");

        button.addEventListener("click", () => {
            document.getElementById("title").innerHTML = item.title;
            document.getElementById("description").innerHTML = item.description;
            document.getElementById("readMore").href = item.link;
            a.classList.add("link-secondary")
        })

        a.innerHTML = item.title;
        a.href = item.link;
        a.target = "_blank"

        postLi.append(a);
        postLi.append(button);

        posts.querySelector("ul").prepend(postLi);
    })

    posts.classList.remove("invisible");
}


const setHTMLelements = (i18n) => {
    const postHeader = document.getElementById("posts").querySelector("h2");
    const feedHeader = document.getElementById("feeds").querySelector("h2");
    const closeButton = document.getElementById("closeButton");
    const readMore = document.getElementById("readMore");
    const header1 = document.querySelector("h1");

    postHeader.innerHTML = i18n.t("posts");
    feedHeader.innerHTML = i18n.t("feeds");
    closeButton.innerHTML = i18n.t("close");
    readMore.innerHTML = i18n.t("readMore");
    header1.innerHTML = i18n.t("rssReader");
}


export default getWatchedState;