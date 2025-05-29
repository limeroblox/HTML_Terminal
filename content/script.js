// Global variables
let activeTabId = null;
let tabs = [];
const terminalInstances = {};
const commandHistory = {};
const historyPosition = {};
let settings = {
  fontSize: "14",
  fontFamily: "'Cascadia Code', monospace",
  opacity: "0.95",
  cursorBlink: true,
  bellSound: true,
  confirmClose: true,
  colorScheme: "default",
};

// Initialize the terminal
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const tabsContainer = document.getElementById("tabsContainer");
  const terminalContent = document.getElementById("terminalContent");
  const newTabButton = document.getElementById("newTabButton");
  const overlay = document.getElementById("overlay");
  const settingsPanel = document.getElementById("settingsPanel");
  const colorSchemePanel = document.getElementById("colorSchemePanel");
  const aboutPanel = document.getElementById("aboutPanel");
  const toolsPanel = document.getElementById("toolsPanel");
  const extensionsPanel = document.getElementById("extensionsPanel");
  const settingsButton = document.getElementById("settingsButton");
  const colorSchemeButton = document.getElementById("colorSchemeButton");
  const aboutButton = document.getElementById("aboutButton");
  const toolsButton = document.getElementById("toolsButton");
  const extensionsButton = document.getElementById("extensionsButton");
  const closeSettings = document.getElementById("closeSettings");
  const closeColorScheme = document.getElementById("closeColorScheme");
  const closeAbout = document.getElementById("closeAbout");
  const closeTools = document.getElementById("closeTools");
  const closeExtensions = document.getElementById("closeExtensions");
  const saveSettings = document.getElementById("saveSettings");
  const resetSettings = document.getElementById("resetSettings");
  const applyColorScheme = document.getElementById("applyColorScheme");
  const exportColorScheme = document.getElementById("exportColorScheme");
  const importColorScheme = document.getElementById("importColorScheme");
  const closeAboutButton = document.getElementById("closeAboutButton");
  const checkUpdatesButton = document.getElementById("checkUpdatesButton");
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const fontFamilySelect = document.getElementById("fontFamilySelect");
  const opacityRange = document.getElementById("opacityRange");
  const opacityValue = document.getElementById("opacityValue");
  const blurRange = document.getElementById("blurRange");
  const blurValue = document.getElementById("blurValue");
  const borderRadiusRange = document.getElementById("borderRadiusRange");
  const borderRadiusValue = document.getElementById("borderRadiusValue");
  const glassEffectToggle = document.getElementById("glassEffectToggle");
  const cursorBlinkToggle = document.getElementById("cursorBlinkToggle");
  const bellSoundToggle = document.getElementById("bellSoundToggle");
  const confirmCloseToggle = document.getElementById("confirmCloseToggle");
  const particleEffectsToggle = document.getElementById("particleEffectsToggle");
  const typingSoundToggle = document.getElementById("typingSoundToggle");
  const scanlineEffectToggle = document.getElementById("scanlineEffectToggle");
  const autoSuggestToggle = document.getElementById("autoSuggestToggle");
  const tabCompletionToggle = document.getElementById("tabCompletionToggle");
  const minimizeButton = document.querySelector(".window-control.minimize");
  const maximizeButton = document.querySelector(".window-control.maximize");
  const closeButton = document.querySelector(".window-control.close");
  const terminalContainer = document.querySelector(".terminal-container");
  const particleContainer = document.getElementById("particleContainer");
  const promptStyleSelect = document.getElementById("promptStyleSelect");
  const customPromptContainer = document.getElementById("customPromptContainer");
  const customPromptInput = document.getElementById("customPromptInput");
  
  // Color scheme elements
  const bgColorPicker = document.getElementById("bgColorPicker");
  const textColorPicker = document.getElementById("textColorPicker");
  const accentColorPicker = document.getElementById("accentColorPicker");
  const selectionColorPicker = document.getElementById("selectionColorPicker");
  const errorColorPicker = document.getElementById("errorColorPicker");
  const successColorPicker = document.getElementById("successColorPicker");

  // Create the first tab
  createNewTab();

  // Event listeners
  if (newTabButton) newTabButton.addEventListener("click", createNewTab);
  if (settingsButton) settingsButton.addEventListener("click", openSettings);
  if (colorSchemeButton) colorSchemeButton.addEventListener("click", openColorScheme);
  if (aboutButton) aboutButton.addEventListener("click", openAbout);
  if (toolsButton) toolsButton.addEventListener("click", openTools);
  if (extensionsButton) extensionsButton.addEventListener("click", openExtensions);
  if (closeSettings) closeSettings.addEventListener("click", closeSettingsPanel);
  if (closeColorScheme) closeColorScheme.addEventListener("click", closeColorSchemePanel);
  if (closeAbout) closeAbout.addEventListener("click", closeAboutPanel);
  if (closeTools) closeTools.addEventListener("click", closeToolsPanel);
  if (closeExtensions) closeExtensions.addEventListener("click", closeExtensionsPanel);
  if (closeAboutButton) closeAboutButton.addEventListener("click", closeAboutPanel);
  if (saveSettings) saveSettings.addEventListener("click", saveSettingsHandler);
  if (resetSettings) resetSettings.addEventListener("click", resetSettingsHandler);
  if (applyColorScheme) applyColorScheme.addEventListener("click", applyColorSchemeHandler);
  if (exportColorScheme) exportColorScheme.addEventListener("click", exportColorSchemeHandler);
  if (importColorScheme) importColorScheme.addEventListener("click", importColorSchemeHandler);
  if (checkUpdatesButton) checkUpdatesButton.addEventListener("click", checkUpdatesHandler);
  if (overlay) overlay.addEventListener("click", closeAllPanels);
  if (minimizeButton) minimizeButton.addEventListener("click", minimizeTerminal);
  if (maximizeButton) maximizeButton.addEventListener("click", maximizeTerminal);
  if (closeButton) closeButton.addEventListener("click", closeTerminal);

  // Settings controls
  if (opacityRange) {
    opacityRange.addEventListener("input", () => {
      updateRangeValue(opacityRange, opacityValue, "%", 100);
      applySettingsPreview();
    });
  }
  
  if (blurRange) {
    blurRange.addEventListener("input", () => {
      updateRangeValue(blurRange, blurValue, "px");
      applySettingsPreview();
    });
  }
  
  if (borderRadiusRange) {
    borderRadiusRange.addEventListener("input", () => {
      updateRangeValue(borderRadiusRange, borderRadiusValue, "px");
      applySettingsPreview();
    });
  }
  
  if (glassEffectToggle) {
    glassEffectToggle.addEventListener("change", applySettingsPreview);
  }
  
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener("change", applySettingsPreview);
  }
  
  if (fontFamilySelect) {
    fontFamilySelect.addEventListener("change", applySettingsPreview);
  }
  
  if (cursorBlinkToggle) {
    cursorBlinkToggle.addEventListener("change", applySettingsPreview);
  }
  
  if (promptStyleSelect) {
    promptStyleSelect.addEventListener("change", () => {
      if (promptStyleSelect.value === "custom") {
        customPromptContainer.style.display = "flex";
      } else {
        customPromptContainer.style.display = "none";
      }
      applySettingsPreview();
    });
  }

  // Color scheme items
  document.querySelectorAll(".color-scheme-item").forEach((item) => {
    item.addEventListener("click", () => {
      const scheme = item.getAttribute("data-scheme");
      selectColorScheme(scheme);
    });
  });

  document.querySelectorAll(".scheme-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".scheme-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      const scheme = item.getAttribute("data-scheme");
      previewColorScheme(scheme);
    });
  });
  
  // Color pickers
  if (bgColorPicker) bgColorPicker.addEventListener("input", updateCustomColorScheme);
  if (textColorPicker) textColorPicker.addEventListener("input", updateCustomColorScheme);
  if (accentColorPicker) accentColorPicker.addEventListener("input", updateCustomColorScheme);
  if (selectionColorPicker) selectionColorPicker.addEventListener("input", updateCustomColorScheme);
  if (errorColorPicker) errorColorPicker.addEventListener("input", updateCustomColorScheme);
  if (successColorPicker) successColorPicker.addEventListener("input", updateCustomColorScheme);
  
  // Tool cards
  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("click", () => {
      const tool = card.getAttribute("data-tool");
      activateTool(tool);
      closeToolsPanel();
    });
  });
  
  // Extension categories
  document.querySelectorAll(".extension-category").forEach(category => {
    category.addEventListener("click", () => {
      document.querySelectorAll(".extension-category").forEach(c => c.classList.remove("active"));
      category.classList.add("active");
      filterExtensions(category.getAttribute("data-category"));
    });
  });
  
  // Extension search
  const extensionsSearch = document.getElementById("extensionsSearch");
  const searchExtensionsButton = document.getElementById("searchExtensionsButton");
  
  if (searchExtensionsButton) {
    searchExtensionsButton.addEventListener("click", () => {
      searchExtensions(extensionsSearch.value);
    });
  }
  
  if (extensionsSearch) {
    extensionsSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchExtensions(extensionsSearch.value);
      }
    });
  }
  
  // Extension buttons
  const refreshExtensions = document.getElementById("refreshExtensions");
  const uploadExtension = document.getElementById("uploadExtension");
  const createExtension = document.getElementById("createExtension");
  
  if (refreshExtensions) refreshExtensions.addEventListener("click", refreshExtensionsList);
  if (uploadExtension) uploadExtension.addEventListener("click", uploadExtensionHandler);
  if (createExtension) createExtension.addEventListener("click", createExtensionHandler);
  
  // Extension action buttons
  document.querySelectorAll(".extension-action").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const extensionItem = button.closest(".extension-item");
      const extensionName = extensionItem.querySelector(".extension-name").textContent;
      
      if (button.classList.contains("uninstall")) {
        uninstallExtension(extensionName, extensionItem);
      } else {
        installExtension(extensionName, extensionItem);
      }
    });
  });

  // Load settings
  loadSettings();

  // Add cursor reactive background effects
  document.addEventListener("mousemove", (e) => {
    // Create ripple effect
    if (Math.random() > 0.97 && settings.particleEffects) {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      document.body.appendChild(ripple);

      // Remove after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    }

    // Create cursor trail
    if (Math.random() > 0.7 && settings.particleEffects) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
      document.body.appendChild(trail);

      // Remove after animation completes
      setTimeout(() => {
        trail.remove();
      }, 1000);
    }

    // Create cursor glow
    if (settings.particleEffects) {
      const glow = document.querySelector(".cursor-glow") || document.createElement("div");
      glow.className = "cursor-glow";
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";

      if (!document.querySelector(".cursor-glow")) {
        document.body.appendChild(glow);
      }
    }
  });
  
  // Initialize particle effects
  if (settings.particleEffects) {
    createParticles();
  }
});

// Tab Management
function createNewTab() {
  const tabId = "tab-" + Date.now();
  const tabTitle = `Terminal ${tabs.length + 1}`;

  // Create tab element
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.id = tabId;
  tab.innerHTML = `
    <span class="tab-icon"><i class="fa-solid fa-terminal"></i></span>
    <span class="tab-title">${tabTitle}</span>
    <span class="tab-close"><i class="fa-solid fa-xmark"></i></span>
  `;

  // Add tab to tabs container
  const tabsContainer = document.getElementById("tabsContainer");
  if (tabsContainer) {
    tabsContainer.appendChild(tab);
  }

  // Create terminal instance
  createTerminalInstance(tabId, tabTitle);

  // Add event listeners
  tab.addEventListener("click", (e) => {
    if (!e.target.closest(".tab-close")) {
      activateTab(tabId);
    }
  });

  tab.querySelector(".tab-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closeTab(tabId);
  });

  // Add to tabs array
  tabs.push({
    id: tabId,
    title: tabTitle,
  });

  // Initialize command history for this tab
  commandHistory[tabId] = [];
  historyPosition[tabId] = -1;

  // Activate the new tab
  activateTab(tabId);
  
  // Add command execution effect
  const terminalInstance = document.getElementById(`terminal-${tabId}`);
  if (terminalInstance) {
    const effect = document.createElement("div");
    effect.className = "command-execute-effect";
    terminalInstance.appendChild(effect);
    
    setTimeout(() => {
      effect.remove();
    }, 500);
  }
}

function activateTab(tabId) {
  // Deactivate all tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Deactivate all terminal instances
  document.querySelectorAll(".terminal-instance").forEach((instance) => {
    instance.classList.remove("active");
  });

  // Activate the selected tab
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.classList.add("active");
  }

  // Activate the corresponding terminal instance
  const terminalInstance = document.getElementById(`terminal-${tabId}`);
  if (terminalInstance) {
    terminalInstance.classList.add("active");

    // Focus the input
    const input = terminalInstance.querySelector(".terminal-input");
    if (input) {
      setTimeout(() => {
        input.focus();
      }, 10);
    }
  }

  // Update active tab ID
  activeTabId = tabId;
}

