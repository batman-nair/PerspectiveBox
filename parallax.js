window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
}

old_log = console.log;
new_log = document.getElementById("error")
console.log = function (message) {
    if (typeof message == "object") {
        new_log.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />'
    } else {
        new_log.innerHTML += message + '<br />'
    }
}

class ParallaxBox {
    MAX_ANGLE_PERCENT = 1
    constructor(box_id) {
        this.parallax_box_parent = document.getElementById(box_id)
        this.parallax_box_parent.classList.add("parallax_box_parent")
        this.parallax_box = document.createElement("div")
        this.parallax_box_parent.appendChild(this.parallax_box)
        this.parallax_box.classList.add('parallax_box')
        this.num_images = 0
        this.isPressed = false
        this.isGyroInitialized = false
        this.isInteractiveSetup = false
        this.image_list = []
        this.is_touched = false
        this.MAX_ROTATE = 15
        this.ROTATE_MULTI= 3
    }
    addImage(img_src) {
        this.num_images += 1
        var parallax_img = document.createElement("img")
        parallax_img.src = img_src
        this.image_list.push(parallax_img)
        this.parallax_box.appendChild(parallax_img)
    }
    reset() {
        this.num_images = 0
        this.image_list = []
        this.parallax_box.innerHTML = ""
        this.img_width = 1
        this.img_height = 1
    }
    init(action) {
        imagesLoaded(this.parallax_box, () => {
            this.calculateBoxWidth()
            this.setupAnimation()
            this.updateWidthRelatedStuff()
            window.addEventListener("resize", () => {
                this.calculateBoxWidth()
                this.updateWidthRelatedStuff()
            })
            switch (action) {
                case "animation":
                    this.startAnimation()
                    break;
                case "mouse":
                    this.setupInteractiveEvents()
                    break;
                default:
                    console.log("Invalid init state", action)
                    break;
            }
            this.image_list.forEach((img, ii) => {
                img.style.opacity = '1'
            })
        })
    }
    calculateBoxWidth() {
        this.img_height = 1;
        this.img_width = 1;
        this.parallax_box.style.height = `auto`
        this.parallax_box.style.width = `auto`
        this.image_list.forEach((img, ii) => {
            this.img_width = this.img_width > img.width ? this.img_width : img.width
            this.img_height = this.img_height > img.height ? this.img_height : img.height
        })
        this.parallax_box.style.height = `${this.img_height}px`
        this.parallax_box.style.width = `${this.img_width}px`
        const img_depth = this.img_width/50
        this.image_list.forEach((img, ii) => {
            img.style.transform = `translateZ(${img_depth*(ii+1)}px) translateX(${-img.width/2}px)`
        })
        console.log("Parallax box width:", this.img_width)
    }
    updatePerspective(norm_x=0, norm_y=0) {
        norm_x = norm_x * this.ROTATE_MULTI
        norm_y = norm_y * this.ROTATE_MULTI
        norm_x = Math.min(Math.max(norm_x, -1), 1)
        norm_y = Math.min(Math.max(norm_y, -1), 1)
        const rotate_x = this.MAX_ROTATE * norm_y
        const rotate_y = -this.MAX_ROTATE * norm_x
        this.parallax_box.style.transform = `rotateX(${rotate_x}deg) rotateY(${rotate_y}deg)`;
        // const transform_x = this.img_width/2 + this.MAX_ANGLE_PERCENT * (this.img_width/2) * norm_x
        // const transform_y = this.img_width/2 + this.MAX_ANGLE_PERCENT * (this.img_width/2) * norm_y
        // this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
        this.parallax_box.style.perspectiveOrigin = '50% 50%'
    }
    updateWidthRelatedStuff() {
        this.parallax_box.style.perspective = `${this.img_width * 1.5}px`
        if (!this.parallax_box.style.perspectiveOrigin) {
            this.updatePerspective()
        }
        this.tween.onUpdate(() => {
            var transform_x = Math.sin(this.angles.x * Math.PI / 180)
            var transform_y = Math.cos(this.angles.y * Math.PI / 180)
            this.updatePerspective(transform_x, transform_y)
        })
    }
    setupAnimation() {
        this.angles = { x: 0, y: 0 }
        this.tween = new TWEEN.Tween(this.angles)
            .to({ x: 360, y: 360 }, 4000)
            .onComplete(() => {
                console.log("Tween complete!")
            })
            .onStart(() => {
                console.log("Tween start")
            })
            .repeat(Infinity)
        this.updateWidthRelatedStuff()
        console.log('Animation setup done!')
    }
    startAnimation() {
        this.tween.start()
        animate()
    }
    startPoint(xx, yy) {
        this.mouseStartPoint = [xx, yy]
        this.parallax_box.style.transitionDuration = '0s'
        this.isPressed = true
        // console.log("mouse down", e.clientX, e.clientY)
    }
    movePoint(xx, yy) {
        if (this.isPressed) {
            const disp_x = this.mouseStartPoint[0] - xx
            const transform_x = disp_x / this.img_width
            const disp_y = this.mouseStartPoint[1] - yy
            const transform_y = disp_y / this.img_width
            this.updatePerspective(transform_x, transform_y)
        }
    }
    endPoint() {
        this.isPressed = false
        this.parallax_box.style.transitionDuration = '0.4s'
        this.updatePerspective()
    }

