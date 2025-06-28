import { useRef, useState } from "preact/hooks";

export type SelectOption<V> = { value: V, display: string }

interface SelectInputProps<V, T extends SelectOption<V>> {
	id: string,
	label?: string,
	value?: V,
	options: T[],
	isReadonly?: boolean,
	size?: number,
	placeholder?: string,
	onSelection: (value: SelectOption<V>) => void,
}

function matchDisplayValue<T>(search: string) {
	return (option: SelectOption<T>) => {
		if (!search) {
			return true;
		}
		return option.display.toLowerCase().includes(search);
	}
}

function findDisplayByValue<V, T extends SelectOption<V>>(options: T[], value?: V) {
	if (value !== 0 && value !== "" && !value) {
		return "";
	}
	return options.find(x => x.value === value)?.display ?? "";
}

export function SelectInput<Value>(props: SelectInputProps<Value, SelectOption<Value>>) {
	const divRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const valueDisplay = findDisplayByValue(props.options, props.value);

	const handleSelection = (option: SelectOption<Value>) => {
		props.onSelection(option);
		setIsOpen(false);
		setSearchValue("");
	}
	const handleOnFocus = () => {
		setIsOpen(!props.isReadonly);
	}
	const handleBlur = () => {
		window.requestAnimationFrame(() => {
			if (divRef.current?.contains(document.activeElement)) {
				return;
			}
			setIsOpen(false);
		});
	}
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "Escape": 
				setIsOpen(false);
				break;
		}
	}

	return (
		<div 
			className={"combobox " + (isOpen ? "open" : "")} 
			ref={divRef} 
			tabIndex={-1}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		>
			{props.label && <span>{props.label}</span>}
			<input
				autocomplete="off"
				autocorrect="off"
				size={props.size}
				name={props.id}
				value={isOpen ? searchValue : valueDisplay}
				onFocus={handleOnFocus}
				onBlur={handleBlur}
				placeholder={props.placeholder}
				onInput={(e) => setSearchValue(e.currentTarget.value)}
				readOnly={props.isReadonly}
			/>
			<menu role="combobox">
				<div>
					{props.options.filter(matchDisplayValue(searchValue)).map((x, index) =>
						<button role="button" key={index} onClick={() => handleSelection(x)}>
							{x.display}
						</button>
					)}
				</div>
			</menu>
		</div>
	)
}


export function Dropdown<Value>(props: SelectInputProps<Value, SelectOption<Value>>) {
	const divRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const valueDisplay = findDisplayByValue(props.options, props.value);

	const handleSelection = (option: SelectOption<Value>) => {
		props.onSelection(option);
		setIsOpen(false);
	}
	const handleOnFocus = () => {
		setIsOpen(!props.isReadonly);
	}
	const handleBlur = () => {
		window.requestAnimationFrame(() => {
			if (divRef.current?.contains(document.activeElement)) {
				return;
			}
			setIsOpen(false);
		});
	}
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "Escape": 
				setIsOpen(false);
				break;
		}
	}

	return (
		<div 
			className={"combobox " + (isOpen ? "open" : "")} 
			ref={divRef} 
			tabIndex={-1}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
		>
			{props.label && <span>{props.label}</span>}
			<input
				autocomplete="off"
				autocorrect="off"
				readonly
				size={props.size}
				name={props.id}
				value={valueDisplay}
				onFocus={handleOnFocus}
				onBlur={handleBlur}
				readOnly={props.isReadonly}
			/>
			<menu role="combobox">
				<div>
					{props.options.map((x, index) =>
						<button role="button" key={index} onClick={() => handleSelection(x)}>
							{x.display}
						</button>
					)}
				</div>
			</menu>
		</div>
	)
}