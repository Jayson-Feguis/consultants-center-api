import { transformResponse, uploadFileToS3 } from "../../lib/utils.js";
import { createMedia } from "./query.js";

export const uploadSingleFile = async (req, res) => {
  const filePath = await uploadFileToS3(req.file)

  const media = await createMedia(req.dbconnection, filePath)

  res.status(201).json(transformResponse([{ id: media.insertId, filePath }]));
};
