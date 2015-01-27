  (function() {
    $(function(){
      $(document).tooltip({
        track: true,
        position: {
          my: 'left top+20 center',
          at: 'right center'
        },
        content: function() { return $(this).attr('title'); }
      });
    })
    var diameter = document.body.clientWidth * .9;

    var bubble = d3.layout.pack()
                   .sort(function(a, b) {
                      return Date.parse(b.created) - Date.parse(a.created);
                    })
                    .size([diameter, diameter * .8])
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
                .attr("transform", function(d) { return "translate(" + (d.x * 1) + "," + (d.y * 1) + ")"; });

      var defs = node.append('svg:defs');
      var gradient = defs.append('svg:radialGradient')
          .attr('id', function(a,b) {
            return 'gradient_' + b
          })
          .attr('fy', '10%')
          .attr('fx', '35%');

      gradient.append('svg:stop')
              .attr('offset', '0%')
              .attr('stop-color', 'rgba(255,255,255,.9)')
              .attr('stop-opacity', .9);

      gradient.append('svg:stop')
              .attr('offset', '100%')
              .attr('stop-color', function(d) { return languageColor(d.language) })
              .attr('stop-opacity', .8);

      node.attr('title', function(d) { return [
            d.repoName.toUpperCase(),
            '<br/>',
            d.language || 'no language specified',
            '<br/>',
            d.value + ' bytes' || 'n/a',
          ].join('\n'); });

      var filter = defs.append('filter')
          .attr('id', function(a,b) { return 'blur_' + b })
          .attr('width', '120%')
          .attr('height', '120%');

      filter.append('feOffset')
            .attr('result', 'offOut')
            .attr('in', 'SourceAlpha')
            .attr('dx', 1)
            .attr('dy', 3);

      filter.append('feColorMatrix')
            .attr('result',"matrixOut")
            .attr('in',"SourceGraphic")
            .attr( "type","matrix")
            .attr('values',"0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0");

      filter.append('feGaussianBlur')
            .attr('result', 'blurOut')
            .attr('in', 'offOut')
            .attr('stDeviation', 10);

      filter.append('feBlend')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'blurOut')
            .attr('mode', 'normal');

      node.append("circle")
          .attr('r', 0).transition()
          .attr("r", function(d) { return d.r * 1; })
          .style('text-align', 'center')
          .style("fill", function(a, b) { return 'url(#gradient_'+ b +')' })
          .style('filter',function(a, b) { return 'url(#blur_'+ b +')' })
          .style("box-shadow", "5px 5px 5px rgba(0,0,0,1)");

    }

    });
    d3.select(self.frameElement).style("height", diameter + "px");

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

    function languageColor(language) {
      console.log(language)
      if (language == null) {
        return 'paleturquoise';
      }
      colors = {
        "JavaScript": 'yellow',
        "Java": 'navajowhite',
        "Ruby": 'firebrick',
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