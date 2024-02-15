// Event + HTML Handling
window.onload = (e) => {
    load();
    init();
    update();
}

window.onclick = (e) => {
    if (e.target == document.getElementsByTagName("img")[0]) {
        document.getElementsByClassName("popup")[0].classList.add("show");
    }
    let inputs = document.querySelectorAll(".popup input");
    if (e.target == inputs[3] && inputs[0].value != "" && inputs[1].value != "") {
        add(new Item(inputs[0].value, inputs[1].value, inputs[2].value));
        inputs[0].value = null;
        inputs[1].value = null;
        inputs[2].value = document.getElementsByClassName("header_date")[0].innerText;
        document.getElementsByClassName("popup")[0].classList.remove("show");
    }
    if (e.target == document.querySelector(".help")) {
        document.querySelector(".help_page").classList.add("show");
    }
    if (e.target == document.querySelector(".help_page")) {
        document.querySelector(".help_page").classList.remove("show");
    }
}

function store() {
    localStorage.setItem("items", JSON.stringify(items));
}

function load() {
    let stored = localStorage.getItem("items");
    if (stored != null) {
        items = sorted = JSON.parse(stored);
    } 
}

function init() {
    let d = new Date();
    if (d.getMonth() < 9) {
        document.getElementsByClassName("header_date")[0].innerText = d.getFullYear() + "-0" + (d.getMonth()+1) + "-" + d.getDate();
    } else {
        document.getElementsByClassName("header_date")[0].innerText = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    }
    if (d.getDate() < 10) {
        document.getElementsByClassName("header_date")[0].innerText = d.getFullYear() + "-" + (d.getMonth()+1) + "-0" + d.getDate();
    } else {
        document.getElementsByClassName("header_date")[0].innerText = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    }
    document.querySelectorAll("input[type='date']")[0].value = document.getElementsByClassName("header_date")[0].innerText;
}

function update() {
    let list = document.querySelector(".list");
    list.innerHTML = "";
    sorted.forEach(x => {
        if (x.entries.length != 0) {
            let item = document.createElement("div");
            item.classList.add("item");
            let title = document.createElement("h1");
            title.innerText = x.name;
            item.appendChild(title);
            x.entries.forEach(y => {
                let entry = document.createElement("div");
                entry.classList.add("entry");
                entry.onclick = (e) => {
                    remove(x.name, y.exp_date);
                }
                if (y.exp_date != "") {
                    entry.innerText = "Count: " + y.count + " Date: " + y.exp_date;
                } else {
                    entry.innerText = "Count: " + y.count;
                }
                item.appendChild(entry);
            });
            list.appendChild(item);
        }
    });
}

let search = document.querySelectorAll("input")[0];
search.onchange = () => {
    sort(search.value.toLowerCase());
}

// Utility
function remove_index(array, index) {
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        if (i != index) {
            temp.push(array[i]);
        }
    }
    return temp;
}

// Inventory
let items = [];
let sorted = [];

class Item {
    constructor(name, count, exp_date) {
        this.name = name;
        this.entries = [];
        this.entries.push({count: count, exp_date: exp_date}); 
    }
}

function add(item) {
    let found = false;
    items.forEach(x => {
        if (x.name == item.name) {
            x.entries.forEach(y => {
                if (y.exp_date == item.entries[0].exp_date) {
                    y.count = parseInt(y.count) + parseInt(item.entries[0].count);
                    found = true;
                }
            });
            if (!found) {
                x.entries.push({count: item.entries[0].count, exp_date: item.entries[0].exp_date});
            }
            found = true;
        }
    });
    if (!found) {
        items.push(item);
    }
    store();
    sort("");
    update();
}

function remove(name, exp_date) {
    items.forEach(x => {
        if (x.name == name) {
            for (let i = 0; i < x.entries.length; i++) {
                if (x.entries[i].exp_date == exp_date) {
                    x.entries = remove_index(x.entries, i);
                }
            }
        }
    });
    store();
    update();
}

function sort(id) {
    sorted = [];
    if (id != "") {
        items.forEach(x => {
            if (x.name.toLowerCase().includes(id) || x.name == id) {
                sorted.push(x);
            }
        });
    } else {
        sorted = items;
    }
    update();
}