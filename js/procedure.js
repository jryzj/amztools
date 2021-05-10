function postMsg(tabId, msg, callback) {
  chrome.tabs.sendMessage(tabId, msg, callback);
}

function* getAsinRankAction(tabId, params, data) {
  let currentPage = 1;
  let ret;
  let hasNextPage = true;
  //go url
  yield postMsg(tabId, { amzAction: "goUrl", params: webbase + "/?" + lang});

  //change location
  yield postMsg(tabId, {
    amzAction: "changeLocation",
    params: params.actionZipcode,
  });
  //search
  yield postMsg(tabId, { amzAction: "search", params: params.actionKV });
  while (currentPage <= maxAsinPage) {
    //get asin
    ret = yield postMsg(tabId, {
      amzAction: "content",
      params: ["html", "[data-asin].s-asin"],
    });
    // let asinEle_list = $(ACT_SEL.asinOnPages.slAll, $(ret));
    // console.log("ele length:", asinEle_list.length);
    // asinEle_list.each(function () {
    //   console.log($(this).attr("data-asin"));
    // });
    console.log(
      "all data on one page",
      getAllAsinInfoOnPage(ret, currentPage, (type = "all"))
    );
    data.push.apply(data, getAllAsinInfoOnPage(ret, currentPage));
    console.log("currentPage", currentPage);
    currentPage++;
    if (currentPage > maxAsinPage) break;
    //go next page
    postMsg(tabId, { amzAction: "goNextPage" });
    hasNextPage = yield;
    if (!hasNextPage) break;
  }
  console.log("1 time end");
  document.dispatchEvent(
    new CustomEvent("task end", {
      detail: {
        tabId: tabId,
        data: data,
      },
    })
  );
  // chrome.storage.local.get(null, (items) => {
  //   console.log(items);
  // });
}

function rxMsgHandler(tabId, task) {
  return function (req, sender, callback) {
    // console.log("message from content-script:", req, sender, callback);
    console.log("current tabId", tabId);
    if (sender.tab["id"] == tabId) {
      if (req.playerState) {
        switch (req.playerState) {
          case "ready":
            task.next(req.data);
            break;
          case "done":
            task.next(req.data);
            break;
          default:
            break;
        }
      }
    }
  };
}

// async function bgGetAsinRank(kv) {
//   chrome.tabs.create({ url: webbase }, function (tab) {
//     console.log(tab.id);
//     let tabId = tab.id;
//     let task = getAsinRankAction(tab.id, kv);
//     let cb = rxMsgHandler(tabId, task);
//     document.addEventListener("task end", (e) => {
//       if (e.detail.tabId == tabId) {
//         chrome.runtime.onMessage.removeListener(cb);
//       }
//     });
//     chrome.runtime.onMessage.addListener(cb);
//   });
// }

// async function bgGetAsinRank1(kv, gaptime, maxTimes) {
//   return new Promise((resolve) => {
//     chrome.tabs.create({ url: webbase }, function (tab) {
//       console.log(tab.id);
//       let tabId = tab.id;
//       let handler = setInterval(function () {
//         let task = getAsinRankAction(tab.id, kv);
//         let cb = rxMsgHandler(tabId, task);
//         document.addEventListener("task end", (e) => {
//           if (e.detail.tabId == tabId) {
//             chrome.runtime.onMessage.removeListener(cb);
//             // clearInterval(handler);
//           }
//         });
//         chrome.runtime.onMessage.addListener(cb);
//         task.next();
//       }, gaptime);
//       resolve({ handler, tabId });
//     });
//   });
// }

function makeAction(func, param) {
  return new Promise(async function (resolve) {
    chrome.tabs.create({ url: webbase}, function (tab) {
      console.log("tab.id and param", tab.id, param);
      let handler = null;
      let tabId = tab.id;
      let timeNum = 1;
      let data = [];

      document.addEventListener("task end", (e) => {
        if (e.detail.tabId == tabId) {
          saveCsv(e.detail.data, param.actionFilename);
          if (param.actionTimes != 0 && timeNum >= param.actionTimes) {
            // saveCsv(e.detail.data, param.actionFilename);
            console.log("one task finished, clear");
            taskDone(taskList, tabId);
          }
        }
      });
      func(param, tabId, data);
      if (param.actionTimes != 1) {
        let handler = setInterval(
          function () {
            timeNum++;
            console.log(timeNum);
            func(param, tabId, data);
            setTaskTimes(taskList, tabId, timeNum);
          },
          param.actionFreq,
          param,
          tabId
        );
        resolve({ handler, tabId });
      } else {
        resolve({ handler, tabId });
      }
    });
  });
}

async function bgGetAsinRank2(params, tabId, data) {
  let task = getAsinRankAction(tabId, params, data);
  let cb = rxMsgHandler(tabId, task);
  document.addEventListener("task end", (e) => {
    if (e.detail.tabId == tabId) {
      chrome.runtime.onMessage.removeListener(cb);
      // clearInterval(handler);
    }
  });
  chrome.runtime.onMessage.addListener(cb);
  task.next();
  console.log("tabId", tabId);
}
