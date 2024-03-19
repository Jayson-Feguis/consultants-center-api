import { transformResponse, uploadFileToS3 } from "../../lib/utils.js";
import { createMedia } from "./query.js";

export const uploadSingleFile = async (req, res) => {
  const filePath = await uploadFileToS3(req.file)

  const media = await createMedia(filePath)

  res.status(200).json(transformResponse([{ id: media.insertId, filePath }]));
};
