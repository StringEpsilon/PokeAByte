export function CopyValueIcon({ onClick }: { onClick: () => void }) {
	return (
		<button type="button" className={"margin-right icon-button"} onClick={onClick}>
			<i className="material-icons"> content_copy </i>
		</button>
	)
}