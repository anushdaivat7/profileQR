// controllers/profileController.js
const Profile = require('../models/Profile');
const qr = require('qr-image');

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.id);
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    const profile = await Profile.createOrUpdate(req.user.id, profileData);
    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.getPublicProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generateQR = async (req, res) => {
  try {
    const profileUrl = `${process.env.FRONTEND_URL}/profile/${req.user.id}`;
    const qr_png = qr.image(profileUrl, { type: 'png' });
    
    res.setHeader('Content-type', 'image/png');
    qr_png.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile, getPublicProfile, generateQR };