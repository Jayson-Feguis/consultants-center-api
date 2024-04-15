import { transformResponse, ValidationError } from "../../lib/utils.js";
import { getAnnouncementsCustomByAnnouncementId } from "./query.js";

export const getAnnouncementsCustomPerAnnouncementId = async (req, res) => {
  const { announcementId } = req.params

  if (!announcementId) throw Error(ValidationError('Announcement Id as parameter is required'))

  const announcements = await getAnnouncementsCustomByAnnouncementId(req.dbconnection, announcementId)

  res.status(200).json(transformResponse(announcements));
};
