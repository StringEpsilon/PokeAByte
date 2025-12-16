export function CopyValueIcon({ onClick }: { onClick: () => void }) {
	return (
		<button 
			type="button" 
			class="margin-right icon-button" 
			onClick={onClick}
			title="Copy value"
		>
			<i class="material-icons"> content_copy </i>
		</button>
	)
}