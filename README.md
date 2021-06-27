# PerspectiveBox

Add depth to your illustrations. [Try it out!](batmannair.com/PerspectiveBox)

Change perspective of the image by dragging the image. On tablets and phones motion control can be used for changing the perspective.

![Splash](./screencaps/Animation.gif)


## How to use?

Initialize PerspectiveBox object
```js
pb = new PerspectiveBox("perspective_box")
```

Add images layer by layer
```js
pb.addImage("path_to_img1.png")
pb.addImage("path_to_img2.png")
pb.addImage("path_to_img3.png")
```

Call the init function with "mouse" for touch controls. "anim" for auto animation.
```js
pb.init("mouse")
```

To change or use another image, call `reset`, re-add the images and re-call `init`.
```js
pb.reset()
```

## How it works?

Whole thing is built with CSS 3D transforms and JS. Each image is kept spaced apart in z axis. Perspective movement is done with 3D rotations. Gyroscopic control is done with DeviceMotionEvent.

## Disclaimer

Inspired from [Jarom Vogel's](https://jaromvogel.com/) parallax image [illustraion](https://jaromvogel.com/illustration/floating_2.jpg).
