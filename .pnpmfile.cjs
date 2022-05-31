const enforceSingleVersion = [
    'react-hot-toast', //
    'react',
    'react-dom',
    '@nextui-org/react',
]

function afterAllResolved(lockfile, context) {
    console.log(`Checking duplicate packages`)
    const packagesKeys = Object.keys(lockfile.packages)
    const found = {}
    for (let p of packagesKeys) {
        for (let x of enforceSingleVersion) {
            if (p.startsWith(`/${x}/`)) {
                if (found[x]) {
                    found[x] += 1
                } else {
                    found[x] = 1
                }
            }
        }
    }
    let msg = ''
    for (let p in found) {
        const count = found[p]
        if (count > 1) {
            msg += `${p} found ${count} times\n`
        }
    }
    if (msg) {
        throw new Error(msg)
    }
    return lockfile
}

module.exports = {
    hooks: {
        afterAllResolved,
    },
}
