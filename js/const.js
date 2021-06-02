const ACT_SEL = {
  slGlobalLocation: "#nav-global-location-popover-link",
  slSelectLocation: "[data-action-type='SELECT_LOCATION']",
  slChangeZipcode: "#GLUXChangePostalCodeLink",
  slZipcodeInput: "#GLUXZipUpdateInput",
  slZipcodeApply: "#GLUXZipUpdate-announce",
  slLocationConfirm: ".a-popover-footer #GLUXConfirmClose",
  slDoneBtn: ".a-popover-wrapper .a-popover-footer .a-button-text",
  slSearchBar: "#twotabsearchtextbox",
  slSearchBtn: "#nav-search-submit-button",
  slNextPageBtn: ".a-pagination .a-last",
  slNextPageBtnEnabled: ".a-pagination .a-last a",
  slNextPageBtnDisabled: ".a-pagination .a-disabled.a-last",
  slDogsofamazon: "[alt^=Sorry]",
  // for one list
  asinPage: {
    slTitle: "#productTitle",
    slSizes: "#variation_size_name ul li .a-size-base",
    slColors: "#variation_color_name ul li[title] img",
    aColors: "alt",
    rColor: "Click to select ",
    slBullets: "#feature-bullets ul li:not[id] .a-list-item",
    slMain_pic: "#imageBlock_feature_div .selected img",
    slRating_num: "#acrCustomerReviewText",
    slStar: "#acrPopover i span", //[0]
    slProductDescription: "div[id*=description] p,table", //text().trim().replace(/\s{2,}|\n+/g,",")
    slProductInformation: "#productDetails_detailBullets_sections1", //text().trim().replace(/\s{2,}|\n+/g,",")
    slProductDetails: "#detailBulletsWrapper_feature_div li", //text().trim().replace(/\s{2,}|\n+/g,",")
    slBestSellerRank: "a[href*='/gp/bestsellers/']:not([class]", //$("a[href*='/gp/bestsellers/']:not([class]").parentsUntil(":contains(Best Seller)").parent().text().replace(/\n+/g, " ")
    slProductOverView: "productOverview_feature_div", //$("#productOverview_feature_div tr").text().replace(/\n+/g," ")
  },
  // for asin on page
  asinOnPages: {
    slAsin: "[data-asin].s-asin:not(.AdHolder)",
    slAdAsin: "[data-asin].s-asin.AdHolder",
    slAll: "[data-asin].s-asin",
    slAd: "AdHolder",
    slAsinid: "data-asin",
    slListingSpan: "span",
    slPrice: ".a-offscreen", //# span:nth-child(9) 9;ad 18
    slRating: "a .a-size-base", //# span:nth-child(5) 5; ad 15
    slTitleSpan: ".a-size-base-plus.a-color-base.a-text-normal", //# span:nth-child(2) 2 a-size-base-plus a-color-base a-text-normal
    slStarSpan: ".a-icon-alt", //# span:nth-child(7) 7 a-icon-alt
    slTitleSpanAd: ".a-size-base-plus.a-color-base.a-text-normal", //# span:nth-child(11) a-size-base-plus a-color-base a-text-normal
    slStarSpanAd: ".a-icon-alt", //# span:nth-child(14) a-icon-alt
    slTitle: "span .a-size-base-plus.a-color-base.a-text-normal", //# span:nth-child(2) 2 a-size-base-plus a-color-base a-text-normal
    slStar: "span .a-icon-alt", //# span:nth-child(7) 7 a-icon-alt
    slSave:
      "span .a-size-base.s-coupon-highlight-color.s-highlighted-text-padding.aok-inline-block",
    slBadge: "span .a-badge .a-badge-text",
  },
  allReviews: {
    slSelf: '[data-hook="see-all-reviews-link-foot"]',
    slAllReviews: '#cm_cr-review_list [data-hook="review"]',
    slName: ".a-profile-name",
    slRating: '[data-hook="review-star-rating"] span',
    rRating: " out of 5 stars",
    slTitle: '[data-hook="review-title"]',
    slDateCoutry: '[data-hook="review-date"]',
    rCountry: "Reviewed in ",
    slFormatStrip: '[data-hook="format-strip"]',
    rFormatStrip: /<i.*i>/,
    slAvp: '[data-hook="avp-badge"]',
    slContent: '[data-hook="review-body"]',
    slHref: '[data-hook="review-title"]',
    //# 'global_rating_reviews': '[data-hook="cr-filter-info-review-rating-count"] span'
  },
  allQA: {
    slAllQADiv: ".a-section.askTeaserQuestions",
    slQADivs: ".a-section.askTeaserQuestions>.a-fixed-left-grid.a-spacing-base", //based on document
    slQ: "[id*=question] a", //innerText
    slADiv: ".a-fixed-left-grid.a-spacing-base", //based on slQADiv, innerText
    slA: ".a-fixed-left-grid-col.a-col-right span",
    slASeeAll: "a:contains(See)", //based on slADiv
    slVote: ".count",
    // slQNext: "#askPaginationBar .a-last a",
    //see all answer pages
    slAQ: "p.askAnswersAndComments span",
    slAAllA: "[id^=answer]>span",
    // slANext: "#askPaginationBar .a-last a",
  },
  bestSeller: {
    slAllAsinLink: "#zg-ordered-list li span.zg-item>.a-link-normal",
    rAsin: /\/dp\/(\w+)\//, //捕获组1，即第二个
  },
  categoryBestSeller: {},
  searchBarKV: {
    slSuggestionDiv: "",
    slCategory: ".s-suggestion[data-type=a9-xcat]",
    slKV: ".s-suggestion[data-type=a9]",
    slSearchBarAjax: "#nav-flyout-searchAjax",
  },
};

