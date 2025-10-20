const popup = {
    init: () => {

        // load user data

        popup.loadUserData();

        // load configuration

        popup.loadSettingsData();

        // save token

        library.dispachEvent('set-token', 'click', popup.setToken);

        library.dispachEvent('set-action', 'click', popup.setAction);

        library.dispachEvent('save-config', 'click', popup.saveConfig);

        library.currentDate();
        
        library.currentVersion();


    },
    deleteData(type) {

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
        library.getData('groq_token').then(function (res) {

            if (res.groq_token) {
                document.getElementById('welcome').classList.add('hidden');
                document.getElementById('main').classList.remove('hidden');
            } else {
                document.getElementById('welcome').classList.remove('hidden');
                document.getElementById('main').classList.add('hidden');
            }

        });

        library.getData('action').then(function (res) {

            if (!document.getElementById(res.action)) {
                document.getElementById('improve').checked = true;

                library.saveData('action', 'improve');

            } else {
                document.getElementById(res.action).checked = true;

            }

        });


    },
    loadSettingsData() {

        library.getData('groq_token').then(function (res) {

            if (res.groq_token && document.getElementById('groq-token-config')) {
                // if(document.getElementById('groq-token-config')){
                    document.getElementById('groq-token-config').value = library.encryptDecryptString(res.groq_token, true);
                // }
                    
            }

        });

        library.getData('language').then(function (res) {

            if (res.language && document.getElementById('language')) {
                // if(){
                    document.getElementById('language').value = res.language;

                // }

            }

        });

    },
    // dispachEvent(selector, event, handler) {

    //     const el = document.getElementById(selector);
    //     if (!el) return;
    //     el.addEventListener(event, handler);

    // },
    setToken() {

        let input = document.getElementById('groq-token');

        if (input.value.length > 0) {

            library.saveData('groq_token', library.encryptDecryptString(input.value));
            library.saveData('action', 'improve');
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

                library.saveData('action', el.value)

            }
        });

        browser.runtime.reload();
    },
    saveConfig() {

        let token = document.getElementById('groq-token-config');
        let language = document.getElementById('language');

        library.saveData('groq_token', btoa(token.value));
        library.saveData('language', language.value);

        browser.runtime.reload();


    },
    setAppVersion(){

    }
   
};


(function () {

    'use strict';
    popup.init();

})();