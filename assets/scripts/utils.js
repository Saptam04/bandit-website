function randomInRange(a, b) {
	return (((b - a) * (Math.random() - 1)) + b);
}

const CHART_COLORS = {
	red: 'rgb(255, 99, 132)',
	blue: 'rgb(54, 162, 235)',
	gray: 'rgb(201, 203, 207)',
	purple: 'rgb(153, 102, 255)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
};

const NAMED_COLORS = [
	CHART_COLORS.red,
	CHART_COLORS.blue,
	CHART_COLORS.gray,
	CHART_COLORS.purple,
	CHART_COLORS.orange,
	CHART_COLORS.yellow,
	CHART_COLORS.green,
];