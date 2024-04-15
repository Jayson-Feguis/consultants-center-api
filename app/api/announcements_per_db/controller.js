import { NotFoundError, transformResponse, uploadFileToS3, ValidationError } from "../../lib/utils.js";
import { createAnnouncementPerDb, updateAnnouncementPerDb, deleteAnnouncementPerDb, getAnnouncementsPerDb, getAnnouncementsPerDbByUserId } from "./query.js";
import { validateCreateAnnouncementPerDb, validateUpdateAnnouncementPerDb } from "./validation.js";
import { createMedia, getMediaById } from "../media/query.js";
import { ANNOUNCEMENT_CATEGORY } from "../../lib/constants.js";
import { createAnnouncementCustom, deleteAnnouncementCustomByAnnouncementId } from "../announcements_custom/query.js";

export const getAnnouncements = async (req, res) => {
  let announcements = await getAnnouncementsPerDb(req.dbconnection)

  announcements = await Promise.all(announcements.map(async announcement => {
    const [announcementImage] = await getMediaById(req.dbconnection, announcement.image)
    announcement.image = announcementImage ?? {}

    return announcement
  }))



  res.status(200).json(transformResponse(announcements));
};

export const getAnnouncementsByUserId = async (req, res) => {
  let announcements = await getAnnouncementsPerDbByUserId(req.dbconnection, req.user.id)

  announcements = await Promise.all(announcements.map(async announcement => {
    const [announcementImage] = await getMediaById(req.dbconnection, announcement.image)
    announcement.image = announcementImage ?? {}

    return announcement
  }))



  res.status(200).json(transformResponse(announcements));
};

export const createAnnouncements = async (req, res) => {
  await validateCreateAnnouncementPerDb(req.body)
  const { title, description, isCustom, receiver } = req.body

  const filePath = await uploadFileToS3(req.file)

  const media = await createMedia(req.dbconnection, filePath)

  const announcement = await createAnnouncementPerDb(req.dbconnection, title, description, media.insertId, isCustom === 'true' ? ANNOUNCEMENT_CATEGORY.CUSTOM : ANNOUNCEMENT_CATEGORY.ALL)

  if (isCustom) await Promise.all(receiver.map(async r => await createAnnouncementCustom(req.dbconnection, announcement.id, r)))



  res.status(201).json(announcement);
};

export const updateAnnouncements = async (req, res) => {
  await validateUpdateAnnouncementPerDb(req.body)
  const { title, description, isActive, isCustom, receiver } = req.body
  const { id } = req.params
  let media = null

  if (!id) throw Error(ValidationError('Announcement ID as parameter is required'))

  if (req.file) {
    const filePath = await uploadFileToS3(req.file)

    media = await createMedia(req.dbconnection, filePath)
    media = media.insertId
  }

  const announcement = await updateAnnouncementPerDb(req.dbconnection, id, title, description, media, isActive, isCustom === 'true' ? ANNOUNCEMENT_CATEGORY.CUSTOM : ANNOUNCEMENT_CATEGORY.ALL)

  await deleteAnnouncementCustomByAnnouncementId(req.dbconnection, id)

  if (isCustom) await Promise.all(receiver.map(async r => await createAnnouncementCustom(req.dbconnection, announcement.id, r)))



  res.status(200).json(announcement);
};

export const deleteAnnouncements = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Announcement ID as parameter is required'))

  const announcement = await deleteAnnouncementPerDb(req.dbconnection, id)

  if (announcement.affectedRows <= 0) throw Error(NotFoundError('Announcement is not found'))



  res.status(200).json({ message: 'Announcement deleted successfully' });
};