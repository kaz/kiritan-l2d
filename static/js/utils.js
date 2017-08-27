"use strict";

const wrapper = func => e => {
	e.preventDefault();
	e.stopPropagation();
	func(e);
	return false;
};

const registerStartListener = (target, listener) => {
	target.addEventListener("mousedown", wrapper(listener), false);
	target.addEventListener("touchstart", wrapper(listener), false);
};

const registerEndListener = (target, listener) => {
	target.addEventListener("mouseup", wrapper(listener), false);
	target.addEventListener("touchend", wrapper(listener), false);
};

const registerMoveListener = (target, listener) => {
	target.addEventListener("mousemove", wrapper(listener), false);
	target.addEventListener("touchmove", wrapper(listener), false);
};

const getCoord = e => {
	if("touches" in e && e.touches.length){
		return [e.touches[0].clientX, e.touches[0].clientY];
	}
	if("clientX" in e){
		return [e.clientX, e.clientY];
	}
	alert("failed to get coord");
};
