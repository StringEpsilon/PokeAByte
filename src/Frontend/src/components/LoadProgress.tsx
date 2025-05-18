
export function LoadProgress({ label }: { label: string }) {
	return (
		<>
			<h2>
				{label}
			</h2>
			<div>
				<progress className="error" />
			</div>
		</>
	);
}