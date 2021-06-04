async function createTask(params) {
  let action = null;
  let task = { ...params };
  task.time = Date();
  task.lastRunningTime = Date();
  task.state = "running";
  task.times = 0;
  console.log(params);
  switch (params.action) {
    case "asin-rank":
      action = await makeAction(
        getAsinRankAction,
        params,
        (event, param) => {
          saveCsv(event.detail.data, param.actionFilename);
        },
        () => {
          taskNotification({
            message: `任务：${params.action}\n关键词：${params.actionAsin}\n执行完毕!`,
          });
        }
      );
      task.times = 1;
      console.log(action);
      Object.assign(task, action);
      taskList.push(task);
      break;
    case "review-collect":
      action = await makeAction(
        reviewCollect,
        params,
        null,
        async (event, param) => {
          return new Promise(async (res, rej) => {
            saveCsv(event.detail.data, param.actionFilename);

            //for wordcloud
            let collection = [];
            for (let len = event.detail.data.length, i = 1; i < len; i++) {
              // collection.push(event.detail.data[i]["review"]);
              for (key of param.actionWordFreq) {
                if (event.detail.data[i][key]) {
                  collection.push(event.detail.data[i][key].trim());
                }
              }
            }
            let words = [];
            for (phrase of collection) {
              words.push.apply(
                words,
                cleanWords(phrase, stopwords.en, param.actionWordExcept)
              );
            }
            await saveWordCloud(
              wordFreq(words, "list"),
              wordCloudOption,
              param.actionFilename + ".jpg"
            );
            saveCsv(
              wordFreq(words, "aoo"),
              param.actionFilename + "_wordFreq" + ".csv"
            );
            taskNotification({
              message: `任务：${params.action}\n关键词：${params.actionAsin}\n执行完毕!`,
            });
            res();
          });
        }
      );
      task.times = 1;
      console.log(action);
      Object.assign(task, action);
      taskList.push(task);

      break;
    case "QA-collect":
      action = await makeAction(
        QACollect,
        params,
        null,
        async (event, param) => {
          return new Promise(async (res, rej) => {
            saveCsv(event.detail.data, param.actionFilename);

            //for wordcloud
            let collection = [];
            for (let len = event.detail.data.length, i = 1; i < len; i++) {
              // collection.push(event.detail.data[i]["review"]);
              // for (key of param.actionWordFreq) {
              //   if (event.detail.data[i][key]) {
              //     collection.push(event.detail.data[i][key].trim());
              //   }
              // }

              collection.push(event.detail.data[i]["question"].trim());
              collection.push(event.detail.data[i]["answer"].trim());
            }
            let words = [];
            for (phrase of collection) {
              words.push.apply(
                words,
                cleanWords(phrase, stopwords.en, param.actionWordExcept)
              );
            }
            await saveWordCloud(
              wordFreq(words, "list"),
              wordCloudOption,
              param.actionFilename + ".jpg"
            );
            saveCsv(
              wordFreq(words, "aoo"),
              param.actionFilename + "_wordFreq" + ".csv"
            );
            taskNotification({
              message: `任务：${params.action}\n关键词：${params.actionAsin}\n执行完毕!`,
            });
            res();
          });
        }
      );
      task.times = 1;
      console.log(action);
      Object.assign(task, action);
      taskList.push(task);
      break;
    case "hotKV-collect":
      action = await makeAction(
        hotKVCollectBFS,
        params,
        null,
        async (event, param) => {
          return new Promise(async (res, rej) => {
            saveCsv(event.detail.data, param.actionFilename);
            taskNotification({
              message: `任务：${params.action}\n关键词：${params.actionKV}\n执行完毕!`,
            });
            res();
          });
        }
      );
      task.times = 1;
      console.log(action);
      Object.assign(task, action);
      taskList.push(task);
      break;
    case "clear-cookie":
      clearCookie();
      taskNotification({ message: "cookie清除完毕！" });
      break;
  }
}

function taskDone(taskList, tabId) {
  for (let len = taskList.length, i = 0; i < len; i++) {
    if (taskList[i].tabId == tabId) {
      taskDoneByIndex(taskList, i);
      break;
    }
  }
}

function taskDoneByIndex(taskList, index) {
  taskList[index].state = "done";
  if (taskList[index].handler) clearInterval(taskList[index].handler);
}

function setTaskTimes(taskList, tabId, timeNum) {
  for (let len = taskList.length, i = 0; i < len; i++) {
    if (taskList[i].tabId == tabId) {
      setTaskTimesByIndex(taskList, i, timeNum);
      break;
    }
  }
}

function setTaskTimesByIndex(taskList, index, timeNum) {
  taskList[index].times = timeNum;
  taskList[index].lastRunningTime = Date();
}