function closeTab(tabId) {
  // Check if we should confirm before closing
  if (settings.confirmClose && tabs.length > 1) {
    if (!confirm("Close this terminal tab?")) {
      return;
    }
  }

  // Remove tab from DOM
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.remove();
  }

  // Remove terminal instance from DOM
  const terminalInstance = document.getElementById(`terminal-${tabId}`);
  if (terminalInstance) {
    terminalInstance.remove();
  }

  // Remove from tabs array
  tabs = tabs.filter((t) => t.id !== tabId);

  // Clean up command history
  delete commandHistory[tabId];
  delete historyPosition[tabId];
  delete terminalInstances[tabId];

  // If this was the active tab, activate another one
  if (activeTabId === tabId && tabs.length > 0) {
    activateTab(tabs[0].id);
  }

  // If no tabs left, create a new one
  if (tabs.length === 0) {
    createNewTab();
  }
}

function createTerminalInstance(tabId, tabTitle) {
  // Create terminal instance element
  const terminalInstance = document.createElement("div");
  terminalInstance.className = "terminal-instance";
  terminalInstance.id = `terminal-${tabId}`;

  // Create terminal output
  const terminalOutput = document.createElement("div");
  terminalOutput.className = "terminal-output";
  terminalOutput.id = `output-${tabId}`;

  // Create scanline effect if enabled
  if (settings.scanlineEffect) {
    const scanlineEffect = document.createElement("div");
    scanlineEffect.className = "scanline-effect";
    terminalInstance.appendChild(scanlineEffect);
  }

  // Create terminal input line
  const inputLine = document.createElement("div");
  inputLine.className = "terminal-input-line";

  const prompt = document.createElement("span");
  prompt.className = "terminal-prompt";
  prompt.textContent = getPromptText();

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "terminal-input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "terminal-input";
  input.id = `input-${tabId}`;
  input.autocomplete = "off";
  input.spellcheck = false;

  const cursor = document.createElement("span");
  cursor.className = "terminal-cursor";
  if (settings && !settings.cursorBlink) {
    cursor.classList.add("cursor-no-blink");
  }
  
  // Set cursor style
  if (settings.cursorStyle) {
    cursor.classList.add(`cursor-${settings.cursorStyle}`);
  }

  // Assemble the terminal instance
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(cursor);
  inputLine.appendChild(prompt);
  inputLine.appendChild(inputWrapper);
  terminalInstance.appendChild(terminalOutput);
  terminalInstance.appendChild(inputLine);

  // Add to DOM
  const terminalContent = document.getElementById("terminalContent");
  if (terminalContent) {
    terminalContent.appendChild(terminalInstance);
  }

  // Add event listeners
  input.addEventListener("keydown", (e) => handleInputKeydown(e, tabId));
  input.addEventListener("input", () => {
    updateCursorPosition(tabId);
    if (settings.typingSound) {
      playTypingSound();
    }
  });
  
  // Make sure the terminal is clickable to focus
  terminalInstance.addEventListener("click", () => {
    if (input) {
      input.focus();
    }
  });

  // Store reference to terminal elements
  terminalInstances[tabId] = {
    output: terminalOutput,
    input: input,
    prompt: prompt,
    cursor: cursor,
    currentDirectory: "C:\\Users\\User",
    fileSystem: initializeFileSystem(),
  };

  // Add welcome message with symbols
  appendOutput(
    tabId,
`
HTML Terminal [Version 2.5.0]
© 2025 idk blah blah all rights reserved
Welcome to the enhanced HTML Terminal! Type 'HELP' for a list of available commands.
`
);

  // Focus the input
  setTimeout(() => {
    if (input) {
      input.focus();
    }
  }, 100);
}

function getPromptText() {
  const promptStyle = settings.promptStyle || "windows";
  const customPrompt = settings.customPrompt || "";
  
  switch (promptStyle) {
    case "windows":
      return "C:\\Users\\User>";
    case "bash":
      return "user@host:~$ ";
    case "powershell":
      return "PS C:\\Users\\User> ";
    case "minimal":
      return "> ";
    case "custom":
      return customPrompt;
    default:
      return "C:\\Users\\User>";
  }
}

function initializeFileSystem() {
  // Simple simulated file system
  return {
    "C:": {
      "Users": {
        "User": {
          "Documents": {
            "readme.txt": "This is a sample text file in the Documents folder.",
            "report.docx": "[Word Document Content]",
            "presentation.pptx": "[PowerPoint Presentation Content]"
          },
          "Downloads": {},
          "Pictures": {},
          "Music": {},
          "Videos": {},
          "Desktop": {}
        }
      },
      "Program Files": {},
      "Windows": {}
    }
  };
}

function updateCursorPosition(tabId) {
  const instance = terminalInstances[tabId];
  if (!instance) return;

  const input = instance.input;
  const cursor = instance.cursor;

  // Create a temporary span to measure text width
  const temp = document.createElement("span");
  temp.style.visibility = "hidden";
  temp.style.position = "absolute";
  temp.style.whiteSpace = "pre";
  temp.style.font = window.getComputedStyle(input).font;
  temp.textContent = input.value.substring(0, input.selectionStart);
  document.body.appendChild(temp);

  // Set cursor position
  cursor.style.left = temp.offsetWidth + "px";

  // Clean up
  document.body.removeChild(temp);
}

function playTypingSound() {
  // Create a simple typing sound
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.type = "sine";
  oscillator.frequency.value = 800 + Math.random() * 400;
  gainNode.gain.value = 0.05;
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 0.03);
}

// Command Processing
function handleInputKeydown(e, tabId) {
  const instance = terminalInstances[tabId];
  if (!instance) return;

  const input = instance.input;
  const history = commandHistory[tabId];

  // Handle special keys
  switch (e.key) {
    case "Enter":
      e.preventDefault();
      const command = input.value.trim();
      if (command) {
        // Add to history
        history.push(command);
        historyPosition[tabId] = history.length;

        // Process command
        processCommand(tabId, command);
      } else {
        // Empty command, just add a new line
        appendOutput(tabId, "");
      }
      input.value = "";
      updateCursorPosition(tabId);
      break;

    case "ArrowUp":
      e.preventDefault();
      if (history.length > 0) {
        historyPosition[tabId] = Math.max(0, historyPosition[tabId] - 1);
        input.value = history[historyPosition[tabId]] || "";
        updateCursorPosition(tabId);
        // Move cursor to end
        setTimeout(() => {
          input.selectionStart = input.selectionEnd = input.value.length;
          updateCursorPosition(tabId);
        }, 0);
      }
      break;

    case "ArrowDown":
      e.preventDefault();
      if (historyPosition[tabId] < history.length) {
        historyPosition[tabId]++;
        input.value = historyPosition[tabId] < history.length ? history[historyPosition[tabId]] : "";
        updateCursorPosition(tabId);
        // Move cursor to end
        setTimeout(() => {
          input.selectionStart = input.selectionEnd = input.value.length;
          updateCursorPosition(tabId);
        }, 0);
      }
      break;

    case "Tab":
      if (settings.tabCompletion) {
        e.preventDefault();
        // Simple tab completion
        const currentInput = input.value.trim();
        const commands = [
          "HELP", "TIME", "DATE", "ECHO", "RANDOM", "CLEAR", "CLS", "QUOTE", "PING", 
          "MYIP", "WEATHER", "URL", "DIR", "LS", "CD", "TYPE", "CAT", "MKDIR", "MD", 
          "RMDIR", "RD", "DEL", "RM", "COPY", "MOVE", "REN", "EXIT", "THEME", "SETTINGS", 
          "ABOUT", "VERSION", "TEST", "CALC", "COLOR", "SYSINFO", "HISTORY", "TIMER", "SEARCH", 
          "JOKE", "ASCII"
        ];

        if (currentInput) {
          const matchingCommands = commands.filter((cmd) => cmd.startsWith(currentInput.toUpperCase()));
          if (matchingCommands.length === 1) {
            input.value = matchingCommands[0].toLowerCase();
            updateCursorPosition(tabId);
          } else if (matchingCommands.length > 1) {
            // Show available completions
            appendOutput(tabId, `\nAvailable commands: ${matchingCommands.join(", ")}`);
            appendOutput(tabId, `\n${getPromptText()}${currentInput}`);
          }
        }
      }
      break;

    case "c":
    case "C":
      // Ctrl+C to cancel current command
      if (e.ctrlKey) {
        e.preventDefault();
        appendOutput(tabId, "^C");
        input.value = "";
        updateCursorPosition(tabId);
      }
      break;

    case "l":
    case "L":
      // Ctrl+L to clear screen
      if (e.ctrlKey) {
        e.preventDefault();
        clearTerminal(tabId);
      }
      break;
  }
}

function processCommand(tabId, command) {
  const instance = terminalInstances[tabId];
  if (!instance) return;

  // Check if we're in a special mode
  if (instance.waitingForFrameType) {
    handleFrameTypeSelection(tabId, command);
    return;
  }
  
  if (instance.calculatorMode) {
    calculateExpression(tabId, command);
    return;
  }
  
  if (instance.waitingForWeatherLocation) {
    instance.waitingForWeatherLocation = false;
    getWeather(tabId, command);
    return;
  }
  
  if (instance.networkToolsMode) {
    processNetworkCommand(tabId, command);
    return;
  }

  // Echo the command
  appendOutput(tabId, `${getPromptText()}${command}`);

  // Process command
  const cmdParts = command.split(" ");
  const cmd = cmdParts[0].toUpperCase();
  const args = cmdParts.slice(1).join(" ");

  // Add command execution effect
  const terminalInstance = document.getElementById(`terminal-${tabId}`);
  if (terminalInstance) {
    const effect = document.createElement("div");
    effect.className = "command-execute-effect";
    terminalInstance.appendChild(effect);
    
    setTimeout(() => {
      effect.remove();
    }, 500);
  }
  

  switch (cmd) {
    case "HELP":
      showHelp(tabId);
      break;

    case "TIME":
      showTime(tabId);
      break;

    case "DATE":
      showDate(tabId);
      break;

    case "ECHO":
      echoMessage(tabId, args);
      break;

    case "RANDOM":
      generateRandom(tabId);
      break;

    case "CLEAR":
    case "CLS":
      clearTerminal(tabId);
      break;

    case "QUOTE":
      showQuote(tabId);
      break;

    case "PING":
      pingUrl(tabId, args);
      break;

    case "MYIP":
      showIp(tabId);
      break;

    case "WEATHER":
      promptWeatherLocation(tabId, args);
      break;

    case "URL":
      openUrl(tabId, args);
      break;

    case "CALC":
      openCalculator(tabId, args);
      break;

    case "COLOR":
      changeTextColor(tabId, args);
      break;

    case "SYSINFO":
      showSystemInfo(tabId);
      break;

    case "HISTORY":
      showCommandHistory(tabId);
      break;

    case "TIMER":
      promptTimerDuration(tabId, args);
      break;

    case "SEARCH":
      searchWeb(tabId, args);
      break;

    case "JOKE":
      tellJoke(tabId);
      break;

    case "ASCII":
      showAsciiArt(tabId);
      break;

    case "DIR":
    case "LS":
      listDirectory(tabId, args);
      break;

    case "CD":
      changeDirectory(tabId, args);
      break;

    case "TYPE":
    case "CAT":
      showFileContents(tabId, args);
      break;

    case "MKDIR":
    case "MD":
      makeDirectory(tabId, args);
      break;

    case "RMDIR":
    case "RD":
      removeDirectory(tabId, args);
      break;

    case "DEL":
    case "RM":
      deleteFile(tabId, args);
      break;

    case "COPY":
      copyFile(tabId, args);
      break;

    case "MOVE":
      moveFile(tabId, args);
      break;

    case "REN":
      renameFile(tabId, args);
      break;

    case "EXIT":
      closeTab(tabId);
      break;

    case "THEME":
      changeTheme(tabId, args);
      break;

    case "SETTINGS":
      openSettings();
      break;

    case "ABOUT":
      openAbout();
      break;

    case "VERSION":
      showVersion(tabId);
      break;
    case "TEST":
      testDebugCommands(tabId, args);
      break;
      
    case "NETWORK":
      openNetworkTools(tabId);
      break;
      
    case "TOOLS":
      openTools();
      break;
      
    case "EXTENSIONS":
      openExtensions();
      break;

    default:
      // Add error effect
      if (terminalInstance) {
        const errorEffect = document.createElement("div");
        errorEffect.className = "error-effect";
        terminalInstance.appendChild(errorEffect);
        
        setTimeout(() => {
          errorEffect.remove();
        }, 500);
      }
      
      appendOutput(
        tabId,
        `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`,
        "error"
      );
      
      // Show suggestion if auto-suggest is enabled
      if (settings.autoSuggest) {
        const commands = [
          "HELP", "TIME", "DATE", "ECHO", "RANDOM", "CLEAR", "QUOTE", "PING", 
          "MYIP", "WEATHER", "URL", "DIR", "CD", "TYPE", "MKDIR", "RMDIR", "DEL", 
          "COPY", "MOVE", "REN", "EXIT", "THEME", "SETTINGS", "ABOUT", "VERSION", "TEST"
        ];
        
        // Find closest command
        const closestCommand = findClosestCommand(cmd, commands);
        if (closestCommand) {
          appendOutput(tabId, `Did you mean '${closestCommand.toLowerCase()}'?`, "info");
        }
      }
      break;
  }
}

