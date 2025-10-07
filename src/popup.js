const popup = {

    init: () => {

        // load user data

        popup.loadUserData();

        // load configuration

        popup.loadSettingsData();

        // save token

        popup.dispachEvent('set-token', 'click', popup.setToken);

        popup.dispachEvent('set-action', 'click', popup.setAction);

        popup.dispachEvent('save-config', 'click', popup.saveConfig);


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
    deteData(type) {

        browser.storage.local.remove(type)

    },
    changeLayout(container, status) {

        if (status === 'hidden') {
            document.getElementById(container).className.add('hidden');
        }

        if (status === 'show') {
            document.getElementById(container).className.remove('hidden');
        }

    },
    loadUserData() {
        popup.getData('groq_token').then(function (res) {

            if (res.groq_token) {
                document.getElementById('welcome').classList.add('hidden');
                document.getElementById('main').classList.remove('hidden');
            } else {
                document.getElementById('welcome').classList.remove('hidden');
                document.getElementById('main').classList.add('hidden');
            }

        });

        popup.getData('action').then(function (res) {

            if (!document.getElementById(res.action)) {
                document.getElementById('improve').checked = true;
            } else {
                document.getElementById(res.action).checked = true;

            }

        });


    },
    loadSettingsData() {

        popup.getData('groq_token').then(function (res) {

            if (res.groq_token) {
                document.getElementById('groq-token-config').value = res.groq_token;
            }

        });

        popup.getData('language').then(function (res) {

            if (res.language) {
                document.getElementById('language').value = res.language;

            }

        });

    },
    dispachEvent(selector, event, handler) {

        const el = document.getElementById(selector);
        if (!el) return;
        el.addEventListener(event, handler);

    },
    setToken() {

        let input = document.getElementById('groq-token');

        if (input.value.length > 0) {

            popup.saveData('groq_token', input.value);
            popup.saveData('action', 'improve');
            browser.runtime.reload();
        }
        else {
            input.classList.add('is-invalid')
        }

    },
    setAction() {

        let selector = document.querySelectorAll('.selector');

        selector.forEach(function (el) {
            if (el.checked) {

                popup.saveData('action', el.value)

            }
        });

        browser.runtime.reload();
    },
    saveConfig() {

        let token = document.getElementById('groq-token-config');
        let language = document.getElementById('language');

        popup.saveData('token', token.value);
        popup.saveData('language', language.value);

        browser.runtime.reload();


    }
};


(function () {

    'use strict';
    popup.init();

})();