import { UploadedFile } from "express-fileupload";
import { generateRandomNumber, imageValidator } from "../utils/imageHelper";

export const imageService = async (
  id: any,
  model: any,
  profile: UploadedFile | UploadedFile[]
) => {
  try {
    const message = Array.isArray(profile)
      ? imageValidator(profile[0].size, profile[0].mimetype)
      : imageValidator(profile?.size, profile?.mimetype);

    if (message !== null) {
      return { error: { profile: message } };
    }

    // Extract file extension and generate a unique image name
    const imgExt = Array.isArray(profile)
      ? profile[0]?.name.split(".")
      : profile?.name.split(".");
    const imgName = generateRandomNumber() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imgName;

    // Move the image file to the destination
    if (Array.isArray(profile)) {
      profile.forEach((file: UploadedFile) => {
        file.mv(uploadPath, (err: any) => {
          if (err) throw err;
        });
      });
    } else {
      (profile as UploadedFile).mv(uploadPath, (err: any) => {
        if (err) throw err;
      });
    }

    const updatedProfile = await model.update({
      where: { id: id },
      data: { profilePic: imgName },
    });

    return { data: updatedProfile };
  } catch (error) {
    console.error("Error in imageService:", error);
    throw new Error("Internal server error");
  }
};
