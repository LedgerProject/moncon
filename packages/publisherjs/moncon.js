import { v4 as uuidv4 } from "uuid";
import QRCodeStyling from "qr-code-styling";
import io from "socket.io-client";
import { DateTime, Interval } from "luxon";

const LS_KEY_ID = "did";

const apiBaseUrl = process.env.MONCON_API_BASE_URL;
const socket = io(process.env.MONCON_API_BASE_URL_SOCKET);

const NORMALIZE_AMOUNT = 100;
const AMOUNT_TO_DISPLAY = (amount) => amount / NORMALIZE_AMOUNT;
const AMOUNT_TO_STORE = (amount) => amount * NORMALIZE_AMOUNT;

const currentScriptSrc = document.currentScript.src;
const queryString = currentScriptSrc.substring(currentScriptSrc.indexOf("?"));
const urlParams = new URLSearchParams(queryString);
const publisherId = urlParams.get("id");
const sessionId = uuidv4();
const url =
  window.location.protocol +
  "//" +
  window.location.host +
  window.location.pathname;
let stripeAccountId;
let userId = localStorage.getItem(LS_KEY_ID);
const token = new URLSearchParams(window.location.search).get("token");
let content;
const LEGAL_AGE = "LEGAL_AGE";
const UNDERAGE = "UNDERAGE";
const NO_CREDENTIAL = "NO_CREDENTIAL";
let condition = false;
let initialLoad = true;
let qr = false;
let request;
let type;
let contentNode;
let contentNodeInnerHtml;

socket.on("connect", () => {
  console.log(socket.id);
  if (initialLoad) {
    initialLoad = false;
    sendPageView(userId);
  }
});

socket.on("contentInfoRequest", (data) => {
  console.log("contentInfoRequest data");
  console.table(data);
  if (data.userId) {
    console.log(userId);
    userId = data.userId;
    localStorage.setItem(LS_KEY_ID, userId);
    sendPageView(data.userId);
  }
  socket.emit("sendContentInfo",{
    ...data, 
    stripeAccountId, 
    hostname: window.location.hostname,
    request,
    content:{
      ...content,
      amount: AMOUNT_TO_DISPLAY(content.amount),
    },
    type,
  });
});

socket.on("onLogin", (data) => {
  console.log("onLogin data");
  console.table(data);
  if (data.userId) {
    console.log(userId);
    userId = data.userId;
    localStorage.setItem(LS_KEY_ID, userId);
    sendPageView(data.userId, true);
  }
});

socket.on("paymentResponse", (data) => {
  console.log(data.userId, "data.userId");
  userId = data.userId;
  localStorage.setItem(LS_KEY_ID, userId);

  console.log("paymentResponse data: ");
  console.table(data);

  let apiUrl = apiBaseUrl + "/js/purchase";

  let body = {
    ...data,
    publisherId,
  };

  console.log(body, "body ", userId, "userId");

  fetch(apiUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response, "response of js/purchase");
      sendPageView(userId, true);
      let responseData = { ...data, paymentValidated: true };
      socket.emit("validatedPayment", responseData);
    })
    .catch((response) => {
      let errorContent = {
        id: data.id,
        message: response.error,
        idProvider: socket.id,
        hostname: window.location.hostname,
        paymentValidated: false,
      };
      console.log(response);
      console.log(response.error.message);
      console.log(response.error);
      console.table(errorContent);
      socket.emit("notificationMessages", errorContent);
    });
});

socket.on("webCredentialResponse", (data) => {
  console.log("webCredentialResponse", data);
  if(!data.credential){
    let responseData = {
      id: data.id,
      room,
      idProvider: socket.id,
      hostname: window.location.hostname,
      validated: false,
    };
    return socket.emit("validatedCredential", responseData);
  }

  if(content.verification_type == 'zkp'){
    handleZkpProof(data);
  }else if(content.verification_type == 'w3c') {
    handleW3cCredential(data);
  }
  
});

