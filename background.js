setMenu();

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "meu-item") {

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {

      browser.tabs.sendMessage(tabs[0].id, { action: "improve" })
        .then((resp) => console.log("Resposta", resp))
        .catch((err) => console.error("Erro:", err));
    });
    
  }
});

async function setMenu() {

  try {

    const title = await getActionSaved();

    browser.menus.create({
      id: "meu-item",
      title: title,
      contexts: ["page", "selection", "link", "image"]
    });

  } catch (err) {
    console.log(err)
  }

}

function getActionSaved() {
  return browser.storage.local.get('action').then(function (data) {
    return browser.storage.local.get('i18n').then(function (res) {
      let { i18n } = res;
      let translate = JSON.parse(i18n);


      switch (data.action) {
        case 'improve': return labelParse(translate['improve']);
        case 'translate': return labelParse(translate['translate']);
        case 'explain': return labelParse(translate['explain']);
        default: return null;
      }
    });


  }).catch((err) => {
    console.error("Erro:", err);
    return null;
  });
}

function labelParse(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}





