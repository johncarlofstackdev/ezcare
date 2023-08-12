import { auth, db, storage } from "../../config"

const uploadFile = async (fileUri, fileName) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // rename file with timestamp and default name
    const splitedName = fileName.split(".")
    const newFileName = "file-" + Date.now() + "." + splitedName[splitedName.length - 1];

    // reference where to store the renamed file
    const ref = storage.ref().child(`profile/${newFileName}`);

    // upload file to firebase storage
    await ref.put(blob);

    // return donwload URL
    // return await ref.getDownloadURL();
    return newFileName;
};

export default uploadFile;