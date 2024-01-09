// trigger then clicking the extension logo
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  }
});

// trigger when active tab switches
chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (activeInfo?.tabId) {
    chrome.tabs.sendMessage(activeInfo?.tabId, { updateStorage: true });
  }
});


/** Add to context menus */
 chrome.contextMenus.create({
  id: "prism_knowledge_helper_save_page",
  title: "Save This Page",
  contexts:["all"],  // ContextType
 });

 chrome.contextMenus.create({
  id: "prism_knowledge_helper_create_note",
  title: "Create Note",
  contexts:["all"],  // ContextType
 });

 chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "prism_knowledge_helper_create_note") {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { createPageNote: true });
    }
  }
  if (info.menuItemId === "prism_knowledge_helper_save_page") {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { savePage: true });
    }
  }
 })