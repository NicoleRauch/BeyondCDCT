

module.exports = {
    formatString: function(string) {
        return JSON.stringify(string, null, 4);
    },

    formatDiff: function ({modelString, backendString}) {
         return this.formatString(modelString) + this.formatString(backendString);
    },

    format: function (diffs) {
        const formattedDiffs = diffs.map(diff => this.formatDiff(diff));

    }
};
