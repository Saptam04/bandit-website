const actions = [
{
	handler(chart) {
		const data = chart.data;
		const dsColor = Utils.namedColor(chart.data.datasets.length);
		const newDataset = {
			label: 'Hyper ' + (data.datasets.length + 1),
			backgroundColor: Utils.transparentize(dsColor, 0.5),
			borderColor: dsColor,
			data: Utils.numbers({count: data.labels.length, min: -100, max: 100}),
		};
		chart.data.datasets.push(newDataset);
		chart.update();
	}
}]

function prepareHyperData(limLoss) {
	var data = {
		labels: xs,
		datasets: [{
			type: 'scatter',
			label: "Hyper 1",
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
	
	var chart = new Chart(ctx, {
	type: 'line',
	data: emptyData,
	options: {
		responsive: false,
		scales: {
			xAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					maxTicksLimit: 5,
					// steps: 5,
					// stepValue: 5,
					// min: -5,
					// max: 2.5
				},
				scaleLabel: {
					display: true,
					labelString: 'Pull'
				}
			}, {
				position: 'top',
				ticks: {
					display: false
				},
				gridLines: {
					display: true,
					drawOnChartArea: false,
					drawTicks: false
				}
			}],
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					// steps: 10,
					// stepValue: 5,
					min: -0.5,
					// max: 2.5
				},
				scaleLabel: {
					display: true,
					labelString: 'Loss'
				}
			}, {
				position: 'right',
				ticks: {
					display: false
				},
				gridLines: {
					display: true,
					drawOnChartArea: false,
					drawTicks: false
				}
			}],
		},
		elements:{
			point: {
				radius: 2
			}
		}
	}
	});
	
	// chart.options.title.text = (stochastic) ? "Stochastic reward":"Non-stochastic reward";
	
	return chart;
}

function addHyperData(chart, limLoss) {
	if (chart.data.datasets.length < 5) {
		var firstCoef = randomInRange(0.1, 1.5);
		var secondCoef = randomInRange(5, 30);
		
		const newDataset = {
			type: 'scatter',
			label: 'Hyper ' + (chart.data.datasets.length + 1),
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


