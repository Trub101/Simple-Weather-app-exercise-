type CityWeatherProps = {
	name: string
	temperature: number | null
	humidity: number | null
	precipitationProbability: number | null
	windSpeed: number | null
	status: 'ok' | 'error'
	isSelected: boolean
	onToggle: () => void
}

function CityWeather({
	name,
	temperature,
	humidity,
	precipitationProbability,
	windSpeed,
	status,
	isSelected,
	onToggle,
}: CityWeatherProps) {
	// If status is error, show "Unavailable".
	const showError = status === 'error'
	const detailsId = `details-${name.replace(/\s+/g, '-').toLowerCase()}`

	return (
		<div
			className={`rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft transition duration-200 hover:shadow-lift ${
				isSelected ? 'ring-2 ring-emerald-300' : ''
			}`}
			role="button"
			tabIndex={0}
			aria-expanded={isSelected}
			aria-controls={detailsId}
			onClick={onToggle}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					onToggle()
				}
			}}
		>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<h3 className="break-words text-lg font-semibold text-slate-800">{name}</h3>
					<p className="text-sm text-slate-500">Tap for details</p>
				</div>
				<div className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
					Now
				</div>
			</div>

			<div className="mt-6">
				{showError ? (
					<p className="text-sm font-semibold text-rose-600">Unavailable</p>
				) : (
					<p className="text-3xl font-bold text-slate-900">
						{temperature?.toFixed(1)}°C
					</p>
				)}

				{isSelected && (
					<div
						id={detailsId}
						className="mt-4 border-t border-slate-200/70 pt-3 text-sm text-slate-600"
					>
						{showError ? (
							<p className="text-sm text-slate-500">
								Details are not available right now.
							</p>
						) : (
							<ul className="space-y-2">
								<li className="flex items-center justify-between">
									<span>Humidity</span>
									<span className="font-semibold text-slate-800">
										{humidity ?? 'N/A'}
										{typeof humidity === 'number' ? '%' : ''}
									</span>
								</li>
								<li className="flex items-center justify-between">
									<span>Chance of rain</span>
									<span className="font-semibold text-slate-800">
										{precipitationProbability ?? 'N/A'}
										{typeof precipitationProbability === 'number' ? '%' : ''}
									</span>
								</li>
								<li className="flex items-center justify-between">
									<span>Wind speed</span>
									<span className="font-semibold text-slate-800">
										{windSpeed ?? 'N/A'}
										{typeof windSpeed === 'number' ? ' km/h' : ''}
									</span>
								</li>
							</ul>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default CityWeather
