export function getFileList() {
    let files = localStorage.getItem("files")
    let fileList;
    if (files) {
        try {
            fileList = JSON.parse(atob(files))
        } catch (e) {
            let answer = prompt("there was an error loading your stash. if you wish to delete it and continue, type 'YES'.")
            if (answer == "YES") {
                fileList = {};
            }
        }
    } else {
        fileList = {};
    }
    if (!fileList) {
        alert("error loading stash")
    }
    return fileList
}

export function saveFileList(fileList) {
    localStorage.setItem("files", btoa(JSON.stringify(fileList)))
    alert("saved")
}