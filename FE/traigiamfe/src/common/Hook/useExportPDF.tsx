import { useNavigate } from "react-router-dom";
import { useLoading } from "./useLoading";

export const useExportPDF = () => {
  const { showLoading, closeLoading } = useLoading();
  const navigate = useNavigate();

  const isJSON = (str: string | undefined) => {
    if (!str) return false;
    try {
      const json = JSON.parse(str);
      return typeof json === "object";
    } catch (e) {
      return false;
    }
  };
  const handleDownload = async <T,>(config: {
    apiFunction: any;
    model: T;
    fileName?: string | ((result: any) => string);
    onError?: (result: any) => void;
    onCatchError?: (e: any) => void;
    includeParams?: boolean;
  }) => {
    try {
      showLoading();
      const { apiFunction, model, fileName, onError, includeParams } = config;

      const result = await apiFunction(model, {
        responseType: "arraybuffer",
        params: includeParams ? model : undefined,
      });

      if (result?.result === null) {
        onError?.(result);
        return;
      }

      const byteArray = new Uint8Array(result);
      const textDecoder = new TextDecoder("utf-8");
      const decodedString = textDecoder.decode(byteArray);
      const parsedObject = isJSON(decodedString)
        ? JSON.parse(decodedString)
        : undefined;
      if (
        (parsedObject && parsedObject.hasPermission === false) ||
        result?.hasPermission === false
      ) {
        closeLoading();
        navigate("/nopermission");
        onError?.(result);
        return;
      }

      const blob = new Blob([result], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      //   if (typeof fileName === "string") {
      //     a.download = fileName;
      //   } else {
      //     a.download = fileName(result);
      //   }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      //   handleError(e);
      config.onCatchError?.(e);
    } finally {
      closeLoading();
    }
  };

  return handleDownload;
};
