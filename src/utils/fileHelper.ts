import { supportedTypes } from "../config/supportedTypes";
import { bytesToMb } from "./imageHelper";

export const fileValidator = (size: number, mime: string) => {
  if (bytesToMb(size) > 10) {
    return "File size too large";
  } else if (!Object.keys(supportedTypes).includes(mime)) {
    return "Invalid file type";
  }
  return null;
};
