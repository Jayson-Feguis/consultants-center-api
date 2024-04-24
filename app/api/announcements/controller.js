import { NotFoundError, transformResponse, uploadFileToS3, ValidationError } from "../../lib/utils.js";
import { getAnnouncementsForAll, createAnnouncement, updateAnnouncement, deleteAnnouncement, getActiveAnnouncementsForAll } from "./query.js";
import { validateCreateAnnouncement, validateUpdateAnnouncement } from "./validation.js";
import { createMedia, getMediaById } from "../media/query.js";
import defaultDbConnection from '../../config/db.config.js'

export const getAnnouncements = async (req, res) => {
  let announcements = await getAnnouncementsForAll(defaultDbConnection, req.query)

  announcements = await Promise.all(announcements.map(async announcement => {
    const [announcementImage] = await getMediaById(defaultDbConnection, announcement.image)
    announcement.image = announcementImage ?? {}

    return announcement
  }))

  res.status(200).json(transformResponse(announcements));
};

export const getActiveAnnouncements = async (req, res) => {
  let announcements = await getActiveAnnouncementsForAll(defaultDbConnection)

  announcements = await Promise.all(announcements.map(async announcement => {
    const [announcementImage] = await getMediaById(defaultDbConnection, announcement.image)
    announcement.image = announcementImage ?? {}

    return announcement
  }))

  res.status(200).json(transformResponse(announcements));
};

export const createAnnouncements = async (req, res) => {
  await validateCreateAnnouncement(req.body)
  const { title, description, isActive } = req.body

  const filePath = await uploadFileToS3(req.file)

  const media = await createMedia(defaultDbConnection, filePath)

  const announcement = await createAnnouncement(defaultDbConnection, title, description, media.insertId, isActive)

  res.status(201).json(announcement);
};

export const updateAnnouncements = async (req, res) => {
  await validateUpdateAnnouncement(req.body)
  const { title, description, isActive } = req.body
  const { id } = req.params
  let media = null

  if (!id) throw Error(ValidationError('Announcement ID as parameter is required'))

  if (req.file) {
    const filePath = await uploadFileToS3(req.file)

    media = await createMedia(defaultDbConnection, filePath)
    media = media.insertId
  }

  const announcement = await updateAnnouncement(defaultDbConnection, id, title, description, media, isActive)

  res.status(200).json(announcement);
};

export const deleteAnnouncements = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Announcement ID as parameter is required'))

  const announcement = await deleteAnnouncement(defaultDbConnection, id)

  if (announcement.affectedRows <= 0) throw Error(NotFoundError('Announcement is not found'))

  res.status(200).json({ message: 'Announcement deleted successfully' });
};