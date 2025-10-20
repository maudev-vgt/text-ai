const helper = {
    teste: 'ola mundo',

    init: () => {

        console.log('helper load');


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

    }
};

(function () {

    'use strict';
    helper.init()

})();


