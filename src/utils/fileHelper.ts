import { UploadedFile } from "express-fileupload";
import { supportedTypes } from "../config/supportedTypes";
import { bytesToMb, generateRandomNumber } from "./imageHelper";
import path from "node:path";
import fs from "node:fs";

export const fileValidator = (size: number, mime: string) => {
  if (bytesToMb(size) > 10) {
    return "File size too large";
  } else if (!Object.keys(supportedTypes).includes(mime)) {
    return "Invalid file type";
  }
  return null;
};

export const uploadFile = async (
  file: UploadedFile | UploadedFile[]
): Promise<string | null> => {
  try {
    const files = Array.isArray(file) ? file : [file];
    const fileNames: string[] = [];

    for (const f of files) {
      if (!f || !f.name) {
        throw new Error("Invalid file object");
      }

      const validationError = fileValidator(f.size, f.mimetype);
      if (validationError) {
        throw new Error(validationError);
      }

      const ext = path.extname(f.name);
      const fileName = generateRandomNumber() + ext;
      const uploadPath = path.join(process.cwd(), "public", "files", fileName);

      // Save file using fs.promises
      await fs.promises.writeFile(uploadPath, f.data);
      fileNames.push(fileName);
    }

    // Return single filename if one file was uploaded, else join multiple filenames with commas
    return fileNames.length === 1 ? fileNames[0] : fileNames.join(",");
  } catch (error) {
    console.error("Error during file upload:", error);
    return null;
  }
};