function findClosestCommand(input, commands) {
  let closestMatch = null;
  let closestDistance = Infinity;
  
  for (const command of commands) {
    const distance = levenshteinDistance(input.toUpperCase(), command);
    if (distance < closestDistance && distance <= 3) { // Max 3 edits away
      closestDistance = distance;
      closestMatch = command;
    }
  }
  
  return closestMatch;
}

function levenshteinDistance(a, b) {
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// URL handling
function openUrl(tabId, url) {
  if (!url) {
    appendOutput(tabId, "Error: Please specify a URL to open.", "error");
    return;
  }

  // Add http:// if not present
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  appendOutput(tabId, `Opening ${url}...`, "info");

  // Ask for frame type
  appendOutput(tabId, `\nSelect frame type:`, "info");
  appendOutput(tabId, `1. Regular iframe (direct embedding)`);
  appendOutput(tabId, `2. Proxy frame (uses a proxy service)`);
  appendOutput(tabId, `3. Embedded browser (simulated browser UI)`);

  // Store the URL for later use
  terminalInstances[tabId].pendingUrl = url;

  // Set a flag to indicate we're waiting for frame type selection
  terminalInstances[tabId].waitingForFrameType = true;

  // Focus the input
  terminalInstances[tabId].input.focus();
}

function handleFrameTypeSelection(tabId, selection) {
  const url = terminalInstances[tabId].pendingUrl;

  if (!url) {
    appendOutput(tabId, "Error: No pending URL found.", "error");
    return;
  }

  // Clear the waiting flag
  terminalInstances[tabId].waitingForFrameType = false;

  switch (selection) {
    case "1":
      // Regular iframe
      createRegularIframe(url);
      break;
    case "2":
      // Proxy frame
      createProxyFrame(url);
      break;
    case "3":
      // Embedded browser
      createEmbeddedBrowser(url);
      break;
    default:
      appendOutput(tabId, "Error: Invalid selection. Please choose 1, 2, or 3.", "error");
      // Re-display the options
      appendOutput(tabId, `\nSelect frame type:`, "info");
      appendOutput(tabId, `1. Regular iframe (direct embedding)`);
      appendOutput(tabId, `2. Proxy frame (uses a proxy service)`);
      appendOutput(tabId, `3. Embedded browser (simulated browser UI)`);
      terminalInstances[tabId].waitingForFrameType = true;
      return;
  }

  // Clear the pending URL
  delete terminalInstances[tabId].pendingUrl;
}

function createRegularIframe(url) {
  // Create iframe container
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "iframe-container";

  // Create iframe header
  const iframeHeader = document.createElement("div");
  iframeHeader.className = "iframe-header";

  const iframeTitle = document.createElement("div");
  iframeTitle.className = "iframe-title";
  iframeTitle.textContent = `Regular iframe: ${url}`;

  const iframeClose = document.createElement("button");
  iframeClose.className = "iframe-close";
  iframeClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  iframeClose.addEventListener("click", () => {
    document.body.removeChild(iframeContainer);
  });

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.className = "iframe-content";
  iframe.src = url;

  // Assemble iframe container
  iframeHeader.appendChild(iframeTitle);
  iframeHeader.appendChild(iframeClose);
  iframeContainer.appendChild(iframeHeader);
  iframeContainer.appendChild(iframe);

  // Add to body
  document.body.appendChild(iframeContainer);
}

function createProxyFrame(url) {
  // Create iframe container
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "iframe-container";

  // Create iframe header
  const iframeHeader = document.createElement("div");
  iframeHeader.className = "iframe-header";

  const iframeTitle = document.createElement("div");
  iframeTitle.className = "iframe-title";
  iframeTitle.textContent = `Proxy frame: ${url}`;

  const iframeClose = document.createElement("button");
  iframeClose.className = "iframe-close";
  iframeClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  iframeClose.addEventListener("click", () => {
    document.body.removeChild(iframeContainer);
  });

  // Create iframe with proxy
  const iframe = document.createElement("iframe");
  iframe.className = "iframe-content";

  // Use a proxy service (for demonstration, using a common proxy service)
  // Note: In a real implementation, you might want to use a more reliable proxy service
  iframe.src = `https://www.whateverorigin.org/get?url=${encodeURIComponent(url)}&callback=?`;

  // Assemble iframe container
  iframeHeader.appendChild(iframeTitle);
  iframeHeader.appendChild(iframeClose);
  iframeContainer.appendChild(iframeHeader);
  iframeContainer.appendChild(iframe);

  // Add to body
  document.body.appendChild(iframeContainer);
}

function createEmbeddedBrowser(url) {
  // Create iframe container
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "iframe-container browser-container";

  // Create browser UI
  const browserHeader = document.createElement("div");
  browserHeader.className = "browser-header";

  // Browser controls
  const browserControls = document.createElement("div");
  browserControls.className = "browser-controls";

  const backButton = document.createElement("button");
  backButton.className = "browser-button";
  backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

  const forwardButton = document.createElement("button");
  forwardButton.className = "browser-button";
  forwardButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';

  const refreshButton = document.createElement("button");
  refreshButton.className = "browser-button";
  refreshButton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';

  browserControls.appendChild(backButton);
  browserControls.appendChild(forwardButton);
  browserControls.appendChild(refreshButton);

  // Address bar
  const addressBar = document.createElement("div");
  addressBar.className = "browser-address-bar";

  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.className = "browser-address-input";
  addressInput.value = url;

  addressBar.appendChild(addressInput);

  // Close button
  const browserClose = document.createElement("button");
  browserClose.className = "iframe-close";
  browserClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  browserClose.addEventListener("click", () => {
    document.body.removeChild(iframeContainer);
  });

  // Assemble browser header
  browserHeader.appendChild(browserControls);
  browserHeader.appendChild(addressBar);
  browserHeader.appendChild(browserClose);

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.className = "iframe-content";
  iframe.src = url;

  // Set up event listeners for browser controls
  backButton.addEventListener("click", () => {
    iframe.contentWindow.history.back();
  });

  forwardButton.addEventListener("click", () => {
    iframe.contentWindow.history.forward();
  });

  refreshButton.addEventListener("click", () => {
    iframe.contentWindow.location.reload();
  });

  addressInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let newUrl = addressInput.value;
      if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
        newUrl = "https://" + newUrl;
      }
      iframe.src = newUrl;
    }
  });

  // Assemble iframe container
  iframeContainer.appendChild(browserHeader);
  iframeContainer.appendChild(iframe);

  // Add to body
  document.body.appendChild(iframeContainer);
}

// Command Implementations
function showHelp(tabId) {
  appendOutput(
    tabId,
    `
Available commands:
HELP        - Show this help message
TIME        - Show current time
DATE        - Show current date
ECHO [text] - Display text
RANDOM      - Generate a random number
CLEAR, CLS  - Clear the terminal screen
QUOTE       - Show a random quote
CALC       [expr] - Simple calculator
COLOR       - Change text color
SYSINFO     - Show system information
HISTORY     - Show command history
TIMER [sec] - Set a countdown timer
SEARCH [term] - Search the web
JOKE        - Tell a random joke
ASCII       - Show ASCII art
THEME [name] - Change color theme (default, powershell, ubuntu, matrix, light)
SETTINGS    - Open settings panel
ABOUT       - Show about information
VERSION     - Show version information
TEST [test type] - Tests stuff inside the terminal for debugging purposes only 

File System Commands:
DIR, LS     - List directory contents
CD [path]   - Change directory
TYPE, CAT   - Display file contents
MKDIR, MD   - Create directory
RMDIR, RD   - Remove directory
DEL, RM     - Delete file
COPY        - Copy file
MOVE        - Move file
REN         - Rename file

Network Commands:
PING [host] - Ping a host
MYIP        - Show your IP address
NETWORK     - Open network tools

Other Commands:
TOOLS       - Open tools panel
EXTENSIONS  - Open extensions panel

Keyboard shortcuts:
Ctrl+C      - Cancel current command
Ctrl+L      - Clear screen
Up/Down     - Navigate command history
Tab         - Command completion

Symbol Legend:
⮾ - Error
✓ - Success
⚠ - Warning
ⓘ - Information
§ - System
⏲ - Time
» - Quote
⌘ - Command
⧗ - Timer
⌕ - Search
☺ - Joke
`,
  );
}

function showTime(tabId) {
  const now = new Date();
  appendOutput(tabId, `⏲ Current time: ${now.toLocaleTimeString()}`, "info");
}

function showDate(tabId) {
  const now = new Date();
  appendOutput(tabId, `⌚ Current date: ${now.toLocaleDateString()}`, "info");
}

function echoMessage(tabId, message) {
  if (!message) {
    appendOutput(tabId, "ℹ ECHO is on.", "info");
  } else {
    appendOutput(tabId, message);
  }
}

function generateRandom(tabId) {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  appendOutput(tabId, `⚄ Random number: ${randomNum}`, "success");
}

function clearTerminal(tabId) {
  const instance = terminalInstances[tabId];
  if (!instance) return;

  instance.output.innerHTML = "";
}

function showQuote(tabId) {
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Everything you've ever wanted is on the other side of fear. - George Addair",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  appendOutput(tabId, `» "${randomQuote}"`, "info");
}

function pingUrl(tabId, url) {
  if (!url) {
    appendOutput(tabId, "Error: Please specify a URL to ping.");
    return;
  }

  appendOutput(tabId, `Pinging ${url}...`);

  const startTime = Date.now();

  fetch(url, { method: 'HEAD' }) // Sending a HEAD request to minimize data transfer
    .then(response => {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      appendOutput(tabId, `Reply from ${url}: time=${timeTaken}ms`);

      // Simulating packet loss for demonstration
      const lostPackets = Math.random() < 0.1; // 10% chance of packet loss
      if (lostPackets) {
        appendOutput(tabId, `Error: Request timed out.`);
      } else {
        appendOutput(tabId, `Packets: Sent = 1, Received = 1, Lost = 0 (0% loss)`);
      }
      appendOutput(tabId, `Approximate round trip times in milli-seconds:`);
      appendOutput(tabId, `Minimum = ${timeTaken}ms, Maximum = ${timeTaken}ms, Average = ${timeTaken}ms`);
    })
    .catch(error => {
      appendOutput(tabId, `Error: ${error.message}`);
    });
}
/**
 * IP Address Retriever
 * A utility to fetch and display the user's public IP address
 */

// Function to append output to a specific tab (simulating the UI behavior)
function appendOutput(tabId, message) {
  console.log(`[Tab ${tabId}]: ${message}`);
  // In a real application, this would append text to a DOM element
}

