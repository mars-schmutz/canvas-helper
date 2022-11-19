const url = document.getElementById("url");
const title = document.getElementById("title");
const add = document.getElementById("add-btn");
const clear = document.getElementById("clear-btn");
const reminders = document.getElementById("reminders");
const done = document.getElementsByClassName("mark-done");

clear.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all reminders?")) {
        chrome.storage.local.remove("reminders");
        reminders.innerHTML = "";
    }
})

add.addEventListener("click", function() {
    chrome.runtime.sendMessage("", {
        id: uid(),
        type: "remind",
        title: title.value,
        url: url.value,
        when: Date.now()
    })
    title.value = "";
    url.value = "";
})

function uid() {
    return Math.random().toString(16).substring(2) + (new Date()).getTime().toString(16);
}

function renderReminders(remindersList) {
    const html = remindersList.map(r => `
        <li><span class="mark-done" data-id="${r.id}">&#88;</span>${r.title}</li>
    `).join("");
    reminders.innerHTML = html;
    console.log(html);

    for (let i = 0; i < done.length; i++) {
        done[i].addEventListener("click", () => {
            chrome.storage.local.get("reminders", function(result) {
                const reminders = result.reminders || [];
                const reminder = reminders.find(r => r.id === done[i].dataset.id);
                if (reminder) {
                    reminders.splice(reminders.indexOf(reminder), 1);
                    chrome.storage.local.set({ reminders });
                    renderReminders(reminders);
                }
            })
        })
    }
}

chrome.storage.local.get("reminders", function(result) {
    const reminders = result.reminders || [];
    renderReminders(reminders);
    // reminders.forEach(reminder => {
    //     const li = document.createElement("li");
    //     li.textContent = reminder.title;
    //     document.getElementById("reminders").appendChild(li);
    // })
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    // print changes to console
    console.log(changes.reminders);
    if (changes.reminders.newValue) {
        renderReminders(changes.reminders.newValue);
    }
})