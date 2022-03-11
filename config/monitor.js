exports.config = {
	title: 'endpoints for mongodb',
	webSocket: '/socket.io',
	spans: [
		{
			interval: 2,
			retention: 60,
		},
		{
			interval: 10,
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
