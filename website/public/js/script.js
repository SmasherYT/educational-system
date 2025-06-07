// from browserdetection website
window.mobileCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
// ======[Class Chat]========
var element = $('.floating-chat');
if (element) {
    let myStorage = localStorage;

    if (!myStorage.getItem('chatID')) {
        myStorage.setItem('chatID', createUUID());
    }
    setTimeout(function () {
        element.addClass('enter');
    }, 1000);

    element.click(openElement);

    function openElement() {
        var messages = element.find('.messages');
        var textInput = element.find('.text-box');
        element.find('>i').hide();
        element.addClass('expand');
        element.find('.chat').addClass('enter');
        var strLength = textInput.val().length * 2;
        textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
        element.off('click', openElement);
        element.find('.header button').click(closeElement);
        element.find('#sendMessage').click(sendNewMessage);
        messages.scrollTop(messages.prop("scrollHeight"));
    }

    function closeElement() {
        element.find('.chat').removeClass('enter').hide();
        element.find('>i').show();
        element.removeClass('expand');
        element.find('.header button').off('click', closeElement);
        element.find('#sendMessage').off('click', sendNewMessage);
        element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
        setTimeout(function () {
            element.find('.chat').removeClass('enter').show()
            element.click(openElement);
        }, 500);
    }

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    function sendNewMessage() {
        var userInput = $('.text-box');
        var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

        if (!newMessage) return;

        var messagesContainer = $('.messages');

        messagesContainer.append([
            '<li class="self">',
            newMessage,
            '</li>'
        ].join(''));

        // clean out old message
        userInput.html('');
        // focus on input
        userInput.focus();

        messagesContainer.finish().animate({
            scrollTop: messagesContainer.prop("scrollHeight")
        }, 250);
    }

    function onMetaAndEnter(event) {
        if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            sendNewMessage();
        }
    }
}
/* const socket = io('http://localhost:3000');
const messages = document.getElementById('messages');
const msgForm = document.getElementById('msgForm');

socket.on('message', data => {
    console.log(data)
    appendMessages(data)
})

msgForm.addEventListener('submit', e => {
    e.preventDefault()
    socket.emit('chatmessage', msgForm.msg.value)
    console.log('submit from msgfrom', msgForm.msg.value)
    msgForm.msg.value = '';


})

function appendMessages(message) {
    const html = `<div>${message}</div>`
    messages.innerHTML += html
} */

// ====[Classes page]=====
let enterClass = document.querySelector("#enter-class");

if (enterClass) {
    enterClass.addEventListener("click", function () {
        let classCode = document.querySelector("input[name=class-code]");
        console.log(classCode)
        if (!classCode.value) classCode.setCustomValidity("يرجى كتابة كود الفصل")
    });
}


// ======[Navbar tooltips]=====
// let mm = window.matchMedia("(max-width: 600px)");

// if (mm.matches) {
//     document.querySelectorAll(".nav-cs-item").forEach(navItem => {
//         navItem.setAttribute("data-cooltipz-dir", "top-right");
//     });
// } else {
//     document.querySelectorAll(".nav-cs-item").forEach(navItem => {
//         navItem.removeAttribute("data-cooltipz-dir");
//     });
// }

// ======[Filter]====
let applyFilter = document.querySelector("#apply-options");
if (applyFilter) applyFilter.addEventListener("click", function () {
    let grade = document.querySelector("input[name=grade]:checked");
    let term = document.querySelectorAll("input[name=term]:checked");
    if(term && term.length === 0) term = null;
    if (term && term.length === 1) term = term[0];
    if (term && term.length === 2) term = null;
    let hasqs = document.querySelector("input[name=hasqs]:checked");
    location.href = `/study${
        grade ? `?grade=${grade.id.replace("grade", "")}` : ""
    }${
        term ? `?term=${term.id.replace("term", "")}` : ""
    }${
        hasqs ? `?questions=true` : ""
    }`;
});