// Function to get the user's public IP address using a reliable public API
async function getPublicIpAddress() {
  try {
    // Using ipify API - a free service that returns the user's public IP
    const response = await fetch('https://api.ipify.org?format=json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw error;
  }
}

// Function to show IP address with proper error handling
async function showIp(tabId) {
  appendOutput(tabId, "Retrieving IP address...");
  
  try {
    // Show loading message
    appendOutput(tabId, "Please wait while we retrieve your IP address...");
    
    // Get the actual IP address
    const ipAddress = await getPublicIpAddress();
    
    // Display the IP address
    appendOutput(tabId, `Your IP Address: ${ipAddress}`);
    
    // Additional information
    appendOutput(tabId, `IP retrieved successfully at: ${new Date().toLocaleString()}`);
    
    return ipAddress;
  } catch (error) {
    appendOutput(tabId, `Failed to retrieve IP address: ${error.message}`);
    appendOutput(tabId, "Please check your internet connection and try again.");
    return null;
  }
}

// Example usage - simulating the function being called for different tabs
(async () => {
  // Simulate first tab
  await showIp(1);
  
  // Wait a bit and show in another tab
  setTimeout(async () => {
    await showIp(2);
  }, 2000);
})();

function promptWeatherLocation(tabId) {
  appendOutput(tabId, "Please enter a location to get the weather:");

  // Set a flag to indicate waiting for weather location
  terminalInstances[tabId].waitingForWeatherLocation = true;

  // Override command processing for weather location
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].waitingForWeatherLocation) {
      terminalInstances[tabId].waitingForWeatherLocation = false; // Clear the waiting flag
      processCommand = originalProcessCommand; // Restore original command processing

      // Fetch weather data
      getWeather(tabId, command);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

async function getWeather(tabId, location) {
  try {
    appendOutput(tabId, `Fetching weather for ${location}...`, "info");

    const apiKey = 'd4a74bc9d78d475bba4161053252003'; // Replace with your WeatherAPI key
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.code === 2006) {
        throw new Error("Invalid API key. Please check your API key and try again.", error);
      } else if (response.status === 404) {
        throw new Error("Location not found. Please check the location name and try again.", "error");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`, "error");
      }
    }

    const data = await response.json();
    const weatherInfo = 
`
Last Updated: ${data.last_updated}\n
Current weather in ${data.location.name}, ${data.location.region}:\n
Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F\n
Feels Like: ${data.current.feelslike_c}°C / ${data.current.feelslike_f}°F\n
Condition: ${data.current.condition.text}\n
Humidity: ${data.current.humidity}%\n
Wind: ${data.current.wind_kph} kph / ${data.current.wind_mph} mph\n
Pressure: ${data.current.pressure_mb} mb\n
Visibility: ${data.current.vis_km} km (${data.current.vis_miles} Miles)
`

    appendOutput(tabId, weatherInfo);
  } catch (error) {
    appendOutput(tabId, `Error: ${error.message}`, "error");
  }
}

function openCalculator(tabId, expression) {
  if (expression) {
    calculateExpression(tabId, expression);
    return;
  }
  
  appendOutput(tabId, `
Calculator Tool
--------------
Enter expressions directly in the terminal.
Examples: 2+2, 5*10, (3+4)*2, Math.sin(0.5)

Type 'exit' to close the calculator.
`);
  
  // Set a flag to indicate calculator mode
  terminalInstances[tabId].calculatorMode = true;
}

function calculateExpression(tabId, expression) {
  if (expression.toLowerCase() === 'exit') {
    // Exit calculator mode
    terminalInstances[tabId].calculatorMode = false;
    appendOutput(tabId, "Calculator closed.", "info");
    return;
  }
  
  try {
    // Using Function instead of eval for slightly better security
    const result = new Function("return " + expression)();
    appendOutput(tabId, `Result: ${result}`, "success");
  } catch (error) {
    appendOutput(tabId, `Error: Invalid expression - ${error.message}`, "error");
  }
}

function changeTextColor(tabId, color) {
  const instance = terminalInstances[tabId];
  if (!instance) return;

  const validColors = ["green", "blue", "red", "yellow", "cyan", "magenta", "white"];

  if (!color || !validColors.includes(color.toLowerCase())) {
    appendOutput(tabId, `ℹ Available colors: ${validColors.join(", ")}`, "info");
    return;
  }

  // Apply color to future output
  instance.output.style.color = color.toLowerCase();
  appendOutput(tabId, `◉ Text color changed to ${color}`, "success");
}

function showSystemInfo(tabId) {
  const browserInfo = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const cookiesEnabled = navigator.cookieEnabled;
  const platform = navigator.platform;

  appendOutput(
    tabId,
    `
§ System Information:

Browser: ${browserInfo}
Screen Resolution: ${screenWidth}x${screenHeight}
Color Depth: ${colorDepth} bits
Time Zone: ${timeZone}
Language: ${language}
Cookies Enabled: ${cookiesEnabled ? "Yes" : "No"}
Platform: ${platform}
`,
    "info"
  );
}

function showCommandHistory(tabId) {
  const history = commandHistory[tabId];

  if (!history || history.length === 0) {
    appendOutput(tabId, "⌘ No command history available", "info");
    return;
  }

  let historyOutput = "⌘ Command History:\n\n";

  history.forEach((cmd, index) => {
    historyOutput += `${index + 1}. ${cmd}\n`;
  });

  appendOutput(tabId, historyOutput, "info");
}

function promptTimerDuration(tabId, seconds) {
  if (seconds) {
    setCountdownTimer(tabId, seconds);
    return;
  }
  
  appendOutput(tabId, "Enter duration for timer (in seconds):", "info");
  
  // Set a flag to indicate waiting for timer duration
  terminalInstances[tabId].waitingForTimerDuration = true;
}

function setCountdownTimer(tabId, seconds) {
  if (!seconds || isNaN(Number.parseInt(seconds))) {
    appendOutput(tabId, "Error: Please specify a valid number of seconds", "error");
    return;
  }

  let countdown = Number.parseInt(seconds);
  appendOutput(tabId, `⧗ Timer started: ${countdown} seconds`, "info");

  const timerId = setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      clearInterval(timerId);
      appendOutput(tabId, "⧗ Timer finished!", "success");

      // Play a beep sound if bell sound is enabled
      if (settings.bellSound) {
        const audio = new Audio(
          "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2ooVFYAIAEAGChGIUQY2HV0Vysc7+fh9ipmJKxEUXDtiSCYPqXZcEjkMYvbMBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ=="
        );
        audio.play();
      }
      
      // Add success effect
      const terminalInstance = document.getElementById(`terminal-${tabId}`);
      if (terminalInstance) {
        const successEffect = document.createElement("div");
        successEffect.className = "success-effect";
        terminalInstance.appendChild(successEffect);
        
        setTimeout(() => {
          successEffect.remove();
        }, 500);
      }
    }
  }, 1000);

  // Store the timer ID in case we want to cancel it later
  terminalInstances[tabId].timers = terminalInstances[tabId].timers || [];
  terminalInstances[tabId].timers.push(timerId);
}

function searchWeb(tabId, query) {
  if (!query) {
    appendOutput(tabId, "Error: Please provide a search query", "error");
    return;
  }

  appendOutput(tabId, `⌕ Searching for: ${query}`, "info");

  // Create a search URL
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  // Open in a new tab
  window.open(searchUrl, "_blank");
}

function tellJoke(tabId) {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do you call fake spaghetti? An impasta!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
    "Why do we tell actors to 'break a leg?' Because every play has a cast!",
    "Parallel lines have so much in common. It's a shame they'll never meet.",
    "How do you organize a space party? You planet!",
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  appendOutput(tabId, `☺ ${randomJoke}`, "success");
}

function showAsciiArt(tabId) {
  const arts = [
    `
    ,---.
    /    |
    |    |
    \\    |
     \`---'
    `,
    `
     _____
    / ____|
   | |     
   | |     
   | |____ 
    \\_____|
    `,
    `
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\\_   _/\`\\
\\___)=(___/
    `,
    `
     /\\_/\\
    ( o.o )
     > ^ <
    `,
  ];

  const randomArt = arts[Math.floor(Math.random() * arts.length)];
  appendOutput(tabId, randomArt, "info");
}

// File system commands
function listDirectory(tabId, path) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  const currentDir = instance.currentDirectory;
  const targetPath = path ? resolvePath(currentDir, path) : currentDir;
  
  const dirContents = getDirectoryContents(instance.fileSystem, targetPath);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${targetPath}`, "error");
    return;
  }
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  }).replace(/\//g, "/");
  
  const timeStr = now.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });
  
  let output = `\n Directory of ${targetPath}\n\n`;
  
  // Add parent directory entries
  output += `${dateStr}  ${timeStr}    <DIR>          .\n`;
  output += `${dateStr}  ${timeStr}    <DIR>          ..\n`;
  
  // Add directories
  let dirCount = 2; // . and ..
  let fileCount = 0;
  let totalSize = 0;
  
  for (const name in dirContents) {
    if (typeof dirContents[name] === 'object') {
      output += `${dateStr}  ${timeStr}    <DIR>          ${name}\n`;
      dirCount++;
    } else {
      const size = Math.floor(Math.random() * 1000000) + 1000;
      output += `${dateStr}  ${timeStr}    ${size.toString().padStart(14, ' ')} ${name}\n`;
      fileCount++;
      totalSize += size;
    }
  }
  
  output += `${' '.repeat(14)}${fileCount} File(s)${' '.repeat(14)}${totalSize.toLocaleString()} bytes\n`;
  output += `${' '.repeat(14)}${dirCount} Dir(s)${' '.repeat(12)}107,374,182,400 bytes free\n`;
  
  appendOutput(tabId, output);
}

function getDirectoryContents(fileSystem, path) {
  const parts = path.replace(/\\/g, '/').split('/').filter(p => p);
  
  let current = fileSystem;
  for (const part of parts) {
    if (part === 'C:') continue;
    if (!current[part] || typeof current[part] !== 'object') {
      return null;
    }
    current = current[part];
  }
  
  return current;
}

function resolvePath(currentPath, relativePath) {
  // Handle absolute paths
  if (relativePath.startsWith('C:') || relativePath.startsWith('/')) {
    return relativePath.startsWith('C:') ? relativePath : 'C:' + relativePath;
  }
  
  // Handle parent directory
  if (relativePath === '..') {
    const parts = currentPath.replace(/\\/g, '/').split('/').filter(p => p);
    if (parts.length <= 1) {
      return 'C:';
    }
    parts.pop();
    return parts.join('/');
  }
  
  // Handle current directory
  if (relativePath === '.') {
    return currentPath;
  }
  
  // Handle relative path
  return currentPath + '/' + relativePath;
}

function changeDirectory(tabId, dir) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  if (!dir) {
    appendOutput(tabId, instance.currentDirectory);
    return;
  }
  
  const newPath = resolvePath(instance.currentDirectory, dir);
  
  const dirContents = getDirectoryContents(instance.fileSystem, newPath);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${dir}`, "error");
    return;
  }
  
  instance.currentDirectory = newPath;
  
  // Update prompt to reflect directory change
  instance.prompt.textContent = `${newPath}>`;
  
  appendOutput(tabId, `Changed directory to ${newPath}`, "info");
}

function showFileContents(tabId, file) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  if (!file) {
    appendOutput(tabId, "Error: Please specify a file name.", "error");
    return;
  }
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (typeof dirContents[file] === 'string') {
    appendOutput(tabId, dirContents[file]);
  } else {
    appendOutput(tabId, `File not found: ${file}`, "error");
  }
}

function makeDirectory(tabId, dir) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  if (!dir) {
    appendOutput(tabId, "Error: Please specify a directory name.", "error");
    return;
  }
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (dirContents[dir]) {
    appendOutput(tabId, `A file or directory with the name '${dir}' already exists.`, "error");
    return;
  }
  
  dirContents[dir] = {};
  appendOutput(tabId, `Directory created: ${dir}`, "success");
}

function removeDirectory(tabId, dir) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  if (!dir) {
    appendOutput(tabId, "Error: Please specify a directory name.", "error");
    return;
  }
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (!dirContents[dir]) {
    appendOutput(tabId, `Directory not found: ${dir}`, "error");
    return;
  }
  
  if (typeof dirContents[dir] !== 'object') {
    appendOutput(tabId, `${dir} is not a directory.`, "error");
    return;
  }
  
  delete dirContents[dir];
  appendOutput(tabId, `Directory removed: ${dir}`, "success");
}

function deleteFile(tabId, file) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  if (!file) {
    appendOutput(tabId, "Error: Please specify a file name.", "error");
    return;
  }
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (!dirContents[file]) {
    appendOutput(tabId, `File not found: ${file}`, "error");
    return;
  }
  
  if (typeof dirContents[file] === 'object') {
    appendOutput(tabId, `${file} is a directory, not a file.`, "error");
    return;
  }
  
  delete dirContents[file];
  appendOutput(tabId, `File deleted: ${file}`, "success");
}

function copyFile(tabId, args) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  const parts = args.split(" ");
  if (parts.length < 2) {
    appendOutput(tabId, "Error: Please specify source and destination files.", "error");
    return;
  }

  const source = parts[0];
  const dest = parts[1];
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (!dirContents[source]) {
    appendOutput(tabId, `File not found: ${source}`, "error");
    return;
  }
  
  if (typeof dirContents[source] === 'object') {
    appendOutput(tabId, `${source} is a directory, not a file.`, "error");
    return;
  }
  
  dirContents[dest] = dirContents[source];
  appendOutput(tabId, `File copied: ${source} -> ${dest}`, "success");
}

function moveFile(tabId, args) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  const parts = args.split(" ");
  if (parts.length < 2) {
    appendOutput(tabId, "Error: Please specify source and destination files.", "error");
    return;
  }

  const source = parts[0];
  const dest = parts[1];
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (!dirContents[source]) {
    appendOutput(tabId, `File not found: ${source}`, "error");
    return;
  }
  
  if (typeof dirContents[source] === 'object') {
    appendOutput(tabId, `${source} is a directory, not a file.`, "error");
    return;
  }
  
  dirContents[dest] = dirContents[source];
  delete dirContents[source];
  appendOutput(tabId, `File moved: ${source} -> ${dest}`);
}

function renameFile(tabId, args) {
  const instance = terminalInstances[tabId];
  if (!instance) return;
  
  const parts = args.split(" ");
  if (parts.length < 2) {
    appendOutput(tabId, "Error: Please specify old and new file names.", "error");
    return;
  }

  const oldName = parts[0];
  const newName = parts[1];
  
  const currentDir = instance.currentDirectory;
  const dirContents = getDirectoryContents(instance.fileSystem, currentDir);
  
  if (!dirContents) {
    appendOutput(tabId, `Directory not found: ${currentDir}`, "error");
    return;
  }
  
  if (!dirContents[oldName]) {
    appendOutput(tabId, `File not found: ${oldName}`, "error");
    return;
  }
  
  dirContents[newName] = dirContents[oldName];
  delete dirContents[oldName];
  appendOutput(tabId, `File renamed: ${oldName} -> ${newName}`, "success");
}

