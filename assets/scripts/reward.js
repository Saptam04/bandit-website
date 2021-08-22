function prepareNonStochData() {
	var data = {
		labels: xs,
		datasets: [{
			type: 'scatter',
			label: "Loss",
			function: function(x, limLoss = 0.5) { return (limLoss + (Math.exp(0.5 - (x / 15)))) },
			data: [],
			borderColor: "rgba(75, 192, 192, 1)",
			backgroundColor: "rgba(75, 192, 192, 1)",
			// fill: true,
			pointStyle: "circle",
			radius: 2,
		}, {
			type: 'line',
			label: "Limiting loss",
			function: function(x, limLoss = 0.5) { return limLoss },
			data: [],
			borderColor: "rgba(192, 0, 0, 1)",
			backgroundColor: "rgba(0, 0, 0, 0)",
			// fill: false,
			pointStyle: "circle",
			radius: 0,
			borderDash: [5, 5]
		}]
	}

	return data;
}

function prepareStochData() {
	var newMin, newMax;
	if (limLoss > 0.5) {
		newMin = (2 * limLoss) - 1, newMax = 1;
	}
	else {
		newMin = 0, newMax = 2 * limLoss;		
	}
	
	var data = {
		labels: xs,
		datasets: [{
			type: 'scatter',
			label: "Loss",
			// function: function(x, limLoss = 0.5) { return (Math.random() * 2 * limLoss) },
			function: function(x, limLoss = 0.5) { return randomInRange(newMin, newMax) },
			data: [],
			borderColor: "rgba(75, 192, 192, 1)",
			backgroundColor: "rgba(75, 192, 192, 1)",
			// fill: true,
			pointStyle: "circle",
			radius: 2,
		}, {
			type: 'line',
			label: "Mean",
			function: function(x, limLoss = 0.5) { return limLoss },
			data: [],
			borderColor: "rgba(192, 0, 0, 1)",
			backgroundColor: "rgba(0, 0, 0, 0)",
			// fill: false,
			pointStyle: "circle",
			radius: 0,
			borderDash: [5, 5]
		}]
	}

	return data;
}

function generateData(chart, loss = 0.5) {
	var data = chart.config.data;
	data.datasets.forEach(dataset => {dataset.data = [];});
	
	for (var i = 0; i < data.datasets.length; i++) {
		for (var j = 0; j < xs.length; j += step) {
			var func = data.datasets[i].function,
				x = xs[j],
				y = func(x, loss);
			if (data.datasets[i].type == 'scatter') {
				data.datasets[i].data.push({x, y});
			}
			else {
				data.datasets[i].data.push(y);
			}
		}
	}
		
	return data;
}

Chart.pluginService.register({
	beforeInit: function (chart) {generateData(chart)}, 
});

function createChart(ctx, loss, stochastic = true) {
	var emptyData;
	if (stochastic) {
		emptyData = prepareStochData();
	}
	else {
		emptyData = prepareNonStochData();
	}
	
	var chart = new Chart(ctx, {
	type: 'line',
	data: emptyData,
	options: {
		responsive: false,
		scales: {
			xAxes: [{
				display: true,
				ticks: {
					// beginAtZero: true,
					maxTicksLimit: 5,
					// steps: 5,
					// stepValue: 5,
					// min: -50,
					// max: 75
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
					max: 3
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
		title: {
			display: true,
		}
	},
	});
	
	chart.options.title.text = (stochastic) ? "Stochastic reward":"Non-stochastic reward";
	
	return chart;
}
