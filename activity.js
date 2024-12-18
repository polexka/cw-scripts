function performMouseMove(element) {
  const rect = element.getBoundingClientRect();
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const endX = rect.left + rect.width / 2 + Math.random() * 10 - 5;
  const endY = rect.top + rect.height / 2 + Math.random() * 10 - 5;

  const steps = 10; // Количество шагов для плавности
  const delay = 20; // Задержка между шагами (в мс)

  for (let i = 0; i <= steps; i++) {
    setTimeout(() => {
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        clientX: startX + ((endX - startX) * i) / steps,
        clientY: startY + ((endY - startY) * i) / steps,
      });
      document.dispatchEvent(event);
    }, i * delay);
  }
}

function randomInterval() {
  return Math.random() * (3 * 60 * 1000 - 2.5 * 60 * 1000);
}

function performAction(afterTalk) {
  const bot = findBot();

  if (bot && !afterTalk) {
    moveToBot(bot);
    return;
  }

  const element =
    document.querySelector(".move_name")?.parentElement?.parentElement
      ?.parentElement;
  if (element) performMouseMove(element);

  const shiffElement = document.querySelector(
    'a.dey.has-tooltip[data-id="13"]'
  );
  if (shiffElement) performMouseMove(shiffElement);

  const sniffButton = document.querySelector("#tr_tos button");
  if (sniffButton) performMouseMove(sniffButton);

  if (!!element || !!shiffElement || !!sniffButton) {
    let rect;
    if (shiffElement) {
      rect = shiffElement.getBoundingClientRect();
    } else if (sniffButton) {
      rect = sniffButton.getBoundingClientRect();
    } else {
      rect = element.getBoundingClientRect();
    }

    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 100 - 50;

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: rect.left + rect.width / 2 + offsetX,
      clientY: rect.top + rect.height / 2 + offsetY,
    });
    if (shiffElement) {
      shiffElement.dispatchEvent(event);
    } else if (sniffButton) {
      sniffButton.dispatchEvent(event);
    } else {
      element.dispatchEvent(event);
    }

    console.log(
      "Click event triggered at random offset (x, y):",
      offsetX,
      offsetY
    );
  } else {
    console.error("Element not found!");
  }

  let randomInterval =
    Math.random() * (3 * 60 * 1000 - 2.5 * 60 * 1000) + 2.5 * 60 * 1000;

  if (sniffButton) (randomInterval = randomInterval - 2.5 * 60 * 1000) / 2;

  console.log(
    `Next action will occur in ${(randomInterval / 1000).toFixed(1)} seconds.`
  );

  setTimeout(() => {
    performAction(false);
  }, randomInterval);
}

function findBot() {
  return Array.from(document.querySelectorAll("div[style]")).find((div) => {
    const style = div.getAttribute("style") || "";

    if (
      style.includes("/cw3/cats/0/costume/39.png") ||
      style.includes("/cw3/cats/0/costume/40.png") ||
      style.includes("/cw3/cats/0/costume/41.png") ||
      style.includes("/cw3/cats/0/costume/42.png")
    ) {
      return true;
    }

    return false;
  });
}

function moveToBot(bot) {

  const botCostumeId = bot
    .getAttribute("style")
    .match(/url\("\/cw3\/cats\/0\/costume\/(39|40|41|42)\.png"\)/)[1];
  let botId = 0;

  if (botCostumeId) {
    switch (botCostumeId) {
      case '39':
        botId = 2001;
        break; 

      case '40':
        botId = 2000;
        break;

      case '41':
        botId = 2002;
        break;

      case '42':
        botId = 2003;
        break;
    }
  }
  
  if (botId == 2000 || botId == '2000' ) {
    console.log('meet bot ', botId)
    return
  }

  performMouseMove(bot);

  // как-то проверять что котов нет в клетках
  const prevCage =
    bot.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement.previousElementSibling;

  let rect = bot.getBoundingClientRect();
  const offsetX = Math.random() * 100 - 50;
  const offsetY = Math.random() * 100 - 50;

  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: rect.left + rect.width / 2 + offsetX,
    clientY: rect.top + rect.height / 2 + offsetY,
  });

  console.log(
    "Click event triggered at random offset (x, y):",
    offsetX,
    offsetY
  );

  prevCage.dispatchEvent(event);

  const randomTime = randomInterval() / 2;
  console.log(
    `Next action will occur in ${(randomTime / 1000).toFixed(1)} seconds.`
  );

  setTimeout(() => {
    talkToBot(botId);
  }, randomTime);
}

function talkToBot(id) {
  console.log('Talking to bot cat', id)
  const menu = document.querySelector("#mit");
  const optionToSelect = document.querySelector(
    `option[value="${id.toString()}"]`
  );

  if (!optionToSelect) {
    performAction(false);
    return
  }

  optionToSelect.selected = true;

  if (id === 0) {
    console.log("Bot ID = 0, error");
    return;
  }

  menu.dispatchEvent(new Event("change", { bubbles: true }));

  const randomTime = randomInterval() / 2;
  console.log(
    `Next action will occur in ${(randomTime / 1000).toFixed(1)} seconds.`
  );

  setTimeout(() => {
    doTalkToBot();
  }, randomTime);
}

function doTalkToBot() {
  const talkElement = document.querySelector(
    'a.dey.has-tooltip[data-id="talk"]'
  );

  if (talkElement) {
    performMouseMove(talkElement);

    let rect = talkElement.getBoundingClientRect();
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 100 - 50;
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: rect.left + rect.width / 2 + offsetX,
      clientY: rect.top + rect.height / 2 + offsetY,
    });

    talkElement.dispatchEvent(event);

    console.log(
      "Click event triggered at random offset (x, y):",
      offsetX,
      offsetY
    );

    const chatForm = document.getElementById('chat_form');
    
    botChat(chatForm)
  }
  
  const randomTime = randomInterval() / 2;
  console.log(
    `Next action will occur in ${(randomTime / 1000).toFixed(1)} seconds.`
  );
  setTimeout(() => {
    performAction(true);
  }, randomTime);
}

function botChat(chatForm) {
  // как-то задержать тут тыкалку тк не успевает зарендериться и уходит в else
  if (chatForm && chatForm.querySelector('select#text')) {
    console.log('Chat contains select');

    const msgSendButton = chatForm.querySelector('#msg_send');
    
    if (msgSendButton) {
      msgSendButton.click();
    }
    const randomTime = randomInterval() / 4;
    console.log(
      `Next action will occur in ${(randomTime / 1000).toFixed(1)} seconds.`
    );
    setTimeout(() => {
      botChat(chatForm)
    }, randomTime);

  } else {
    console.log('Chat without select');
    return
  }
}

performAction(false);
