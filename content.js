const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
const groqModel = "llama-3.1-8b-instant";

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {


  if (msg.action === 'improve') {
    browser.storage.local.get('action').then(function (action) {
      browser.storage.local.get('groq_token').then(function (token) {

        let selection = library.getSelectedText();

        library.getInstructions(action.action).then(function (instructions) {


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
              "Authorization": `Bearer ${library.encryptDecryptString(token.groq_token, true)}`
            },
            body: JSON.stringify({
              "messages": messages,
              "temperature": 0.5,
              "model": groqModel,
              "stop": null,
              "stream": false

            })


          }


          library.makeRequest(options, groqUrl).then(function (res) {

            let response = res.choices[0].message;

            alert(response.content);

            sendResponse({ ok: true });

          });


        })



      });


    });
  }

});

document.addEventListener("mouseup", (e) => {

  browser.storage.local.get('i18n').then(function (res) {

    let { i18n } = res;
    let translate = JSON.parse(i18n);

    const selection = library.getSelectedText();
    if (!selection) return;

    let oldMenu = document.querySelector(".mini-menu");
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img");
    const text = document.createElement("span")

    img.src = browser.runtime.getURL('mind.png');
    img.className = "textai-logo";
    img.style.height = "16px"
    img.verticalAlign = "middle";
    img.marginRight = "5px";

    let label = library.labelParse(translate['AnswerAi']);

    text.innerHTML = ` <span>${label}</span>`

    span.appendChild(img)
    span.appendChild(text)


    menu.className = "mini-menu";


    menu.style.position = "absolute";
    menu.style.top = `${e.pageY + 5}px`;
    menu.style.left = `${e.pageX + 5}px`;
    menu.style.background = "#333";
    menu.style.color = "#fff";
    menu.style.padding = "5px 10px";
    menu.style.borderRadius = "6px";
    menu.style.cursor = "pointer";
    menu.style.zIndex = "999999";
    menu.style.fontFamily = "sans-serif";
    menu.appendChild(span);

    menu.addEventListener("click", () => {

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.start();

      recognition.onresult = (event) => {
        browser.storage.local.get('groq_token').then(function (token) {
          const text = event.results[0][0].transcript;

          let systemMessage = [
            { "role": "system", "content": text }
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
              "Authorization": `Bearer ${library.encryptDecryptString(token.groq_token, true)}`
            },
            body: JSON.stringify({
              "messages": messages,
              "temperature": 0.5,
              "model": groqModel,
              "stop": null,
              "stream": false

            })


          }


          library.makeRequest(options, groqUrl).then(function (res) {

            let response = res.choices[0].message;

            alert(response.content);

            menu.remove();
          });


        });
      };

    });

    document.body.appendChild(menu);


  })

});

document.addEventListener("mousedown", (e) => {
  const menu = document.querySelector(".mini-menu");
  if (menu && !menu.contains(e.target)) menu.remove();
});


