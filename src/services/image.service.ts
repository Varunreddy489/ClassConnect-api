import { UploadedFile } from "express-fileupload";
import { generateRandomNumber, imageValidator } from "../utils/imageHelper";
import path from "node:path";
import fs from "node:fs";

// export const imageService = async (
//   id: any,
//   model: any,
//   profile: UploadedFile | UploadedFile[]
// ) => {
//   try {
//     const message = Array.isArray(profile)
//       ? imageValidator(profile[0].size, profile[0].mimetype)
//       : imageValidator(profile?.size, profile?.mimetype);

//     if (message !== null) {
//       return { error: { profile: message } };
//     }

//     const imgExt = Array.isArray(profile)
//       ? profile[0]?.name.split(".")
//       : profile?.name.split(".");
//     const imgName = generateRandomNumber() + "." + imgExt[1];
//     const uploadPath = process.cwd() + "/public/images/" + imgName;

    
//     if (Array.isArray(profile)) {
//       profile.forEach((file: UploadedFile) => {
//         file.mv(uploadPath, (err: any) => {
//           if (err) throw err;
//         });
//       });
//     } else {
//       (profile as UploadedFile).mv(uploadPath, (err: any) => {
//         if (err) throw err;
//       });
//     }

//     const updatedProfile = await model.update({
//       where: { id: id },
//       data: { profilePic: imgName },
//     });

//     return { data: updatedProfile };
//   } catch (error) {
//     console.error("Error in imageService:", error);
//     throw new Error("Internal server error");
//   }
// };


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

    const ext = path.extname(Array.isArray(profile) ? profile[0].name : profile.name);
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
