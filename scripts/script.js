function validateForm() {
    console.log("validate form");
    var inputTask = document.getElementById("input-task").value;
    var inputDate = document.getElementById("input-date").value;

    if (inputTask === "") {
        alert("task field can't be empty!");
        return false;
    }
    if (inputTask.length < 3 || inputTask.length > 255) {
        alert("task must contain between 3 and 255 characters");
        return false;
    }

    if (inputDate != "") {
        var todayDate = new Date();
        var dateToCompare = new Date(inputDate);
        if (dateToCompare < todayDate 
            && dateToCompare.toDateString() != todayDate.toDateString()) {
            alert("date must be today or after");
            return false;
        }
    }
    return true;
}

function showData() {
    var tasksList;

    if (localStorage.getItem("tasksList") == null) {
        tasksList = [];
        console.log("local storage");
    } else {
        console.log("zawieram dane")
        tasksList = JSON.parse(localStorage.getItem("tasksList"));
    }

    var html = ""; 

    tasksList.forEach(function (element, index) {
        html += "<div class='task' >";
        html += "<input class='checkbox' type='checkbox'>";
        html += "<div class='name' contentEditable='true' >";
        html += element.name;
        html += "</div>";
        html += "<input name='date-edit-input' class='datepicker-input' type='hidden' />";
        html += "<div class='date' contentEditable='true' >";
        html += element.date;
        html +=  "</div>";
        html += "<button type='submit' onclick='deleteData("+ index +")' class='delete-button'>";
        html += "<img class='delete-icon' src='images/delete-icon.svg'> </button>";
        html += "</div>";
    });

    document.getElementById("tasksContainer").innerHTML = html;
}

window.onload = showData();

$('.datepicker-input').datepicker({
    dateFormat: 'mm-dd-yy',
    onClose: function(dateText, inst) {
        var todayDate = new Date();
        var dateToCompare = new Date(dateText);
        if (dateToCompare < todayDate 
            && dateToCompare.toDateString() != todayDate.toDateString()) {
            alert("date must be today or after");
            $(this).parent().find('.date').focus().html("").blur();
            return;
        }
        $(this).parent().find('.date').focus().html(dateText).blur();
    }
});

$('.date').click(function() {
    $(this).parent().find('.datepicker-input').datepicker("show");
});



function addData() {
    console.log("jestem w add data")
    if (validateForm() == true) {
        console.log("true w validate")
        var inputTask = document.getElementById("input-task").value;
        var inputDate = document.getElementById("input-date").value;

        var tasksList;

        if (localStorage.getItem("tasksList") == null) {
            tasksList = [];
        } else {
            tasksList = JSON.parse(localStorage.getItem("tasksList"));
        }

        tasksList.push({
            name: inputTask,
            date: inputDate,
            done: false
        });

        localStorage.setItem("tasksList", JSON.stringify(tasksList));
        location.reload();
        showData();
        document.getElementById("input-task").value = "";
        document.getElementById("input-data").value = "dd/mm/yyyy";
    }
}

function deleteData(index) {
    var tasksList;
    if (localStorage.getItem("tasksList") == null) {
        tasksList = [];
    } else {
        tasksList = JSON.parse(localStorage.getItem("tasksList"));
    }

    if (confirm("are you sure you want to delete this task?")) {
        tasksList.splice(index, 1);
        localStorage.setItem("tasksList", JSON.stringify(tasksList));
        location.reload();
        showData();
    }
}

function searchTasks() {
    let searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function () {
        const searchText = this.value;
        if (searchText.length > 1) {
            filterTasks(searchText);
        } else {
            showData();
        }
    });
}

function filterTasks(searchText) {
    var tasksList;

    if (localStorage.getItem("tasksList") == null) {
        tasksList = [];
        console.log("local storage");
    } else {
        console.log("zawieram dane")
        tasksList = JSON.parse(localStorage.getItem("tasksList"));
    }

    var html = ""; 

    tasksList.forEach(function (element, index) {
        if (element.name.includes(searchText)) {
            html += "<div class='task' >";
            html += "<input class='checkbox' type='checkbox'>";
            html += "<div class='name' contentEditable='true' >";
            html += markdownName(element.name, searchText);
            html += "</div>";
            html += "<input name='date-edit-input' class='datepicker-input' type='hidden' />";
            html += "<div class='date' contentEditable='true' >";
            html += element.date;
            html +=  "</div>";
            html += "<button type='submit' onclick='deleteData("+ index +")' class='delete-button'>";
            html += "<img class='delete-icon' src='images/delete-icon.svg'> </button>";
            html += "</div>";
        }
        
    });
    document.getElementById("tasksContainer").innerHTML = html;
}

function markdownName(name, searchText) {
    const indexOfFirst = name.indexOf(searchText);
    const indexOfLast = indexOfFirst + searchText.length;
    var markdownedName = name.slice(0, indexOfFirst) + "<span style='color: red'>" + searchText + "</span>" + name.slice(indexOfLast);
    return markdownedName;
}

searchTasks();