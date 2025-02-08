import QRCode from "qrcode";

export const generateQRCode = async (
  restaurantId: string,
  options: {
    size?: number;
    logo?: File;
  } = {},
) => {
  const { size = 200 } = options;

  try {
    // Create a URL that includes the restaurant ID
    const menuUrl = `${window.location.origin}/menu/${restaurantId}`;

    const qrDataUrl = await QRCode.toDataURL(menuUrl, {
      width: size,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
      quality: 1,
    });

    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
