const R = require("ramda");


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

    singleDiff: function([m, b], index) {
        return m === b ? null : 'Difference in line '+index+':\nModel:\n' + this.singleQuote(m) + '\nBackend:\n' + this.singleQuote(b);
    },

    formatDiff: function ({modelString, backendString}) {
        const model = this.spliceString(modelString);
        const backend = this.spliceString(backendString);
        const pairs = R.zip(model, backend);

        return pairs.map(this.singleDiff.bind(this)).filter(R.identity);
    },

    format: function (diffs) {
        return diffs.map(diff => this.formatDiff(diff));

    }
};
