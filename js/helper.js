Handlebars.registerHelper("multiply", function(a, b){
  return a * b.toFixed(2);
});

Handlebars.registerHelper("compare", function(a, b){
  return a == b ? true : false;
});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i < n+1; ++i)
        accum += block.fn(i);
    return accum;
});