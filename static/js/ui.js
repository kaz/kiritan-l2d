"use strict";

const getCoord = e => {
	if("touches" in e && e.touches.length){
		return [e.touches[0].clientX, e.touches[0].clientY];
	}
	if("clientX" in e){
		return [e.clientX, e.clientY];
	}
	alert("failed to get coord");
};

const makeDraggable = target => {
	let x, y;

	const cancel = event => {
		event.preventDefault();
	};
	const move = event => {
		const rect = target.getBoundingClientRect();
		const [cx, cy] = getCoord(event);

		target.style.left = `${rect.left + cx - x}px`;
		target.style.top = `${rect.top + cy - y}px`;

		[x, y] = [cx, cy];
	};
	const start = event => {
		[x, y] = getCoord(event);
		window.addEventListener("touchmove", move);
		window.addEventListener("mousemove", move);
		target.addEventListener("touchmove", cancel);
		target.addEventListener("mousemove", target);
	};
	const end = _ => {
		window.removeEventListener("touchmove", move);
		window.removeEventListener("mousemove", move);
		target.removeEventListener("touchmove", cancel);
		target.removeEventListener("mousemove", target);
	};
	target.addEventListener("touchstart", start);
	target.addEventListener("mousedown", start);
	target.addEventListener("touchend", end);
	target.addEventListener("mouseup", end);
};

const initCameraFrame = _ => {
	const rect = document.body.getBoundingClientRect();
	const size = Math.min(rect.width, rect.height) / 1.8;

	frame.style.display = "block";
	frame.style.width = frame.style.height = `${size}px`;
	frame.style.top = `${(rect.height - size) / 2 - 50}px`;
	frame.style.left = `${(rect.width - size) / 2 - 50}px`;

	return size;
};
const changeCameraFrame = size => {
	frame.style.width = frame.style.height = `${size}px`;
};

const render = async dimension => {
	const image = new Image();
	image.src = canv.toDataURL();
	await new Promise(resolve => image.onload = resolve);

	const cRect = canv.getBoundingClientRect();
	const fRect = frame.getBoundingClientRect();

	const {s, x, y, w, h} = dimension !== null ? dimension : {
		s: 2048 / cRect.width,
		x: fRect.left - cRect.left + 50,
		y: fRect.top - cRect.top + 50,
		w: fRect.width - 100,
		h: fRect.height - 100,
	};

	const dstCanv = document.createElement("canvas");
	dstCanv.width = dstCanv.height = 400;

	const ctx = dstCanv.getContext("2d");
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, 400, 400);
	ctx.drawImage(image, s*x, s*y, s*w, s*h, 0, 0, 400, 400);

	return {canvas: dstCanv, dimension: {s, x, y, w, h}};
};
const internalCapture = async dimension => {
	const {canvas: rendered} = await render(dimension);
	return fetch("/internal", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({data: rendered.toDataURL()}),
	}).then(r => r.text());
};
const capture = async _ => {
	panel.innerHTML = "処理中……";

	const {canvas: rendered, dimension} = await render(null);

	const jobs = [
		["PUT", "/params.json", Params.get()],
		["PUT", "/", dimension],
	];
	for(let [method, path, body] of jobs){
		const result = await fetch(path, {method, body: JSON.stringify(body), headers: {"Content-Type": "application/json"}}).then(r => r.text());
		if(result != "ok"){
			return alert(panel.innerHTML = "失敗しました");
		}
	}

	rendered.toBlob(blob => {
		const url = URL.createObjectURL(blob);
		panel.innerHTML = `
			<div style="width:380px; height:380px; background-image:url(${url});"></div>
			<a href="${url}">ダウンロード</a>
		`;
	});
};

const capBtn = document.querySelector("#cap");
const panel = document.querySelector("#panel");
const frame = document.querySelector("#frame");

makeDraggable(panel);
makeDraggable(frame);

capBtn.onclick = _ => {
	const frameSize = initCameraFrame();
	document.querySelector("table").innerHTML = `
		<tr>
			<th>フレームサイズ</th>
			<td><input type="range" value="${frameSize}" min="0" max="${frameSize * 1.8}"></td>
		</tr>
	`;
	document.querySelectorAll("[type='range']").forEach(p => {
		p.addEventListener("input", e => changeCameraFrame(e.currentTarget.value));
	});

	capBtn.textContent = "撮影";
	capBtn.style.fontSize = "2em";
	capBtn.onclick = capture;

	document.querySelector("button:not(#cap)").remove();
};
