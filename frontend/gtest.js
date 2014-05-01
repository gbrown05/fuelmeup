// instantiate the bloodhound suggestion engine
var numbers = new Bloodhound({
    datumTokenizer: function (d) {
        return d;
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: ["(A)labama", "Alaska", "Arizona", "Arkansas"]
});

// initialize the bloodhound suggestion engine
numbers.initialize();

// Get an array of datums which satisfy the query for 'a'
numbers.get('a', function (suggestions) {
    jQuery.each(suggestions, function (index, item) {
        console.log(item);
    });
});