function changeTheme(tabId, theme) {
  if (!theme) {
    appendOutput(tabId, "Error: Please specify a theme name (default, powershell, ubuntu, matrix, light, cyberpunk, dracula, nord).", "error");
    return;
  }

  const validThemes = ["default", "powershell", "ubuntu", "matrix", "light", "cyberpunk", "dracula", "nord"];
  const themeName = theme.toLowerCase();

  if (validThemes.includes(themeName)) {
    // Remove all theme classes
    document.body.classList.remove(...validThemes.map(t => `theme-${t}`));

    // Add the selected theme class
    if (themeName !== "default") {
      document.body.classList.add(`theme-${themeName}`);
    }

    settings.colorScheme = themeName;
    saveSettingsToLocalStorage();

    appendOutput(tabId, `Theme changed to ${themeName}.`, "success");
  } else {
    appendOutput(tabId, `Error: Invalid theme name. Available themes: ${validThemes.join(", ")}`, "error");
  }
}

// Define current version and dates
const currentVersion = "2.5.0";
const buildDate = "5/21/2025";
const updatedDate = new Date().toLocaleDateString(); // Gets the current date

function showVersion(tabId) {
  appendOutput(
    tabId,
`    
HTML Terminal Version: ${currentVersion} 
Build: ${buildDate} 
Updated: ${updatedDate}
`
  );
}

// Network tools
function openNetworkTools(tabId) {
  appendOutput(tabId, `
Network Tools
------------
Available commands:
- ping [host] - Ping a host
- myip - Show your IP address
- tracert [host] - Trace route to host
- dns [domain] - DNS lookup
- scan [host] - Port scan (simulated)

Type 'exit' to close network tools.
`);
  
  // Set a flag to indicate network tools mode
  terminalInstances[tabId].networkToolsMode = true;
}

function processNetworkCommand(tabId, command) {
  if (command.toLowerCase() === 'exit') {
    // Exit network tools mode
    terminalInstances[tabId].networkToolsMode = false;
    appendOutput(tabId, "Network tools closed.");
    return;
  }
  
  const parts = command.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");
  
  switch (cmd) {
    case "ping":
      pingUrl(tabId, args);
      break;
    case "myip":
      showIp(tabId);
      break;
    case "tracert":
      traceRoute(tabId, args);
      break;
    case "dns":
      dnsLookup(tabId, args);
      break;
    case "scan":
      portScan(tabId, args);
      break;
    default:
      appendOutput(tabId, `Unknown network command: ${cmd}`, "error");
      break;
  }
}

async function traceRoute(tabId, host) {
  if (!host) {
    appendOutput(tabId, `Error: Please specify a host to trace.`, "error");
    return;
  }

  appendOutput(tabId, `Tracing route to ${host}...`);

  try {
    // Make a request to your backend API that performs traceroute
    const response = await fetch(`/api/traceroute?host=${encodeURIComponent(host)}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`, "error");
    }

    const data = await response.json();

    // Assuming your API returns an array of hops
    data.hops.forEach((hop, index) => {
      appendOutput(tabId, `  ${index + 1}    ${hop.time}    ${hop.ip}`);
    });

    appendOutput(tabId, "\nTrace complete.", "success");
  } catch (error) {
    appendOutput(tabId, `Error: ${error.message}`, "error");
  }
}

