const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const FFMPEG_PATH = path.join(__dirname, "ffmpeg/bin/ffmpeg.exe");
const FFPROBE_PATH = path.join(__dirname, "ffmpeg/bin/ffprobe.exe");
ffmpeg.setFfmpegPath(FFMPEG_PATH);
ffmpeg.setFfprobePath(FFPROBE_PATH);

// ====== [Get gif previews of a video] ========

// Get video information, size, duration
function getVideoInfo(inputPath) {
    // to make sure video actually finished processing, takes time if windows or pc is slow
    return new Promise((resolve, reject) => {
        return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
            if (error) {
                return reject(error);
            }

            const {
                duration,
                size
            } = videoInfo.format;

            return resolve({
                size,
                durationInSeconds: Math.floor(duration),
            });
        });
    });
}

// self expaining
function getRandomIntegerInRange(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);

    return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}

// Get start time of video
function getStartTimeInSeconds(videoDurationInSeconds,
    fragmentDurationInSeconds) {
    // by subtracting the fragment duration we can be sure that the resulting
    // start time + fragment duration will be less than the video duration
    const safeVideoDurationInSeconds = videoDurationInSeconds - fragmentDurationInSeconds;

    // if the fragment duration is longer than the video duration
    if (safeVideoDurationInSeconds <= 0) {
        return 0;
    }

    return getRandomIntegerInRange(
        0.25 * safeVideoDurationInSeconds,
        0.75 * safeVideoDurationInSeconds
    );
}


// Small gif video preview
async function createFragmentPreview(inputPath,
    outputPath,
    fragmentDurationInSeconds = 4, startTimeInSeconds = null) {
    return new Promise(async (resolve, reject) => {
        console.log(path.join(__dirname, inputPath))
        const {
            durationInSeconds: videoDurationInSeconds
        } = await getVideoInfo(
            path.join(__dirname, inputPath)
        );

        // Specify when to start (0 if from start or dont specify and pick randomly)
        startTimeInSeconds ? startTimeInSeconds : startTimeInSeconds = getStartTimeInSeconds(
            videoDurationInSeconds,
            fragmentDurationInSeconds
        );

        return ffmpeg()
            .input(path.join(__dirname, inputPath))
            .inputOptions([`-ss ${startTimeInSeconds}`]) // It can be 
            .outputOptions([`-t ${fragmentDurationInSeconds}`])
            .noAudio()
            .output(path.join(__dirname, `fragments/${outputPath}.gif`))
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
}
//=================================

// ==========[Get thumbnails previews]=========

function createXFramesPreview(inputPath,
    outputPattern,
    numberOfFrames) {
    return new Promise(async (resolve, reject) => {
        console.log(path.join(__dirname, inputPath))
        const {
            durationInSeconds
        } = await getVideoInfo(path.join(__dirname, inputPath));

        // 1/frameIntervalInSeconds = 1 frame each x seconds
        const frameIntervalInSeconds = Math.floor(
            durationInSeconds / numberOfFrames
        );

        return ffmpeg()
            .input(path.join(__dirname, inputPath))
            .outputOptions([`-vf fps=1/${frameIntervalInSeconds}`])
            .output(path.join(__dirname, `previews/${outputPattern}.jpeg`)) // like thumbnail%04d is pattern etc..
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
}
//=================

module.exports = {
    createFragmentPreview,
    createXFramesPreview,
    getVideoInfo
}
/**
 * @author Mohanad
 */