function getAllAsinInfoOnPage(page, page_num, type = "all") {
  let asinInfoList = [];
  let asin_list = null;
  let qPage = $(page);
  if (type == "ad") {
    asin_list = $(ACT_SEL.asinOnPages.slAdAsin, qPage);
  } else if (type == "asin") {
    asin_list = $(ACT_SEL.asinOnPages.slAsin, qPage);
  } else {
    asin_list = $(ACT_SEL.asinOnPages.slAll, qPage);
  }

  for (let i = 0, len = asin_list.length; i < len; i++) {
    let asinInfo = {};
    asinInfo["page"] = page_num;
    asinInfo["position"] = i + 1;

    let price = $(ACT_SEL.asinOnPages.slPrice, asin_list[i])[0];
    if (price) {
      asinInfo["price"] = $(price).text();
    } else {
      asinInfo["price"] = "";
    }

    let rating = $(ACT_SEL.asinOnPages.slRating, asin_list[i])[0];
    if (rating) {
      asinInfo["rating"] = $(rating).text();
    } else {
      asinInfo["rating"] = "";
    }

    if ($(asin_list[i]).hasClass(ACT_SEL.asinOnPages.slAd)) {
      asinInfo["type"] = "ad";
    } else {
      asinInfo["type"] = "asin";
    }

    asinInfo["title"] = $(
      $(ACT_SEL.asinOnPages.slTitle, asin_list[i])[0]
    ).text();

    let star = $(ACT_SEL.asinOnPages.slStar, asin_list[i])[0];
    if (star) {
      asinInfo["star"] = $(star).text();
    } else {
      asinInfo["star"] = "";
    }

    let save = $(ACT_SEL.asinOnPages.slSave, asin_list[i])[0];
    if (save) {
      asinInfo["save"] = $(save).text();
    } else {
      asinInfo["save"] = "";
    }

    let deal = $(ACT_SEL.asinOnPages.slBadge, asin_list[i]);
    if (deal.length > 0) {
      asinInfo["deal"] = "";
      for (let len = deal.length, i = 0; i < len; i++) {
        asinInfo["deal"] += $(deal[i]).text();
      }
    } else {
      asinInfo["deal"] = "";
    }

    asinInfo["asin"] = $(asin_list[i]).attr(ACT_SEL.asinOnPages.slAsinid);
    asinInfo["page"] = page_num;
    asinInfo["date"] = Date();
    asinInfoList.push(asinInfo);
  }

  return asinInfoList;
}

function getInfoOnAsinPage(page) {
  let info = {};
  let qPage = $(page);

  info["title"] = $(ACT_SEL.asinPage.slTitle, qPage).text().trim();
  info["size"] = [];
  let sizes = $(ACT_SEL.asinPage.slSizes, qPage);
  for (let i = 0, len = sizes.length; i < len; i++) {
    info["sizes"].push($(sizes[i]).text().trim());
  }

  info["colors"] = [];
  let colors = $(ACT_SEL.asinPage.slColors, qPage);
  for (let i = 0, len = colors.length; i < len; i++) {
    let color = $(colors[i])
      .attr(ACT_SEL.asinPage.aColors)
      .replace(ACT_SEL.asinPage.rColor, "");
    info["colors"].push(color);
  }

  info["bullets"] = [];
  let bullets = $(ACT_SEL.asinPage.slBullets, qPage);
  for (let i = 0, len = bullets.length; i < len; i++) {
    info["bullets"].push($(bullets[i]).text().trim());
  }

  info["main_pic"] = $(ACT_SEL.asinPage.slMain_pic, qPage).attr("src");
  info["rating_num"] = $(ACT_SEL.asinPage.slRating_num, qPage)
    .text()
    .replace(",", "")
    .replace(" rating", "");

  info["star"] = $(ACT_SEL.asinPage.slStar, qPage)
    .text()
    .replace(" out of 5 stars", "");

  return info;
}

