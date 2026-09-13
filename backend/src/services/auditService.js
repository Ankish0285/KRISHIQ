import AuditLog from '../models/AuditLog.js';

const safeMetadata = (metadata = {}) => {
  const blocked = /password|otp|secret|token|api.?key|credential/i;
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !blocked.test(key)));
};

export const recordAudit = async ({ req, action, resourceType, resourceId = '', metadata = {} }) => {
  if (!req.user?._id) return;
  await AuditLog.create({
    action,
    actor: req.user._id,
    resourceType,
    resourceId: String(resourceId || ''),
    metadata: safeMetadata(metadata),
  });
};
