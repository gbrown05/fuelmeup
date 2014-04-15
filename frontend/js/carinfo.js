var carMakes = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 10,
  prefetch: {
    // url points to a json file that contains an array of car makes
    url: '../../db/makes.json',
    // the json file contains an array of strings, but the Bloodhound
    // suggestion engine expects JavaScript objects so this converts all of
    // those strings
    filter: function(list) {
      return $.map(list, function(makes) { return { name: makes }; });
    }
  }
});
 
// kicks off the loading/processing of `local` and `prefetch`
carMakes.initialize();
 
// passing in `null` for the `options` arguments will result in the default
// options being used
$('#carmakes .typeahead').typeahead(null, {
  name: 'carMakes',
  displayKey: 'name',
  // `ttAdapter` wraps the suggestion engine in an adapter that
  // is compatible with the typeahead jQuery plugin
  source: carMakes.ttAdapter()
});

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var gases, substringRegex;
 
    // an array that will be populated with substring matches
    gases = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        gases.push({ value: str });
      }
    });
 
    cb(gases);
  };
};
 
var types = ['Premium', 'Plus', 'Regular', 'Diesel', 'Jet Fuel'
];
 
$('#typegas .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'types',
  displayKey: 'value',
  source: substringMatcher(types)
});