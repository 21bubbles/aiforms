(function() {
    // Get script tag attributes
    const currentScript = document.currentScript;
    const chatbotId = currentScript.getAttribute('data-chatbot-id');
    const width = currentScript.getAttribute('data-width') || '400px';
    const height = currentScript.getAttribute('data-height') || '600px';
    const theme = currentScript.getAttribute('data-theme') || 'light';
    const position = currentScript.getAttribute('data-position') || 'right';
  
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-embed-container';
    chatbotContainer.style.cssText = `
      position: fixed;
      ${position}: 20px;
      bottom: 20px;
      width: ${width};
      height: ${height};
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      display: none;
    `;
  
    // Create iframe for chatbot
    const chatbotFrame = document.createElement('iframe');
    chatbotFrame.src = `https://aiforms.21bubbles.com/aiform/117`;
    chatbotFrame.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    `;
  
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '💬';
    toggleButton.style.cssText = `
      position: fixed;
      ${position}: 20px;
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #007bff;
      color: white;
      border: none;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      font-size: 24px;
      cursor: pointer;
    `;
  
    let isChatbotVisible = false;
    toggleButton.addEventListener('click', () => {
      isChatbotVisible = !isChatbotVisible;
      chatbotContainer.style.display = isChatbotVisible ? 'block' : 'none';
      toggleButton.style.display = isChatbotVisible ? 'none' : 'block';
    });
  
    // Append elements
    chatbotContainer.appendChild(chatbotFrame);
    document.body.appendChild(toggleButton);
    document.body.appendChild(chatbotContainer);
  })();