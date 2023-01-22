const subirNivelesPath = (path, niveles) => {
    let dirName = path.split('\\');
    for (let i = 0; i < niveles; i++) {
        dirName.pop();
    }
    dirName = dirName.join('\\');
    return dirName;
};

module.exports = {
    subirNivelesPath
};