import onChange from "on-change";


const getWatchedState = () => {

    const state = { 
        urls: [],
        error: ""
    };

    const input = document.querySelector("input");
    const message = document.querySelector("p");

    const watchedState = onChange(state, (path) => {
        switch (path) {
            case "urls":
                handleRssLink(input, message);
                break;
            case "error":
                handleError(watchedState, message);
                break;
        }
    });

    return watchedState;
}


const handleRssLink = (input, message) => {
    input.value = "";
    message.innerHTML = "";
    input.classList.remove("is-invalid");
    input.focus();
}


const handleError = (watchedState, message) => {
    message.innerHTML = watchedState.error;
}


export default getWatchedState;