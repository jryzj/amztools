function makeCsvURI(str) {
  //   return "data:text/csv;charset=utf-8," + encodeURIComponent(str);
  href = new Blob(["\ufeff" + str], { type: "text/csv,charset=UTF-8" });
  return URL.createObjectURL(href);
}

function downloadByA(ele, filename, content) {
  let a = ele.createElement("a");
  a.href = makeCsvURI(content);
  a.id = "amzcsv";
  a.download = filename;
  //   ele.body.appendChild(a);
  a.click();
  //   ele.body.removeChild(a);
}

function json2csv(jsonList, delimiter = "\t") {
  let head = Object.keys(jsonList[0]).join(delimiter) + "\n";
  let values = "";
  for (let i = 0, len = jsonList.length; i < len; i++) {
    values = values + Object.values(jsonList[i]).join(delimiter) + "\n";
  }
  return head + values;
}

function saveCsv(jsonList, filename, ele = document) {
  downloadByA(ele, filename, json2csv(jsonList));
}

function setFileOverwrite() {
  chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    suggest({
      filename: item.filename,
      conflict_action: "overwrite",
      conflictAction: "overwrite",
    });
  });
}

// chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
//   suggest({
//     filename: item.filename,
//     conflict_action: "overwrite",
//     conflictAction: "overwrite",
//   });
// });