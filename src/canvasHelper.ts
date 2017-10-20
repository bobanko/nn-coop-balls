const gbSize = {width: 1080, height: 720};
const gb: HTMLCanvasElement = document.querySelector('#gameboard') as HTMLCanvasElement;
const ctx = gb.getContext('2d');
gb.width = gbSize.width;
gb.height = gbSize.height;

export function background(color: string) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, gbSize.width, gbSize.height);
}

export function line(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

export function ellipse(x1, y1, radius, color?) {
	ctx.beginPath();
	ctx.arc(x1, y1, radius, 0, 2 * Math.PI, false);

	if (color) {
		ctx.fillStyle = color;
	}

	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.closePath();
}

export function text(value, x, y, size = 20) {
	//ctx.font = '20px Arial';
	//ctx.fillStyle = 'black';
	ctx.fillText(value, x, y);
}

export function fill(color, alpha = 255) {
	//todo: impl alpha
	ctx.fillStyle = color;
}

export function textSize(size) {
	ctx.font = `${size}px Arial`;
}