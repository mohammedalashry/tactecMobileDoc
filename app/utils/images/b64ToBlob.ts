export const b64ToBlobUrl = async b64 => {
  const base64Response = await fetch(`data:image/jpeg;base64,${b64}`);

  const blob = await base64Response.blob();
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
};
