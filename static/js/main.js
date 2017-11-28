"use strict";

const model = {
	type: "Live2D Model Setting",
	name: "Kiritan-Mekakure",
	model: "/static/model/Kiritan-Mekakure.moc",
	textures: [
		"/static/model/Kiritan-Mekakure.2048/texture_00.png",
		"/static/model/Kiritan-Mekakure.2048/texture_01.png",
		"/static/model/Kiritan-Mekakure.2048/texture_02.png",
		"/static/model/Kiritan-Mekakure.2048/texture_03.png",
	]
};

const canv = document.querySelector("#kiritan");

const initialize = async _ => {
	const gl = canv.getContext("webgl", {
		alpha: true,
		premultipliedAlpha: true,
		preserveDrawingBuffer: true,
	});
	Live2D.setGL(gl);

	const modelData = await fetch(model.model).then(resp => resp.arrayBuffer());
	const live2DModel = Live2DModelWebGL.loadModel(modelData);

	const images = await Promise.all(model.textures.map(path => new Promise(resolve => {
		const image = new Image();
		image.onload = _ => resolve(image);
		image.src = path;
	})));
	images.forEach((img, index) => live2DModel.setTexture(index, createTexture(gl, live2DModel, img)));

	const s = 2.0 / live2DModel.getCanvasWidth();
	live2DModel.setMatrix([
		s, 0, 0, 0,
		0,-s, 0, 0,
		0, 0, 1, 0,
		-1, 1, 0, 0.8,
	]);

	draw(gl, live2DModel);
};

const draw = (gl, live2DModel) => {
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	Params.get().forEach(param => live2DModel.setParamFloat(param[0], param[1]));

	live2DModel.update();
	live2DModel.draw();

	requestAnimationFrame(_ => draw(gl, live2DModel));
};

const createTexture = (gl, live2DModel, image) => {
	const texture = gl.createTexture();
	if(live2DModel.isPremultipliedAlpha() == false){
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
};

const resizeCanvas = _ => {
	const rect = document.body.getBoundingClientRect();
	const size = Math.min(rect.width, rect.height);

	canv.width = canv.height = 2048;
	canv.style.width = canv.style.height = `${size}px`;
    canv.style.left = `${(rect.width - size) / 2}px`;
};

resizeCanvas();
addEventListener("resize", resizeCanvas);

Live2D.init();
initialize().then(_ => {
	if(location.search === "?internal"){
		return fetch("/internal", {method: "PATCH"});
	}
});
