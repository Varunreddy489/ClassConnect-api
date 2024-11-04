import { UploadedFile } from "express-fileupload";
import { fileValidator } from "../utils/fileHelper";
import { generateRandomNumber } from "../utils/imageHelper";

export const fileService = async (
  id: any,
  model: any,
  file: UploadedFile | UploadedFile[]
) => {
  try {
    const validationMessage = Array.isArray(file)
      ? fileValidator(file[0].size, file[0].mimetype)
      : fileValidator(file?.size, file?.mimetype);

    if (validationMessage !== null) {
      return { error: { file: validationMessage } };
    }

    const fileExt = Array.isArray(file)
      ? file[0]?.name.split(".")
      : file?.name.split(".");
    const fileName = generateRandomNumber() + "." + fileExt[1];
    const uploadPath = process.cwd() + "/public/files/" + fileName;

    // Move the file to the destination
    if (Array.isArray(file)) {
      file.forEach((file: UploadedFile) => {
        file.mv(uploadPath, (err: any) => {
          if (err) throw err;
        });
      });
    } else {
      (file as UploadedFile).mv(uploadPath, (err: any) => {
        if (err) throw err;
      });
    }

    const updatedMessage = await model.update({
      where: { id: id },
      data: { fileUrl: fileName },
    });

    return { data: updatedMessage };
  } catch (error) {
    console.error("Error in fileService:", error);
    throw new Error("Internal server error");
  }
};
