import apiService from "./apiService";
import toast, { Toaster } from "react-hot-toast";

export const get = async () => {
  apiService.get("/zenroom/public_key").then(function (response) {
    console.log(response);
  });
};

export const post = async (credentialSubject) => {
  try {
    return await apiService.post("zenroom/credentialIssuerSignRequest", {
      credentialSubject,
    });
  } catch (error) {
    toast.error("An error has occurred, check the data!");
    console.log(error.message);
    return (
      false && (
        <Toaster
          toastOptions={{ duration: 3000, style: { fontSize: "1.6rem" } }}
        />
      )
    );
  }
};
