import { v4 as uuidv4 } from 'uuid';
import QRCodeStyling from "qr-code-styling";
import io from 'socket.io-client';
import { DateTime, Interval } from "luxon";

const LS_KEY_ID = 'did';

const apiBaseUrl = process.env.MONCON_API_BASE_URL;
const socket = io(process.env.MONCON_API_BASE_URL_SOCKET);

const NORMALIZE_AMOUNT = 100;
const AMOUNT_TO_DISPLAY = (amount) => amount / NORMALIZE_AMOUNT;
const AMOUNT_TO_STORE = (amount) => amount * NORMALIZE_AMOUNT;

const currentScriptSrc = document.currentScript.src;
const queryString = currentScriptSrc.substring(currentScriptSrc.indexOf('?'));
const urlParams = new URLSearchParams(queryString);
const publisherId = urlParams.get('id');
const sessionId = uuidv4();
const room = uuidv4();
const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
let stripeAccountId;
let userId = localStorage.getItem(LS_KEY_ID)
const token = new URLSearchParams(window.location.search).get('token');
let content;
let legalAge = false;
let initialLoad = true;

socket.on('connect', () => {  
  console.log(socket.id);  
  if (initialLoad) {
    initialLoad = false;
    sendPageView(userId);
  }
});

socket.on('onLogin', (data) => {  
  console.log('onLogin data');
  console.table(data);  
  if (data.userId) {
    console.log(userId);
    if(!userId){
      userId = data.userId;
      localStorage.setItem(LS_KEY_ID,userId);
    }
    sendPageView(data.userId,true);
  }
});

socket.on('paymentResponse',(data) => {
  
  console.log(data.userId,'data.userId');
  if(!!userId){
    userId = data.userId;
    localStorage.setItem(LS_KEY_ID,userId);
  }

  console.log('paymentResponse data: ');
  console.table(data)
  
  let apiUrl = apiBaseUrl + '/js/purchase';

  let body = {
    ...data,
    publisherId
  }
  

  console.log(body , 'body ',userId,'userId');

  fetch(apiUrl, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => response.json())
    .then((response) =>{
      console.log(response,'response');
      sendPageView(userId, true);

    }).catch((response) => {
      let errorContent = {
        id: data.id,
        message: response.error,
        idProvider: socket.id,      
        hostname: window.location.hostname,
        room,
      }
      console.log(response);
      console.log(response.error.message)
      console.log(response.error)
      console.table(errorContent)
      socket.emit('notificationMessages',errorContent)
    })
})

socket.on('disconnect', () => {
  //setIsConnected(false);
});

socket.on('webCredentialResponse',(data) => {  
  console.log('webCredentialResponse',data);
  const localUserId = data?.credential['my-vc']?.credentialSubject?.id
  console.log(userId);
  if(localUserId && !userId){
    localStorage.setItem(LS_KEY_ID,userId);
    userId = localUserId;
  }
  const birthDate = data?.credential["my-vc"].credentialSubject.credential?.birthday;    
  if(!birthDate){    
    alert('Invalid credential')
  }
  const now = DateTime.now();
  const birthD = DateTime.fromISO('09-12-1991'.split('-').reverse().join('-'))  
  const interval = Interval.fromDateTimes(birthD,now)
  console.log(interval.length('years') );
  let responseData = {
    id: data.id,
    room,
    idProvider: socket.id,      
    hostname: window.location.hostname,
  }
  if(!interval.isValid){
    responseData.validated = false;        
    alert(interval.invalidExplanation);
    console.log(interval.invalidExplanation);
    socket.emit('validatedCredential',responseData);
  }

  if(interval.length('years') >= 18){
    legalAge=true;
    responseData.validated = true;
    socket.emit('validatedCredential',responseData);
    if(content?.amount == 0){
      hideMonconLayer()
    }
  }else{
    responseData.validated = false;
    socket.emit('validatedCredential',responseData);
  }

}) 

