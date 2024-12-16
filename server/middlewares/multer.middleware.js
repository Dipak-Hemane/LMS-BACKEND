import path from "path";

import multer from "multer";

const upload = multer({
    dest: "uploads/",
    limits: { filesize: 50 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cd) => {
            cd(null, file.originalname);
        },
    }),
    fileFilter: (_req, file, cd ) => {
        let ext = path.extname(file.originalname);

        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4"  
        ) {
            cd(new Error(`Unsupported file type! ${ext}`), false);
            return;
        }

        cd(null, true);
    },
});

export default upload;