function handleZkpProof(data) {
  
  if (content.age === NO_CREDENTIAL) {
    return;
  }

  const localUserId = data.userId;
  userId = localUserId;
  localStorage.setItem(LS_KEY_ID, userId);
  
  const apiUrl = `${apiBaseUrl}/zenroom/zkp-verify?did=${data.issuer_did}`

  const body = JSON.stringify({
    credential_proof: data.credential.credential_proof,
    claim: content.age.toLowerCase()
  });

  const state = fetch(apiUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      console.log(response, "credential");
      let responseData = {
        ...data,
        id: data.id,
        idProvider: socket.id,
        hostname: window.location.hostname,
      };

      if (response.verifyZkp) {
        responseData.validated = true;
        if (content?.amount == 0) {
          let apiUrl = apiBaseUrl + "/js/credential";

          let body = {
            ...data,
            publisherId,
            userId,
            contentId: content.id,
          };

          console.log(body, "body ", userId, "userId");

          fetch(apiUrl, {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((response) => {
              console.log(response, "response of js/credential");
              sendPageView(userId, true);
              return socket.emit("validatedCredential", responseData);
            })
            .catch((response) => {
              console.log(response);
              return
            });
        }
        return socket.emit("validatedCredential", responseData);
      }
      else {
        console.log(response);
        responseData.validated = false;
        return socket.emit("validatedCredential", responseData);
      }
    })
    .catch((response) => {
      let responseData = {
        ...data,
        id: data.id,
        idProvider: socket.id,
        hostname: window.location.hostname,
        validated: false
      };
      console.log(response, "falloo");
      return socket.emit("validatedCredential", responseData);
    });
}

function handleW3cCredential(data){

  if (content.age === NO_CREDENTIAL) {
    return;
  }

  const body = {
    credential: data?.credential,
  };

  const apiUrl = `${apiBaseUrl}/zenroom/w3c-verify?did=${data.issuer_did}`

  console.log(apiUrl, "apiUrl");

  let responseData = {
    ...data,
    id: data.id,
    idProvider: socket.id,
    hostname: window.location.hostname,
  };

  fetch(apiUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response, "credential");

      if (response.verifyVC) {
        const localUserId = data?.credential["my-vc"]?.credentialSubject?.id;
        console.log(userId);

        userId = localUserId;
        localStorage.setItem(LS_KEY_ID, userId);

        const birthDate =
          data?.credential["my-vc"].credentialSubject.credential?.birthday;
        if (!birthDate) {
          return alert("Invalid credential");
        }

        const now = DateTime.now();
        const birthD = DateTime.fromISO(birthDate.split("-").reverse().join("-"));
        const interval = Interval.fromDateTimes(birthD, now);
        console.log(interval.length("years"));


        if (!interval.isValid) {
          responseData.validated = false;
          alert(interval.invalidExplanation);
          console.log(interval.invalidExplanation);
          return socket.emit("validatedCredential", responseData);
        }

        console.log("legal_age", interval.length("years") >= 18);
        console.log("underage", interval.length("years") < 18);

        const localCondition =
          content.age === LEGAL_AGE
            ? interval.length("years") >= 18
            : interval.length("years") < 18;

        console.log("localCondition", localCondition);

        if (localCondition) {
          condition = true;
          responseData.validated = true;
          if (content?.amount == 0) {
            let apiUrl = apiBaseUrl + "/js/credential";

            let body = {
              ...data,
              publisherId,
              userId,
              contentId: content.id,
            };

            console.log(body, "body ", userId, "userId");

            fetch(apiUrl, {
              method: "post",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            })
              .then((response) => response.json())
              .then((response) => {
                console.log(response, "response of js/credential");
                sendPageView(userId, true);
                return socket.emit("validatedCredential", responseData);
              })
              .catch((response) => {
                console.log(response);
              });
            return;
          }
          return socket.emit("validatedCredential", responseData);
        } else {
          responseData.validated = false;
          socket.emit("validatedCredential", responseData);
        }
      }
      else {
        console.log(response)
        responseData.validated = false;
        return socket.emit("validatedCredential", responseData);
      }
    })
    .catch((response) => {
      console.log(response, "falloo");
      responseData.validated = false;
      return socket.emit("validatedCredential", responseData);
    });

}

socket.on("disconnect", () => {
});

function sendPageView(userId_, justPurchased, onlyCredential) {
  console.log(justPurchased, userId_, "justPurchased");
  let apiUrl = apiBaseUrl + "/js/pageview";
  let body = {
    publisherId,
    url,
    sessionId,
    token,
  };
  if (userId_) {
    body.userId = userId_;
  }
  if (justPurchased) {
    body.justPurchased = true;
  }
  if (onlyCredential) {
    body.onlyCredential = true;
  }
  fetch(apiUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      const { isPremium, isLoggedIn, isPurchased, userBalance } = response;
      console.log(response, "response");
      const { contentIdType, contentIdValue } = response;
      if (isPremium && !isPurchased) {
        content = response.content;

        stripeAccountId = response.stripeAccountId;
        console.log(content);
        if(!qr){
          showMonconLayer(contentIdType, contentIdValue);
          if (content.age === NO_CREDENTIAL) {
            showQrCode("payment",null,contentIdType);
          } else if (
            content.age !== NO_CREDENTIAL &&
            !condition &&
            content.amount > 0
          ) {
            showQrCode("request_and_pay", "credential_birthday",contentIdType);
          } else if (
            content.age !== NO_CREDENTIAL &&
            !condition &&
            content.amount === 0
          ) {
            showQrCode("request_credential", "credential_birthday",contentIdType);
          }
        }
      } else {
        hideMonconLayer(contentIdType);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function purchase() {
  fetch(apiBaseUrl + "/js/purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publisherId,
      contentId: content.id,
    }),
  }).then(() => {
    sendPageView(userId, true);
  });
}

