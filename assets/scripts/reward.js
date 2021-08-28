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

function createChart(ctx, loss, stochastic = true) {
	var emptyData = (stochastic) ? prepareStochData() : prepareNonStochData();
	var chartTitle = (stochastic) ? "Stochastic reward" : "Non-stochastic reward";
	
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
				// min: -1, max: 1,
				ticks: {
					// beginAtZero: true,
					maxTicksLimit: 5,
					// steps: 5,
					// stepValue: 5,
				},
				grid: {
					// display: false,
					// drawBorder: false,
					// drawOnChartArea: true,
				},
			},
			yAxis: {
				title: {
					display: true,
					text: 'Loss',
				},
				min: -0.5, max: 3,
				ticks: {
					// beginAtZero: true,
					// steps: 10,
					// stepValue: 5,
				},
				grid: {
					// display: false,
					// drawBorder: false,
					// drawOnChartArea: true,
				},
			},
		},
		plugins: {
			title: {
				display: true,
				text: chartTitle,
			},
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
