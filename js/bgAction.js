async function createTask(params) {
  let task = { ...params };
  task.time = Date();
  task.lastRunningTime = Date();
  task.state = "running";
  task.times = 0;
  console.log(params);
  switch (params.action) {
    case "asin_rank":
      let action = await makeAction(bgGetAsinRank2, params);
      task.times = 1;
      console.log(action);
      Object.assign(task, action);
      break;
  }
  taskList.push(task);
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
}
