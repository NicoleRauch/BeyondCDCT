const R = require("ramda");


module.exports = {
    formatString: function(obj) {
        return JSON.stringify(obj, null, 4);
    },

    spliceString: function(obj) {
        return this.formatString(obj).split("\n");
    },

    singleQuote: function(string) {
        return string.split('"').join("'");
    },

    singleDiff: function([m, b], index) {
        return m === b ? null : 'Difference in line '+index+':\nModel:\n' + this.singleQuote(m) + '\nBackend:\n' + this.singleQuote(b);
    },

    formatDiff: function ({model, backend}) {
        const modelRows = this.spliceString(model);
        const backendRows = this.spliceString(backend);
        const pairs = R.zip(modelRows, backendRows);

        return pairs.map(this.singleDiff.bind(this)).filter(R.identity);
    },

    format: function (diffs) {
        return diffs.map(diff => this.formatDiff(diff));
    }
};
