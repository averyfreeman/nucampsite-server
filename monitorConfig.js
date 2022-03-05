exports.monitorConfig = {
	title: 'REST server for mongodb',
	spans: [
		{
			interval: 1,
			retention: 60,
		},
		{
			interval: 5,
			retention: 60,
		},
		{
			interval: 15,
			retention: 60,
		},
	],
	chartVisibility: {
		cpu: true,
		mem: true,
		load: true,
		eventLoop: true,
		heap: true,
		responseTime: true,
		rps: true,
		statusCodes: true,
	},
	healthChecks: [],
	ignoreStartsWith: '/admin',
};
