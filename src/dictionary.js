const getDictionary = () => {
    return {
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
    }
}

export default getDictionary;