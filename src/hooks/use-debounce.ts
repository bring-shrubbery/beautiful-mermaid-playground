import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(
	value: T,
	delay: number,
	immediate?: boolean,
): T {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		if (immediate) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			setDebouncedValue(value);
			return;
		}
		timeoutRef.current = setTimeout(() => setDebouncedValue(value), delay);
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [value, delay, immediate]);

	return debouncedValue;
}
