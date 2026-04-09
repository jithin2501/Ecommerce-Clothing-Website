const SupportIssue = require('../models/SupportIssue');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../conf/s3');
const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

const uploadSupportFile = async (file) => {
  const ext = file.originalname.split('.').pop();
  const key = `support/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: 'inline',
  }));
  return `https://s3.${REGION}.amazonaws.com/${BUCKET}/${key}`;
};

exports.submitSupportIssue = async (req, res) => {
  try {
    const { userId, customerId, orderId, description } = req.body;
    const attachmentUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadSupportFile(file);
        const fileType = file.mimetype.startsWith('video/') ? 'video' : 'image';
        attachmentUrls.push({ url, fileType });
      }
    }

    const issue = await SupportIssue.create({
      userId,
      customerId,
      orderId,
      description,
      attachments: attachmentUrls
    });

    res.json({ success: true, data: issue });
  } catch (error) {
    console.error('submitSupportIssue error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit support issue' });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await SupportIssue.find().sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch support issues' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const issue = await SupportIssue.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update issue' });
  }
};
