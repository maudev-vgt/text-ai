browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
  const groqModel = "llama-3.1-8b-instant";

  if (msg.action === 'improve') {
    browser.storage.local.get('action').then(function (action) {
      browser.storage.local.get('groq_token').then(function (token) {

        let selection = getSelectedText();

        // let instructions = getInstructions(action.action);

        getInstructions(action.action).then(function (instructions) {


          let systemMessage = [
            { "role": "system", "content": instructions }
          ];

          let userMessage = [{
            "role": "user",
            "content": selection
          }]

          let messages = [...systemMessage, ...userMessage];

          let options = {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token.groq_token}`
            },
            body: JSON.stringify({
              "messages": messages,
              "temperature": 0.5,
              "model": groqModel,
              "stop": null,
              "stream": false

            })


          }


          makeRequest(options, groqUrl).then(function (res) {

            let response = res.choices[0].message;

            alert(response.content);

            sendResponse({ ok: true });

          });


        })



      });


    });
  }

});

async function makeRequest(options, url) {

  let results = await fetch(url, options);
  let response = await results.json();

  return response;

}

async function getInstructions(action) {

  return browser.storage.local.get('i18n').then(function (res) {

    let { i18n } = res;
    let translate = JSON.parse(i18n);

    let text = '';

    console.log(action)

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



}


function getSelectedText() {
  const activeEl = document.activeElement

  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
    return activeEl.value.substring(activeEl.selectionStart, activeEl.selectionEnd);
  } else {
    return window.getSelection().toString();
  }

}




