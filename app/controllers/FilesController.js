import {fileDeleteService, fileReadService, fileUploadService} from "../service/FileServices.js";

//file upload
export const singleFileUpload = async (req, res) => {
    let result = await fileUploadService(req)
    return res.json(result)
}

//file read
export const fileRead = async (req, res) => {
    let result = await fileReadService(req)
    return res.sendFile(result)
}

//file delete
export const fileDelete = async (req, res) => {
    let result = await fileDeleteService(req, res)
    return res.json(result)
}