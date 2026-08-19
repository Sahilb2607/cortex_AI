import multer from "multer";
import path from "path";
import fs from "fs";

const workingdir = path.resolve("./temp");
if (!fs.existsSync(workingdir)) {
  fs.mkdirSync(workingdir, { recursive: true });
  // recursive means if any parent in the path does not exist create it also
//   multer is a middleware
}
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, workingdir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    return cb(null, true);
  }

  return cb(new Error("Only PDF and Images are allowed."));
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
