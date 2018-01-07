// Please set the configuration below
module.exports = {
    screeps: {
        token: 'f0e6b0a6-970e-4492-8103-d89f04d15908',
        method: 'memory.stats', // Valid Options: 'console' 'memory.stats'
        //		segment: 99, // Uncomment this line and specify segment id if you're placing stats into segment
        shard: 'shard1',
        connect: {
            // For Private servers, uncomment the following:
            // host: 'server1.screepspl.us',
            // port: 21025,
            // protocol: 'http'
        }
    },
    service: {
        url: 'https://screepspl.us',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlaWduIiwiaWF0IjoxNTEzNzQyOTQzLCJhdWQiOiJzY3JlZXBzcGwudXMiLCJpc3MiOiJzY3JlZXBzcGwudXMifQ.7WLWZmYJ_nCrYcv1w1_4rW0CM04VN6Ys8HB_IYlX0p8'	// Token supplied upon account creation
    },
    checkForUpdates: true,
    showRawStats: false, // This dumps stats to console on every push if enabled
    sampleConfig: true // REMOVE THIS LINE BEFORE RUNNING
}