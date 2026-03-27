const chrome_fingerprint = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
  ja3: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,35-5-27-16-0-10-13-23-45-65037-17613-18-65281-51-43-11,4588-29-23-24,0",
  ja4r: "t13d1516h2_002f,0035,009c,009d,1301,1302,1303,c013,c014,c02b,c02c,c02f,c030,cca8,cca9_0005,000a,000b,000d,0012,0017,001b,0023,002b,002d,0033,44cd,fe0d,ff01_0403,0804,0401,0503,0805,0501,0806,0601",
};
const android_fingerprint = {
  ja3: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,23-0-16-11-17613-27-43-35-13-65037-51-18-65281-45-5-10-41,4588-29-23-24,0",
  ja4r: "t13d1517h2_002f,0035,009c,009d,1301,1302,1303,c013,c014,c02b,c02c,c02f,c030,cca8,cca9_0005,000a,000b,000d,0012,0017,001b,0023,0029,002b,002d,0033,44cd,fe0d,ff01_0403,0804,0401,0503,0805,0501,0806,0601",
  userAgent: "TwitterAndroid/10.93.0-release.00 (Android 14; Google Pixel 7 Pro)",
};
const iphone_fingerprint = {
  ja3: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,23-0-16-11-17613-27-43-35-13-65037-51-18-65281-45-5-10-41,4588-29-23-24,0",
  ja4r: "t13d1517h2_002f,0035,009c,009d,1301,1302,1303,c013,c014,c02b,c02c,c02f,c030,cca8,cca9_0005,000a,000b,000d,0012,0017,001b,0023,0029,002b,002d,0033,44cd,fe0d,ff01_0403,0804,0401,0503,0805,0501,0806,0601",
  userAgent: "Twitter-iPhone/10.93.0-release.00 (iPhone; iOS 16.5.1; Scale/3.00)",
};

export default {
  android: {
    // beware! this might get your account locked when tweeting
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F",
    fingerprints: android_fingerprint,
  },
  iphone: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAAj4AQAAAAAAPraK64zCZ9CSzdLesbE7LB%2Bw4uE%3DVJQREvQNCZJNiz3rHO7lOXlkVOQkzzdsgu6wWgcazdMUaGoUGm",
    fingerprints: iphone_fingerprint,
  },
  ipad: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAGHtAgAAAAAA%2Bx7ILXNILCqkSGIzy6faIHZ9s3Q%3DQy97w6SIrzE7lQwPJEYQBsArEE2fC25caFwRBvAGi456G09vGR",
    fingerprints: iphone_fingerprint,
  },
  mac: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAIWCCAAAAAAA2C25AxqI%2BYCS7pdfJKRH8Xh19zA%3D8vpDZzPHaEJhd20MKVWp3UR38YoPpuTX7UD2cVYo3YNikubuxd",
    fingerprints: iphone_fingerprint,
  },
  old: {
    // v1.1 only - doesn't seem to work
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw",
    fingerprints: chrome_fingerprint,
  },
  web: {
    // requires transaction id
    bearer:
      "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    fingerprints: chrome_fingerprint,
  },
  tweetdeck: {
    // requires premium
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF",
    fingerprints: chrome_fingerprint,
  },
  advertisers: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAPnA9gAAAAAAZHpqKYoDdMCaqTUBktzAdK38BGk%3DLNsI9r2BHSjZ7cl5wD6Sh6NhxwZd2j8lXDSd6GDoQVYBlzx5Ff",
    fingerprints: chrome_fingerprint,
  },
  ads_manager_next: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAFsXTQEAAAAAGT1ZWWC51IF1Z8pIl9GKdGuGYtY%3Darf4lbyvoKjCUZfpLX90hOjVT1PqmxNH3arG6iOcb4XNlCvQxe",
    fingerprints: chrome_fingerprint,
  },
  advertiser_interface: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAFktLQEAAAAAidmFlKJvQR29CW13eg2VolZ3wy4%3DU2ufD1swpIdjuNtaIzloCW8VnUYsmyuTatng49FzHuRwEeDdKH",
    fingerprints: chrome_fingerprint,
  },
  corporate_cms: {
    // known by twitter employees
    bearer:
      "AAAAAAAAAAAAAAAAAAAAACHguwAAAAAAaSlT0G31NDEyg%2BSnBN5JuyKjMCU%3Dlhg0gv0nE7KKyiJNEAojQbn8Y3wJm1xidDK7VnKGBP4ByJwHPb",
    fingerprints: chrome_fingerprint,
  },
  ads_broken: {
    // doesn't work
    bearer:
      "AAAAAAAAAAAAAAAAAAAAAG5LOQEAAAAAbEKsIYYIhrfOQqm4H8u7xcahRkU%3Dz98HKmzbeXdKqBfUDmElcqYl0cmmKY9KdS2UoNIz3Phapgsowi",
    fingerprints: chrome_fingerprint,
  },
  audience_manager_internal: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAADLR6gAAAAAAVkXGYss9CqHyAQ%2FMecX43S1FhwA%3DYUynbBpK0xqHXNeDxFt3NkoFwkS45LTzvgE3CJTfRbQ3QOSO7f",
    fingerprints: chrome_fingerprint,
  },
  tweets_manager: {
    bearer:
      "AAAAAAAAAAAAAAAAAAAAADiN8wAAAAAAeBRmNg1NMB%2F4KdNvC%2FpQD0jjTEI%3Dosq5IVDr4azvJ2wThXtkMbGu8powFlXBRgQD9yTttGtygMk7ki",
    fingerprints: chrome_fingerprint,
  },
};
