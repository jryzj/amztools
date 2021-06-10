$(document).ready(function () {
  let bg = chrome.extension.getBackgroundPage();
  let generalSetting = bg.generalSetting;

  console.log("popup.js");
  function showGeneralSetting() {
    let generalSettingHtml = template("general-setting-template", {
      general_setting: JSON.parse(
        JSON.stringify(generalSetting, (k, v) => {
          return v === Infinity ? "Infinity" : v;
        })
      ),
    });
    $("#general-setting").html(generalSettingHtml);
  }

  function showTasks() {
    let taskListHtml = template("task-template", { task_list: bg.taskList });
    $("#task-list").html(taskListHtml);
  }

  $("#action").change(function () {
    let value = $("#action").val();
    if (value == "") value = "select-task";
    $("#" + value).collapse("toggle");
  });

  //搜索排名
  $("#task-asin-rank").click(function () {
    let msg = "";
    console.log("task-asin-rank");
    let action = $("#action").val();
    let actionFreq = parseInt($("#asin-rank-freq").val());
    let actionTimes = $("#asin-rank-times").val();
    let actionKV = $("#asin-rank-keyword").val();
    let actionMaxPage = $("#asin-rank-maxpage").val();
    let actionZipcode = generalSetting.zipcode;
    let actionFilename = $("#asin-rank-filename").val();
    console.log(
      action,
      actionFreq,
      actionTimes,
      actionKV,
      actionMaxPage,
      actionZipcode,
      actionFilename
    );
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }
    if (isNaN(actionFreq)) {
      // msg += "必须选择任务频率。\r\n";
      actionFreq = generalSetting.freq;
    }

    if (actionFreq == 1) {
      actionTimes = 1;
    }
    if (isNaN(parseInt(actionTimes)) || parseInt(actionTimes) == 0) {
      actionTimes = generalSetting.maxTimes;
    }

    if (actionKV == "") {
      msg += "必须输入关键词。\r\n";
    }

    // if (actionZipcode == "") {
    //   actionZipcode = generalSetting.zipcode;
    // }

    if (isNaN(actionMaxPage) || parseInt(actionMaxPage) == 0) {
      actionMaxPage = generalSetting.maxPage;
    }

    if (actionFilename == "") {
      actionFilename =
        generalSetting.filename +
        new Date().getTime() +
        "." +
        generalSetting.fileExt;
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
        actionMaxPage,
        actionFilename,
        actionZipcode,
      });
    }
  });

  //评论收集
  $("#task-review-collect").click(function () {
    let msg = "";
    console.log("task-review-collect");
    let action = $("#action").val();
    let actionAsin = $("#review-collect-asin").val();
    let actionTimes = 1;
    let actionMaxPage = $("#review-collect-maxpage").val();
    let actionWordFreq = $("#review-collect-word-freq").val();
    let actionWordExcept = $("#review-collect-word-except").val();
    let actionZipcode = generalSetting.zipcode;
    let actionFilename = $("#review-collect-filename").val();
    console.log(
      action,
      actionAsin,
      actionMaxPage,
      actionWordFreq,
      actionWordExcept,
      actionZipcode,
      actionFilename
    );
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }
    if (actionAsin == "") {
      msg += "asin必须输入。\r\n";
    }

    if (isNaN(parseInt(actionMaxPage)) || parseInt(actionMaxPage) == 0) {
      actionMaxPage = generalSetting.maxPage;
    }

    if (actionWordFreq.trim() == "") {
      actionWordFreq = generalSetting.wordFreq;
    } else {
      actionWordFreq = actionWordFreq.trim().toLowerCase().split("|");
    }

    if (actionWordExcept.trim() == "") {
      actionWordExcept = [];
    } else {
      actionWordExcept = actionWordExcept.trim().toLowerCase().split("|");
    }

    if (actionFilename == "") {
      actionFilename =
        generalSetting.filename +
        new Date().getTime() +
        "." +
        generalSetting.fileExt;
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
        actionAsin,
        actionTimes,
        actionMaxPage,
        actionWordExcept,
        actionWordFreq,
        actionFilename,
        actionZipcode,
      });
    }
  });

  //QA收集
  $("#task-QA-collect").click(function () {
    let msg = "";
    console.log("task-QA-collect");
    let action = $("#action").val();
    let actionAsin = $("#QA-collect-asin").val();
    let actionTimes = 1;
    let actionMaxPage = $("#QA-collect-maxpage").val();
    let actionWordExcept = $("#QA-collect-word-except").val();
    let actionZipcode = generalSetting.zipcode;
    let actionFilename = $("#QA-collect-filename").val();
    console.log(
      action,
      actionAsin,
      actionTimes,
      actionMaxPage,
      actionWordExcept,
      actionZipcode,
      actionFilename
    );
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }
    if (actionAsin == "") {
      msg += "asin必须输入。\r\n";
    }

    if (isNaN(parseInt(actionMaxPage)) || parseInt(actionMaxPage) == 0) {
      actionMaxPage = generalSetting.maxPage;
    }

    if (actionWordExcept.trim() == "") {
      actionWordExcept = [];
    } else {
      actionWordExcept = actionWordExcept.trim().toLowerCase().split("|");
    }

    if (actionFilename == "") {
      actionFilename =
        generalSetting.filename +
        new Date().getTime() +
        "." +
        generalSetting.fileExt;
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
        actionAsin,
        actionTimes,
        actionMaxPage,
        actionWordExcept,
        actionFilename,
        actionZipcode,
      });
    }
  });

  //hotKV收集
  $("#task-hotKV-collect").click(function () {
    let msg = "";
    console.log("task-hotkKV-collect");
    let action = $("#action").val();
    let actionKV = $("#hotKV-collect-kv").val();
    let actionTimes = 1;
    let actionMaxNum = $("#hotKV-collect-maxNum").val();
    let actionZipcode = generalSetting.zipcode;
    let actionFilename = $("#hotKV-collect-filename").val();
    console.log(action, actionKV, actionMaxNum, actionZipcode, actionFilename);
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }
    if (actionKV == "") {
      msg += "关键词必须输入。\r\n";
    }

    if (actionMaxNum == "") actionMaxNum = Infinity;

    if (actionFilename == "") {
      actionFilename =
        generalSetting.filename +
        new Date().getTime() +
        "." +
        generalSetting.fileExt;
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
        actionKV,
        actionTimes,
        actionMaxNum,
        actionZipcode,
        actionFilename,
      });
    }
  });

  //通用设置
  $("#task-setting").click(function () {
    let msg = "";
    console.log("task-setting");
    let action = $("#action").val();
    // let actionAsin = $("#review-collect-asin").val();
    // let actionTimes = 1;
    // let actionMaxPage = $("#review-collect-maxpage").val();
    let actionWordFreq = $("#setting-word-freq").val();
    let actionZipcode = $("#setting-zipcode").val();
    // let actionFilename = $("#review-collect-filename").val();
    console.log(
      action,
      // actionAsin,
      // actionMaxPage,
      actionWordFreq,
      actionZipcode
      // actionFilename
    );
    if (action == "") {
      msg += "必须选择任务。\r\n";
    }

    if (msg != "") {
      $("#popupMsg").text(msg);
      $("#popupModal").modal("toggle", "center");
    } else {
      if (actionZipcode.trim() != "") {
        generalSetting.zipcode = actionZipcode.trim();
      }

      if (actionWordFreq.trim() != "") {
        generalSetting.wordFreq = actionWordFreq
          .trim()
          .toLowerCase()
          .split("|");
      }

      showGeneralSetting();
    }
  });

  //清除cookie
  $("#task-clear-cookie").click(async function () {
    let action = "clear-footprint";
    bg.createTask({ action });
    // bg.clearCookie();
    // bg.taskNotification({ message: "cookie清除完毕！" });
  });

  $(".num").on("input", function () {
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

  showGeneralSetting();
  console.dir(bg.taskList);
  showTasks();
});
