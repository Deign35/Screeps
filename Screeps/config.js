// Please set the configuration below
module.exports = {
    screeps: {
        token: 'ae2ac21b-b395-491c-9cee-b6633e15b652',
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
}