// ======[Custom Select]======
document.querySelectorAll(".custom-select input").forEach(input => {
    input.addEventListener("change", function () {
        if (this.checked) {
            let view = document.querySelector(".custom-select summary span");
            view.innerHTML = this.title;
            view.title = this.title;
        }
    });
});

let selected = document.querySelector(".custom-select input:checked");
if (selected) {
    let view = document.querySelector(".custom-select summary span");
    view.innerHTML = selected.title;
    view.title = selected.title;
}
// ========[Login]=======

let register = document.querySelector("#register")
if (register) register.addEventListener("click", function (e) {
    let password = document.querySelector("#password");
    let confirmPassword = document.querySelector("#confirm-password");
    // console.log(password.value, confirmPassword.value)
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("لا تتطابق كلمتي المرور.");
    }else{
        confirmPassword.setCustomValidity("");
    }
});

// ======[Questions]======

document.querySelectorAll(".submitBtn").forEach(submitBtn => submitBtn.addEventListener("click", (ev) => {
    ev.target.classList.add("disabled")
    setTimeout(() => {
        ev.target.classList.remove("disabled")
    }, 3.05e3);
    // Getting info from option of question number
    let questionNumber = document.querySelector(".questions-no .active");

    let choice = document.querySelector(".questions .active input:checked");
    let reason;
    let isTrue;
    if (choice) {
        reason = choice.dataset.why;
        isTrue = choice.value === "true";
    }

    const toastLive = document.getElementById('liveToast');
    if (!choice) {
        toastLive.querySelector(".toast-body").innerHTML = "رجاء إختيار إجابة!"
        toastLive.classList.add("bg-danger");
    } else if (isTrue) {
        ev.target.classList.add("bg-success")
        setTimeout(() => {
            ev.target.classList.remove("bg-success");
        }, 3e3);
        toastLive.classList.remove("bg-danger")
        toastLive.classList.add("bg-success")
        toastLive.querySelector(".toast-body").innerHTML = `إجابة صحيحة!${reason ? `<br>السبب: ${reason}` : ""}`;
    } else {
        ev.target.classList.add("bg-danger")
        setTimeout(() => {
            ev.target.classList.remove("bg-danger");
        }, 3e3);
        let rightChoice = document.querySelector(`.questions .active label[for="${document.querySelector(".questions .active input[value=true]").id}"`);
        reason = document.querySelector(".questions .active input[value=true]").dataset.why
        toastLive.classList.remove("bg-success")
        toastLive.classList.add("bg-danger")
        toastLive.querySelector(".toast-body").innerHTML = `إجابة خاطئة!<br>الإجابة الصحيحة: ${rightChoice.innerHTML.split(" ").slice(1).join(" ")}${reason ? `<br>السبب: ${reason}` : ""}`;
    }
    const toast = new bootstrap.Toast(toastLive)

    toast.show()

}));

// ====[Loader]====
function slideLoader(f) {
    let loader = document.querySelector(".loader");
    loader.style.width = "100%";
    setTimeout(f, 400)
}

document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
        slideLoader(function () {
            e.target.submit();
        });
    });
});

document.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", e => {
        if (a.href.endsWith("#")) return;
        if (a.download) return;
        e.preventDefault();
        slideLoader(function () {
            location.href = a.href;
        })
    });
});

//======[filter]==========
const filterBtn = document.querySelector(".filter-btn")
const filterSidebar = document.querySelector(".filter-sidebar")
const filterClose = document.querySelector(".close-btn");
if (filterSidebar) {
    function handleFilterSidebar() {
        if (!filterSidebar.classList.contains("filter-sidebar-visible")) {
            filterSidebar.classList.add("filter-sidebar-visible")
            filterBtn.classList.add("filter-btn-sidebar-visible")
        } else {
            filterSidebar.classList.remove("filter-sidebar-visible")
            filterBtn.classList.remove("filter-btn-sidebar-visible")

        }
    }

    filterBtn.addEventListener("click", handleFilterSidebar);
}

