const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const { Parser } = require('json2csv');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// create complaint (multipart/form-data)
router.post('/', auth, upload.array('images', 4), async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];
    const complaint = new Complaint({
      title, description,
      location: { type: 'Point', coordinates: [parseFloat(lng || 0), parseFloat(lat || 0)] },
      images,
      reporter: req.user.id
    });
    await complaint.save();
    res.json(complaint);
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// get complaints (admin -> all, citizen -> own)
router.get('/', auth, async (req, res) => {
  try {
    const q = req.user.role === 'admin' ? {} : { reporter: req.user.id };
    const complaints = await Complaint.find(q).populate('reporter', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// update status or assign (admin/staff)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role === 'citizen') return res.status(403).json({ msg: 'Forbidden' });
    const upd = req.body;
    const c = await Complaint.findByIdAndUpdate(req.params.id, { ...upd, updatedAt: new Date() }, { new: true });
    res.json(c);
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// export CSV (admin only)
router.get('/export/csv', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
    const complaints = await Complaint.find().populate('reporter', 'name email');
    const rows = complaints.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description,
      status: c.status,
      reporter: c.reporter ? c.reporter.email : '',
      createdAt: c.createdAt
    }));
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('complaints.csv');
    res.send(csv);
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
