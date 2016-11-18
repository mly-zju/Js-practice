function tplEngine(tpl, data) {
  var r = /<%(.*?)%>/g;
  var match = [];
  var code = [];
  var cursor = 0;
  var test_func = /(for|if|else|elif|switch|case|break|\{|\})/g
  code.push('var arr=[]\n');
  while (match = r.exec(tpl)) {
    code.push('arr.push("' + tpl.slice(cursor, match.index) + '")\n');
    match[1].match(test_func)
      ? code.push(match[1] + '\n')
      : code.push('arr.push(' + match[1] + ')\n');
    cursor = match.index + match[0].length;
  }
  code.push('arr.push("' + tpl.slice(cursor) + '")\n');
  code.push('return arr.join("")');
  //console.log(code.join(""));
  var fn = new Function(code.join(""));
  return fn.apply(data);
}

var tpl = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p><ul><%for(var index in this.scores){ %> <%if(index>1){ %><li><%this.scores[index]%>!!</li><%}else{%><li><%this.scores[index]%></li><%}%><%}%></ul>';
var result = tplEngine(tpl, {
  name: 'tom',
  profile: {
    age: 14
  },
  scores: [10, 11, 12]
});
console.log(result);
