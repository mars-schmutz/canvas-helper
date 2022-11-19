chrome.runtime.onMessage.addListener(msg => {
    switch(msg.type) {
        case "remind":
            saveReminder(msg);
            break;
        default:
            console.log("unknown message", msg);
            break;
    }
})

function scheduleReminder(msg) {
    chrome.alarms.create(msg.title, {delayInMinutes: 1, periodInMinutes: 1});
}

function saveReminder(msg) {
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        reminders.push(msg);
        chrome.storage.local.set({ reminders });
    });
    // scheduleReminder(msg);
    notify(msg.id, msg.title);
}

function notify(id, title) {
    chrome.notifications.create(id, {
        type: "basic",
        iconUrl: "assets/kuzco.png",
        title: "Reminder",
        message: "Don't forget you have " + title + " due!",
    })
}

chrome.notifications.onClicked.addListener(function(nID) {
    console.log("notification clicked", nID);
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        const reminder = reminders.find(r => r.id === nID);
        if(reminder) {
            chrome.tabs.create({url: reminder.url});
        } else {
            console.log(reminders)
        }
    })
})