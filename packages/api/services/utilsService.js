import puppeteer from 'puppeteer';
import NotOwnerError from '../errors/NotOwnerError.js';

const isWebOwner = async (page, publisherId) => {
  const scriptSrc = await page.evaluate(() => {
    const scriptTags = document.querySelectorAll('script');
    var scriptTagsArray = Array.prototype.slice.call(scriptTags);
    let monconScriptSrc = '';
    scriptTagsArray.forEach((script) => {
      if (script.src.indexOf('/moncon.js?id=') > 0) {
        monconScriptSrc = script.src;
      }
    });
    return monconScriptSrc;
  });

  return (scriptSrc.endsWith(`/moncon.js?id=${publisherId}`));
}

const getTitle = async (page) => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1 = document.querySelector('h1').innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2 = document.querySelector('h1').innerHTML;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};

const getDomainName = async (page, url) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace('www.', '')
    : new URL(url).hostname.replace('www.', '');
};

const urlImageIsAccessible = async (url) => {
  const correctedUrls = getUrls(url);
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers['content-type'];
    return new RegExp('image/*').test(contentType);
  }
};

const getImage = async (page, url) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]');
    if (
      twitterImg != null &&
      twitterImg.content.length > 0 &&
      (await urlImageIsAccessible(twitterImg.content))
    ) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 30 || img.naturalWidth <= 30) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach(img =>
        img.src.indexOf("//") === -1
          ? (img.src = `${new URL(url).origin}/${src}`)
          : img.src
      );
      return imgs[0]?.src || null;
    }
    return null;
  });
  return img;
};

export const getUrlData = async (url, publisherId) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  if (!await isWebOwner(page, publisherId)) {
    throw new NotOwnerError();
  }

  const data = await Promise.all([
    getTitle(page),
    getDomainName(page, url),
    getImage(page, url),
  ]);
  return {
    title: data[0],
    domain: data[1],
    image: data[2],
  };
}
