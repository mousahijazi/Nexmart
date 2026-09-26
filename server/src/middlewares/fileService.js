import fs from "fs/promises";
import path from "path";

const deleteFile = async (filePath) => {
  if (!filePath) return;

  const absolutePath = path.join(process.cwd(), filePath);

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const deleteFiles = async (filePaths = []) => {
  await Promise.all(
    filePaths.filter(Boolean).map((filePath) => deleteFile(filePath))
  );
};

export {
  deleteFile,
  deleteFiles,
};