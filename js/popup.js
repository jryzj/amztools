$(document).ready(function () {
  let bg = chrome.extension.getBackgroundPage();
  console.log("popup.js");
  $("#create-task").click(function () {
    let msg = "";
    console.log("create-task");
    let action = $("#action").val();
    let actionFreq = parseInt($("#action-freq").val());
    let actionTimes = $("#action-times").val();
    let actionKV = $("#action-keyword").val();
    let actionZipcode = $("#action-zipcode").val();
    let actionFilename = $("#action-filename").val();
    console.log(
      action,
      actionFreq,
      actionTimes,
      actionKV,
      actionZipcode,
      actionFilename
    );
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }
    if (isNaN(actionFreq)) {
      msg += "必须选择任务频率。\r\n";
    }

    if (actionFreq == 1) {
      actionTimes = 1;
    }
    if (isNaN(actionTimes)) {
      msg += "必须输入任务次数。\r\n";
    } else if (parseInt(actionTimes) == 0) {
      actionTimes = Infinity;
    }

    if (actionKV == "") {
      msg += "必须输入关键词。\r\n";
    }

    if (actionZipcode == "") {
      actionZipcode = "10005";
    }

    if (actionFilename == "") {
      msg += "必须输入关键词。\r\n";
    } else {
      let reg = new RegExp('[\\\\/:*?"<>|]');
      if (reg.test(actionFilename)) {
        msg += "文件名不能包括特殊字符";
      }
    }
    if (msg != "") {
      $("#popupMsg").text(msg);
      $("#popupModal").modal("toggle", "center");
    } else {
      bg.createTask({
        action,
        actionFreq,
        actionTimes,
        actionKV,
        actionFilename,
        actionZipcode,
      });
    }
  });

  $("#action-times").on("input", function () {
    $(this).val(
      $(this)
        .val()
        .replace(/[^0-9]/g, "")
    );
  });

  $(document).on("click", ".btn-del", function () {
    let index = $(this).data("index");
    console.log(this);
    bg.taskDoneByIndex(bg.taskList, index);
    $(this).addClass("disabled");
  });

  console.dir(bg.taskList);
  let taskListHtml = template("task-template", { task_list: bg.taskList });
  $("#task-list").html(taskListHtml);
});
