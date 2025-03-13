import { Http } from "@/services/http-common";

export function downloadUrl(
  url,
  name,
  extension,
) {
  return Http.get(url, {
    responseType: "blob",
  }).then((response) => {
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];
    a.download = isoDate + name + extension;
    a.click();
  }).catch((error) => {
    console.log("Error exporting to :", error);
  });
}