async function dnsLookup(tabId, domain) {
  if (!domain) {
    appendOutput(tabId, `Error: Please specify a domain for DNS lookup.`, "error");
    return;
  }

  appendOutput(tabId, `Performing DNS lookup for ${domain}...`);

  try {
    // Use a public DNS resolver API (e.g., DNS over HTTPS)
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`, "error");
    }

    const data = await response.json();

    if (data.Status !== 0) {
      throw new Error(`DNS lookup failed: ${data.Status}`, "error");
    }

    // Extract A records
    const aRecords = data.Answer.map(record => `A Record: ${record.data}`).join('\n');

    appendOutput(tabId, `DNS Records for ${domain}:\n${aRecords}`);
  } catch (error) {
    appendOutput(tabId, `Error: ${error.message}`, "error");
  }
}

async function portScan(tabId, host) {
  if (!host) {
    appendOutput(tabId, `Error: Please specify a host for port scan.`, "error");
    return;
  }

  appendOutput(tabId, `Scanning common ports on ${host}...`);

  try {
    // Make a request to your backend API that performs the port scan
    const response = await fetch(`/api/portscan?host=${encodeURIComponent(host)}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`, "error");
    }

    const data = await response.json();

    // Assuming your API returns an array of ports with their states
    data.ports.forEach(port => {
      appendOutput(tabId, ` ${port.number}/tcp   ${port.state}    ${port.service}`);
    });

    appendOutput(tabId, "\nScan completed.");
  } catch (error) {
    appendOutput(tabId, `Error: ${error.message}`, "error");
  }
}

// Output handling
function appendOutput(tabId, text, type = "") {
  const instance = terminalInstances[tabId];
  if (!instance || !instance.output) return;

  const output = instance.output;

  // Create a new output line
  const line = document.createElement("div");
  line.className = "output-line";

  // Add appropriate styling based on type
  if (type) {
    line.classList.add(`output-${type}`);
  }

  // Handle newlines properly
  if (text.includes("\n")) {
    const fragments = text.split("\n");
    fragments.forEach((fragment, index) => {
      const fragmentLine = document.createElement("div");
      fragmentLine.className = "output-line";
      if (type) {
        fragmentLine.classList.add(`output-${type}`);
      }
      fragmentLine.textContent = fragment;
      output.appendChild(fragmentLine);
    });
  } else {
    line.textContent = text;
    output.appendChild(line);
  }

  // Scroll to bottom
  output.scrollTop = output.scrollHeight;
  
  // Focus the input after output
  if (instance.input) {
    setTimeout(() => {
      instance.input.focus();
    }, 10);
  }
}

// Settings Management
function openSettings() {
  const settingsPanel = document.getElementById("settingsPanel");
  const overlay = document.getElementById("overlay");
  
  if (settingsPanel && overlay) {
    settingsPanel.classList.add("active");
    overlay.classList.add("active");

    // Load current settings into form
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const fontFamilySelect = document.getElementById("fontFamilySelect");
    const opacityRange = document.getElementById("opacityRange");
    const opacityValue = document.getElementById("opacityValue");
    const blurRange = document.getElementById("blurRange");
    const blurValue = document.getElementById("blurValue");
    const borderRadiusRange = document.getElementById("borderRadiusRange");
    const borderRadiusValue = document.getElementById("borderRadiusValue");
    const glassEffectToggle = document.getElementById("glassEffectToggle");
    const cursorBlinkToggle = document.getElementById("cursorBlinkToggle");
    const bellSoundToggle = document.getElementById("bellSoundToggle");
    const confirmCloseToggle = document.getElementById("confirmCloseToggle");
    const particleEffectsToggle = document.getElementById("particleEffectsToggle");
    const typingSoundToggle = document.getElementById("typingSoundToggle");
    const scanlineEffectToggle = document.getElementById("scanlineEffectToggle");
    const promptStyleSelect = document.getElementById("promptStyleSelect");
    const customPromptContainer = document.getElementById("customPromptContainer");
    const customPromptInput = document.getElementById("customPromptInput");
    
    if (fontSizeSelect) fontSizeSelect.value = settings.fontSize || "14";
    if (fontFamilySelect) fontFamilySelect.value = settings.fontFamily || "'Cascadia Code', monospace";
    if (opacityRange) {
      opacityRange.value = settings.opacity || "0.95";
      if (opacityValue) opacityValue.textContent = `${Math.round((settings.opacity || 0.95) * 100)}%`;
    }
    if (blurRange) {
      blurRange.value = settings.blur || "0";
      if (blurValue) blurValue.textContent = `${settings.blur || 0}px`;
    }
    if (borderRadiusRange) {
      borderRadiusRange.value = settings.borderRadius || "0";
      if (borderRadiusValue) borderRadiusValue.textContent = `${settings.borderRadius || 0}px`;
    }
    if (glassEffectToggle) glassEffectToggle.checked = settings.glassEffect || false;
    if (cursorBlinkToggle) cursorBlinkToggle.checked = settings.cursorBlink !== false;
    if (bellSoundToggle) bellSoundToggle.checked = settings.bellSound !== false;
    if (confirmCloseToggle) confirmCloseToggle.checked = settings.confirmClose !== false;
    if (particleEffectsToggle) particleEffectsToggle.checked = settings.particleEffects !== false;
    if (typingSoundToggle) typingSoundToggle.checked = settings.typingSound || false;
    if (scanlineEffectToggle) scanlineEffectToggle.checked = settings.scanlineEffect !== false;
    if (promptStyleSelect) promptStyleSelect.value = settings.promptStyle || "windows";
    
    if (customPromptContainer && promptStyleSelect) {
      customPromptContainer.style.display = promptStyleSelect.value === "custom" ? "flex" : "none";
    }
    
    if (customPromptInput) customPromptInput.value = settings.customPrompt || "";
  }
}

function closeSettingsPanel() {
  const settingsPanel = document.getElementById("settingsPanel");
  const overlay = document.getElementById("overlay");
  
  if (settingsPanel && overlay) {
    settingsPanel.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function openColorScheme() {
  const colorSchemePanel = document.getElementById("colorSchemePanel");
  const overlay = document.getElementById("overlay");
  
  if (colorSchemePanel && overlay) {
    colorSchemePanel.classList.add("active");
    overlay.classList.add("active");

    // Highlight the active scheme
    document.querySelectorAll(".scheme-item").forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-scheme") === settings.colorScheme) {
        item.classList.add("active");
      }
    });
    
    // Update color pickers for custom scheme
    updateColorPickersFromTheme();
  }
}

function closeColorSchemePanel() {
  const colorSchemePanel = document.getElementById("colorSchemePanel");
  const overlay = document.getElementById("overlay");
  
  if (colorSchemePanel && overlay) {
    colorSchemePanel.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function openAbout() {
  const aboutPanel = document.getElementById("aboutPanel");
  const overlay = document.getElementById("overlay");
  
  if (aboutPanel && overlay) {
    aboutPanel.classList.add("active");
    overlay.classList.add("active");
  }
}

function closeAboutPanel() {
  const aboutPanel = document.getElementById("aboutPanel");
  const overlay = document.getElementById("overlay");
  
  if (aboutPanel && overlay) {
    aboutPanel.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function openTools() {
  const toolsPanel = document.getElementById("toolsPanel");
  const overlay = document.getElementById("overlay");
  
  if (toolsPanel && overlay) {
    toolsPanel.classList.add("active");
    overlay.classList.add("active");
  }
}

function closeToolsPanel() {
  const toolsPanel = document.getElementById("toolsPanel");
  const overlay = document.getElementById("overlay");
  
  if (toolsPanel && overlay) {
    toolsPanel.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function openExtensions() {
  const extensionsPanel = document.getElementById("extensionsPanel");
  const overlay = document.getElementById("overlay");
  
  if (extensionsPanel && overlay) {
    extensionsPanel.classList.add("active");
    overlay.classList.add("active");
  }
}

function closeExtensionsPanel() {
  const extensionsPanel = document.getElementById("extensionsPanel");
  const overlay = document.getElementById("overlay");
  
  if (extensionsPanel && overlay) {
    extensionsPanel.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function closeAllPanels() {
  closeSettingsPanel();
  closeColorSchemePanel();
  closeAboutPanel();
  closeToolsPanel();
  closeExtensionsPanel();
}

function updateRangeValue(rangeElement, valueElement, unit = "", multiplier = 1) {
  if (rangeElement && valueElement) {
    const value = rangeElement.value;
    valueElement.textContent = `${Math.round(value * multiplier)}${unit}`;
  }
}

function applySettingsPreview() {
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const fontFamilySelect = document.getElementById("fontFamilySelect");
  const opacityRange = document.getElementById("opacityRange");
  const blurRange = document.getElementById("blurRange");
  const borderRadiusRange = document.getElementById("borderRadiusRange");
  const glassEffectToggle = document.getElementById("glassEffectToggle");
  const cursorBlinkToggle = document.getElementById("cursorBlinkToggle");
  
  // Apply font size
  if (fontSizeSelect) {
    document.documentElement.style.setProperty("--font-size", `${fontSizeSelect.value}px`);
  }

  // Apply font family
  if (fontFamilySelect) {
    document.documentElement.style.setProperty("--font-family", fontFamilySelect.value);
  }

  // Apply opacity
  if (opacityRange) {
    document.documentElement.style.setProperty("--bg-color-transparent", `rgba(12, 12, 12, ${opacityRange.value})`);
  }
  
  // Apply blur
  if (blurRange) {
    document.documentElement.style.setProperty("--blur-amount", `${blurRange.value}px`);
  }
  
  // Apply border radius
  if (borderRadiusRange) {
    document.documentElement.style.setProperty("--border-radius", `${borderRadiusRange.value}px`);
  }
  
  // Apply glass effect
  if (glassEffectToggle) {
    if (glassEffectToggle.checked) {
      document.documentElement.classList.add("glass-effect");
    } else {
      document.documentElement.classList.remove("glass-effect");
    }
  }

  // Apply cursor blink
  if (cursorBlinkToggle) {
    document.querySelectorAll(".terminal-cursor").forEach((cursor) => {
      if (cursorBlinkToggle.checked) {
        cursor.classList.remove("cursor-no-blink");
      } else {
        cursor.classList.add("cursor-no-blink");
      }
    });
  }
}

function saveSettingsHandler() {
  // Get values from form
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const fontFamilySelect = document.getElementById("fontFamilySelect");
  const opacityRange = document.getElementById("opacityRange");
  const blurRange = document.getElementById("blurRange");
  const borderRadiusRange = document.getElementById("borderRadiusRange");
  const glassEffectToggle = document.getElementById("glassEffectToggle");
  const cursorBlinkToggle = document.getElementById("cursorBlinkToggle");
  const bellSoundToggle = document.getElementById("bellSoundToggle");
  const confirmCloseToggle = document.getElementById("confirmCloseToggle");
  const particleEffectsToggle = document.getElementById("particleEffectsToggle");
  const typingSoundToggle = document.getElementById("typingSoundToggle");
  const scanlineEffectToggle = document.getElementById("scanlineEffectToggle");
  const cursorStyleSelect = document.getElementById("cursorStyleSelect");
  const promptStyleSelect = document.getElementById("promptStyleSelect");
  const customPromptInput = document.getElementById("customPromptInput");
  
  if (fontSizeSelect) settings.fontSize = fontSizeSelect.value;
  if (fontFamilySelect) settings.fontFamily = fontFamilySelect.value;
  if (opacityRange) settings.opacity = opacityRange.value;
  if (blurRange) settings.blur = blurRange.value;
  if (borderRadiusRange) settings.borderRadius = borderRadiusRange.value;
  if (glassEffectToggle) settings.glassEffect = glassEffectToggle.checked;
  if (cursorBlinkToggle) settings.cursorBlink = cursorBlinkToggle.checked;
  if (bellSoundToggle) settings.bellSound = bellSoundToggle.checked;
  if (confirmCloseToggle) settings.confirmClose = confirmCloseToggle.checked;
  if (particleEffectsToggle) settings.particleEffects = particleEffectsToggle.checked;
  if (typingSoundToggle) settings.typingSound = typingSoundToggle.checked;
  if (scanlineEffectToggle) settings.scanlineEffect = scanlineEffectToggle.checked;
  if (cursorStyleSelect) settings.cursorStyle = cursorStyleSelect.value;
  if (promptStyleSelect) settings.promptStyle = promptStyleSelect.value;
  if (customPromptInput) settings.customPrompt = customPromptInput.value;

  // Apply settings
  applySettings();

  // Save to local storage
  saveSettingsToLocalStorage();

  // Close panel
  closeSettingsPanel();
}

function resetSettingsHandler() {
  // Reset to defaults
  settings = {
    fontSize: "14",
    fontFamily: "'Cascadia Code', monospace",
    opacity: "0.95",
    blur: "0",
    borderRadius: "0",
    glassEffect: false,
    cursorBlink: true,
    bellSound: true,
    confirmClose: true,
    colorScheme: "default",
    particleEffects: true,
    typingSound: false,
    scanlineEffect: true,
    cursorStyle: "bar",
    promptStyle: "windows",
    customPrompt: "",
  };

  // Apply settings
  applySettings();

  // Save to local storage
  saveSettingsToLocalStorage();
  
  // Reload form
  openSettings();
}

function selectColorScheme(scheme) {
  document.querySelectorAll(".color-scheme-item").forEach((item) => {
    item.classList.remove("active");
  });

  const selectedItem = document.querySelector(`.color-scheme-item[data-scheme="${scheme}"]`);
  if (selectedItem) {
    selectedItem.classList.add("active");
  }

  settings.colorScheme = scheme;
  applyColorScheme();
}

function previewColorScheme(scheme) {
  // Remove all theme classes
  const validThemes = ["default", "powershell", "ubuntu", "matrix", "light", "cyberpunk", "dracula", "nord"];
  document.body.classList.remove(...validThemes.map(t => `theme-${t}`));

  // Add the selected theme class
  if (scheme !== "default") {
    document.body.classList.add(`theme-${scheme}`);
  }
  
  // Update preview terminal
  updateSchemePreview();
}

function updateSchemePreview() {
  // Update the colors in the preview terminal
  const previewTerminal = document.querySelector(".scheme-preview-terminal");
  if (previewTerminal) {
    previewTerminal.style.color = getComputedStyle(document.documentElement).getPropertyValue("--text-color");
    
    const previewPrompt = previewTerminal.querySelector(".preview-prompt");
    if (previewPrompt) {
      previewPrompt.style.color = getComputedStyle(document.documentElement).getPropertyValue("--prompt-color");
    }
    
    const previewCommand = previewTerminal.querySelector(".preview-command");
    if (previewCommand) {
      previewCommand.style.color = getComputedStyle(document.documentElement).getPropertyValue("--command-color");
    }
    
    const previewDirectory = previewTerminal.querySelector(".preview-directory");
    if (previewDirectory) {
      previewDirectory.style.color = getComputedStyle(document.documentElement).getPropertyValue("--info-color");
    }
    
    const previewFolder = previewTerminal.querySelector(".preview-folder");
    if (previewFolder) {
      previewFolder.style.color = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
    }
    
    const previewCursor = previewTerminal.querySelector(".preview-cursor");
    if (previewCursor) {
      previewCursor.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--cursor-color");
    }
  }
}

function applyColorSchemeHandler() {
  const activeScheme = document.querySelector(".scheme-item.active");
  if (activeScheme) {
    const scheme = activeScheme.getAttribute("data-scheme");
    settings.colorScheme = scheme;
    applyColorScheme();
    saveSettingsToLocalStorage();
  }

  closeColorSchemePanel();
}

function exportColorSchemeHandler() {
  const activeScheme = document.querySelector(".scheme-item.active");
  if (activeScheme) {
    const scheme = activeScheme.getAttribute("data-scheme");
    const schemeData = {
      name: scheme,
      settings: {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--bg-color").trim(),
        textColor: getComputedStyle(document.documentElement).getPropertyValue("--text-color").trim(),
        accentColor: getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim(),
        selectionColor: getComputedStyle(document.documentElement).getPropertyValue("--selection-color").trim(),
        errorColor: getComputedStyle(document.documentElement).getPropertyValue("--error-color").trim(),
        successColor: getComputedStyle(document.documentElement).getPropertyValue("--success-color").trim(),
      },
    };

    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schemeData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${scheme}-theme.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

function importColorSchemeHandler() {
  // Create a file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const schemeData = JSON.parse(event.target.result);
          if (schemeData.name && schemeData.settings) {
            // Apply the imported scheme
            applyCustomColorScheme(schemeData.settings);
            
            // Select the custom scheme
            document.querySelectorAll(".scheme-item").forEach((item) => {
              item.classList.remove("active");
            });
            const customSchemeItem = document.querySelector('.scheme-item[data-scheme="custom"]');
            if (customSchemeItem) {
              customSchemeItem.classList.add("active");
            }
            
            // Update color pickers
            updateColorPickersFromCustomScheme(schemeData.settings);
            
            // Save the custom scheme
            settings.customScheme = schemeData.settings;
            settings.colorScheme = "custom";
            saveSettingsToLocalStorage();
          }
        } catch (error) {
          console.error("Error parsing color scheme:", error);
        }
      };
      reader.readAsText(file);
    }
  });
  
  fileInput.click();
}

function updateColorPickersFromTheme() {
  const bgColorPicker = document.getElementById("bgColorPicker");
  const textColorPicker = document.getElementById("textColorPicker");
  const accentColorPicker = document.getElementById("accentColorPicker");
  const selectionColorPicker = document.getElementById("selectionColorPicker");
  const errorColorPicker = document.getElementById("errorColorPicker");
  const successColorPicker = document.getElementById("successColorPicker");
  
  if (bgColorPicker) bgColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--bg-color").trim());
  if (textColorPicker) textColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--text-color").trim());
  if (accentColorPicker) accentColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim());
  if (selectionColorPicker) selectionColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--selection-color").trim());
  if (errorColorPicker) errorColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--error-color").trim());
  if (successColorPicker) successColorPicker.value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue("--success-color").trim());
}

function updateColorPickersFromCustomScheme(scheme) {
  const bgColorPicker = document.getElementById("bgColorPicker");
  const textColorPicker = document.getElementById("textColorPicker");
  const accentColorPicker = document.getElementById("accentColorPicker");
  const selectionColorPicker = document.getElementById("selectionColorPicker");
  const errorColorPicker = document.getElementById("errorColorPicker");
  const successColorPicker = document.getElementById("successColorPicker");
  
  if (bgColorPicker && scheme.backgroundColor) bgColorPicker.value = rgbToHex(scheme.backgroundColor);
  if (textColorPicker && scheme.textColor) textColorPicker.value = rgbToHex(scheme.textColor);
  if (accentColorPicker && scheme.accentColor) accentColorPicker.value = rgbToHex(scheme.accentColor);
  if (selectionColorPicker && scheme.selectionColor) selectionColorPicker.value = rgbToHex(scheme.selectionColor);
  if (errorColorPicker && scheme.errorColor) errorColorPicker.value = rgbToHex(scheme.errorColor);
  if (successColorPicker && scheme.successColor) successColorPicker.value = rgbToHex(scheme.successColor);
}

function rgbToHex(rgb) {
  // Check if already a hex color
  if (rgb.startsWith('#')) {
    return rgb;
  }
  
  // Extract RGB values
  const rgbMatch = rgb.match(/^rgb$$(\d+),\s*(\d+),\s*(\d+)$$$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  return '#000000'; // Default
}

function updateCustomColorScheme() {
  const bgColorPicker = document.getElementById("bgColorPicker");
  const textColorPicker = document.getElementById("textColorPicker");
  const accentColorPicker = document.getElementById("accentColorPicker");
  const selectionColorPicker = document.getElementById("selectionColorPicker");
  const errorColorPicker = document.getElementById("errorColorPicker");
  const successColorPicker = document.getElementById("successColorPicker");
  
  const customScheme = {
    backgroundColor: bgColorPicker ? bgColorPicker.value : "#0c0c0c",
    textColor: textColorPicker ? textColorPicker.value : "#cccccc",
    accentColor: accentColorPicker ? accentColorPicker.value : "#0078d7",
    selectionColor: selectionColorPicker ? selectionColorPicker.value : "#264f78",
    errorColor: errorColorPicker ? errorColorPicker.value : "#f14c4c",
    successColor: successColorPicker ? successColorPicker.value : "#13a10e",
  };
  
  applyCustomColorScheme(customScheme);
  
  // Update preview
  updateSchemePreview();
}

function applyCustomColorScheme(scheme) {
  document.documentElement.style.setProperty("--bg-color", scheme.backgroundColor);
  document.documentElement.style.setProperty("--text-color", scheme.textColor);
  document.documentElement.style.setProperty("--accent-color", scheme.accentColor);
  document.documentElement.style.setProperty("--selection-color", scheme.selectionColor);
  document.documentElement.style.setProperty("--error-color", scheme.errorColor);
  document.documentElement.style.setProperty("--success-color", scheme.successColor);
  
  // Extract RGB values from accent color for calculations
  const accentRgb = hexToRgb(scheme.accentColor);
  if (accentRgb) {
    document.documentElement.style.setProperty("--accent-color-rgb", `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
  }
  
  // Calculate accent hover color (slightly lighter)
  const accentHoverColor = lightenColor(scheme.accentColor, 20);
  document.documentElement.style.setProperty("--accent-hover-color", accentHoverColor);
  
  // Calculate glow color
  document.documentElement.style.setProperty("--glow-color", `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.2)`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function lightenColor(color, amount) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return `#${Math.min(255, rgb.r + amount).toString(16).padStart(2, '0')}${
    Math.min(255, rgb.g + amount).toString(16).padStart(2, '0')}${
    Math.min(255, rgb.b + amount).toString(16).padStart(2, '0')}`;
}

async function checkUpdatesHandler() {
  const tabId = activeTabId;
  if (!tabId) return;

  appendOutput(tabId, "🔍 Checking for version and file integrity...");

  const remoteBase = "https://raw.githubusercontent.com/Snowy3775/HTML_Terminal/main/HMTL%20TERMINAL/";
  const localVersion = "3.0.0"; // Sync with your app version
  const versionFile = "version.txt";
  const filesToCheck = ["index.html", "styles.css", "script.js"];

  try {
    const versionRes = await fetch(remoteBase + versionFile);
    if (!versionRes.ok) throw new Error("Failed to fetch version.txt");
    const remoteVersion = (await versionRes.text()).trim();

    if (remoteVersion !== localVersion) {
      appendOutput(tabId, `Version mismatch: Local = ${localVersion}, Remote = ${remoteVersion}`, "warning");
    } else {
      appendOutput(tabId, `Version matches: ${localVersion}`, "success");
    }

    // Check files one by one
    const mismatched = [];

    for (const file of filesToCheck) {
      try {
        const remoteRes = await fetch(remoteBase + file);
        const remoteContent = (await remoteRes.text()).trim();

        const localRes = await fetch(file);
        const localContent = (await localRes.text()).trim();

        if (remoteContent !== localContent) {
          mismatched.push(file);
        }
      } catch {
        mismatched.push(file); // Missing or failed to fetch
      }
    }

    if (mismatched.length === 0 && remoteVersion === localVersion) {
      appendOutput(tabId, "All files match and version is correct.", "success");
    } else {
      appendOutput(tabId, `File mismatch detected in: ${mismatched.join(", ")}`, "warning");
      appendOutput(tabId, "Type `update confirm` to re-download and fix these files.", "info");
    }
  } catch (err) {
    appendOutput(tabId, `Error: ${err.message}`, "error");
  } finally {
    closeAboutPanel();
  }
}



// Helpers to get loaded content:
function getStyleContent() {
  const styleLink = document.querySelector('link[href$="styles.css"]');
  return styleLink ? styleLink.outerHTML : "";
}

function getScriptContent() {
  const scripts = [...document.querySelectorAll("script[src$='script.js']")];
  return scripts.map(s => s.outerHTML).join("\n");
}




function applySettings() {
  // Apply font size
  document.documentElement.style.setProperty("--font-size", `${settings.fontSize}px`);

  // Apply font family
  document.documentElement.style.setProperty("--font-family", settings.fontFamily);

  // Apply opacity
  document.documentElement.style.setProperty("--bg-color-transparent", `rgba(12, 12, 12, ${settings.opacity})`);
  
  // Apply blur
  document.documentElement.style.setProperty("--blur-amount", `${settings.blur || 0}px`);
  
  // Apply border radius
  document.documentElement.style.setProperty("--border-radius", `${settings.borderRadius || 0}px`);
  
  // Apply glass effect
  if (settings.glassEffect) {
    document.documentElement.classList.add("glass-effect");
  } else {
    document.documentElement.classList.remove("glass-effect");
  }

  // Apply cursor blink
  document.querySelectorAll(".terminal-cursor").forEach((cursor) => {
    if (settings.cursorBlink) {
      cursor.classList.remove("cursor-no-blink");
    } else {
      cursor.classList.add("cursor-no-blink");
    }
  });
  
  // Apply cursor style
  document.querySelectorAll(".terminal-cursor").forEach((cursor) => {
    cursor.classList.remove("cursor-block", "cursor-bar", "cursor-underline");
    if (settings.cursorStyle) {
      cursor.classList.add(`cursor-${settings.cursorStyle}`);
    }
  });
  
  // Apply scanline effect
  if (settings.scanlineEffect) {
    document.querySelectorAll(".terminal-instance").forEach((instance) => {
      if (!instance.querySelector(".scanline-effect")) {
        const scanlineEffect = document.createElement("div");
        scanlineEffect.className = "scanline-effect";
        instance.appendChild(scanlineEffect);
      }
    });
  } else {
    document.querySelectorAll(".scanline-effect").forEach((effect) => {
      effect.remove();
    });
  }
  
  // Apply prompt style
  document.querySelectorAll(".terminal-prompt").forEach((prompt) => {
    prompt.textContent = getPromptText();
  });

  // Apply color scheme
  applyColorScheme();
  
  // Apply particle effects
  if (settings.particleEffects) {
    createParticles();
  } else {
    document.querySelectorAll(".particle").forEach((particle) => {
      particle.remove();
    });
    document.querySelectorAll(".cursor-glow").forEach((glow) => {
      glow.remove();
    });
  }
}

function applyColorScheme() {
  // Remove all theme classes
  const validThemes = ["default", "powershell", "ubuntu", "matrix", "light", "cyberpunk", "dracula", "nord"];
  document.body.classList.remove(...validThemes.map(t => `theme-${t}`));

  // Add the selected theme class
  if (settings.colorScheme !== "default" && settings.colorScheme !== "custom") {
    document.body.classList.add(`theme-${settings.colorScheme}`);
  }
  
  // Apply custom scheme if selected
  if (settings.colorScheme === "custom" && settings.customScheme) {
    applyCustomColorScheme(settings.customScheme);
  }
}

function loadSettings() {
  // Try to load from local storage
  const savedSettings = localStorage.getItem("terminalSettings");
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      settings = { ...settings, ...parsedSettings };
    } catch (e) {
      console.error("Error parsing settings:", e);
    }
  }

  // Apply settings
  applySettings();
}

