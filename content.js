const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
const groqModel = "llama-3.1-8b-instant";

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {


  if (msg.action === 'improve') {
    browser.storage.local.get('action').then(function (action) {
      browser.storage.local.get('groq_token').then(function (token) {

        let selection = helper.getSelectedText();

        helper.getInstructions(action.action).then(function (instructions) {


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
              "Authorization": `Bearer ${helper.encryptDecryptString(token.groq_token, true)}`
            },
            body: JSON.stringify({
              "messages": messages,
              "temperature": 0.5,
              "model": groqModel,
              "stop": null,
              "stream": false

            })


          }


          helper.makeRequest(options, groqUrl).then(function (res) {

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
  const selection = helper.getSelectedText();
  if (!selection) return;

  let oldMenu = document.querySelector(".mini-menu");
  if (oldMenu) oldMenu.remove();

  const menu = document.createElement("div");
  
  menu.className = "mini-menu";
  menu.innerHTML = `
  <img src="${browser.runtime.getURL('mind.png')}" 
       style="width:16px; height:16px; vertical-align:middle; margin-right:5px;">
  <span>Pergunte ao TextAi</span>
  `;
  
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

  menu.addEventListener("click", () => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.start();

    recognition.onresult = (event) => {
      browser.storage.local.get('groq_token').then(function (token) {
        const text = event.results[0][0].transcript;

        console.log(text);

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
            "Authorization": `Bearer ${helper.encryptDecryptString(token.groq_token, true)}`
          },
          body: JSON.stringify({
            "messages": messages,
            "temperature": 0.5,
            "model": groqModel,
            "stop": null,
            "stream": false

          })


        }


        helper.makeRequest(options, groqUrl).then(function (res) {

          let response = res.choices[0].message;

          alert(response.content);

          menu.remove();
        });


      });
    };

  });

  document.body.appendChild(menu);
});

document.addEventListener("mousedown", (e) => {
  const menu = document.querySelector(".mini-menu");
  if (menu && !menu.contains(e.target)) menu.remove();
});