function showMonconLayer(contentIdType,ContentIdValue) {
  let htmlString = `
  <div ${contentIdType !== 'default'? '':'id="moncon-wrapper"'}>
    <div ${contentIdType !== 'default'? 'id="moncon-content-active"':'id="moncon-content"'}></div>
  </div>
  `;
  let divLayer = document.createElement("div");
  divLayer.id = "moncon-block";

  if(contentIdType !== 'default'){
    divLayer.classList = 'moncon-block-active';
  }

  console.table({contentIdType,ContentIdValue})
  divLayer.innerHTML = htmlString.trim();
  
  if(contentIdType == "default"){
    divLayer.style.height = document.body.offsetHeight + "px";
    document.body.appendChild(divLayer);
  }
  else if(contentIdType == "id"){
    contentNode = document.getElementById(ContentIdValue);
    divLayer.style.height = (contentNode.parentNode.offsetHeight + 300) + "px";
    contentNodeInnerHtml = contentNode.innerHTML;
    contentNode.innerHTML = "";
    contentNode.appendChild(divLayer);
  }
  else if(contentIdType == 'class'){
    contentNode = document.getElementsByClassName(ContentIdValue)[0];
    divLayer.style.height = (contentNode.parentNode.offsetHeight + 300) + "px";
    contentNodeInnerHtml = contentNode.innerHTML;
    contentNode.innerHTML = "";
    contentNode.appendChild(divLayer);
  }
  else if(contentIdType == 'tag'){
    contentNode = document.getElementsByTagName(ContentIdValue)[0];
    divLayer.style.height = (contentNode.parentNode.offsetHeight + 300) + "px";
    contentNodeInnerHtml = contentNode.innerHTML;
    contentNode.innerHTML = "";
    contentNode.appendChild(divLayer);
  }
  
  divLayer.style.display = "block";
}

function hideMonconLayer(contentIdType) {
  const monconBlock = document.getElementById("moncon-block");
  monconBlock.style.display = "none";
  if(contentIdType == 'default'){
    monconBlock.setAttribute("aria-hidden", false);
    return document.body.classList.remove("stop-scrolling");
  }
  contentNode.removeChild(monconBlock);
  contentNode.innerHTML = contentNodeInnerHtml;
}

function getBrowserLocale() {
  return navigator.language || "en-US";
}

function getContentPrice() {

  return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(content.amount || 0);
}


function showQrCode(_type, _request, contentIdType) {
  type = _type;
  request = _request;

  qr = true;

  const data = {
    idProvider: socket.id,
  };

  console.log(data);
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: JSON.stringify(data),
    image:
      "https://pbs.twimg.com/profile_images/1356260647642796035/qPlwhss9_400x400.jpg",
    dotsOptions: { type: "dots", color: "#6a1a4c" },
    cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
    backgroundOptions: {
      color: "#e9ebee",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
    },
  });

  const title = {
    request_and_pay: `If you meet the ${
      content.age === LEGAL_AGE ? "legal age" : "underage"
    } scan the QR code to unlock this content for ${getContentPrice()} .`,
    request_credential: `If you meet the ${
      content.age === LEGAL_AGE ? "legal age" : "underage"
    } scan the QR code to unlock this content.`,
    payment: `Scan the QR code to unlock this content for ${getContentPrice()} .`,
  };
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


  const htmlActive = `  
  <aside class="moncon-active">
  <div id="moncon-content-active">
    <div id="moncont-step-active-logo">
      <img src="${process.env.MONCON_IMAGE_URL}" alt="logo" class="logo"/>
    </div>
      <div id="moncon-step-title-active">
        ${title[type]}
      </div>     
        <div class="content-qr">
            <div id="canvas"></div>
        </div>
    <div id="moncon-step-description-active">
      Use your
      <a href="${process.env.MONCON_PWA_URL}" id="moncon-link-active" target="blank"> moncon wallet</a>
    </div>
        </div>
    </aside> 
  `;

  var divLayer = document.createElement("div");
  divLayer.id = "moncon-step1";
  divLayer.innerHTML = htmlStep1.trim();
  const monconBlock = document.getElementById("moncon-block");
  let contentDiv = monconBlock.childNodes[0].getElementsByTagName('div')[0];
  console.log(contentDiv)
  if(contentIdType == 'default'){
    monconBlock.setAttribute("aria-hidden", true);
    document.body.classList.add("stop-scrolling");
  }
  contentDiv.appendChild(divLayer);
  qrCode.append(document.getElementById("canvas"));
}
