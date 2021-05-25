function postMsg(tabId, msg, callback) {
  chrome.tabs.sendMessage(tabId, msg, callback);
}

function* getAsinRankAction(tabId, params, data) {
  let maxPage = params.actionMaxPage || maxAsinPage;
  let currentPage = 1;
  let ret;
  let hasNextPage = true;
  //go url
  // yield postMsg(tabId, { amzAction: "goUrl", params: webbase + "/?" + lang });
  yield chrome.tabs.update(tabId, { url: webbase + "/?" + lang });

  //change location
  yield postMsg(tabId, {
    amzAction: "changeLocation",
    params: params.actionZipcode,
  });
  //search
  yield postMsg(tabId, { amzAction: "search", params: params.actionKV });
  while (currentPage <= maxPage) {
    //get asin
    ret = yield postMsg(tabId, {
      amzAction: "content",
      params: ["html", ACT_SEL.asinOnPages.slAll],
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
    if (currentPage > maxPage) break;
    //go next page
    postMsg(tabId, { amzAction: "goNextPage" });
    hasNextPage = yield;
    if (!hasNextPage) break;
  }
  console.log("getAsinRankAction 1 time end");
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

function* reviewCollect(tabId, params, data) {
  let maxPage = params.actionMaxPage || maxAsinPage;
  let currentPage = 1;
  let ret;

  //go url
  // postMsg(tabId, {
  //   amzAction: "goUrl",
  //   params: asinBase + params.actionAsin + "/?" + lang,
  // });
  chrome.tabs.update(tabId, {
    url: asinBase + params.actionAsin + "/?" + lang,
  });

  ret = yield;
  console.log("ret", ret);

  if (ret.pageAvailable) {
    // change location
    yield postMsg(tabId, {
      amzAction: "changeLocation",
      params: params.actionZipcode,
    });

    ret = yield postMsg(tabId, {
      amzAction: "content",
      params: ["html", ACT_SEL.asinPage.slBullets],
    });
    getAllAsinInfoOnPage(ret);

    ret = yield postMsg(tabId, {
      amzAction: "goSeeAllReview",
    });

    if (ret) {
      while (currentPage <= maxPage) {
        ret = yield postMsg(tabId, {
          amzAction: "content",
          params: ["html", ACT_SEL.allReviews.slAllReviews],
        });

        console.log("alreviewCollect", getReviewOnPage(ret));

        data.push.apply(data, getReviewOnPage(ret));

        console.log("currentPage", currentPage);
        currentPage++;
        if (currentPage > maxPage) break;
        //go next page
        postMsg(tabId, { amzAction: "goNextPage" });
        hasNextPage = yield;
        if (!hasNextPage) break;
      }
    } else {
      data.push({ error: "no review." });
    }
  } else {
    data.push({ error: "asin is N/A." });
  }

  console.log("reviewCollect 1 time end");
  document.dispatchEvent(
    new CustomEvent("task end", {
      detail: {
        tabId: tabId,
        data: data,
      },
    })
  );
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

function makeAction(func, param, doAfterEveryBatch, doBeforeEnd) {
  return new Promise(async function (resolve) {
    // chrome.tabs.create({ url: webbase }, function (tab) {
    chrome.tabs.create({ url: null }, function (tab) {
      console.log("tab.id and param", tab.id, param);
      let handler = null;
      let tabId = tab.id;
      let timeNum = 1;
      let data = [];

      document.addEventListener("task end", async (event) => {
        if (event.detail.tabId == tabId) {
          if (doAfterEveryBatch) {
            doAfterEveryBatch(event, param);
          }
          // saveCsv(event.detail.data, param.actionFilename);
          if (param.actionTimes != 0 && timeNum >= param.actionTimes) {
            // saveCsv(e.detail.data, param.actionFilename);
            // if (doBeforeEnd) {
            //   doBeforeEnd(event, param);
            // }

            await doBeforeEnd && doBeforeEnd(event, param);

            console.log("one task finished, clear");
            taskDone(taskList, tabId);
          }
        }
      });
      makeTask(func, param, tabId, data);
      if (param.actionTimes != 1) {
        let handler = setInterval(
          function () {
            timeNum++;
            console.log(timeNum);
            makeTask(func, param, tabId, data);
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

async function makeTask(func, params, tabId, data) {
  // let task = getAsinRankAction(tabId, params, data);
  let task = func(tabId, params, data);
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
