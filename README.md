# PerspectiveBox

Add depth to your illustrations. [Try it out!](batmannair.com/PerspectiveBox)

Change perspective of the image by dragging the image. On tablets and phones motion control can be used for changing the perspective.

If you are interested in adding/testing your illustrations, let me know, I'm interested to test too.

![Splash](./screencaps/Animation.gif)


## How to use?

Initialize PerspectiveBox object
```js
pb = new PerspectiveBox("<div id>")
```

Add images layer by layer
```js
pb.addImage("path_to_img1.png")
pb.addImage("path_to_img2.png")
pb.addImage("path_to_img3.png")
```

Call the init function finish up. Give argument "mouse" for click/touch/motion controls. "animation" for auto looping animation.
```js
pb.init()
```

Set caption text with `setCaption`. This sets the target text as HTML itself so be careful of what is being set.
```js
pb.setCaption("by <a href='https://batmannair.com/'>@batmannair</a>")

To change or use another image, call `reset`, re-add the images and re-call `init`.
```js
pb.reset()
```

## How it works?

Whole thing is built with CSS 3D transforms and JS. Each image is kept spaced apart in z axis. Perspective movement is done with 3D rotations. Gyroscopic control is done with DeviceMotionEvent.

## Disclaimer

Inspired from [Jarom Vogel's](https://jaromvogel.com/) parallax image [illustraion](https://jaromvogel.com/illustration/floating_2.jpg).