function saveSettingsToLocalStorage() {
  localStorage.setItem("terminalSettings", JSON.stringify(settings));
}

// Window Controls
function minimizeTerminal() {
  const terminalContainer = document.querySelector(".terminal-container");
  if (terminalContainer) {
    terminalContainer.classList.add("minimized");
  }
}

function maximizeTerminal() {
  const terminalContainer = document.querySelector(".terminal-container");
  const maximizeButton = document.querySelector(".window-control.maximize");
  
  if (terminalContainer && maximizeButton) {
    if (terminalContainer.classList.contains("maximized")) {
      terminalContainer.classList.remove("maximized");
      maximizeButton.innerHTML = '<i class="fa-regular fa-window-maximize"></i>';
    } else {
      terminalContainer.classList.add("maximized");
      maximizeButton.innerHTML = '<i class="fa-regular fa-window-restore"></i>';
    }
  }
}

function closeTerminal() {
  if (settings.confirmClose) {
    if (confirm("Close HTML Terminal?")) {
      window.close();
    }
  } else {
    window.close();
  }
}

// Tool functions
function activateTool(tool) {
  const tabId = activeTabId;
  if (!tabId) return;
  
  switch (tool) {
    case "calculator":
      openCalculator(tabId);
      break;
    case "weather":
      promptWeatherLocation(tabId);
      break;
    case "network":
      openNetworkTools(tabId);
      break;
    case "calendar":
      showCalendar(tabId);
      break;
    case "notes":
      openNotes(tabId);
      break;
    case "timer":
      promptTimerDuration(tabId);
      break;
    case "converter":
      openUnitConverter(tabId);
      break;
    case "encoder":
      openEncoderDecoder(tabId);
      break;
    case "colorpicker":
      openColorPicker(tabId);
      break;
    case "qrcode":
      promptQRCodeContent(tabId);
      break;
    case "markdown":
      openMarkdownPreview(tabId);
      break;
    case "regex":
      openRegexTester(tabId);
      break;
    default:
      appendOutput(tabId, `Tool '${tool}' not implemented yet.`);
      break;
  }
}

function showCalendar(tabId) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  appendOutput(tabId, `Calendar for ${now.toLocaleString('default', { month: 'long' })} ${year}:`);
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create calendar header
  let calendar = "\n  Su  Mo  Tu  We  Th  Fr  Sa\n";
  
  // Add leading spaces for the first week
  let dayCounter = 1;
  let weekLine = "  ";
  for (let i = 0; i < firstDay; i++) {
    weekLine += "    ";
  }
  
  // Fill in the days
  for (let i = firstDay; i < 7; i++) {
    weekLine += dayCounter.toString().padStart(2) + "  ";
    dayCounter++;
  }
  calendar += weekLine + "\n";
  
  // Fill in the rest of the weeks
  while (dayCounter <= daysInMonth) {
    weekLine = "  ";
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      const dayStr = dayCounter.toString().padStart(2);
      weekLine += (dayCounter === now.getDate() ? `[${dayStr}]` : `${dayStr}  `);
      dayCounter++;
    }
    calendar += weekLine + "\n";
  }
  
  appendOutput(tabId, calendar);
}

