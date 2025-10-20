const library = {
    init: () => {

        console.log('library load');


    },
    encryptDecryptString(string, decrypt = false) {

        if (decrypt) {
            return new TextDecoder().decode(Uint8Array.from(atob(string), c => c.charCodeAt(0)));
        }

        return btoa(new TextEncoder().encode(string).reduce((a, b) => a + String.fromCharCode(b), ''));

    },
    async makeRequest(options, url) {

        let results = await fetch(url, options);
        let response = await results.json();

        return response;


    },
    async getInstructions(action) {

        return browser.storage.local.get('i18n').then(function (res) {

            let { i18n } = res;
            let translate = JSON.parse(i18n);

            let text = '';

            switch (action) {
                case 'improve': {
                    text = translate['improve_instruction'];
                    break;
                }
                case 'translate': {

                    text = translate['translate_instruction'];
                    break;
                }
                case 'explain': {
                    text = translate['explain_instruction'];
                    break;
                }


            }

            return text + translate['general_instruction'];

        })



    },
    getSelectedText() {
        const activeEl = document.activeElement

        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
            return activeEl.value.substring(activeEl.selectionStart, activeEl.selectionEnd);
        } else {
            return window.getSelection().toString();
        }

    },
    async saveData(type, data) {

        let obj = {};
        let key = type;
        obj[key] = data

        await browser.storage.local.set(obj);

    },
    async getData(type) {
        if (browser.storage.local.get(type)) {
            return await browser.storage.local.get(type);
        }
    },
    currentDate() {
        let date = new Date();
        let year = date.getFullYear();
        if (document.getElementById('year')) {
            document.getElementById('year').innerHTML = year;

        }
    },
    dispachEvent(selector, event, handler) {

        const el = document.getElementById(selector);
        if (!el) return;
        el.addEventListener(event, handler);

    },
    labelParse(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
};

(function () {

    'use strict';
    library.init()

})();


