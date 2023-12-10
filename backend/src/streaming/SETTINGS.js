const PORT = 4000;
const PORT_io = 4001;
const TYPE_FILES_TO_GET = [
    'mp4',
    'webm',
    'mkv',
    'avi',
];

const pathSources = [
    '/home/giuseppe/Videos/tmp',
]
// Quanti livelli di profondità per recuperare i files
//      0       => path e tutte le sotto directory annidate
//      1       => solo root del path
//      >=2     => vari livelli di profondità
const DEEP_LEV = 0;


module.exports = {
    PORT: PORT,
    PORT_io: PORT_io,
    TYPE_FILES_TO_GET: TYPE_FILES_TO_GET,
    pathSources: pathSources,
    DEEP_LEV: DEEP_LEV,
}