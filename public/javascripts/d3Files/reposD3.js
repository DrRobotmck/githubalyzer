  (function() {
    var diameter = 400;

    var bubble = d3.layout.pack()
    .sort(function(a, b) {
      return Date.parse(b.created) - Date.parse(a.created);
    })
    .size([diameter, diameter])
    .padding(1.5);


    d3.json("/get_repo_json", function(error, root) {
      var svgOwn = d3.select("#own").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

      var svgFork = d3.select('#forked').append('svg')
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

      addRepo(root.children[0], svgOwn);
      addRepo(root.children[1], svgFork);

      function addRepo(whichRepos, svg) {
        var node = svg.selectAll(".node")
                  .data(bubble.nodes(repos(whichRepos))
                    .filter(function(d) { return !d.children; }))
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return [
              d.repoName.toUpperCase(),
              d.language || 'no language specified',
              d.value + ' bytes' || 'n/a'
            ].join(' | '); });

        node.append("circle")
            .attr('r', 0).transition()
            .attr("r", function(d) { return d.r; })
            .style('text-align', 'center')
            .style("fill", function(d) {
              return languageColor(d.language);
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.repoName.substring(0, 1).toUpperCase(); });
      }
    });

    function repos(root) {
      var repos = [];
      root.children.forEach(function(repo){
        repos.push({
          language: repo.language,
          repoName: repo.name,
          value: repo.size,
          created: repo.created_at
        });
      });
      return {children: repos};
    }

    d3.select(self.frameElement).style("height", diameter + "px");

    function languageColor(language) {
      if (language == undefined) {
        return 'paleturquoise';
      }
      colors = {
        "JavaScript": 'gold',
        "Java": 'navajowhite',
        "Ruby": 'indianred',
        "C":'lightgreen',
        "CSS":'deepskyblue',
        "PHP":'slateblue',
        "Python":'darkseagreen',
        "C++": 'skyblue',
        "Objective-C":'dodgerblue',
        "C#":"skyblue",
        "Shell":"mediumaquamarine",
        "R":"palevioletred",
        "CoffeeScript":"palegreen",
        "Go":"royalblue",
        "Perl":"mediumvioletred",
        "Scala":"deeppink",
        "Lua":"mediumspringgreen",
        "VimL":"mediumpurple",
        "TeX":"sienna",
        "Clojure":"cornflowerblue",
        "Haskell":"coral",
        "Puppet":"lightseagreen",
        "Emacs Lisp":"mediumslateblue",
        "Erlang":"darksalmon",
        "Tcl":"orange",
        "Prolog":"orangered"
      };
      return colors[language];
    }
  })();