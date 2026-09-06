import { exec } from 'https://deno.land/x/exec/mod.ts';


const maxDimension = 1900
const outputDirName = 'compress'
const args = Deno.args

if (args[0] === undefined) {
    console.error('need path for folder image directory')
    Deno.exit(0)
}

const imagePath = args[0]
const compressLevel = args[1] || 5

async function main() {
    try {
        await Deno.remove(`${imagePath}/${outputDirName}`, {recursive: true})
    } catch (e) {
        console.info(e)
    }

    await Deno.mkdir(`${imagePath}/${outputDirName}`)

    const images = Deno.readDirSync(imagePath)

    for(const image of images) {
        runFFMpeg(image)
    }
}

async function runFFMpeg(image: Deno.DirEntry) {
    if( ! (image.isFile && (image.name.endsWith(".jpg") || image.name.endsWith(".jpeg") ) ) ) return

    console.info('image jpg: ', image.name)

    const ffmpegCommand = `ffmpeg -i ${imagePath}/${image.name} -vf "scale='min(${maxDimension}\\,iw):-2'" -q:v ${compressLevel} ${imagePath}/${outputDirName}/${image.name}`

    const create = await exec  ( ffmpegCommand )

    console.info(`${imagePath}/${outputDirName}/${image.name} compressed`)
}

main()
