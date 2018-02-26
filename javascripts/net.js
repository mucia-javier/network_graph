window.onload = init;

/*          ON LOADING THE PAGE TO THE FOLLOWING:       */
function init(){
    oneTimeAlert(); //IF first visit, ask user for a good browser
    openModal();  // Open dialog box (MODAL) to load graph files
    loadGraph();  // Load graph
  	}

/*          FIRST TIME USE DIALOG STUFF       */
// Use "localStorage" instead of cookies too check if user is loading page for first time.
function oneTimeAlert(){
    if(localStorage.getItem('hasBeenVisited') == null){
        localStorage.setItem('hasBeenVisited', 1);
        alert("It is suggested to use Chrome (or at least Firefox) to support all features.");
      }
  }

/*          SIDEBAR STUFF       */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("container").style.marginLeft = "250px";
    document.getElementById("cy").style.paddingLeft = "250px";
    }
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("container").style.marginLeft= "0";
    document.getElementById("cy").style.paddingLeft = "0";
    }

/*          MODAL STUFF (Box asking user how to load the graph)      */
function openModal(){
    document.getElementById('myModal').style.display = "block";
    }
function closeModal(){
    document.getElementById('myModal').style.display = "none";
    }
function changeModalTitle(newTitle){
    document.getElementById("modal_title").innerHTML = newTitle;
    }
function changeModalDetails(newDetails){
    document.getElementById("modal_details").innerHTML = newDetails;
    }


