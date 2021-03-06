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
  //   ele.body.appendChild(a);  //only for compatible for firefox, Chrome need't.
  a.click();
  //   ele.body.removeChild(a);  //only for compatible for firefox, Chrome need't.
}

function json2csv(jsonList, delimiter = "\t") {
  let head = Object.keys(jsonList[0]).join(delimiter) + "\n";
  let values = "";
  for (let i = 0, len = jsonList.length; i < len; i++) {
    values = values + Object.values(jsonList[i]).join(delimiter) + "\n";
  }
  return head + values;
}

function json2csvPlus(jsonList, delimiter = "\t") {
  let head = [];
  let values = "";
  for (let i = 0, len = jsonList.length; i < len; i++) {
    for (key in jsonList[i]) {
      if (head.indexOf(key) == -1) {
        head.push(key);
      }
    }
    let v = [];
    for (key of head) {
      v.push(jsonList[i][key]);
    }
    values = values + v.join(delimiter) + "\n";
  }
  return head.join(delimiter) + "\n" + values;
}

function saveCsv(jsonList, filename, ele = document) {
  downloadByA(ele, filename, json2csvPlus(jsonList));
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

function cleanWords(
  paragraph,
  stopwords,
  wordExcept,
  selector = ["noun", "verb", "adverb", "adjective", "number"]
) {
  //selector: list
  //[noun, noun_adjective, verb, adverb]
  //adjective
  let words = [];
  let doc = nlp(paragraph.toLowerCase());
  for (sel of selector) {
    switch (sel) {
      case "noun":
        words.push.apply(words, doc.nouns().toSingular().out("array"));
        break;
      case "adjective":
        words.push.apply(words, doc.adjectives().out("array"));
        break;
      case "noun_adjective":
        words.push.apply(words, doc.nouns().adjectives().out("array"));
        break;
      case "verb":
        words.push.apply(words, doc.verbs().out("array"));
        break;
      case "adverb":
        words.push.apply(words, doc.adverbs().out("array"));
        break;
    }
  }

  let retWords = [];
  for (word of words) {
    word = word.replace(wordPunctuationRule, "");
    if (word == "") continue;
    if (stopwords.indexOf(word) != -1) continue;
    if (wordExcept.indexOf(word) != -1) continue;
    retWords.push(word);
  }

  if (selector.indexOf("number") != -1) {
    let numbers = doc.numbers().out("array");
    for (n of numbers) {
      if (wordExcept.indexOf(n) == -1) {
        retWords.push(n);
      }
    }
  }

  return retWords;
}

function wordFreq(wordList, type) {
  let wFreq = {};
  for (word of wordList) {
    if (wFreq[word]) {
      wFreq[word]++;
    } else {
      wFreq[word] = 1;
    }
  }

  let wRet;
  switch (type) {
    case "list":
      wRet = [];
      for (key in wFreq) {
        wRet.push([key, wFreq[key]]);
      }
      break;
    case "aoo":
      wRet = [];
      for (key in wFreq) {
        wRet.push({ word: key, frequency: wFreq[key] });
      }
      break;
    default:
      wRet = wFreq;
      break;
  }
  return wRet;
}

async function saveWordCloud(data, option, filename, container = document) {
  return new Promise((res, rej) => {
    let options = {
      list: data,
    };
    Object.assign(options, option);

    // let canvas = container.createElement("canvas");
    let canvas = $("<canvas>")[0];
    canvas.width = 1920;
    canvas.height = 1080;

    let maxSize = 1;
    for (d of options.list) {
      if (d[1] > maxSize) {
        maxSize = d[1];
      }
    }

    if (canvas.height > maxSize * 6) {
      options.weightFactor = 6;
    } else {
      options.weightFactor = canvas.height / maxSize / 6;
    }

    // document.body.appendChild(canvas);
    // $(document).append(canvas);
    WordCloud(canvas, options);

    // let a = container.createElement("a");
    $(canvas).one("wordcloudstop", function () {
      let a = $("<a>")[0];
      a.href = canvas.toDataURL("image/jpeg");
      a.download = filename;
      a.click();
      console.log("wordcloudstop");
      res();
    });
  });
}
