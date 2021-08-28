function prepareParallelData() {	
	var datasets = [];
	for (let i = 0; i < numConfigurations; i++) {
		let firstCoef = randomInRange(0.1, 1.5);
		let secondCoef = randomInRange(5, 30);
		let limLoss = randomInRange(0, 1);
		
		var dataset = {
			type: 'scatter',
			label: "Configuration " + (i + 1),
			function: function(x) { return (limLoss + (Math.exp(firstCoef - (x / secondCoef)))) },
			data: [],
			borderColor: NAMED_COLORS[i],
			backgroundColor: NAMED_COLORS[i],
			pointStyle: "circle",
		};
		datasets.push(dataset);
	}
	
	var data = {
		labels: xs,
		datasets: datasets,
		curPhase: 0,
	}

	return data;
}

function createParallelChart(ctx) {
	var emptyData = prepareParallelData();
	
	const chartAreaBorder = {
		id: 'chartAreaBorder',
		beforeDraw(chart, args, options) {
			const {ctx, chartArea: {left, top, width, height}} = chart;
			ctx.save();
			ctx.strokeStyle = options.borderColor;
			ctx.lineWidth = options.borderWidth;
			ctx.setLineDash(options.borderDash || []);
			ctx.lineDashOffset = options.borderDashOffset;
			ctx.strokeRect(left, top, width, height);
			ctx.restore();
		}
	};
	
	var chart = new Chart(ctx, {
	type: 'line',
	data: emptyData,
	options: {
		responsive: false,
		scales: {
			xAxis: {
				title: {
					display: true,
					text: 'Pull',
				},
				ticks: {
					display: false,
					// beginAtZero: true,
					maxTicksLimit: 5,
					// steps: 5,
					// stepValue: 5,
				}
			},
			yAxis: {
				title: {
					display: true,
					text: 'Loss',
				},
				min: -0.5,
				ticks: {
					display: false,
					// beginAtZero: true,
					// steps: 10,
					// stepValue: 5,
				},
			},
		},
		elements:{
			point: {
				radius: 2
			}
		},
		plugins: {
			title: {
				display: true,
				text: "Parallel evaluation"
			},
			chartAreaBorder: {
				borderColor: 'black',
				borderWidth: 2,
				// borderDash: [5, 5],
				// borderDashOffset: 2,
			},
		},
	},
	plugins: [chartAreaBorder],
	});
	
	return chart;
}

function allotBudget(chart) {
	if (chart.data.curPhase < numPhases) {
		const curPhase = chart.data.curPhase;
		const curBudget = Math.floor(50 / numPhases);
		var datasets = chart.data.datasets;
		const curXs = [];
		for (let i = 1; i <= curBudget; ++i) {
			curXs.push((curPhase * curBudget) + i);
		}
		
		datasets.forEach((dataset) => {
			var func = dataset.function;
			for (i = 0; i < curXs.length; ++i) {
				var x = curXs[i],
					y = func(x);
				dataset.data.push({x, y});
			}
		});
		
		chart.data.curPhase += 1;
		chart.update();
	}
}

function clearParallelChart(chart) {
	if (chart.data.curPhase > 0) {
		chart.data = prepareParallelData();
		chart.data.curPhase = 0;
		chart.update();
	}
}