function openNotes(tabId) {
  appendOutput(tabId, `
Notes Tool
----------
Enter notes directly in the terminal.
Each line will be saved as a separate note.

Type 'save' to save your notes.
Type 'list' to list all notes.
Type 'clear' to clear all notes.
Type 'exit' to close the notes tool.
`);
  
  // Initialize notes if not exists
  if (!terminalInstances[tabId].notes) {
    terminalInstances[tabId].notes = [];
  }
  
  // Set a flag to indicate notes mode
  terminalInstances[tabId].notesMode = true;
  
  // Override command processing for notes mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].notesMode) {
      switch (command.toLowerCase()) {
        case 'exit':
          // Exit notes mode
          terminalInstances[tabId].notesMode = false;
          appendOutput(tabId, "Notes tool closed.");
          processCommand = originalProcessCommand;
          break;
        case 'save':
          // Save notes (simulated)
          appendOutput(tabId, `Saved ${terminalInstances[tabId].notes.length} notes.`, "success");
          break;
        case 'list':
          // List all notes
          if (terminalInstances[tabId].notes.length === 0) {
            appendOutput(tabId, "No notes saved yet.");
          } else {
            appendOutput(tabId, "Your notes:");
            terminalInstances[tabId].notes.forEach((note, index) => {
              appendOutput(tabId, `${index + 1}. ${note}`);
            });
          }
          break;
        case 'clear':
          // Clear all notes
          terminalInstances[tabId].notes = [];
          appendOutput(tabId, "All notes cleared.", "success");
          break;
        default:
          // Add as a new note
          terminalInstances[tabId].notes.push(command);
          appendOutput(tabId, "Note added.", "success");
          break;
      }
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function openUnitConverter(tabId) {
  appendOutput(tabId, `
Unit Converter
-------------
Available conversions:
1. Length (m, km, ft, in, mi)
2. Weight (kg, g, lb, oz)
3. Temperature (C, F, K)
4. Volume (l, ml, gal, qt)

Format: [value] [from_unit] to [to_unit]
Example: 10 km to mi

Type 'exit' to close the converter.
`);
  
  // Set a flag to indicate converter mode
  terminalInstances[tabId].converterMode = true;
  
  // Override command processing for converter mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].converterMode) {
      if (command.toLowerCase() === 'exit') {
        // Exit converter mode
        terminalInstances[tabId].converterMode = false;
        appendOutput(tabId, "Unit converter closed.");
        processCommand = originalProcessCommand;
        return;
      }
      
      // Parse conversion request
      const match = command.match(/^([\d.]+)\s+(\w+)\s+to\s+(\w+)$/i);
      if (match) {
        const value = parseFloat(match[1]);
        const fromUnit = match[2].toLowerCase();
        const toUnit = match[3].toLowerCase();
        
        performConversion(tabId, value, fromUnit, toUnit);
      } else {
        appendOutput(tabId, "Invalid format. Use: [value] [from_unit] to [to_unit]", "error");
      }
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function performConversion(tabId, value, fromUnit, toUnit) {
  // Conversion factors (simplified)
  const conversions = {
    // Length
    "m": { "km": 0.001, "ft": 3.28084, "in": 39.3701, "mi": 0.000621371 },
    "km": { "m": 1000, "ft": 3280.84, "in": 39370.1, "mi": 0.621371 },
    "ft": { "m": 0.3048, "km": 0.0003048, "in": 12, "mi": 0.000189394 },
    "in": { "m": 0.0254, "km": 0.0000254, "ft": 0.0833333, "mi": 0.0000157828 },
    "mi": { "m": 1609.34, "km": 1.60934, "ft": 5280, "in": 63360 },
    
    // Weight
    "kg": { "g": 1000, "lb": 2.20462, "oz": 35.274 },
    "g": { "kg": 0.001, "lb": 0.00220462, "oz": 0.035274 },
    "lb": { "kg": 0.453592, "g": 453.592, "oz": 16 },
    "oz": { "kg": 0.0283495, "g": 28.3495, "lb": 0.0625 },
    
    // Temperature (special case)
    "c": { "f": null, "k": null },
    "f": { "c": null, "k": null },
    "k": { "c": null, "f": null },
    
    // Volume
    "l": { "ml": 1000, "gal": 0.264172, "qt": 1.05669 },
    "ml": { "l": 0.001, "gal": 0.000264172, "qt": 0.00105669 },
    "gal": { "l": 3.78541, "ml": 3785.41, "qt": 4 },
    "qt": { "l": 0.946353, "ml": 946.353, "gal": 0.25 }
  };
  
  // Check if units exist
  if (!conversions[fromUnit]) {
    appendOutput(tabId, `Unknown unit: ${fromUnit}`);
    return;
  }
  
  if (!conversions[fromUnit][toUnit] && !["c", "f", "k"].includes(fromUnit)) {
    appendOutput(tabId, `Cannot convert from ${fromUnit} to ${toUnit}`);
    return;
  }
  
  let result;
  
  // Handle temperature conversions separately
  if (["c", "f", "k"].includes(fromUnit) && ["c", "f", "k"].includes(toUnit)) {
    if (fromUnit === "c" && toUnit === "f") {
      result = (value * 9/5) + 32;
    } else if (fromUnit === "c" && toUnit === "k") {
      result = value + 273.15;
    } else if (fromUnit === "f" && toUnit === "c") {
      result = (value - 32) * 5/9;
    } else if (fromUnit === "f" && toUnit === "k") {
      result = (value - 32) * 5/9 + 273.15;
    } else if (fromUnit === "k" && toUnit === "c") {
      result = value - 273.15;
    } else if (fromUnit === "k" && toUnit === "f") {
      result = (value - 273.15) * 9/5 + 32;
    } else {
      result = value; // Same unit
    }
  } else {
    // Regular conversion
    result = value * conversions[fromUnit][toUnit];
  }
  
  appendOutput(tabId, `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`);
}

function openEncoderDecoder(tabId) {
  appendOutput(tabId, `
Encoder/Decoder Tool
-------------------
Available operations:
1. base64 encode [text]
2. base64 decode [text]
3. url encode [text]
4. url decode [text]
5. hex encode [text]
6. hex decode [text]

Type 'exit' to close the tool.
`);
  
  // Set a flag to indicate encoder/decoder mode
  terminalInstances[tabId].encoderMode = true;
  
  // Override command processing for encoder/decoder mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].encoderMode) {
      if (command.toLowerCase() === 'exit') {
        // Exit encoder/decoder mode
        terminalInstances[tabId].encoderMode = false;
        appendOutput(tabId, "Encoder/Decoder tool closed.");
        processCommand = originalProcessCommand;
        return;
      }
      
      // Parse operation
      const parts = command.split(' ');
      if (parts.length < 3) {
        appendOutput(tabId, "Invalid format. Use: [operation] [encode/decode] [text]");
        return;
      }
      
      const operation = parts[0].toLowerCase();
      const action = parts[1].toLowerCase();
      const text = parts.slice(2).join(' ');
      
      performEncodeDecode(tabId, operation, action, text);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function performEncodeDecode(tabId, operation, action, text) {
  let result = "";
  
  try {
    if (operation === "base64") {
      if (action === "encode") {
        result = btoa(text);
      } else if (action === "decode") {
        result = atob(text);
      } else {
        appendOutput(tabId, "Invalid action. Use 'encode' or 'decode'.");
        return;
      }
    } else if (operation === "url") {
      if (action === "encode") {
        result = encodeURIComponent(text);
      } else if (action === "decode") {
        result = decodeURIComponent(text);
      } else {
        appendOutput(tabId, "Invalid action. Use 'encode' or 'decode'.");
        return;
      }
    } else if (operation === "hex") {
      if (action === "encode") {
        result = Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      } else if (action === "decode") {
        result = text.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
      } else {
        appendOutput(tabId, "Invalid action. Use 'encode' or 'decode'.");
        return;
      }
    } else {
      appendOutput(tabId, "Invalid operation. Available operations: base64, url, hex");
      return;
    }
    
    appendOutput(tabId, `Result: ${result}`);
  } catch (error) {
    appendOutput(tabId, `Error: ${error.message}`, "error");
  }
}

function openColorPicker(tabId) {
  appendOutput(tabId, `
Color Picker Tool
---------------
This is a simulated color picker.
Enter a color in any format (name, hex, rgb) to get information about it.

Example:
- red
- #ff0000
- rgb(255, 0, 0)

Type 'exit' to close the tool.
`);
  
  // Set a flag to indicate color picker mode
  terminalInstances[tabId].colorPickerMode = true;
  
  // Override command processing for color picker mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].colorPickerMode) {
      if (command.toLowerCase() === 'exit') {
        // Exit color picker mode
        terminalInstances[tabId].colorPickerMode = false;
        appendOutput(tabId, "Color Picker tool closed.");
        processCommand = originalProcessCommand;
        return;
      }
      
      // Process color
      processColor(tabId, command);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function processColor(tabId, colorStr) {
  // Simple color name to hex mapping
  const colorMap = {
    "red": "#ff0000",
    "green": "#00ff00",
    "blue": "#0000ff",
    "yellow": "#ffff00",
    "cyan": "#00ffff",
    "magenta": "#ff00ff",
    "black": "#000000",
    "white": "#ffffff",
    "gray": "#808080",
    "orange": "#ffa500",
    "purple": "#800080",
    "brown": "#a52a2a",
    "pink": "#ffc0cb"
  };
  
  let hexColor = "";
  let rgbColor = "";
  let hslColor = "";
  
  // Check if it's a color name
  if (colorStr.toLowerCase()) {
    hexColor = colorMap[colorStr.toLowerCase()];
    const rgb = hexToRgb(hexColor);
    rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hslColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
  }
  // Check if it's a hex color
  else if (colorStr.startsWith("#")) {
    hexColor = colorStr;
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      hslColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
    } else {
      appendOutput(tabId, "Invalid hex color format.", "error");
      return;
    }
  }
  // Check if it's an RGB color
  else if (colorStr.startsWith("rgb")) {
    const rgbMatch = colorStr.match(/^rgb$$(\d+),\s*(\d+),\s*(\d+)$$$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      rgbColor = colorStr;
      hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      const hsl = rgbToHsl(r, g, b);
      hslColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
    }
  }
  // Check if it's an RGB color
  else if (colorStr.startsWith("rgb")) {
    const rgbMatch = colorStr.match(/^rgb$$(\d+),\s*(\d+),\s*(\d+)$$$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      rgbColor = colorStr;
      hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      const hsl = rgbToHsl(r, g, b);
      hslColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
    }
  }
  else {
    appendOutput(tabId, "Invalid color format. Use color name, hex, or rgb.", "error");
    return;
  }
  
  appendOutput(tabId, `Color Information:`);
  appendOutput(tabId, `Hex: ${hexColor}`);
  appendOutput(tabId, `RGB: ${rgbColor}`);
  appendOutput(tabId, `HSL: ${hslColor}`);
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else if (max === b) {
      h = (r - g) / d + 4;
    }
    
    h /= 6;
  }
  
  return { h: h, s: s, l: l };
}

function promptQRCodeContent(tabId) {
  appendOutput(tabId, "Enter content for QR code:");
  
  // Set a flag to indicate waiting for QR code content
  terminalInstances[tabId].waitingForQRCodeContent = true;
  
  // Override command processing for QR code content
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].waitingForQRCodeContent) {
      // Exit QR code mode
      terminalInstances[tabId].waitingForQRCodeContent = false;
      processCommand = originalProcessCommand;
      
      // Generate QR code
      generateQRCode(tabId, command);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function generateQRCode(tabId, content) {
  appendOutput(tabId, `Generating QR code for: ${content}`);
  
  // Simulate QR code generation
  setTimeout(() => {
    const qrCodeArt = `
    █████████████████████████████████
    ██ █ █   █ █████ ███ █ █   █ ██
    ██ ███ ███ ██ ███ ███ ██ ███ ██
    ██ █ █   █ ██ ███ ███ ██ █ █ ██
    ███████████ ███ ████████████████
    ██       ██ ██ ██   ██       ██
    ██ ██ ███ ██ ██ ██ ██ ██ ███ ██
    ██   █ ███    ██   █ ███    ██
    ███████ ██ ████ ████ ██ ███████
    ███████ ██ ██ ██ ██ ██ ███████
    ███████ ████ ████ ████ ███████
    ██   █ ███    ██   █ ███    ██
    ██ ██ ███ ██ ██ ██ ██ ██ ███ ██
    ██       ██ ██ ██   ██       ██
    ███████████ █████ ██████████████
    ██ █ █   █ ███ █████ █ █   █ ██
    ██ ███ ███ ██ ███ ███ ██ ███ ██
    ██ █ █   █ █████ █████ █ █   █ ██
    █████████████████████████████████
    `;
    
    appendOutput(tabId, qrCodeArt);
  }, 1000);
}

function openMarkdownPreview(tabId) {
  appendOutput(tabId, `
Markdown Preview Tool
--------------------
Enter Markdown text directly in the terminal.
The rendered HTML will be displayed below.

Type 'exit' to close the tool.
`);
  
  // Set a flag to indicate markdown mode
  terminalInstances[tabId].markdownMode = true;
  
  // Initialize markdown content
  terminalInstances[tabId].markdownContent = "";
  
  // Override command processing for markdown mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].markdownMode) {
      if (command.toLowerCase() === 'exit') {
        // Exit markdown mode
        terminalInstances[tabId].markdownMode = false;
        appendOutput(tabId, "Markdown Preview tool closed.");
        processCommand = originalProcessCommand;
        return;
      }
      
      // Append to markdown content
      terminalInstances[tabId].markdownContent += command + "\n";
      
      // Render markdown
      renderMarkdown(tabId, terminalInstances[tabId].markdownContent);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function renderMarkdown(tabId, markdownText) {
  // Simulate markdown rendering
  setTimeout(() => {
    const htmlContent = `
    <h1>Markdown Preview</h1>
    <p>This is a simulated markdown preview.</p>
    <p>You entered:</p>
    <pre><code>${markdownText}</code></pre>
    `;
    
    appendOutput(tabId, htmlContent);
  }, 500);
}

function openRegexTester(tabId) {
  appendOutput(tabId, `
Regex Tester Tool
---------------
Enter a regular expression and a test string.
The tool will indicate if the regex matches the string.

Format: regex [regex] test [string]

Type 'exit' to close the tool.
`);
  
  // Set a flag to indicate regex mode
  terminalInstances[tabId].regexMode = true;
  
  // Override command processing for regex mode
  const originalProcessCommand = processCommand;
  processCommand = function(tabId, command) {
    if (terminalInstances[tabId] && terminalInstances[tabId].regexMode) {
      if (command.toLowerCase() === 'exit') {
        // Exit regex mode
        terminalInstances[tabId].regexMode = false;
        appendOutput(tabId, "Regex Tester tool closed.");
        processCommand = originalProcessCommand;
        return;
      }
      
      // Parse command
      const parts = command.split(' ');
      if (parts.length < 4 || parts[0].toLowerCase() !== "regex" || parts[2].toLowerCase() !== "test") {
        appendOutput(tabId, "Invalid format. Use: regex [regex] test [string]", "error");
        return;
      }
      
      const regexStr = parts[1];
      const testString = parts.slice(3).join(' ');
      
      testRegex(tabId, regexStr, testString);
    } else {
      // Normal command processing
      originalProcessCommand(tabId, command);
    }
  };
}

function testRegex(tabId, regexStr, testString) {
  try {
    const regex = new RegExp(regexStr);
    const result = regex.test(testString);
    
    if (result) {
      appendOutput(tabId, `Regex matches the string.`, "success");
    } else {
      appendOutput(tabId, `Regex does not match the string.`, "error");
    }
  } catch (error) {
    appendOutput(tabId, `Error: Invalid regex - ${error.message}`, "error");
  }
}

// Extension functions
function filterExtensions(category) {
  // Simulate filtering extensions by category
  appendOutput(activeTabId, `Filtering extensions by category: ${category}`);
}

function searchExtensions(term) {
  // Simulate searching extensions
  appendOutput(activeTabId, `Searching extensions for: ${term}`);
}

function refreshExtensionsList() {
  // Simulate refreshing the extensions list
  appendOutput(activeTabId, "Refreshing extensions list...");
}

function uploadExtensionHandler() {
  // Simulate uploading an extension
  appendOutput(activeTabId, "Simulating extension upload...");
}

function createExtensionHandler() {
  // Simulate creating a new extension
  appendOutput(activeTabId, "Simulating extension creation...");
}

function installExtension(extensionName, extensionItem) {
  // Simulate installing an extension
  appendOutput(activeTabId, `Installing extension: ${extensionName}`);
  
  // Simulate installation process
  setTimeout(() => {
    appendOutput(activeTabId, `Extension '${extensionName}' installed successfully!`, "success");
    
    // Update button state
    const installButton = extensionItem.querySelector(".extension-action.install");
    const uninstallButton = extensionItem.querySelector(".extension-action.uninstall");
    
    if (installButton) installButton.style.display = "none";
    if (uninstallButton) uninstallButton.style.display = "inline-block";
  }, 1500);
}

function uninstallExtension(extensionName, extensionItem) {
  // Simulate uninstalling an extension
  appendOutput(activeTabId, `Uninstalling extension: ${extensionName}`);
  
  // Simulate uninstallation process
  setTimeout(() => {
    appendOutput(activeTabId, `Extension '${extensionName}' uninstalled successfully!`, "success");
    
    // Update button state
    const installButton = extensionItem.querySelector(".extension-action.install");
    const uninstallButton = extensionItem.querySelector(".extension-action.uninstall");
    
    if (installButton) installButton.style.display = "inline-block";
    if (uninstallButton) uninstallButton.style.display = "none";
  }, 1500);
}

// Particle effects
function createParticles() {
  const particleContainer = document.getElementById("particleContainer");
  if (!particleContainer) return;

  // Clear existing particles
  particleContainer.innerHTML = "";

  const numParticles = 50;

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 100 + "vh";
    particle.style.transform = `scale(${Math.random()})`;
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";

    particleContainer.appendChild(particle);
  }
}

function testDebugCommands(tabId, args) {
  if (!args) {
    appendOutput(tabId, "Error: Please specify a test type (error, warning, info, success, all).", "error");
    return;
  }

  const testType = args.toLowerCase();

  switch (testType) {
    case "error":
      appendOutput(tabId, "Error", "error");
      break;
    case "warning":
      appendOutput(tabId, "Warning", "warning");
      break;
    case "info":
      appendOutput(tabId, "Information", "info");
      break;
    case "success":
      appendOutput(tabId, "Success", "success");
      break;
    case "all":
      appendOutput(tabId, "Testing all output types...");
      appendOutput(tabId, "Error", "error");
      appendOutput(tabId, "Warning", "warning");
      appendOutput(tabId, "Information", "info");
      appendOutput(tabId, "Success", "success");
      break;
    default:
      appendOutput(tabId, "Error: Unknown test type. Use 'error', 'warning', 'info', 'success', or 'all'.", "error");
      break;
  }
}
