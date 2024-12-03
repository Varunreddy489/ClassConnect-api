import cloudinary from "../config/cloudinary";

const cloudinaryService = async (file: { tempFilePath: string }) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error("Invalid file path");
    }

    const response = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    console.log(response);
    return response.secure_url;
  } catch (error) {
    console.error("error in cloudinary service", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export default cloudinaryService;
