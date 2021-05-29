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
    LAYER_DEPTH = 10
    constructor(box_id) {
        this.parallax_box = document.getElementById(box_id)
        this.num_images = 0
        this.parallax_box.classList.add('parallax_box')
        this.isPressed = false
        this.isGyroInitialized = false
        this.image_list = []
    }
    addImage(img_src) {
        this.num_images += 1
        var parallax_img = document.createElement("img")
        parallax_img.src = img_src
        this.image_list.push(parallax_img)
        this.parallax_box.appendChild(parallax_img)
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
        })
    }
    calculateBoxWidth() {
        this.img_height = 1;
        this.img_width = 1;
        this.image_list.forEach((img, ii) => {
            this.img_width = this.img_width > img.width ? this.img_width : img.width
            this.img_height = this.img_height > img.height ? this.img_height : img.height
        })
        this.parallax_box.style.height = `${this.img_height}`
        const img_depth = this.img_width/50
        this.image_list.forEach((img, ii) => {
            img.style.transform = `translateZ(${img_depth*(ii+1)}px)`
        })
        console.log("Parallax box width:", this.img_width)
    }
    updateWidthRelatedStuff() {
        this.parallax_box.style.perspective = `${this.img_width * 1.5}px`
        if (!this.parallax_box.style.perspectiveOrigin) {
            this.parallax_box.style.perspectiveOrigin = `${this.img_width / 2}px ${this.img_width / 2}px`;
        }
        this.tween.onUpdate(() => {
            var transform_x = this.img_width / 2 + (this.img_width / 2) * Math.sin(this.angles.x * Math.PI / 180)
            var transform_y = this.img_width / 2 + (this.img_width / 2) * Math.cos(this.angles.y * Math.PI / 180)

            this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
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
        this.parallax_box.style.transition = '0s'
        this.isPressed = true
        // console.log("mouse down", e.clientX, e.clientY)
    }
    movePoint(xx, yy) {
        if (this.isPressed) {
            const dist_x = this.mouseStartPoint[0] - xx
            const dist_y = this.mouseStartPoint[1] - yy
            var transform_x = this.img_width / 2 + dist_x
            var transform_y = this.img_width / 2 + dist_y
            transform_x = transform_x > this.img_width ? this.img_width : transform_x
            transform_y = transform_y > this.img_width ? this.img_width : transform_y
            transform_x = transform_x < 0 ? 0 : transform_x
            transform_y = transform_y < 0 ? 0 : transform_y

            this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
        }
        // console.log("mouse move", e.clientX, e.clientY)
    }
    endPoint() {
        this.isPressed = false
        const transform_x = this.img_width / 2
        const transform_y = this.img_width / 2
        this.parallax_box.style.transition = '0.5s'
        this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
    }

    deviceMotionHandler(beta, gamma) {
        if (!this.isGyroInitialized) {
            this.initGyroBeta = beta
            this.initGyroGamma = gamma
            this.isGyroInitialized = true
        }
        const MAX_ANGLE = 40
        var transform_x_angle = this.initGyroGamma - gamma
        transform_x_angle = transform_x_angle < -MAX_ANGLE ? -MAX_ANGLE : transform_x_angle
        transform_x_angle = transform_x_angle > MAX_ANGLE ? MAX_ANGLE : transform_x_angle
        const transform_x = this.img_width / 2 + (this.img_width / 2) * (transform_x_angle / MAX_ANGLE)
        var transform_y_angle = this.initGyroBeta - beta
        transform_y_angle = transform_y_angle < -MAX_ANGLE ? -MAX_ANGLE : transform_y_angle
        transform_y_angle = transform_y_angle > MAX_ANGLE ? MAX_ANGLE : transform_y_angle
        const transform_y = this.img_width / 2 + (this.img_width / 2) * (transform_y_angle / MAX_ANGLE)

        this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
        this.parallax_box.style.transition = '0s'
    }

    setupInteractiveEvents() {
        window.addEventListener("mousedown", (e) => {
            this.startPoint(e.clientX, e.clientY)
        })
        window.addEventListener("mousemove", (e) => {
            this.movePoint(e.clientX, e.clientY)
        })
        window.addEventListener("mouseup", (e) => {
            this.endPoint()
        })
        this.parallax_box.addEventListener("touchstart", (e) => {
            this.startPoint(e.touches[0].clientX, e.touches[0].clientY)
        })
        this.parallax_box.addEventListener("touchmove", (e) => {
            this.movePoint(e.touches[0].clientX, e.touches[0].clientY)
            e.preventDefault();
            e.stopPropagation();
            return false
        }, false)
        this.parallax_box.addEventListener("touchend", (e) => {
            this.endPoint()
        })
        const btn = document.getElementById("request")
        btn.addEventListener("click", () => {
            if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        console.log("got response " + response)
                        if (response == "granted") {
                            window.addEventListener("deviceorientation", (e) => {
                                this.deviceMotionHandler(e.beta, e.gamma)
                            }, true);
                        }
                    })
                    .catch(console.log)
            } else {
                alert("DeviceMotionEvent is not defined")
            }
        })
    }
}