function sendPageView(userId_, justPurchased,onlyCredential) {
  console.log(justPurchased,userId_,'justPurchased');
  let apiUrl = apiBaseUrl + '/js/pageview';
  let body = {
    publisherId,
    url,
    sessionId,
    token,
  }
  if (userId_) {
    body.userId = userId_;
  }
  if (justPurchased) {
    body.justPurchased = true;
  }
  if(onlyCredential){
    body.onlyCredential = true;
  }
  fetch(apiUrl, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then((response) => response.json())
    .then((response) => {
      const { isPremium, isLoggedIn, isPurchased, userBalance } = response;
      console.log(response,'response');
      if (isPremium && !isPurchased) {
        content = response.content;
        stripeAccountId = response.stripeAccountId
        console.log(content);
        showMonconLayer();
        if(content.age === 'MINOR'){
          showQrCode('payment');
        }
        else if(content.age === 'LEGAL_AGE' && !legalAge && content.amount > 0){
          showQrCode('request_and_pay','credential_birthday');
        }else if(content.age === 'LEGAL_AGE' && !legalAge && content.amount === 0){
          showQrCode('request_credential','credential_birthday');
        }
      } else {
        hideMonconLayer();
      }
    }).catch(err => {
      console.log(err);
    });
}
function purchase() {

  fetch(apiBaseUrl + '/js/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publisherId,
      contentId: content.id,
    }),
  })
  .then(() => {
    sendPageView(userId, true);
  });
}

function showMonconLayer() {
  document.getElementById('moncon-block').style.display = 'block';
}

function hideMonconLayer() {
  document.getElementById('moncon-block').style.display = 'none';
  const monconBlock = document.getElementById('moncon-block');
  monconBlock.setAttribute('aria-hidden', false);
  document.body.classList.remove('stop-scrolling')
}

function getBrowserLocale() {
  return navigator.language || 'en-US';
}

function getContentPrice() {
  return new Intl.NumberFormat(getBrowserLocale(), {style: 'currency', currency: content.currency}).format((content.amount) || 0)
}

function showQrCode(type, request) {
  const localContent = Object(content);
  localContent.amount = AMOUNT_TO_DISPLAY(localContent.amount);

  const data = {
      idProvider: socket.id,      
      hostname: window.location.hostname,
      type: type,
      room,
      content: localContent,
      stripeAccountId
  }
  
  if(request){
    data.request = request;
  }

  console.log(data);
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: JSON.stringify(data),
    image: "https://pbs.twimg.com/profile_images/1356260647642796035/qPlwhss9_400x400.jpg",
    dotsOptions: { type: "dots", color: "#6a1a4c" },
    cornersSquareOptions: { type: "extra-rounded", color: "#000000" },    
    backgroundOptions: {
        color: "#e9ebee",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
    
});

  const title = {
    request_and_pay: `If you meet the legal age scan the QR code to unlock this content for ${getContentPrice()}.`,
    request_credential: 'If you meet the legal age scan the QR code to unlock this content.',
    payment: `Scan the QR code to unlock this content for ${getContentPrice()}.`,
  }
  const htmlStep1 = `  
  
  <div id="moncon-step1-logo">
      <span></span>
      <img src="${process.env.MONCON_IMAGE_URL}" />
    </div>    
    <div id="moncon-step1-title">
    ${title[type]}
    </div>
    <div id="canvas"></div>  
    <div id="moncon-step1-description">
      Use your
      <a href="${process.env.MONCON_PWA_URL}" id="moncon-link" target="blank">moncon wallet</a>
    </div>
  `;

  var divLayer = document.createElement('div');
  divLayer.id = 'moncon-step1';
  divLayer.innerHTML = htmlStep1.trim();
  const contentDiv = document.getElementById('moncon-content');
  const monconBlock = document.getElementById('moncon-block');
  monconBlock.setAttribute('aria-hidden', true);
  document.body.classList.add('stop-scrolling')
  contentDiv.appendChild(divLayer);
  qrCode.append(document.getElementById("canvas"));
}

var htmlString = `
  <div id="moncon-wrapper">
    <div id="moncon-content"></div>
  </div>
`;
var divLayer = document.createElement('div');
divLayer.id = 'moncon-block';
divLayer.style.height = document.body.offsetHeight + 'px';
divLayer.innerHTML = htmlString.trim();
document.body.appendChild(divLayer);
