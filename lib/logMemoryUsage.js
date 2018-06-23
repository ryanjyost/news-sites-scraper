const bytes = require('bytes');

module.exports = function logMemoryUsage() {
	const usage =process.memoryUsage();
	console.log('MEMORY:', 'RSS=', bytes(usage.rss), ' / HeapTotal=', bytes(usage.heapTotal), ' / HeapUsed=', bytes(usage.heapUsed))
	return usage;
}