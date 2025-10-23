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


          }).catch(function(err){

            alert('Inválid token');

          })


        })

      });


    });
  }

});


// document.addEventListener("mouseup", (e) => {

//   browser.storage.local.get('i18n').then(function (res) {

//     let { i18n } = res;
//     let translate = JSON.parse(i18n);

//     const selection = library.getSelectedText();
//     if (!selection) return;

//     let oldMenu = document.querySelector(".mini-menu");
//     if (oldMenu) oldMenu.remove();

//     const menu = document.createElement("div");
//     const logo = document.createElement("img");
//     const text = document.createElement("span");


//     logo.src = browser.runtime.getURL('mind.png');
//     logo.className = "textai-img";
//     logo.style.height = "16px"
//     logo.style.verticalAlign = "middle";
//     // logo.style.marginRight = "5px";
//     logo.style.marginRight = "10px"


//     let label = library.labelParse(translate['AnswerAi']);

//     text.innerHTML = ` ${label}`

//     menu.appendChild(logo);
//     menu.appendChild(text)

//     menu.className = "mini-menu";

//     menu.style.position = "absolute";
//     menu.style.top = `${e.pageY + 5}px`;
//     menu.style.left = `${e.pageX + 5}px`;
//     menu.style.background = "#333";
//     menu.style.color = "#fff";
//     menu.style.padding = "5px 10px";
//     menu.style.borderRadius = "6px";
//     menu.style.cursor = "pointer";
//     menu.style.zIndex = "999999";
//     menu.style.fontFamily = "sans-serif";
//     menu.style.display = "flex";
//     menu.style.flexDirection = "row";
//     menu.style.alignItems = "center";


//     menu.addEventListener("click", () => {

//       logo.remove();
//       text.remove();

//       const mic = document.createElement("img");
//       mic.src = browser.runtime.getURL('mc.svg');
//       mic.style.marginRight = "10px"
      
//       text.innerHTML = ` listening...`
      
//       menu.appendChild(mic);
//       menu.appendChild(text);

//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
//       recognition.lang = "pt-BR";
//       recognition.start();

//       console.log("teste")

//       recognition.onresult = (event) => {

//         console.log(event)

//         browser.storage.local.get('groq_token').then(function (token) {
//           const text = event.results[0][0].transcript;

//           let systemMessage = [
//             { "role": "system", "content": text }
//           ];

//           let userMessage = [{
//             "role": "user",
//             "content": selection
//           }]

//           let messages = [...systemMessage, ...userMessage];

//           let options = {
//             method: "post",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${library.encryptDecryptString(token.groq_token, true)}`
//             },
//             body: JSON.stringify({
//               "messages": messages,
//               "temperature": 0.5,
//               "model": groqModel,
//               "stop": null,
//               "stream": false

//             })


//           }


//           library.makeRequest(options, groqUrl).then(function (res) {

//             let response = res.choices[0].message;

//             alert(response.content);

//             menu.remove();
//           });


//         });

//       };

//       // menu.remove();
      
//     });

//     document.body.appendChild(menu);


//   })

// });

// document.addEventListener("mousedown", (e) => {
//   const menu = document.querySelector(".mini-menu");
//   if (menu && !menu.contains(e.target)) menu.remove();
// });
