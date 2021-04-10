const fs = require('fs');
const path = require('path');
let fileTree = [],routes = []

function readDir(dir, fileTree, fileKey) {
    try {
        let files =  fs.readdirSync(path.resolve(__dirname, dir))
        files.forEach(file => {
            let childFileDir = `${dir}\\${file}`
            let stat = fs.statSync(path.resolve(__dirname, childFileDir))
            if(stat.isDirectory()) {
                console.log('isDirectory', file)
                let treeKey = file.split('.')[0]

                if(fileKey) {
                    fileTree.forEach(v => {
                        if(Object.prototype.toString.call(v) === '[object Object]') {
                            Object.keys(v).find(key => {
                                if(key == fileKey) {
                                    v[key].push({[treeKey]: []})
                                    readDir(childFileDir, v[key], treeKey)
                                    return true
                                }
                            })
                        }
                    })       
                } else {
                    fileTree.push({[treeKey]: []})
                    readDir(childFileDir, fileTree, treeKey)
                }
            } else {
                console.log('noDirectory', file)
                if(file.includes('.vue')) {
                    if(fileKey) {
                        fileTree.forEach(v => {
                            if(Object.prototype.toString.call(v) === '[object Object]') {
                                if(Object.keys(v)[0] == fileKey) {
                                    v[fileKey].push(file)
                                }
                            }
                        })
                    } else {
                        fileTree.push(file)
                    }
                }
            }
        })
    } catch (error) {
        console.log('error', error)
    }
}
function getRoutes(path, fileTree) {
    fileTree.forEach(file => {
        let route = { path: '', component: null }
        if(Object.prototype.toString.call(file) === '[object String]') {
            let fileName = file.split('.')[0]
            console.log('fileName', fileName)
            let routePath = (path[path.length - 1] == '/' && path.length > 1 && fileName == 'index') ? path.slice(0, path.length - 1) : path
            let splitPaths = routePath.split('/')
            splitPaths.forEach((s,i) => {
                if(s[0] == '_') {
                    console.log('s', s)
                    splitPaths[i] = s.replace(/_/,':')
                }
            })
            routePath = splitPaths.join('/')
            if(fileName == 'index') {
                route.path = routePath
                route.component = `() => import('view${path}${file}')`
            } else {
                route.path = routePath + fileName
                route.component = `() => import('view${path}${file}')`
            }
            routes.push(route)
        } else {
            Object.keys(file).forEach(v => {
                getRoutes(`${path}${v}/`, file[v])
            })
        }
    })
}
function reWriteRouter() {
    fs.readFile(path.resolve(__dirname, '../src/router/index.js'), 'utf-8', (err, file) => {
        if(err) {
            console.log('err', err)
            return
        }
        console.log('file', file)
        let newFile = file
        let replaceStr = JSON.stringify(routes,null,"\t\t")
        replaceStr = replaceStr.replace(/"component": "(.+?)"/g, `"component": $1`)
        newFile = newFile.replace(/routes: \[([\s\S]+)?\]/m, `routes: ${replaceStr}`)
        console.log('newFile')
        console.log(newFile)
        fs.writeFile(path.resolve(__dirname, 'result.js') , newFile, 'utf8', (err) => {
            if (err) throw err;
            console.log('success done');
        });
    })
}
readDir('../src/view', fileTree)
console.log('fileTree',JSON.stringify(fileTree))
getRoutes('/', fileTree)
console.log('routes', JSON.stringify(routes))
reWriteRouter()