function getReviewOnPage(page) {
  let reviewList = [];
  let qPage = $(page);
  let reviews = $(ACT_SEL.allReviews.slAllReviews, qPage);

  for (let i = 0, len = reviews.length; i < len; i++) {
    let info = {};

    review = $(reviews[i]);
    info["name"] = $($(ACT_SEL.allReviews.slName, review)[0]).text();
    info["rating"] = $($(ACT_SEL.allReviews.slRating, review)[0])
      .text()
      .replace(ACT_SEL.allReviews.rRating, "");

    info["title"] = $($(ACT_SEL.allReviews.slTitle, review)[0]).text().trim();
    let date_country = $($(ACT_SEL.allReviews.slDateCoutry, review)[0])
      .text()
      .replace(ACT_SEL.allReviews.rCountry, "")
      .replace(",", " ")
      .trim()
      .split(/\s+/);
    info["month"] = date_country[date_country.length - 3];
    info["day"] = date_country[date_country.length - 2];
    info["year"] = date_country[date_country.length - 1];
    info["country"] = date_country.slice(0, date_country.length - 4).join(" ");

    let format_strip = $($(ACT_SEL.allReviews.slFormatStrip, review)[0]).html();

    if (format_strip) {
      format_strip = format_strip.split(ACT_SEL.allReviews.rFormatStrip);
      for (let i = 0, len = format_strip.length; i < len; i++) {
        let [name, value] = format_strip[i].split(":");
        info[name.toLowerCase().trim()] = value.trim();
      }
      // info["size"] = format_strip[0].trim();
      // info["color"] = format_strip[1].trim();
    }

    info["avp"] = $($(ACT_SEL.allReviews.slAvp, review)[0]).text();
    info["review"] = $($(ACT_SEL.allReviews.slContent, review)[0])
      .text()
      .trim()
      .replace(/\s+/g, " ");
    info["href"] = $($(ACT_SEL.allReviews.slHref, review)[0]).attr("href");
    // if (info["href"]) info["href"] = self.web_base + info["href"];

    let vineBagde = $($(ACT_SEL.allReviews.slBadge, review)[0]);
    if (vineBagde) info["vine voice"] = vineBagde.text().trim();

    let vineReview = $($(ACT_SEL.allReviews.slVineReview, review)[0]);
    if (vineReview) info["vine review"] = vineReview.text().trim();

    reviewList.push(info);
  }
  return reviewList;
}

function getAllQAonPage(page) {
  let QAList = [];
  let hasAllA = [];
  let qPage = $(page);
  let QAs = $(ACT_SEL.allQA.slQADivs, qPage); //all QA div on the page
  for (let oneQA of QAs) {
    let ADiv = $(ACT_SEL.allQA.slADiv, oneQA); //A div in onr QA
    if ($(ACT_SEL.allQA.slASeeAll, ADiv).length > 0) {
      hasAllA.push({
        question: $(ACT_SEL.allQA.slQ, oneQA)[0].textContent.trim(),
        vote: $(ACT_SEL.allQA.slVote, oneQA)[0].textContent,
        url:
          $(ACT_SEL.allQA.slASeeAll, ADiv)[0].pathname +
          $(ACT_SEL.allQA.slASeeAll, ADiv)[0].search,
      });
    } else {
      let ans = $(ACT_SEL.allQA.slA, ADiv);

      if ($(ACT_SEL.allQA.slAL,ans[0]).length>0){
        ans = $(ACT_SEL.allQA.slAL,ans[0])[0].textContent.trim().replace(/\s+/g, " ");
      }else{
        ans = ans[0].textContent.trim().replace(/\s+/g, " ");
      }
      QAList.push({
        question: $(ACT_SEL.allQA.slQ, oneQA)[0].textContent.trim(),
        // answer: $(ACT_SEL.allQA.slA, ADiv)[0].textContent.trim(),
        answer: ans,
        vote: $(ACT_SEL.allQA.slVote, oneQA)[0].textContent,
      });
    }
  }
  return { QAList, hasAllA };
}

function getQAonPage(page) {
  let aContent = "";
  let qPage = $(page);
  let answers = $(ACT_SEL.allQA.slAAllA, qPage);
  for (let a of answers) {
    aContent = aContent + a.textContent + "***"; //*** is separator among answers.
  }
  // let hasNext = $(ACT_SEL.slNextPageBtn, qPage).length > 0 ? true : false;
  // return { answer: aContent, hasNext: hasNext };
  return aContent.trim().replace(/\s+/g," ");
}

function getHotKV(suggestions) {
  let qPage = $(suggestions);
  let kvs = [];

  let divs = $(ACT_SEL.searchBarKV.slKV, qPage);
  for (let div of divs) {
    kvs.push(div.innerText.trim());
  }
  return kvs;
}
