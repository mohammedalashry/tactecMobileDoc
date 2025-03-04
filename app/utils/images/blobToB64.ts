const convertBlobToBase64 = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export const blobToB64 = blobUrl => {
  return new Promise((RESOLVE, REJECT) => {
    fetch(blobUrl)
      .then(r => r.blob())
      .then(decodedBlob => {
        convertBlobToBase64(decodedBlob).then(base64String => {
          RESOLVE(base64String);
        });
      })
      .catch(err => {
        REJECT(err);
      });
  });
};
