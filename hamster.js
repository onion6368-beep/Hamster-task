const inputdata = document.getElementById("task-input")
const tasktable = document.getElementById("task-list")
const cleardonebtn = document.getElementById("clear-done")
const emoji = document.getElementById("hamster-emoji")
const stagetext = document.getElementById("hamster-stage")
const hamname = document.getElementById("hamster-name")
const donecount = document.getElementById("complete-num")
const pendcount = document.getElementById("pending-num")
const XPT = document.getElementById("xpt")
const streaknum = document.getElementById("streak-num");
const hamster = document.getElementById("hamster-king");
const xpbar = document.getElementById("xp-bar");


const stages = [
    { image: "1.png", name: "Baby Hammy", text: "Stage 1 of 5 — just hatched!", xp: 5 },
    { image: "2.png", name: "Curious Hamster", text: "Stage 2 of 5 — growing fast!", xp: 10 },
    { image: "3.png", name: "Hardworking Hamster", text: "Stage 3 of 5 — getting chubby!", xp: 20 },
    { image: "4.png", name: "Focused hamster", text: "Stage 4 of 5 — almost grown up!", xp: 35 },
    { image: "5.png", name: "Master Hamster", text: "Stage 5 of 5 — fully evolved!", xp: 999 }
]

let stagecount = 0;
let taskcount = 0;
let streak = 0;
let totalcompletedtasks = 0;
let completedToday = 0;
let lastCompletedDate = "";
let tasks = []
let lastResetDate = "";

function savetasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks))
    localStorage.setItem("stagecount",stagecount)
    localStorage.setItem("taskcount",taskcount)
    localStorage.setItem("streak",streak)
    localStorage.setItem("lastCompletedDate",lastCompletedDate)
    localStorage.setItem("totalcompletedtasks",totalcompletedtasks)
    localStorage.setItem("completedToday", completedToday);
    localStorage.setItem("lastResetDate", lastResetDate);
}
function loadtasks(){
    const saved = localStorage.getItem("tasks")
    if (saved){
        tasks = JSON.parse(saved)
    }
    stagecount = Number(localStorage.getItem("stagecount")) || 0;
    taskcount = Number(localStorage.getItem("taskcount")) || 0;
    streak = Number(localStorage.getItem("streak")) || 0;
    lastCompletedDate = localStorage.getItem("lastCompletedDate") || "";
    totalcompletedtasks = Number(localStorage.getItem("totalcompletedtasks")) || 0;
    completedToday = Number(localStorage.getItem("completedToday")) || 0;
    lastResetDate = localStorage.getItem("lastResetDate") || "";
    const today = new Date().toISOString().split("T")[0];

    if (lastResetDate !== today) {
        completedToday = 0;
        lastResetDate = today;
        savetasks();
    }
    donecount.textContent = completedToday;
    streaknum.textContent = streak;
    rendertasks()
}
function updatehamster(){
    const currentstage = stages[stagecount]
    hamster.src = currentstage.image;
    hamname.textContent = currentstage.name
    stagetext.textContent = currentstage.text
    xpbar.style.width = (taskcount / currentstage.xp * 100) + "%";

    const current = taskcount
    const needed = currentstage.xp

    XPT.textContent = `${current}/${needed} points needed to level up!`
}
function rendertasks(){
    tasktable.innerHTML = ""

    if (tasks.length === 0){
        document.getElementById("empty-state").style.display = "block"
    }
    else{
        document.getElementById("empty-state").style.display = "none"
    }

    const pendingtasks = tasks.filter(t => !t.done)
    donecount.textContent = completedToday;
    pendcount.textContent = pendingtasks.length

    tasks.forEach((task) =>{
        const li = document.createElement("li")
        const tasktext = document.createElement("span")
        tasktext.textContent = task.text
        tasktext.style.flex = "1"

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"

        if (task.done){
            li.classList.add("done")
            checkbox.checked = task.done
        }

        checkbox.addEventListener("change", () => {
            task.done = !task.done;

            if (task.done) {
                taskcount += 1;
                completedToday++;
                donecount.textContent = completedToday;

                if (!task.rewarded) {
                    totalcompletedtasks++;
                    task.rewarded = true;
                }

                calcstreak();

            } else {
                taskcount -= 1;
            }

            if (taskcount >= stages[stagecount].xp && stagecount < stages.length - 1) {
                stagecount++;
                taskcount = 0;
            }

            updatehamster();
            savetasks();
            rendertasks();
        });

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "❌"

        deleteBtn.addEventListener("click" , (e) => {
            e.stopPropagation()

            tasks = tasks.filter(t => t !== task)

            savetasks()
            updatehamster()
            rendertasks()
        })
        li.appendChild(checkbox)
        li.appendChild(tasktext)
        li.appendChild(deleteBtn)
        tasktable.appendChild(li)
    })
}
function addtask(){
    const inputvalue =inputdata.value
    if (inputvalue.trim() === "") {
        inputdata.value = "" 
        return
    }
    tasks.push({text:inputvalue, done:false, rewarded:false})
    savetasks()
    inputdata.value = ""
    rendertasks()
}
function cleardone(){
    tasks = tasks.filter(t => !t.done)
    savetasks()
    rendertasks()
}
cleardonebtn.addEventListener("click" , () => {
    cleardone()
})
inputdata.addEventListener("keydown" , (e) => {
    if (e.key == "Enter"){
        addtask()
    }

})
function calcstreak() {
    const today = new Date().toISOString().split("T")[0];

    if (lastCompletedDate !== today && completedToday >= 5) {
        streak++;
        lastCompletedDate = today;
        streaknum.textContent = streak;

        savetasks();
    }
}
loadtasks()
updatehamster()