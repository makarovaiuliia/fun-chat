export default function createElement<T extends HTMLElement>(
	tag: string,
	props?: Partial<Record<keyof T, string | boolean | object>>,
	children?: HTMLElement | HTMLElement[]
): T {
	const element = document.createElement(tag) as T;
	if (props) {
		for (const key in props) {
			const value = props[key];
			if (isPlainObject(value) && key === 'dataset') {
				setElementData(element, value);
			} else {
				// @ts-expect-error fix indexing later
				element[key] = isBoolean(value) ? value : String(value);
			}
		}
	}
	if (children) {
		for (const child of Array.isArray(children) ? children : [children]) {
			element.append(child);
		}
	}
	return element;
}

export function setElementData<T extends Record<string, unknown> | object>(
	el: HTMLElement,
	data: T
) {
	for (const key in data) {
		el.dataset[key] = String(data[key]);
	}
}

export function isPlainObject(obj: unknown): obj is object {
	const prototype = Object.getPrototypeOf(obj);
	return prototype === Object.getPrototypeOf({}) || prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
	return typeof v === 'boolean';
}

export function generateRandomHexColor(): string {
	const randomColorValue = (): number => Math.floor(Math.random() * 256);

	const toHex = (colorValue: number): string => {
		const hex = colorValue.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const randomHexColor: string = `#${toHex(randomColorValue())}${toHex(randomColorValue())}${toHex(randomColorValue())}`;

	return randomHexColor;
}
