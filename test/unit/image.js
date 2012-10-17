(function() {

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) return path;
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC     = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;

  var REFERENCE_IMG_OBJECT = {
    'type':         'image',
    'left':         0,
    'top':          0,
    'width':        0, // node-canvas doesn't seem to allow setting width/height on image objects
    'height':       0,
    'fill':         'rgb(0,0,0)',
    'overlayFill':  null,
    'stroke':       null,
    'strokeWidth':  1,
    'strokeDashArray': null,
    'scaleX':       1,
    'scaleY':       1,
    'angle':        0,
    'flipX':        false,
    'flipY':        false,
    'opacity':      1,
    'src':          fabric.isLikelyNode ? undefined : IMG_SRC,
    'selectable':   true,
    'hasControls':  true,
    'hasBorders':   true,
    'hasRotatingPoint': false,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'filters':      []
  };

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image) : fabric.document.createElement('img');
  }

  function _createImageObject(width, height, callback) {
    var elImage = _createImageElement();
    elImage.width = width;
    elImage.height = height;
    setSrc(elImage, IMG_SRC, function() {
      callback(new fabric.Image(elImage));
    });
  }

  function createImageObject(callback) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback)
  }

  function createSmallImageObject(callback) {
    return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2, callback);
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) throw err;
        img.src = imgData;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  QUnit.module('fabric.Image');

  asyncTest('constructor', function() {
    ok(fabric.Image);

    createImageObject(function(image) {
      ok(image instanceof fabric.Image);
      ok(image instanceof fabric.Object);

      equal(image.get('type'), 'image');

      start();
    });
  });

  asyncTest('toObject', function() {
    createImageObject(function(image) {
      ok(typeof image.toObject == 'function');
      deepEqual(image.toObject(), REFERENCE_IMG_OBJECT);
      start();
    });
  });

  asyncTest('toString', function() {
    createImageObject(function(image) {
      ok(typeof image.toString == 'function');
      equal(image.toString(), '#<fabric.Image: { src: "' + (fabric.isLikelyNode ? undefined : IMG_SRC) + '" }>');
      start();
    });
  });

  asyncTest('getSrc', function() {
    createImageObject(function(image) {
      ok(typeof image.getSrc == 'function');
      equal(image.getSrc(), fabric.isLikelyNode ? undefined : IMG_SRC);
      start();
    });
  });

  test('getElement', function() {
    var elImage = _createImageElement();
    var image = new fabric.Image(elImage);
    ok(typeof image.getElement == 'function');
    equal(image.getElement(), elImage);
  });

  asyncTest('setElement', function() {
    createImageObject(function(image) {
      ok(typeof image.setElement == 'function');

      var elImage = _createImageElement();
      equal(image.setElement(elImage), image, 'chainable');
      equal(image.getElement(), elImage);

      start();
    });
  });

  // asyncTest('clone', function() {
  //   createImageObject(function(image) {
  //     ok(typeof image.clone == 'function');

  //     var imageClone = null;
  //     image.clone(function(clone) {
  //       imageClone = clone;
  //     });

  //     setTimeout(function() {
  //       ok(imageClone instanceof fabric.Image);
  //       deepEqual(imageClone.toObject(), image.toObject());
  //       start();
  //     }, 1000);
  //   });
  // });

  // asyncTest('cloneWidthHeight', function() {
  //   var image = createSmallImageObject();

  //   var imageClone = null;
  //   image.clone(function(clone) {
  //     imageClone = clone;
  //   });

  //   setTimeout(function() {
  //     equal(imageClone.getElement().width, IMG_WIDTH / 2,
  //       'clone\'s element should have width identical to that of original image');
  //     equal(imageClone.getElement().height, IMG_HEIGHT / 2,
  //       'clone\'s element should have height identical to that of original image');
  //     start();
  //   }, 1000);
  // });

  // asyncTest('fromObject', function() {
  //   ok(typeof fabric.Image.fromObject == 'function');

  //   // should not throw error when no callback is given
  //   fabric.Image.fromObject(REFERENCE_IMG_OBJECT);

  //   var image;
  //   fabric.Image.fromObject(REFERENCE_IMG_OBJECT, function(instance){
  //     image = instance;
  //   });

  //   setTimeout(function() {
  //     ok(image instanceof fabric.Image);
  //     start();
  //   }, 1000);
  // });

  // asyncTest('fromURL', function() {
  //   ok(typeof fabric.Image.fromURL == 'function');

  //   // should not throw error when no callback is given
  //   // can't use `assertNothingRaised` due to asynchronous callback
  //   fabric.Image.fromURL(IMG_SRC);

  //   var image;
  //   fabric.Image.fromURL(IMG_SRC, function(instance) {
  //     image = instance;
  //   });

  //   setTimeout(function() {
  //     ok(image instanceof fabric.Image);
  //     deepEqual(REFERENCE_IMG_OBJECT, image.toObject());
  //     start();
  //   }, 1000);
  // });

  // test('toGrayscale', function() {
  //   var image = createImageObject(),
  //       imageEl = _createImageElement();

  //   imageEl.src = IMG_SRC;
  //   image.setElement(imageEl);

  //   ok(typeof image.toGrayscale == 'function');

  //   if (!fabric.Canvas.supports('toDataURL')) {
  //     alert('toDataURL is not supported. Some tests can not be run.');
  //   }
  //   else {
  //     equal(image.toGrayscale(), image, 'chainable');
  //   }
  // });

  // asyncTest('fromElement', function() {

  //   function makeImageElement(attributes) {
  //     var element = _createImageElement();
  //     for (var prop in attributes) {
  //       element.setAttribute(prop, attributes[prop]);
  //     }
  //     return element;
  //   }

  //   var IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==";

  //   ok(typeof fabric.Image.fromElement == 'function', 'fromElement should exist');

  //   var imageEl = makeImageElement({
  //     width: "14",
  //     height: "17",
  //     "xlink:href": IMAGE_DATA_URL
  //   });

  //   var imgObject;
  //   fabric.Image.fromElement(imageEl, function(obj) {
  //     imgObject = obj;
  //   });

  //   setTimeout(function() {
  //     ok(imgObject instanceof fabric.Image);
  //     deepEqual(imgObject.get('width'), 14, 'width of an object');
  //     deepEqual(imgObject.get('height'), 17, 'height of an object');
  //     deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
  //     start();
  //   }, 500);
  // });

})();