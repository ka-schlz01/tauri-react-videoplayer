export { Button } from "./ui/button";
export { Slider } from "./ui/slider";

import * as React from "react";

export function IconButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const classes = ["inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition", props.className]
		.filter(Boolean)
		.join(" ");

	return React.createElement("button", {...props, className: classes});
}

// Note: these re-exports map to the local `src/components/ui` shadcn-style components
// included in the project. Import from `../components/shadcn` to get unified names.
