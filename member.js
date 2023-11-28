function skillsMember() {
  var skills = ['HTML', 'CSS', 'JS', 'React', 'Node', 'Python'];
  var member = {
    name: 'John',
    age: 25,
    skills: skills,
    greet: function() {
      console.log('Hello, I am ' + this.name + ' and I know ' + this.skills.join(', '));
    }
  };
  return member;
}