import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export interface UploadedFileDto {
  name: string;
  size: number;
  content: string;
  language: string;
  path?: string;
}

export class UploadController {
  public async handleUpload(req: Request, res: Response): Promise<void> {
    try {
      const files: Express.Multer.File[] = req.files as Express.Multer.File[] || [];
      const singleFile: Express.Multer.File | undefined = req.file;

      const fileList = singleFile ? [singleFile] : files;

      if (!fileList || fileList.length === 0) {
        res.status(400).json({ success: false, error: 'No files were uploaded' });
        return;
      }

      const processedFiles: UploadedFileDto[] = [];

      for (const f of fileList) {
        let content = '';
        try {
          content = fs.readFileSync(f.path, 'utf8');
        } catch {
          content = '// [Binary or unreadable file content]';
        }

        const ext = path.extname(f.originalname).toLowerCase().replace('.', '');
        const langMap: Record<string, string> = {
          java: 'java',
          py: 'python',
          cpp: 'cpp',
          c: 'cpp',
          h: 'cpp',
          hpp: 'cpp',
          js: 'javascript',
          ts: 'javascript',
          jsx: 'javascript',
          tsx: 'javascript',
          go: 'go',
          rs: 'rust',
        };

        processedFiles.push({
          name: f.originalname,
          size: f.size,
          content,
          language: langMap[ext] || 'text',
          path: f.path,
        });
      }

      res.status(200).json({
        success: true,
        message: `Successfully uploaded ${processedFiles.length} file(s)`,
        files: processedFiles,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'File upload failed' });
    }
  }
}

export const uploadController = new UploadController();
