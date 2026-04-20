export async function fileToCompressedDataUrl(file: File, maxBytes = 200_000): Promise<string> {
	const dataUrl = await readAsDataUrl(file);
	if (file.size <= maxBytes) return dataUrl;
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const scale = Math.sqrt(maxBytes / file.size);
	canvas.width = Math.max(64, Math.floor(img.width * scale));
	canvas.height = Math.max(64, Math.floor(img.height * scale));
	const ctx = canvas.getContext('2d');
	if (!ctx) return dataUrl;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL('image/jpeg', 0.85);
}

function readAsDataUrl(file: File): Promise<string> {
	return new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(r.result as string);
		r.onerror = rej;
		r.readAsDataURL(file);
	});
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((res, rej) => {
		const i = new Image();
		i.onload = () => res(i);
		i.onerror = rej;
		i.src = src;
	});
}
