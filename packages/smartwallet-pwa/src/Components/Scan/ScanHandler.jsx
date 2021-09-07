import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";
import { LS_USER_KEY, LS_DID_KEY } from "../../Const";
import ReadQrCode from "../ReadQrCode";
import ShareCredentialAndPay from "../ReadQrCode/ShareCredentialAndPay";
import ScanPayment from "../ReadQrCode/ScanPayment";
import ScanShare from "../ReadQrCode/ScanShare";

const ScanHandler = ({ socket, display }) => {
  const [QrScan, setQrScan] = useState(false);
  const [QrResponse, setQrResponse] = useState({});
  const [hideQrReader, setHideQrReader] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [QrType, setQrType] = useState("");
  const { addToast } = useToasts();
  const history = useHistory();

  useEffect(() => {
    if (Object.keys(QrResponse).length > 0) {
      //indicates that the scanner output has data
      setQrScan(true);
      //hide the qr scanner
      setHideQrReader(true);
    }
  }, [QrResponse]);

  useEffect(() => {
    if (Object.keys(QrResponse).length > 0) {
      //set the type of action
      setQrType(QrResponse.type);
    }
  }, [QrResponse]);

  useEffect(() => {
    if (Object.keys(QrResponse).length > 0) {
      //check if the content is already purcharsed
      const userInfo = JSON.parse(localStorage.getItem(LS_USER_KEY));
      const articles = userInfo.articles;
      const match = articles.find(
        (article) => article.url === QrResponse.content.url
      );
      if (!match) {
        return;
      }
      const userId = localStorage.getItem(LS_DID_KEY);
      const data = {
        idProvider: QrResponse.idProvider,
        id: socket.current.id,
        userId,
        room: QrResponse.room,
      };

      if (process.env.NODE_ENV == "development") {
        console.log("ScanHandler");
        console.log("emit login data", data);
      }

      //if the content is purchased emit an event with the user id
      //to the page to check it in the backend and keep or hide the paywall
      socket.current.emit("login", data);

      setIsPurchased(true);

      addToast("the content is already purchased", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      return history.push("/articles");
    }
  }, [QrResponse]);

  useEffect(() => {
    if (Object.keys(QrResponse).length > 0) {
      if (QrResponse.type == "payment") {
        return;
      }
      const credential = JSON.parse(localStorage.getItem(QrResponse.request));
      if (!credential) {
        if (process.env.NODE_ENV == "development") {
          console.log(
            "data.request in ScanHandler in useEffect",
            QrResponse.request
          );
        }
        addToast("Credential does not exist", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
        return history.push("/identity");
      }
    }
  }, [QrResponse]);

  return (
    <>
      {display && !hideQrReader && (
        <ReadQrCode
          socket={socket}
          QrResponse={QrResponse}
          setQrResponse={setQrResponse}
          QrScan={QrScan}
        />
      )}
      {QrScan &&
        !isPurchased &&
        {
          request_and_pay: (
            <ShareCredentialAndPay QrResponse={QrResponse} socket={socket} />
          ),
          request_credential: (
            <ScanShare QrResponse={QrResponse} socket={socket} />
          ),
          payment: <ScanPayment QrResponse={QrResponse} socket={socket} />,
        }[QrType]}
    </>
  );
};
export default ScanHandler;
