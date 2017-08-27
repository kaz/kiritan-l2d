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
	const size = Math.min(rect.width, rect.height) / 2;
	
	frame.style.display = "block";
	frame.style.width = frame.style.height = `${size}px`;
	frame.style.top = `${size / 5 - 50}px`;
	frame.style.left = `${(rect.width - size) / 2 - 50}px`;
	
	return size;
};
const changeCameraFrame = size => {
	frame.style.width = frame.style.height = `${size}px`;
};

const submit = async data => {
	return await fetch("/", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			params: Params.get(),
			image: data,
		})
	}).then(resp => resp.text());
};
const capture = async _ => {
	const image = new Image();
	image.src = canv.toDataURL();
	await new Promise(resolve => image.onload = resolve);
	
	const cRect = canv.getBoundingClientRect();
	const fRect = frame.getBoundingClientRect();
	
	const scale = 2048 / cRect.width;
	const [sx, sy] = [fRect.left - cRect.left + 50, fRect.top - cRect.top + 50];
	const [sw, sh] = [fRect.width - 100, fRect.height - 100];
	
	const dstCanv = document.createElement("canvas");
	dstCanv.width = dstCanv.height = 400;
	
	const ctx = dstCanv.getContext("2d");
	ctx.drawImage(image, scale*sx, scale*sy, scale*sw, scale*sh, 0, 0, 400, 400);
	
	const result = await submit(dstCanv.toDataURL());
	if(result != "ok"){
		return alert("failed...");
	}
	
	dstCanv.toBlob(blob => {
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
