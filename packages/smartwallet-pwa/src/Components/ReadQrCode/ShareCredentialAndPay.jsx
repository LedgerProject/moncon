import { useState } from 'react';
import ScanShare from "./ScanShare";
import ScanPayment from "./ScanPayment";

const ShareCredentialAndPay = ({ QrResponse, socket }) => {
  const [credential_verified,setCredential_verified] = useState(false);

  return (
    <>
      {
        !credential_verified
          ? 
            <ScanShare 
              QrResponse={QrResponse} 
              socket={socket} 
              setCredential_verified={setCredential_verified}
            />
          : 
            <ScanPayment QrResponse={QrResponse} socket={socket}/>
      }
    </>
  );
};
export default ShareCredentialAndPay;