/*         NETWORK GRAPH STUFF       */
// From this point on it is all about the network graph. 
// Please refer to the cytoscape library documentation at http://js.cytoscape.org
  function loadGraph(){
      cytoscape({
        container: document.getElementById('cy'),
        // Options: (default: chaning) cose, grid, circle, *don't use concentric, breadthfirst
        layout: {
          name: 'preset',
          padding: 2
        },
        style: cytoscape.stylesheet()
          .selector('node')
            .css({
              'shape': 'data(faveShape)',
              'width': '160',
              'content': 'data(name)',
              'text-valign': 'center',
              'text-outline-width': 1,
              'text-outline-color': '#fff' ,
              'background-color': 'data(faveColor)',
              'color': '#000', 
              'font-weight': 'bold',
              'font-size': 12, 
              'text-wrap': 'wrap'
            })
          .selector(':selected')
            .css({
              'width': '190',
              'border-width': 18,
              'border-color': 'data(faveColor)',
              'font-size': '16px'
            })

          // this one is for when a Node is being clicked  
          .selector(":active")
                  .css({
                "overlay-color": "#ccc",
                "overlay-padding": 10,
                "overlay-opacity": 0.25 // and others… if the dev wants
                  })

          // State for when a mouse passes over a node
          .selector(".hovered")
            .css({
              'width': 'data(width)',
              "overlay-color": 'data(faveColor)',
              "overlay-padding": 7,
              "overlay-opacity": 0.20, // and others… if the dev wants
	            'font-size': '13px',
              'width': '170'
            })

          .selector('edge')
            .css({
              'curve-style': 'unbundled-bezier ', //unbundled-bezier, bezier, haystack, segments
              'opacity': .78,
              'width': 'mapData(strength, 0, 10, 0, 30)',
              'target-arrow-shape': 'triangle',
              'source-arrow-shape': 'none',
              'line-color': 'data(faveColor)',
              'source-arrow-color': 'data(faveColor)',
              'target-arrow-color': 'data(faveColor)',
              'label': 'data(label)', 
              'text-outline-width': 8,
              'text-outline-color': '#fff' ,              
              'font-size': 12, 
              'font-weight': 'bold',
              'color' : '#000', 
            })
          .selector('edge.questionable')
            .css({
              'line-style': 'dotted',
              'target-arrow-shape': 'diamond'
            })
          .selector('.faded')
            .css({
              'opacity': 0.25,
              'text-opacity': 0
            })
          .selector(':selected')
            .css({
                "overlay-color": 'data(faveColor)',
                "overlay-padding": 7,
                "overlay-opacity": 0.20 // and others… if the dev wants
            })
            ,
        elements: {
          nodes: [ ],
          edges: [ ]
          },
        ready: function(){
          window.cy = this;

/*        NODES/EDGES LISTENERS STUFF           */
        window.cy.on('mouseover', 'node', function (evt) { //cilck, tap, mouseover
            var node_x = (evt.target.position().x).toFixed(1);
            var node_y = (evt.target.position().y).toFixed(1);
            document.getElementById("notification_area").innerHTML = "<strong>NODE: </strong>"+evt.target.id()+"<br><strong>Name: </strong>"+evt.target.data('name')+"<br> Position: "+node_x+", "+node_y; // also: this.data('name')
            //var nodes = cy.filter("node[id !="+str(evt.target.id())+"]").select()
            
            // Only one node can be hovered at at the same time
            cy.nodes().forEach(function( ele ){
              ele.removeClass('hovered');
              ele.unselect();
            });
            cy.edges().forEach(function( ele ){
              ele.unselect();
            });
            cy.$('#'+evt.target.id()).addClass('hovered');
            //cy.$('#'+evt.target.id()).style( "font-size", "18px");
        });   
        // When a node is clicked it can not be hovered at the sametime
        window.cy.on('tap', 'node', function (evt) { //cilck, tap, mouseover
            openNav();
            document.getElementById("arg_a").value = evt.target.data('name');
            evt.target.removeClass('hovered');
            var node_x = Number((evt.target.position().x).toFixed(1))+100;
            var node_y = Number((evt.target.position().y).toFixed(1))+100;
            var node_id = evt.target.id()+"c";
            document.getElementById("notification_area").innerHTML = "<strong>NODE: </strong>"+evt.target.id()+"<br><strong>Name: </strong>"+evt.target.data('name')+"<br> Position: "+node_x+", "+node_y; // also: this.data('name')
            
        }); 

        window.cy.on('tap', 'edge', function (evt) {
            openNav();
            document.getElementById("arg_a").value = evt.target.data('strength');
            document.getElementById("notification_area").innerHTML = "<strong>EDGE: </strong>"+evt.target.id()+"<br><strong>Label: </strong>"+evt.target.data('label')+"<br> strength: "+evt.target.data('strength'); //Name: </strong>"+evt.target.data('name');
            //console.log(evt.target.id());
            cy.nodes().forEach(function( ele ){
              ele.removeClass('hovered');
              //ele.unselect();
            });
        });
        }
      });
    }

    function loadDefaultGraph(){
        closeModal();    
        window.cy.add([
              { group: "nodes", data: { id: 'n1', name: 'Promotive Intergroup \n Structures and Processes', weight: 80, faveColor: '#86B342', faveShape: 'rectangle' },  position: { x: 400, y: 100   } },
              { group: "nodes", data: { id: 'n2', name: 'Positive Intergroup \n Historical Memory', weight: 80, faveColor: '#86B342', faveShape: 'rectangle' },          position: { x: 100,   y: 250 } },
              { group: "nodes", data: { id: 'n3', name: 'PIR', weight: 80, faveColor: '#4A7023', faveShape: 'rectangle' },                                               position: { x: 400, y: 250 } },
              { group: "nodes", data: { id: 'n4', name: 'Positive Intergroup \n Goals and Expectations', weight: 80, faveColor: '#86B342', faveShape: 'rectangle' } ,    position: { x: 700, y: 250 } }, 
            
              { group: "nodes", data: { id: 'n5', name: 'Negative Intergroup\n Historical Memory', weight: 80, faveColor: '#ff6666', faveShape: 'rectangle' },          position: { x: 100,   y: 400 } },
              { group: "nodes", data: { id: 'n6', name: 'NIR', weight: 80, faveColor: '#990000', faveShape: 'rectangle' },                                              position: { x: 400, y: 400 } },
              { group: "nodes", data: { id: 'n7', name: 'Negative Intergroup\n Goals and Expectations', weight: 80, faveColor: '#ff6666', faveShape: 'rectangle' },     position: { x: 700, y: 400 } },
              { group: "nodes", data: { id: 'n8', name: 'Contrient Intergroup\n Structures and Processes', weight: 80, faveColor: '#ff6666', faveShape: 'rectangle' } , position: { x: 400, y: 550 } },

              { group: "edges", data: { id: 'n1_n2', source: 'n1', target: 'n2', faveColor: '#86B342', strength: 1, label: 'H21+' } },
              { group: "edges", data: { id: 'n1_n3', source: 'n1', target: 'n3', faveColor: '#86B342', strength: 1, label: 'H4+' } },
              { group: "edges", data: { id: 'n1_n4', source: 'n1', target: 'n4', faveColor: '#86B342', strength: 1, label: 'H17+' } },

              { group: "edges", data: { id: 'n2_n1', source: 'n2', target: 'n1', faveColor: '#86B342', strength: 2,  label: 'H22+' } },
              { group: "edges", data: { id: 'n2_n3', source: 'n2', target: 'n3', faveColor: '#86B342', strength: 2, label: 'H12+' }, classes: 'questionable' },
              { group: "edges", data: { id: 'n2_n4', source: 'n2', target: 'n4', faveColor: '#86B342', strength: 1,  label: 'H15' }},
              { group: "edges", data: { id: 'n2_n5', source: 'n2', target: 'n5', faveColor: '#86B342', strength: 3,  label: '-' }},

              { group: "edges", data: { id: 'n3_n1', source: 'n3', target: 'n1', faveColor: '#4A7023', strength: 4, label: '+' } },
              { group: "edges", data: { id: 'n3_n2', source: 'n3', target: 'n2', faveColor: '#4A7023', strength: 2, label: 'H11+' } },
              { group: "edges", data: { id: 'n3_n4', source: 'n3', target: 'n4', faveColor: '#4A7023', strength: 1, label: 'H7+' } },
              { group: "edges", data: { id: 'n3_n6', source: 'n3', target: 'n6', faveColor: '#4A7023', strength: 1, label: 'H2-' } },

              { group: "edges", data: { id: 'n4_n1', source: 'n4', target: 'n1', faveColor: '#86B342', strength: 3,  label: 'H18+' } },
              { group: "edges", data: { id: 'n4_n3', source: 'n4', target: 'n3', faveColor: '#86B342', strength: 2,  label: 'H8+' } }, 
              { group: "edges", data: { id: 'n4_n7', source: 'n4', target: 'n7', faveColor: '#86B342', strength: 2,  label: '-' } }, 

              { group: "edges", data: { id: 'n5_n6', source: 'n5', target: 'n2', faveColor: '#ff6666', strength: 2,  label: '-' } },
              { group: "edges", data: { id: 'n5_n2', source: 'n5', target: 'n6', faveColor: '#ff6666', strength: 3,  label: 'H14+' } },
              { group: "edges", data: { id: 'n5_n7', source: 'n5', target: 'n7', faveColor: '#ff6666', strength: 3,  label: 'H16' } },
              { group: "edges", data: { id: 'n5_n8', source: 'n5', target: 'n8', faveColor: '#ff6666', strength: 8,  label: 'H24+' } },

              { group: "edges", data: { id: 'n6_n3', source: 'n6', target: 'n3', faveColor: '#990000', strength: 6, label: 'H3-' } },
              { group: "edges", data: { id: 'n6_n5', source: 'n6', target: 'n5', faveColor: '#990000', strength: 3, label: 'H13+' } },
              { group: "edges", data: { id: 'n6_n7', source: 'n6', target: 'n7', faveColor: '#990000', strength: 2, label: 'H9+' } },
              { group: "edges", data: { id: 'n6_n8', source: 'n6', target: 'n8', faveColor: '#990000', strength: 0.2, label: '+' } },

              { group: "edges", data: { id: 'n7_n4', source: 'n7', target: 'n4', faveColor: '#ff6666', strength: 3, label: '-' } },
              { group: "edges", data: { id: 'n7_n6', source: 'n7', target: 'n6', faveColor: '#ff6666', strength: 7, label: 'H10+' } },
              { group: "edges", data: { id: 'n7_n8', source: 'n7', target: 'n8', faveColor: '#ff6666', strength: 2, label: 'H20+' } },

              { group: "edges", data: { id: 'n8_n5', source: 'n8', target: 'n5', faveColor: '#ff6666', strength: 2, label: 'H23+' } },
              { group: "edges", data: { id: 'n8_n6', source: 'n8', target: 'n6', faveColor: '#ff6666', strength: 2, label: '+' } },
              { group: "edges", data: { id: 'n8_n7', source: 'n8', target: 'n7', faveColor: '#ff6666', strength: 2, label: 'H19+' } },
          ]);
        document.getElementById("cy").style.top = "0";
    }

    function manualEntryGraph(){
        document.getElementById("auto_entry").style.display = "none";
        document.getElementById("manual_entry").style.display = "none";
        changeModalTitle("Select Nodes File");
        document.getElementById("label_nodesFile").style.display = "block";
        changeModalDetails("Load a file containing the information about the graph's nodes. (e.g. btextbxy8.txt )");
      }

  /*            SIDEBAR STUFF       */
    function loadNodesFile(filePath) {
        var reader = new FileReader();
        var output = "";
	    reader.readAsText(filePath.files[0]);
	    reader.onload = function (e) {
	        output = e.target.result;
	        addNodesFromText(output);
	    	};
    	}

    function addNodesFromText(nodesText){
        let lines = nodesText.split(/\r\n|\n|\r/);
        let line;
        for(line = 0; line < lines.length; line++){
  			let aLine = lines[line].split('\t');
  			console.log(aLine);
  			window.cy.add({
  			      group: "nodes",
  			      data: {id: "n"+line, name: aLine[0], weight: 75, faveColor: aLine[1], faveShape: 'rectangle' },
  			      position: { x: (Number(aLine[2])*100+100), y: Number(aLine[3])*100 }
  			  });
              }  
        changeModalTitle("Select Edges File");
        changeModalDetails("Load a file containing the information about the graph's edges. (e.g. c8.txt )");     
        document.getElementById("label_nodesFile").style.display = "none";
        document.getElementById("label_edgesFile").style.display = "block";
        
        }

    function loadEdgesFile(filePath) {
        var reader = new FileReader();
        var output = "";
	    reader.readAsText(filePath.files[0]);
	    reader.onload = function (e) {
	        output = e.target.result;
	        addEdgesFromText(output);
	    	};
    	} 
    function addEdgesFromText(edgesText){
        let lines = edgesText.split(/\r\n|\n|\r/);
        let line;
        for(line = 0; line < lines.length; line++){
  			let aLine = lines[line].split('\t');
  			console.log("\n # Els: "+aLine.length+", Row#: "+line);
  			console.log(aLine);
  			for(let n_i = 0; n_i<aLine.length; n_i++){
  				let entry = aLine[n_i];

  				if(entry != 0){
    					//console.log("NOT ZERO: "+entry+", idx: "+n_i);
    					let e_target = "n"+String(line);
    					let e_source = "n"+String(n_i)
    					let e_id = e_source+"_"+e_target;
    					let e_strength = Math.abs(aLine[n_i]);
    					let e_label = e_strength;//String(aLine[n_i]);
    					let e_faveColor = '#86B342';
    					if(entry>0){
    						e_faveColor = "#00EE00";
    						console.log("GREATER Thn ZERO: "+entry+", idx: "+n_i);
    						}
    					else{
    						e_faveColor = "#EE0000";
    						console.log("LESS thn ZERO: "+entry+", idx: "+n_i);
    						}

    					window.cy.add({
    					    group: "edges",
    						  data: {id: e_id, source: e_source, target: e_target, faveColor: e_faveColor, strength: e_strength, label: e_label }
    					  });
    					

    					console.log("NODE CREATED: "+e_id);

  					 }
            }
        	}
        document.getElementById("cy").style.top = "0";
        closeModal();
        }

    function updateNode(){
        let newVal = document.getElementById("arg_a").value;
        cy.elements().forEach(function( ele ){
            if(ele.selected()){
              if(ele.isNode()){
                console.log("NODE modified: "+ele.data('name'));
                ele.data( 'name', newVal );
                }
              else if( ele.isEdge() ){
                console.log("EDGE modified: "+ele.data('strength'));
                ele.data( 'strength', Number(newVal) );
                ele.data( 'label', Number(newVal) );
                }
              }
          });
        }