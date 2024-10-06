import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File upload service
export const fileUploadService = async (req) => {
    try {
        const uploadedFile = req.files.file;
        const uploadPath = path.join(__dirname, '../../uploads/', Date.now() + "-" + uploadedFile.name);

        await uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return { status: true, data: "Error occurred while uploading the file." };
            }
        });
        return { status: true, data: "File uploaded successfully!" };
    } catch (error) {
        return { status: false, data: error.toString() };
    }
};

// File read service
export const fileReadService = async (req) => {
    try {
        const filename = req.params.fileName;
        return path.join(__dirname, '../../uploads/', filename)
    } catch (error) {
        return { status: false, data: error.toString() };
    }
};

// File delete service
export const fileDeleteService = async (req, res) => {
    try {
        const filename = req.params.fileName;
        const filePath = path.join(__dirname, '../../uploads/', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                res.status(500).send('Error Deleting File');
            }
        })
        return { status: true, data: "File deleted successfully!" };
    } catch (err) {
        return { status: false, data: err.toString() };
    }
};