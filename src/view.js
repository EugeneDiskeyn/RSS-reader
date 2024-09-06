import onChange from "on-change";


const getWatchedState = () => {

    const state = { 
        urls: [],
        lastItems: [],
        rss: "",
        error: "",
        interval: ""
    };

    const input = document.querySelector("input");
    const message = document.querySelector("p");

    const watchedState = onChange(state, (path) => {
        switch (path) {
            case "urls":
                handleUpdateInput(input, message);
                break;
            case "error":
                handleError(watchedState, message);
                break;
            case "rss":
                handlePosts(watchedState.rss);
                break;
            case "newItems":
                createNewPosts(watchedState.newItems);
        }
    });

    return watchedState;
}


const handlePosts = (rss) => {
    createNewFeed(rss);
    createNewPosts(rss.items);
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


const createNewPosts = (items) => {
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

        button.innerHTML = "Просмотр";

        button.addEventListener("click", () => {
            document.getElementById("title").innerHTML = item.title;
            document.getElementById("description").innerHTML = item.description;
            document.getElementById("readMore").href = item.link;
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


export default getWatchedState;