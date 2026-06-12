import asyncHandler from '../utils/asyncHandler.js';
import adminService from '../services/admin.service.js';

export const dashboard = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await adminService.dashboard() });
});

export default {
  dashboard
};