const webbase = "https://www.amazon.com";
const searchPath = "/s?k=";
const asinBase = webbase + "/dp";
const productReview = webbase + "/product-reviews";
const productReviewType = "?reviewerType=all_reviews";
const bestSellerBase = webbase + "/bestsellers/";
const QAbase = webbase + "/ask/questions/asin";
const isAnswered = "isAnswered=true";
const categoryBestSeller = webbase + "/Best-Sellers/zgbs";
const categoryBestSellerSub = categoryBestSeller;
const categoryNewRelese = webbase + "/gp/new-releases";
const categoryNewReleseSub = categoryNewRelese;
const antiRobot =
  "To discuss automated access to Amazon data please contact api-services-support@amazon.com.";
const lang = "language=en_US"; // not ?language=en_US
const curNLand = "https://www.amazon.com/?currency=USD&language=en_US";
const ref = "&ref=nb_sb_noss"; // from north american?
const maxAsinPage = Infinity; //7
const pageWaitingMs = 3000;
const wordPunctuationRule = /[^\w'/"]+/g;
const punctuationMark = [
  ",",
  ";",
  ":",
  ".",
  "!",
  "?",
  "'",
  '"',
  "-",
  "_",
  "/",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "*",
];

var wordCloudOption = {
  gridSize: 8, // size of the grid in pixels
  weightFactor: 2, // number to multiply for size of each word in the list
  fontWeight: "normal", // 'normal', 'bold' or a callback
  fontFamily: "Times, serif", // font to use
  color: "random-light", // 'random-dark' or 'random-light'
  backgroundColor: "#333", // the color of canvas
  rotateRatio: 1, // probability for the word to rotate. 1 means always rotate,
  // drawOutOfBound: false,
  shrinkToFit: true,
  // shape: "square",
};

var generalSetting = {
  country: "US",
  zipcode: 10005,
  freq: 1800000,
  maxTimes: Infinity,
  maxPage: Infinity,
  filename: "amzData",
  fileExt: "csv",
  wordFreq: ["review", "title", "color", "size"],
};
