const { exec } = require("child_process");
const R = require("ramda");
const async = require("async");


module.exports = {
    formatString: function(string) {
        return JSON.stringify(string, null, 4);
    },

    spliceString: function(string) {
        return this.formatString(string).split("\n");
    },

    singleQuote: function(string) {
        return string.split('"').join("'");
    },

    formatDiff: function ({modelString, backendString}, callback) {
        const model = this.spliceString(modelString);
        const backend = this.spliceString(backendString);
        const pairs = R.zip(model, backend);
        //console.log(model, backend)

        async.map(pairs, ([m,b], cb) => exec("diff <(echo \"" + m + "\") <(echo \"" + b + "\")", (err, sto, ste) => {console.log(err, sto, ste); cb(err, sto);} ), function(err, results){
            //results.filter()
            callback(err, JSON.stringify(results));
        });
    },

    format: function (diffs) {
        const formattedDiffs = diffs.map(diff => this.formatDiff(diff));

    }
};
