async function pageWaiting(ms = pageWaitingMs, callback) {
  return new Promise((res) => {
    setTimeout(() => {
      if (callback) {
        res(callback());
      } else {
        res();
      }
    }, ms);
  });
}

async function sureNotHave(
  content,
  container,
  contType = "text",
  gapTime = 1000
) {
  return new Promise(function (res, rej) {
    let t = setInterval(function () {
      if (document.readyState == "complete") {
        switch (conType) {
          case "text":
            let text = $(container, document).text();
            if (text.indexOf(content) == -1) {
              console.log("sureNoteHave 2");
              res();
              clearInterval(t);
            }
            break;
        }
      } else {
        console.log("sureNoteHave 3");
      }
    }, gapTime);
  });
}

function notHave(content, container, conType = "text") {
  if (document.readyState == "complete") {
    switch (conType) {
      case "text":
        let text = $(container, document).text();
        return text.indexOf(content) == -1;
        break;
    }
  } else {
    return false;
  }
}

async function sureReady(eleFlag = document, gapTime = 1000) {
  return new Promise(function (res, rej) {
    // if (document.readyState == "complete" && $(eleFlag).length > 0) {
    //   console.log("sureready 1");
    //   res();
    // } else {
    //   let t = setInterval(function () {
    //     if (document.readyState == "complete" && $(eleFlag).length > 0) {
    //       console.log("sureready 2");
    //       res();
    //       clearInterval(t);
    //     } else {
    //       console.log("sureready 3");
    //     }
    //   }, gapTime);
    // }
    let t = setInterval(function () {
      if (
        document.readyState == "complete" &&
        $(eleFlag, document).length > 0 &&
        notHave(antiRobot, document)
      ) {
        console.log("sureready 2");
        res();
        clearInterval(t);
      } else {
        console.log("sureready 3");
      }
    }, gapTime);
  });
}

async function sureReadyByEval(condition, gapTime = 1000) {
  return new Promise(function (res, rej) {
    if (document.readyState == "complete" && eval(condition)) {
      console.log("sureready 1");
      res();
    } else {
      let t = setInterval(function () {
        if (document.readyState == "complete" && eval(condition)) {
          console.log("sureready 2");
          res();
          clearInterval(t);
        } else {
          console.log("sureready 3");
        }
      }, gapTime);
    }
  });
}

async function amzSearch(kv) {
  await sureReady(ACT_SEL.slSearchBar);
  $(ACT_SEL.slSearchBar).val(kv);
  $(ACT_SEL.slSearchBtn).click();
}

async function amzContent(sel, eleFlag, gapTime = 1000) {
  await sureReady(eleFlag, gapTime);
  return $(sel).html();
}

async function amzGoNextPage() {
  // $(ACT_SEL.nextPageBtn).ready(function () {
  //   console.log("nextpage btn ready")
  //   $(ACT_SEL.nextPageBtn)[0].click();
  // });
  await sureReady(ACT_SEL.slNextPageBtn);
  if ($(ACT_SEL.slNextPageBtnEnabled).length > 0) {
    $(ACT_SEL.slNextPageBtnEnabled)[0].click();
    await sureReady();
    await pageWaiting();
    return true;
  }
  return false;
}

async function amzGoUrl(url, eleFlag = document) {
  window.location.href = url;
  await sureReady(eleFlag);
}

async function amzChangeLocation(
  zipcode,
  container = document,
  country = "US"
) {
  //step cilck location anchor
  await sureReady(ACT_SEL.slGlobalLocation);
  $(ACT_SEL.slGlobalLocation, container)[0].click();
  await sureReady(ACT_SEL.slZipcodeInput);
  $(ACT_SEL.slZipcodeInput, container)[0].value = zipcode;
  await sureReady(ACT_SEL.slZipcodeApply);
  $(ACT_SEL.slZipcodeApply, container)[0].click();
  await sureReady(ACT_SEL.slDoneBtn);
  $(ACT_SEL.slDoneBtn, container).click();
}
