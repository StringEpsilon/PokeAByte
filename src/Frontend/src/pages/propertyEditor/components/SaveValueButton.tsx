export function SaveValueButton({ active, onClick }: { active: boolean, onClick: () => void }) {
	return (
		<button 
			class="icon-button margin-right" 
			disabled={!active} 
			type="button" 
			onClick={() => active && onClick()}
			title="Save"
		>
			<i class="material-icons"> save </i>
		</button>
	)
}
