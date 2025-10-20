const language = {
    translations: [],
    currentLang: "",
    async init() {

        await language.getLanguage(); 

        language.getDataBind();
    },
    getDataBind() {

        for (const key in language.translations) {
            language.applyTranslator(key);
        }
    },
    async getLanguage() {

        const res = await library.getData('language');

        let currentLang = res.language ? res.language : navigator.language;

        switch (currentLang) {
            case 'pt-BR':
                language.translations = ptBr();
                break;
            case 'en-US':
                language.translations = enUs();
                break;
            case 'zh-TW':
                language.translations = zhTw();
                break;
        }

        await library.saveData('language', currentLang);
        await library.saveData('i18n', JSON.stringify(language.translations));
    },
    applyTranslator(key) {
        const elements = document.querySelectorAll(`[data-bind="${key}"]`);

        elements.forEach(element => {
            if (element.nodeName === 'INPUT') {
                element.placeholder = language.translations[key];
            } else {
                element.innerHTML = language.translations[key];
            }
        });
    }
};

(async () => {
    'use strict';
    await language.init();
})();
