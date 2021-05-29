console.log("I'm content-script.js");
// let n = 0;
// console.log(n++);

function sendMsg(msg = "ready", data = null) {
  console.log(msg, data);
  chrome.runtime.sendMessage({ playerState: msg, data: data });
}

chrome.runtime.onMessage.addListener(async function (req, sender, callback) {
  let hasPage = false;
  if (req.amzAction) {
    switch (req.amzAction) {
      case "goUrl": //realy fresh page, load page
        console.log("gourl");
        await amzGoUrl(req.params);
        // await pageWaiting();
        // sendMsg();
        break;
      case "search": //realy fresh page, load page
        console.log("search");
        await amzSearch(req.params);
        // await pageWaiting();
        // callback("test done!");
        break;
      case "content":   //not fresh page
        console.log("here content");
        content = await amzContent(req.params[0], req.params[1], 3000);
        sendMsg("done", content);
        break;
      case "goNextPage":   //ajax fresh page, not reload page!!!
        console.log("here goNextPage");
        hasPage = await amzGoNextPage();
        sendMsg("ready", hasPage);
        break;
      case "changeLocation":  //realy fresh page, load page
        console.log("here changeLocation");
        await amzChangeLocation(req.params);
        // await pageWaiting();
        // sendMsg();
        break;
      case "goSeeAllReview": //not fresh page
        console.log("here see all review");
        hasPage = await amzGoSeeAllReview();
        sendMsg("ready", hasPage);
        break;
      case "clickGoPage": //not fresh page
        console.log("here click go page");
        hasPage = await amzClickGoPage(pagereq.params[0]);
        sendMsg("ready", hasPage);
        break;
      case "reload":

        break;
      default:
        console.log("no amzAction.");
        break;
    }
  }
});

$(document).ready(function () {
  pageWaiting(3000, function () {
    let ret = pageAvailable();
    sendMsg("ready", ret);
  });
});
