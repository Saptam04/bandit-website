function prepareHyperData(limLoss) {
	var data = {
		labels: xs,
		datasets: [{
			type: 'scatter',
			label: "Configuration 1",
			function: function(x, limLoss = 0.5) { return (limLoss + (Math.exp(0.5 - (x / 15)))) },
			data: [],
			borderColor: NAMED_COLORS[0],
			backgroundColor: NAMED_COLORS[0],
			// fill: true,
			pointStyle: "circle",
		}]
	}

	return data;
}

function generateHyperData(chart, loss = 0.5) {
	var data = chart.config.data;
	data.datasets.forEach(dataset => {dataset.data = [];});

	for (var i = 0; i < data.datasets.length; i++) {
		for (var j = 0; j < xs.length; j += step) {
			var func = data.datasets[i].function,
				x = xs[j],
				y = func(x, loss);
			data.datasets[i].data.push({x, y});
		}
	}
		
	return data;
}

function createHyperChart(ctx, limLoss) {
	var emptyData = prepareHyperData(limLoss);
	
	const chartDatagenerator = {
		id: 'chartDatagenerator',
		beforeInit: function (chart) {
			generateData(chart);
		}
	};
	
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
			chartAreaBorder: {
				borderColor: 'black',
				borderWidth: 2,
				// borderDash: [5, 5],
				// borderDashOffset: 2,
			},
		},
	},
	plugins: [chartDatagenerator, chartAreaBorder],
	});
	
	return chart;
}

function addHyperData(chart, limLoss) {
	if (chart.data.datasets.length < 5) {
		var firstCoef = randomInRange(0.1, 1.5);
		var secondCoef = randomInRange(5, 30);
		
		const newDataset = {
			type: 'scatter',
			label: 'Configuration ' + (chart.data.datasets.length + 1),
			// backgroundColor: Utils.transparentize(dsColor, 0.5),
			borderColor: NAMED_COLORS[chart.data.datasets.length],
			backgroundColor: NAMED_COLORS[chart.data.datasets.length],
			function: function(x) { return (limLoss + (Math.exp(firstCoef - (x / secondCoef)))) },
			data: [],
			pointStyle: "circle",
		};
		
		for (var j = 0; j < xs.length; j += step) {
			var func = newDataset.function,
				x = xs[j],
				y = func(x);
			newDataset.data.push({x, y});
		}
		
		chart.data.datasets.push(newDataset);
		chart.update();
	}
}

function removeHyperData(chart) {
	if (chart.data.datasets.length > 1) {
		chart.data.datasets.pop();
		chart.update();
	}
}


