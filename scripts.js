const url = document.getElementById("url");
const title = document.getElementById("title");
const add = document.getElementById("add-btn");
const clear = document.getElementById("clear-btn");
const reminders = document.getElementById("reminders");

clear.addEventListener("click", () => {
    chrome.storage.local.remove("reminders");
    reminders.innerHTML = "";
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
        <li>${r.title}</li>
    `).join("");
    reminders.innerHTML = html;
    console.log(html);
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
    if (changes.reminders.newValue) {
        renderReminders(changes.reminders.newValue);
    }
})