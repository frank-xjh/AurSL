import szone from "./szone.js";

let mszone = new szone();

document.querySelectorAll("#studentName")[0].innerHTML = mszone.getUserData("studentName");
document.querySelectorAll("#studentName")[1].innerHTML = mszone.getUserData("studentName");
document.querySelectorAll("#nickName")[0].innerHTML = mszone.getUserData("nickName");
document.querySelectorAll("#schoolName")[0].innerHTML = mszone.getUserData("schoolName");
document.querySelectorAll("#currentGrade")[0].innerHTML = mszone.getUserData("currentGrade");

document.querySelectorAll("#studentName")[0].addEventListener("mouseenter", function () {
    document.getElementById("Popover").style.display = "block";
});
document.querySelectorAll("#studentName")[0].addEventListener("mouseleave", function () {
    document.getElementById("Popover").style.display = "none";
});

let focus = 0;

let examData = await mszone.getExamList(100).then((examData) => {
    if (!examData.length) throw Error("Fetch Exam List Failed");
    let node = document.getElementById("examlist");
    node.innerHTML = '<ul class="filter-list"></ul>';
    node = node.firstChild;
    for (let examCount in examData) {
        node.innerHTML +=
            '<li><a class="filter-item"><span id="examName">' +
            examData[examCount].examName +
            '</span><span class="count">' +
            examData[examCount].score +
            "</span></a></li>";
        examCount;
    }
    return examData;
});

function loadExam(id, stucode) {
    document.querySelectorAll(".filter-item")[focus].removeAttribute("aria-current");
    focus = id;
    document.querySelectorAll(".filter-item")[id].setAttribute("aria-current", "");
    document.getElementById("examTitle").innerHTML = examData[id].examName;
    document.getElementById("exam-time").innerHTML = examData[id].time;
    document.getElementById("stuCode").innerHTML = stucode;
    mszone.getExamData(examData[id].examGuid, examData[id].examType, stucode).then((examDetails) => {
        let node = document.getElementById("md");
        if (!examDetails) {
            node.innerHTML = "<h2>Fetch Exam Data Failed</h2>";
        }
        node.innerHTML = "<table><thead><tr><th>Subjects</th><th>Score</th></tr></thead><tbody></tbody></table>";
        node = node.firstChild.firstChild.nextElementSibling;
        for (let counter in examDetails) {
            node.innerHTML += "<tr><td>" + examDetails[counter].km + "</td><td>" + examDetails[counter].myScore + "</td>" + "</tr>";
        }
    });
}

loadExam(0, examData[0].studentCode);

let list = document.querySelectorAll(".filter-item");

for (let examCount in examData) {
    list[examCount].addEventListener("click", function () {
        loadExam(examCount, examData[examCount].studentCode);
    });
}

document.getElementById("chbtn").addEventListener("click", function () {
    loadExam(focus, examData[focus].studentCode);
});
