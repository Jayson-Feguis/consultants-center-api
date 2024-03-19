import { transformResponse } from "../../lib/utils.js";
import { getMenusByRoleId, getMenusByUserId } from "./query.js";

export const getAllMenus = async (req, res) => {
  let menus = await getMenusByUserId(req.user.id)

  if (menus.length <= 0) menus = await getMenusByRoleId(req.user.role)

  res.json(transformResponse(menus));
};