// ===========[Video player]=============
const playPauseBtn = document.querySelector(".play-pause-btn")
const theaterBtn = document.querySelector(".theater-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const miniPlayerBtn = document.querySelector(".mini-player-btn")
const muteBtn = document.querySelector(".mute-btn")
const captionsBtn = document.querySelector(".captions-btn")
const speedBtn = document.querySelector(".speed-btn")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const volumeSlider = document.querySelector(".volume-slider")
const videoContainer = document.querySelector(".video-container")
const timelineContainer = document.querySelector(".timeline-container")
const previewTime = document.querySelector(".timeline p")
const video = document.querySelector("video")

if (video) {
    document.addEventListener("DOMContentLoaded", ev => {
        if (!document.pictureInPictureEnabled) {
            miniPlayerBtn.classList.add("mini-player-nopip");
        }
    }, false);

    document.addEventListener("keydown", e => {
        const tagName = document.activeElement.tagName.toLowerCase()

        if (tagName === "input") return

        switch (e.key.toLowerCase()) {
            case "0":
                video.currentTime = 0;
                break
            case " ":
                if (tagName === "button") return
            case "k":
                togglePlay()
                break
            case "f":
                toggleFullScreenMode()
                break
            case "t":
                toggleTheaterMode()
                break
            case "i":
                toggleMiniPlayerMode()
                break
            case "m":
                toggleMute()
                break
            case "arrowleft":
            case "j":
                skip(-5)
                break
            case "arrowright":
            case "l":
                skip(5)
                break
            case "c":
                toggleCaptions()
                break
        }
    })

    // Timeline
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.addEventListener("mousedown", toggleScrubbing)
    document.addEventListener("mouseup", e => {
        if (isScrubbing) toggleScrubbing(e)
    })
    document.addEventListener("mousemove", e => {
        if (isScrubbing) handleTimelineUpdate(e)
    })

    let isScrubbing = false
    let wasPaused

    // See if mouse is moving
    function toggleScrubbing(e) {
        const rect = timelineContainer.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        isScrubbing = (e.buttons & 1) === 1
        videoContainer.classList.toggle("scrubbing", isScrubbing)
        if (isScrubbing) {
            wasPaused = video.paused
            video.pause()
        } else {
            video.currentTime = percent * video.duration
            if (!wasPaused) video.play()
        }

        handleTimelineUpdate(e)
    }

    // function getVideoImage(path, secs, callback) {
    //     let me = this,
    //     metavideo = document.createElement('video');
    //     metavideo.onloadedmetadata = function () {
    //         if ('function' === typeof secs) {
    //             secs = secs(this.duration);
    //         }
    //         // console.log(Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration))
    //         this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    //     };
    //     metavideo.onseeked = function (e) {
    //         let canvas = document.createElement('canvas');
    //         canvas.height = metavideo.videoHeight;
    //         canvas.width = metavideo.videoWidth;
    //         let ctx = canvas.getContext('2d');
    //         ctx.drawImage(metavideo, 0, 0, canvas.width, canvas.height);
    //         let img = new Image();
    //         img.src = canvas.toDataURL();
    //         callback.call(me, img, this.currentTime, e);
    //     };
    //     metavideo.onerror = function (e) {
    //         callback.call(me, undefined, undefined, e);
    //     };
    //     metavideo.src = path;
    // }
    // let previews = [];
    // function showImageAt(secs, path) {
    //     let duration;
    //     getVideoImage(
    //         path,
    //         function (totalTime) {
    //             duration = totalTime;
    //             return secs;
    //         },
    //         function (img, secs, event) {
    //             if (event.type == 'seeked') {
    //                 previews.push(img.src);
    //             }
    //         }
    //     );
    // }

    // for(let i = 0; video.duration >= i; i+=10){
    //     showImageAt(i, "/public/videos/video.mp4");
    // }

    // console.log(previews.length)

    function handleTimelineUpdate(e) {
        const rect = timelineContainer.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        const previewTimeNumber = Math.floor(percent * video.duration);
        const previewImgNumber = Math.max(
            1,
            Math.floor((percent * video.duration) / 10)
        )
        // const previewImgSrc = `/public/previews/output04${previewImgNumber}.jpeg`;
        // previewImg.src = previewImgSrc
        timelineContainer.style.setProperty("--preview-position", percent)

        previewTime.innerHTML = formatDuration(previewTimeNumber);

        if (isScrubbing) {
            e.preventDefault()
            // thumbnailImg.src = previewImgSrc
            timelineContainer.style.setProperty("--progress-position", percent)
        }
    }

    // Playback Speed
    speedBtn.addEventListener("click", changePlaybackSpeed)

    function changePlaybackSpeed() {
        let newPlaybackRate = video.playbackRate + 0.25
        if (newPlaybackRate > 2) newPlaybackRate = 0.25
        video.playbackRate = newPlaybackRate
        speedBtn.textContent = `${newPlaybackRate}x`
    }

    // Captions
    const captions = video.textTracks[0]
    if (captions) {
        captions.mode = "hidden"

        if (captionsBtn) captionsBtn.addEventListener("click", toggleCaptions)

        function toggleCaptions() {
            if (!captionsBtn) return;
            const isHidden = captions.mode === "hidden"
            captions.mode = isHidden ? "showing" : "hidden"
            videoContainer.classList.toggle("captions", isHidden)
        }
    }
    // Duration
    video.addEventListener("loadeddata", () => {
        totalTimeElem.textContent = formatDuration(video.duration)
    })

    video.addEventListener("timeupdate", () => {
        currentTimeElem.textContent = formatDuration(video.currentTime)
        const percent = video.currentTime / video.duration
        timelineContainer.style.setProperty("--progress-position", percent)
    })

    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
    })

    function formatDuration(time) {
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)
        if (hours === 0) {
            return `${minutes}:${leadingZeroFormatter.format(seconds)}`
        } else {
            return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`
        }
    }

    function skip(duration) {
        video.currentTime += duration
    }

    // Volume
    muteBtn.addEventListener("click", toggleMute)
    volumeSlider.addEventListener("input", e => {
        video.volume = e.target.value
        video.muted = e.target.value === 0
    })

    function toggleMute() {
        video.muted = !video.muted
    }

    video.addEventListener("volumechange", () => {
        volumeSlider.value = video.volume
        let volumeLevel
        if (video.muted || video.volume === 0) {
            volumeSlider.value = 0
            volumeLevel = "muted"
        } else if (video.volume >= 0.5) {
            volumeLevel = "high"
        } else {
            volumeLevel = "low"
        }

        videoContainer.dataset.volumeLevel = volumeLevel
    })

    // View Modes
    theaterBtn.addEventListener("click", toggleTheaterMode)
    fullScreenBtn.addEventListener("click", toggleFullScreenMode)
    if (!window.mobileCheck()) videoContainer.addEventListener("dblclick", toggleFullScreenMode)
    miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode)

    function toggleTheaterMode() {
        videoContainer.classList.toggle("theater")
    }

    function toggleFullScreenMode() {
        if (document.fullscreenElement == null) {
            videoContainer.requestFullscreen();
            if (window.mobileCheck()) screen.orientation.lock("landscape-primary");
        } else {
            document.exitFullscreen();
            if (window.mobileCheck()) screen.orientation.lock("portrait-primary");
        }
    }

    function toggleMiniPlayerMode() {
        if (videoContainer.classList.contains("mini-player")) {
            document.exitPictureInPicture()
        } else {
            video.requestPictureInPicture()
        }
    }

    document.addEventListener("fullscreenchange", () => {
        videoContainer.classList.toggle("full-screen", document.fullscreenElement)
    })

    video.addEventListener("enterpictureinpicture", () => {
        videoContainer.classList.add("mini-player")
    })

    video.addEventListener("leavepictureinpicture", () => {
        videoContainer.classList.remove("mini-player")
    })

    // Play/Pause
    playPauseBtn.addEventListener("click", togglePlay)
    video.addEventListener("click", togglePlay)

    function togglePlay() {
        video.paused ? video.play() : video.pause()
    }

    video.addEventListener("play", () => {
        videoContainer.classList.remove("paused")
    })

    video.addEventListener("pause", () => {
        videoContainer.classList.add("paused")
    })
}