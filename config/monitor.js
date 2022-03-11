exports.config = {
	title: 'REST server for mongodb',
	spans: [
		{
			interval: 2,
			retention: 60,
		},
		{
			interval: 30,
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
