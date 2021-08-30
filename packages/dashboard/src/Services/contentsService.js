import apiService from './apiService.js';

export const isValidURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

export const addNewContent = (urlData) => {
  const {url,title,image,amount, domain} = urlData
  if (!url) throw new Error('You need to enter a URL');
  if (!isValidURL(url)) throw new Error('Invalid URL');

  return apiService.put('/publisher/premiumContent', {
    url,
    title,
    image,
    amount,
    domain,
  })
}

export const previewNewUrl = (url) => {
  if (!url) throw new Error('You need to enter a URL');
  if (!isValidURL(url)) throw new Error('Invalid URL');

  return apiService.get(`/publisher/previewUrl?url=${url}`) 
}

export const deleteContent = (content) => apiService.delete(`/publisher/premiumContent?url=${content.url}`)