    deviceMotionHandler(beta, gamma) {
        if (!this.isGyroInitialized) {
            this.initGyroBeta = beta
            this.initGyroGamma = gamma
            this.isGyroInitialized = true
            // console.log("gyro initialized")
        }
        const MAX_ANGLE = 40
        const transform_x = (this.initGyroGamma - gamma) / MAX_ANGLE
        const transform_y = (this.initGyroBeta - beta) / MAX_ANGLE
        this.updatePerspective(transform_x, transform_y)
        this.parallax_box.style.transitionDuration = '0s'
    }

    setupInteractiveEvents() {
        if (this.isInteractiveSetup) {
            return;
        }
        this.isInteractiveSetup = true
        window.addEventListener("mousedown", (e) => {
            this.startPoint(e.clientX, e.clientY)
        })
        window.addEventListener("mousemove", (e) => {
            this.movePoint(e.clientX, e.clientY)
        })
        window.addEventListener("mouseup", (e) => {
            this.endPoint()
        })
        if (!window.mobileAndTabletCheck()) {
            this.ROTATE_MULTI = 2
            this.parallax_box.style.pointerEvents = 'none';
            return;
        }
        this.parallax_box.addEventListener("touchstart", (e) => {
            this.is_touched = true
            this.startPoint(e.touches[0].clientX, e.touches[0].clientY)
        })
        this.parallax_box.addEventListener("touchmove", (e) => {
            this.movePoint(e.touches[0].clientX, e.touches[0].clientY)
            e.preventDefault();
            e.stopPropagation();
            return false
        }, false)
        this.parallax_box.addEventListener("touchend", (e) => {
            // console.log("is touched now false")
            this.is_touched = false
            this.endPoint()
        })
        this.motion_button = document.createElement("div")
        this.motion_button.innerHTML = "<span><i class=\"bi bi-phone\"></i> Enable Motion Control</span>"
        this.motion_button.id = "enable-motion"
        this.motion_button.classList.add('before-click')
        this.parallax_box_parent.appendChild(this.motion_button)
        var enable_motion_click_handler = () => {
            if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        console.log("got response " + response)
                        if (response == "granted") {
                            window.addEventListener("deviceorientation", (e) => {
                                if (!this.is_touched) {
                                    this.deviceMotionHandler(e.beta, e.gamma)
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        console.log('Error when getting motion permission', err)
                    })
            } else {
                alert("DeviceMotionEvent is not defined")
            }
            this.motion_button.classList.add('after-click')
            this.motion_button.removeEventListener("click", enable_motion_click_handler)
        }
        this.motion_button.addEventListener("click", enable_motion_click_handler)
    }
}