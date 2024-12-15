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

function performAction() {
  const element = document.querySelector(".move_name")?.parentElement?.parentElement?.parentElement;
  if (element) performMouseMove(element);

  const shiffElement = document.querySelector('a.dey.has-tooltip[data-id="13"]'); 
  if (shiffElement) performMouseMove(shiffElement);

  const sniffButton = document.querySelector('#tr_tos button');
  if (sniffButton) performMouseMove(sniffButton);

  if (!!element || !!shiffElement || !!sniffButton) {
    let rect
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
    
    console.log("Click event triggered at random offset (x, y):", offsetX, offsetY );
  } else {
    console.error("Element not found!");
  }

  let randomInterval = Math.random() * (3 * 60 * 1000 - 2.5 * 60 * 1000) + 2.5 * 60 * 1000;

  if (sniffButton) randomInterval = randomInterval - 2.5 * 60 * 1000;

  console.log(`Next action will occur in ${(randomInterval / 1000).toFixed(1)} seconds.`);
  
  setTimeout(performAction, randomInterval);
}

performAction()
