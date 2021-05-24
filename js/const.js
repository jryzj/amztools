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
    slColors: "#variation_color_name ul li[title]",
    aColors: "title",
    rColor: "Click to select ",
    slBullets: "#feature-bullets ul li .a-list-item",
    slMain_pic: "#imageBlock_feature_div .selected img",
    slRating_num: "#acrCustomerReviewText",
    slStar: "#acrPopover i span",
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
};

const webbase = "https://www.amazon.com";
const searchPath = "/s?k=";
const asinBase = webbase + "/dp/";
const antiRobot =
  "To discuss automated access to Amazon data please contact api-services-support@amazon.com.";
const lang = "language=en_US"; // not ?language=en_US
const curNLand = "https://www.amazon.com/?currency=USD&language=en_US";
const ref = "&ref=nb_sb_noss"; // from north american?
const maxAsinPage = Infinity; //7
const pageWaitingMs = 3000;

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
