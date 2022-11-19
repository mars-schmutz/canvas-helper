chrome.runtime.onMessage.addListener(msg => {
    console.log(msg);
    createReminder(msg)
});

chrome.alarms.onAlarm.addListener(alarm => {
    console.log(alarm);
    var localKey = alarm.name
    console.log(localKey)
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        const reminder = reminders.find(r => r.id === localKey);
        if(reminder) {
            notify(reminder)
        } else {
            console.log(reminders)
        }
    })
});

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

chrome.notifications.onButtonClicked.addListener(function(nID, btnIDX){
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        const reminder = reminders.find(r => r.id === nID);
        if(reminder) {
            if(btnIDX == 0){
                clearReminder(reminder)
            }
            else if(btnIDX == 1){
                snoozeReminder(reminder)
            }
        } else {
            console.log(reminders)
        }
    })
});

function createReminder(msg){
    chrome.alarms.create(msg.id, {when: msg.when});
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        reminders.push(msg);
        chrome.storage.local.set({ reminders });
    });
};

function snoozeReminder(msg){
    chrome.alarms.create(msg.id, {when: Date.now()+60000});
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        reminders.push(msg);
        chrome.storage.local.set({ reminders });
    });
};

function clearReminder(msg){
    chrome.storage.local.get("reminders", function(result) {
        const reminders = result.reminders || [];
        const reminder = reminders.find(r => r.id === msg.id);
        if (reminder) {
            reminders.splice(reminders.indexOf(reminder), 1);
            chrome.storage.local.set({ reminders });
        }
    })
};

function notify(msg) {
    chrome.notifications.create(msg.id, {
        type: "basic",
        iconUrl: "assets/kuzco.png",
        title: "Reminder",
        message: "Time to visit " + msg.url,
        buttons: [{title: 'Done'},{title: '5 More Minutes'}]
    })
};