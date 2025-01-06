import fs from "node:fs";
import path from "node:path";
import { UploadedFile } from "express-fileupload";

import { generateRandomNumber, imageValidator } from "../utils/imageHelper";

export const imageService = async (
  id: number | string,
  model: any,
  profile: UploadedFile | UploadedFile[]
): Promise<{ data?: any; error?: { profile: string } }> => {
  try {
    const validationMessage = Array.isArray(profile)
      ? imageValidator(profile[0].size, profile[0].mimetype)
      : imageValidator(profile.size, profile.mimetype);

    if (validationMessage) {
      return { error: { profile: validationMessage } };
    }

    const ext = path.extname(
      Array.isArray(profile) ? profile[0].name : profile.name
    );
    const imgName = `${generateRandomNumber()}${ext}`;
    const uploadPath = path.join(process.cwd(), "public", "images", imgName);

    if (Array.isArray(profile)) {
      await Promise.all(
        profile.map(async (file) => {
          await fs.promises.writeFile(uploadPath, file.data);
        })
      );
    } else {
      await fs.promises.writeFile(uploadPath, profile.data);
    }

    const updatedProfile = await model.update({
      where: { id },
      data: { profilePic: imgName },
    });

    return { data: updatedProfile };
  } catch (error) {
    console.error("Error in imageService:", error);
    throw new Error("Internal server error");
  }
};
