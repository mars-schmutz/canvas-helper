const url = document.getElementById("url");
const title = document.getElementById("title");
const add = document.getElementById("add-btn");
const clear = document.getElementById("clear-btn");
const reminders = document.getElementById("reminders");

clear.addEventListener("click", () => {
    chrome.storage.local.remove("reminders");
})

add.addEventListener("click", function() {
    chrome.runtime.sendMessage("", {
        id: uid(),
        type: "remind",
        title: title.value,
        url: url.value,
        when: Date.now()
    })
})

function uid() {
    return Math.random().toString(16).substring(2) + (new Date()).getTime().toString(16);
}

chrome.storage.local.get("reminders", function(result) {
    const reminders = result.reminders || [];
    reminders.forEach(reminder => {
        const li = document.createElement("li");
        li.textContent = reminder.title;
        document.getElementById("reminders").appendChild(li);
    })
})