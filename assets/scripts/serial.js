function prepareRandomData() {
	var data = {
		datasets: [{
			label: "Sample",
			idx: 0,
			data: [],
			borderColor: NAMED_COLORS[0],
			backgroundColor: NAMED_COLORS[0],
		}]
	}

	return data;
}

function prepareGridData() {
	var data = {
		datasets: [{
			label: "Sample",
			idx: 0,
			maxRow: 3, 
			maxCol: 5,
			data: [],
			borderColor: NAMED_COLORS[0],
			backgroundColor: NAMED_COLORS[0],
		}]
	}

	return data;
}

function createSerialChart(ctx, grid) {
	var emptyData = (grid) ? prepareGridData() : prepareRandomData();
	const chartTitle = (grid) ? "Grid search" : "Random search";
	
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
	type: 'scatter',
	data: emptyData,
	options: {
		responsive: false,
		scales: {
			xAxis: {
				title: {
					display: true,
					text: 'x1',
				},
				min: -1, max: 1,
				ticks: {
					display: false,
				},
				grid: {
					display: false,
					drawBorder: false,
					drawOnChartArea: true,
				},
			},
			yAxis: {
				title: {
					display: true,
					text: 'x2',
				},
				min: -1, max: 1,
				ticks: {
					display: false,
				},
				grid: {
					display: false,
					drawBorder: false,
					drawOnChartArea: true,
				},
			},
		},
		elements:{
			point: {
				pointStyle: "crossRot",
				radius: 4,
			}
		},
		plugins: {
			chartAreaBorder: {
				borderColor: 'black',
				borderWidth: 2,
				// borderDash: [5, 5],
				// borderDashOffset: 2,
			},
			// chartDatagenerator: false,
			title: {
				display: true,
				text: chartTitle,
			},
		},
	},
	plugins: [chartAreaBorder],
	});
		
	return chart;
}

function selectNextHyperparameterRandom(chart) {
	var curIndex = chart.data.datasets[0].idx;
	
	if (curIndex < numSamples) {
		const minX1 = chart.options.scales.xAxis.min,
			  maxX1 = chart.options.scales.xAxis.max;
		const minX2 = chart.options.scales.yAxis.min,
			  maxX2 = chart.options.scales.yAxis.max;
		
		const x = randomInRange(0.8 * minX1, 0.8 * maxX1);
		const y = randomInRange(0.8 * minX2, 0.8 * maxX2);
		
		chart.data.datasets[0].data.push({x, y});
		chart.data.datasets[0].idx += 1;
		chart.update();
	}
}

function selectNextHyperparameterGrid(chart) {
	var curIndex = chart.data.datasets[0].idx;
	const maxRow = chart.data.datasets[0].maxRow,
		  maxCol = chart.data.datasets[0].maxCol;

	if (curIndex < (maxRow * maxCol)) {
		var row = Math.floor(curIndex / maxCol);
		var col = Math.floor(curIndex % maxCol);
		
		const minX1 = chart.options.scales.xAxis.min,
			  maxX1 = chart.options.scales.xAxis.max;
		const minX2 = chart.options.scales.yAxis.min,
			  maxX2 = chart.options.scales.yAxis.max;
		
		const x = minX1 + (((maxX1 - minX1) / (maxCol + 1)) * (col + 1));
		const y = maxX2 - (((maxX2 - minX2) / (maxRow + 1)) * (row + 1));
		
		chart.data.datasets[0].data.push({x, y});
		chart.data.datasets[0].idx += 1;
		chart.update();
	}
}

function clearChart(chart) {
	chart.data.datasets[0].data = [];
	chart.data.datasets[0].idx = 0;
	chart.update();
}










