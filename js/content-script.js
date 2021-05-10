console.log("I'm content-script.js");
// let n = 0;
// console.log(n++);

function sendMsg(msg = "ready", data = null) {
  console.log(msg);
  chrome.runtime.sendMessage({ playerState: msg, data: data });
}

let page = 1;

chrome.runtime.onMessage.addListener(async function (req, sender, callback) {
  if (req.amzAction) {
    switch (req.amzAction) {
      case "goUrl":
        console.log("gourl");
        await amzGoUrl(req.params);
        // await pageWaiting();
        // sendMsg();
        break;
      case "search":
        console.log("search");
        await amzSearch(req.params);
        // await pageWaiting();
        // callback("test done!");
        break;
      case "content":
        console.log("here content");
        content = await amzContent(req.params[0], req.params[1], 3000);
        sendMsg("done", content);
        break;
      case "goNextPage":
        console.log("here goNextPage");
        let hasNextPage = await amzGoNextPage();
        sendMsg("ready", hasNextPage);
        break;
      case "changeLocation":
        console.log("here changeLocation");
        await amzChangeLocation(req.params);
        // await pageWaiting();
        // sendMsg();
        break;
      default:
        console.log("no amzAction.");
        break;
    }
  }
});

pageWaiting(3000, function () {
  $(document).ready(sendMsg()); //content script run at document_idle by default
});
