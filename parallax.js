function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
}

class ParallaxBox {
    LAYER_DEPTH = 10
    constructor(box_id) {
        this.parallax_box = document.getElementById(box_id)
        this.num_images = 0
        this.parallax_box.classList.add('parallax_box')
        this.isMouseDown = false
    }
    addImage(img_src) {
        this.num_images += 1
        var parallax_img = document.createElement("img")
        parallax_img.src = img_src
        parallax_img.style.transform = `translateZ(${this.LAYER_DEPTH*this.num_images}px)`
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
                    this.setupMouseEvents()
                    break;
                default:
                    console.log("Invalid init state", action)
                    break;
            }
        })
    }
    calculateBoxWidth() {
        const imgs = this.parallax_box.querySelectorAll("img")
        this.img_width = 1;
        imgs.forEach((img, ii) => {
            this.img_width = this.img_width > img.width ? this.img_width : img.width
        })
        console.log("Parallax box width:", this.img_width)
    }
    updateWidthRelatedStuff() {
        this.parallax_box.style.perspective = `${this.img_width * 1.5}px`
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
    setupMouseEvents() {
        window.addEventListener("mousedown", (e) => {
            this.mouseStartPoint = [e.clientX, e.clientY]
            this.parallax_box.style.transition = '0s'
            this.isMouseDown = true
            // console.log("mouse down", e.clientX, e.clientY)
        })
        window.addEventListener("mousemove", (e) => {
            if (this.isMouseDown) {
                const dist_x = this.mouseStartPoint[0] - e.clientX
                const dist_y = this.mouseStartPoint[1] - e.clientY
                var transform_x = this.img_width/2 + dist_x
                var transform_y = this.img_width/2 + dist_y
                transform_x = transform_x > this.img_width? this.img_width : transform_x
                transform_y = transform_y > this.img_width? this.img_width : transform_y
                transform_x = transform_x < 0? 0 : transform_x
                transform_y = transform_y < 0? 0 : transform_y

                this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
            }
            // console.log("mouse move", e.clientX, e.clientY)
        })
        window.addEventListener("mouseup", (e) => {
            this.isMouseDown = false
            const transform_x = this.img_width / 2
            const transform_y = this.img_width / 2
            this.parallax_box.style.transition = '0.5s'
            this.parallax_box.style.perspectiveOrigin = `${transform_x}px ${transform_y}px`;
        })

    }
}