import i18next from "i18next"

const initDictionary = () => {
    i18next.init({
        lng: "rus",
        debug: true,
        resources: {
            en: {
                translation: {
                    "validationError": "Invalid URL",
                    "repeatedError": "The URL is already uploaded"
                }
            },
            rus: {
                translation: {
                    "validationError": "Неверный URL",
                    "repeatedError": "Ссылка уже загружена"
                }
            }
        }
    })
}

export default initDictionary;