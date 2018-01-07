const Debug = {
    CurrentCallStack: [],
    CallStack: {
        
        OutputStackTrace: function () {
            for (let index in Debug.CurrentCallStack) {
                console.log('[' + index + ']: ' + Debug.CurrentCallStack[index]);
            }

            return OK;
        },
        Push: function (callerId) {
            return Debug.CurrentCallStack.push(callerId);
        },
        Pop: function () {
            return Debug.CurrentCallStack.pop();
        },
        Clear: function () {
            Debug.CurrentCallStack = [];
            return OK;
        }
    },
};
module.exports = Debug;