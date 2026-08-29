import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Handle multiple or single file uploads
router.post('/', uploadMiddleware.array('files', 50), (req, res) => uploadController.handleUpload(req, res));
router.post('/single', uploadMiddleware.single('file'), (req, res) => uploadController.handleUpload(req, res));

export default router;
