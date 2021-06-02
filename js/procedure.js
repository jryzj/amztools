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
    url: asinBase + "/" + params.actionAsin + "/?" + lang,
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

        console.log("allreviewCollect", getReviewOnPage(ret));

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

function* QACollect(tabId, params, data) {
  let maxPage = params.actionMaxPage || maxAsinPage;
  let currentPage = 1;
  let ret;
  let currentUrl;

  //go url
  chrome.tabs.update(tabId, {
    url: QAbase + "/" + params.actionAsin + "/?" + isAnswered + "&" + lang,
  });

  ret = yield;

  if (ret.pageAvailable) {
    //change location
    yield postMsg(tabId, {
      amzAction: "changeLocation",
      params: params.actionZipcode,
    });
    while (currentPage <= maxPage) {
      currentUrl = chrome.tabs.get(tabId, (tab) => (currentUrl = tab.url));
      ret = yield postMsg(tabId, {
        amzAction: "content",
        params: ["html", ACT_SEL.allQA.slAllQADiv],
      });
      currentPage++;
      //pase QA list page
      ret = getAllQAonPage(ret);
      if (ret.QAList.length > 0) {
        data.push.apply(data, ret.QAList);
      }

      //if many Q have more answer, parse one by one
      if (ret.hasAllA.length > 0) {
        let rret;
        for (let ques of ret.hasAllA) {
          let aContent = "";

          postMsg(tabId, {
            amzAction: "goUrl",
            params: webbase + ques.url,
          });
          rret = yield;
          while (true) {
            if (rret.pageAvailable) {
              rret = yield postMsg(tabId, {
                amzAction: "content",
                params: ["html", ACT_SEL.allQA.slAQ],
              });

              //parse one QA page
              rret = getQAonPage(rret);
              aContent = aContent + rret;

              postMsg(tabId, { amzAction: "goNextPage" });

              rret = yield;
              if (!rret.pageAvailable) {
                yield postMsg(tabId, {
                  amzAction: "goUrl",
                  params: currentUrl,
                });
                break;
              }
              //if has more answer, continue
            } else {
              if (rret.reason == "anti robot") {
                //
                yield;
              } else if (rret.reason == "not N/A") {
                //
              }
            }
          }
          data.push({
            question: ques.question,
            answer: aContent,
            vote: ques.vote,
          });
        }
      }

      ret = yield postMsg(tabId, { amzAction: "goNextPage" });
      if (!ret.pageAvailable) {
        break;
      }
    }
  } else {
    data.push({ error: "asin or QA is N/A." });
  }

  console.log("QACollect 1 time end");
  document.dispatchEvent(
    new CustomEvent("task end", {
      detail: {
        tabId: tabId,
        data: data,
      },
    })
  );
}

function* hotKVCollectDFS(tabId, params, data) {
  let ret;
  let maxNum = params.actionMaxNum || Infinity;
  let currentNum = 0;
  let stack = [];
  //go url
  chrome.tabs.update(tabId, { url: webbase + "/?" + lang });

  ret = yield;

  if (ret.pageAvailable) {
    //change location
    yield postMsg(tabId, {
      amzAction: "changeLocation",
      params: params.actionZipcode,
    });
    stack.push({ level: "0", kv: params.actionKV, isFilled: false });
    while (currentNum < maxNum) {
      let currentKV = stack[stack.length - 1];
      if (currentKV == undefined) break;
      if (currentKV.isFilled) {
        data.unshift(stack.pop());
        continue;
      }
      currentKV.isFilled = true;

      postMsg(tabId, {
        amzAction: "fillSearchBar",
        params: currentKV.kv,
      });

      ret = yield;

      // parse suggestions
      ret = getHotKV(ret);

      if (ret.length == 0 || (ret.length == 1 && ret[0] == currentKV.kv)) {
        data.unshift(stack.pop());
      } else {
        let index = 1;
        for (let kv of ret) {
          if (kv == currentKV.kv) continue;
          currentNum++;
          stack.push({ level: currentKV.level + "-" + index, kv: kv });
          index++;
        }
      }
    }
  } else {
    data.push({ error: "asin or QA is N/A." });
  }

  for (let len = stack.length; len > 0; len--) {
    data.unshift(stack.pop());
  }
  console.log("hotkv collect 1 time end");
  document.dispatchEvent(
    new CustomEvent("task end", {
      detail: {
        tabId: tabId,
        data: data,
      },
    })
  );
}

function* hotKVCollectBFS(tabId, params, data) {
  let ret;
  let maxNum = params.actionMaxNum || Infinity;
  let currentNum = 1;
  let stack1 = [],
    stack2 = [];

  //go url
  chrome.tabs.update(tabId, { url: webbase + "/?" + lang });

  ret = yield;

  if (ret.pageAvailable) {
    //change location
    yield postMsg(tabId, {
      amzAction: "changeLocation",
      params: params.actionZipcode,
    });
    data.push({ level: "0", kv: params.actionKV });
    stack1[0] = data[0];
    doneloop: while (currentNum < maxNum) {
      for (let currentKV of stack1) {
        postMsg(tabId, {
          amzAction: "fillSearchBar",
          params: currentKV.kv,
        });

        ret = yield;

        // parse suggestions
        ret = getHotKV(ret);

        let index = 1;
        for (let kv of ret) {
          if (kv == currentKV.kv) continue;
          data.push({ level: currentKV.level + "-" + index, kv: kv });
          stack2.push(data[data.length - 1]);
          index++;
          currentNum++;
          console.log(currentNum);
          if (currentNum >= maxNum) break doneloop;
        }
      }
      if (stack2.length == 0) break;
      stack1 = stack2;
      stack2 = [];
    }
  } else {
    data.push({ error: "asin or QA is N/A." });
  }

  console.log("hotkv collect 1 time end");
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

            (await doBeforeEnd) && doBeforeEnd(event, param);

            console.log("one task finished, clear");
            taskDone(taskList, tabId);
          }
        }
      });
      makeTask(func, param, tabId, data);
      if (param.actionTimes > 1) {
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
      task = null;
      // clearInterval(handler);
    }
  });
  chrome.runtime.onMessage.addListener(cb);
  task.next();
  console.log("tabId", tabId);
}
