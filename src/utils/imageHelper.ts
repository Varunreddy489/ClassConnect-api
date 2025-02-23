import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

import { supportedTypes } from "../config/supportedTypes";
import { UploadedFile } from "express-fileupload";

export const imageValidator = (size: number, mime: string) => {
  if (bytesToMb(size) > 5) {
    return "Image size too large";
  } else if (!Object.keys(supportedTypes).includes(mime)) {
    return "Invalid image type";
  }
  return null;
};

export const bytesToMb = (bytes: number) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNumber = () => {
  return uuidv4();
};

export const getImageUrl = (imgName: string) => {
  return `${process.env.APP_URL}/images/${imgName}`;
};

export const removeImage = (imageName: string) => {
  const path = process.cwd() + "/public/images/" + imageName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

// export const uploadImage = async (image: UploadedFile): Promise<string | null> => {
//   try {
//     if (!image || !image.name) throw new Error("Invalid image object");

//     const validationError = imageValidator(image.size, image.mimetype);
//     if (validationError) throw new Error(validationError);

//     const ext = path.extname(image.name);
//     const imageName = `${generateRandomNumber()}${ext}`;
//     const uploadPath = path.join(process.cwd(), "public", "images", imageName);

//     await fs.promises.writeFile(uploadPath, image.data);
//     return imageName;
//   } catch (error) {
//     console.error("Error during image upload:", error);
//     return null;
//   }
// };
