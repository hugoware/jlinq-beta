//additional testing methods
jLinq.extend([
    { name:"status", type:jLinq.command.action,
        method:function(action) {
            action.apply(this);
        }},
    { name:"grab", type:jLinq.command.select,
        method:function(action) {
            return action.apply(this);
        }}
]);

//the testing framework 
var test = {
    
    //the actual tests to perform
    tests:[
        {name:"Starting new collections", method:function() {	
            //problem with empty arrays
            try { jlinq.from(); this.assert(false, "Created a new query using 'from' but no arguments.");
            } catch(e) { this.assert(true); }
            
            try { jlinq.modify(); this.assert(false, "Created a new query using 'modify' but no arguments.");
            } catch(e) { this.assert(true); }
            
            try { jlinq.query(); this.assert(false, "Created a new query using 'query' but no arguments.");
            } catch(e) { this.assert(true); }
            
        }},
        {name:"Fail new query when nothing is provided", method:function() {
            try { jLinq.from(null); this.assert(false, "Failed to throw error on nulll collection"); }
            catch (e) { this.assert(true, "count a test, message will not display."); }
        }},
        {name:"ignoreCase defaults to 'true' on new queries.", method:function() {	
            this.assert(jLinq.from([]).grab(function() { return this.ignoreCase; }), "Ignoring case was not true by default.");
        }},
        {name:"useCase can be toggled.", method:function() {	
            this.assert(jLinq.from([]).useCase().grab(function() { return !this.ignoreCase; }), "Using case was not toggled.");
        }},
        {name:"Case sensitivity can be toggled.", method:function() {	
            this.assert(jLinq.from([]).useCase().ignoreCase().grab(function() { return this.ignoreCase; }), "Case sensitivity was not toggled.");
        }},
        {name:"Equals command behaves correctly.", method:function() {	
            this.assert(jLinq.from(data.users).equals("first", "abby").count() == 1, "case insensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.users).useCase().equals("first", "Abby").count() == 1, "case sensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.users).equals("locationId", 7).count() == 5, "number failed to match correct record count.");
            this.assert(jLinq.from(data.users).equals("admin", true).count() == 11, "boolean failed to match correct record count.");
        }},
        {name:"Starts command behaves correctly.", method:function() {	
            this.assert(jLinq.from(data.grades).starts("user", "j").count() == 2, "case insensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.grades).useCase().starts("user", "j").count() == 1, "case sensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.users).starts("age", "1").count() == 6, "number failed to match correct record count.");
            this.assert(jLinq.from(data.users).starts("admin", "t").count() == 11, "boolean failed to match correct record count.");
            this.assert(jLinq.from(data.users).starts("permissions", "read").count() == 32, "case insensitive array checking did not find correct number of records");
            this.assert(jLinq.from(data.users).useCase().starts("permissions", "READ").count() == 4, "case sensitive array checking did not find correct number of records");
        }},
        {name:"Ends command behaves correctly.", method:function() {	
            this.assert(jLinq.from(data.grades).ends("user", "e").count() == 2, "Case-insensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.grades).useCase().ends("user", "e").count() == 1, "Case-sensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.users).ends("age", "2").count() == 5, "number failed to match correct record count.");
            this.assert(jLinq.from(data.users).ends("admin", "ue").count() == 11, "boolean failed to match correct record count.");
            this.assert(jLinq.from(data.users).ends("permissions", "delete").count() == 4, "case insensitive array checking did not find correct number of records");
            this.assert(jLinq.from(data.users).useCase().ends("permissions", "DELETE").count() == 1, "case sensitive array checking did not find correct number of records");
        }},
        {name:"Contains command behaves correctly.", method:function() {	
            this.assert(jLinq.from(data.grades).contains("user", "a").count() == 3, "Case-insensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.grades).useCase().contains("user", "T").count() == 1, "Case-sensitive string failed to match correct record count.");
            this.assert(jLinq.from(data.users).contains("age", "1").count() == 10, "number failed to match correct record count.");
            this.assert(jLinq.from(data.users).contains("admin", "a").count() == 21, "boolean failed to match correct record count.");
            this.assert(jLinq.from(data.users).contains("permissions", "write").count() == 13, "case insensitive array checking did not find correct number of records");
            this.assert(jLinq.from(data.users).useCase().contains("permissions", "WRITE").count() == 3, "case sensitive array checking did not find correct number of records");
        }},
        {name:"Greater command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).greater("age", 40).count() == 10, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).greater("permissions", 2).count() == 4, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).greater("first", 4).count() == 19, "String failed to find correct record count.");
        }},
        {name:"GreaterEquals command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).greaterEquals("age", 40).count() == 11, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).greaterEquals("permissions", 2).count() == 13, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).greaterEquals("first", 4).count() == 30, "String failed to find correct record count.");
        }},
        {name:"Less command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).less("age", 40).count() == 21, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).less("permissions", 2).count() == 19, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).less("first", 4).count() == 2, "String failed to find correct record count.");
        }},
        {name:"LessEquals command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).lessEquals("age", 40).count() == 22, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).lessEquals("permissions", 2).count() == 28, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).lessEquals("first", 4).count() == 13, "String failed to find correct record count.");
        }},
        {name:"Between command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).between("age", 14, 21).count() == 4, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).between("permissions", 1, 3).count() == 9, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).between("first", 3, 5).count() == 11, "String failed to find correct record count.");
        }},
        {name:"BetweenEquals command behaves correctly.", method:function() {
        	this.assert(jlinq.from(data.users).betweenEquals("age", 14, 21).count() == 9, "Numeric failed to find correct record count.");
        	this.assert(jlinq.from(data.users).betweenEquals("permissions", 1, 3).count() == 32, "Array failed to find correct record count.");
        	this.assert(jlinq.from(data.users).betweenEquals("first", 3, 5).count() == 23, "String failed to find correct record count.");
        }},
        {name:"Match command behaves correctly.", method:function() {	
            this.assert(jLinq.from(data.users).match("first", /^a/).count() == 5, "Match failed with case-insensitive string matching.");
            this.assert(jLinq.from(data.users).useCase().match("first", /a$/).count() == 3, "Match failed with case-sensitive string matching.");
            this.assert(jLinq.from(data.users).match("age", /^1/).count() == 6, "Match failed with numeric matching.");
            this.assert(jLinq.from(data.users).match("admin", /^t/).count() == 11, "Match failed with boolean matching.");
            this.assert(jLinq.from(data.users).match("permissions", /^re/).count() == 32, "Match failed with case-insensitive string matching.");
            this.assert(jLinq.from(data.users).useCase().match("permissions", /^RE/).count() == 4, "Match failed with case-sensitive string matching.");
        }},
        {name:"Sort command behaves correctly.", method:function() {	
            
            //check string sorting
            var results = jlinq.from(data.users).starts("first", "a").sort("first").select(function(rec) { return rec.first.toLowerCase(); });
            var ordered = results[0] == "abby" && results[1] == "abigail" && results[2] == "adam" && results[3] == "audrey" && results[4] == "ava";
            this.assert(ordered, "String sorting failed to create the correct order.");
            
			//check numeric sorting
            results = jlinq.from(data.users).sort("age").select(function(rec) { return rec.age; });
            ordered = results[0] == 12 && results[1] == 14 && results[2] == 14 && results[3] == 16 && results[4] == 17;
            this.assert(ordered, "Numeric sorting failed to create the correct order.");
            
            //boolean sorting
            results = jlinq.from([{val:true},{val:false}]).sort("val").select(function(r) { return r.val; });
            ordered = results[0] === false && results[1] === true;
            this.assert(ordered, "Boolean sorting failed to create the correct order.");
        
        }},
    ],
    
    //measures the time of an action
    time:function(action) {
        var start = new Date();
        action();
        var total = new Date() - start;
        return total;
    },
    
    //prepares the framework
    init:function() {
    
    	//make sure not so modify the records each selection
    	jlinq.alwaysClone = true;
    	
    	//set the defaults
        var self = this;
        self.index = 0;
        self.errors = [];
        self.target = document.getElementById("results");
        self.total = 0;
        self.tests = 0;

        //tracks test attempts
        this.assert = function(ok, msg) {
            self.tests++;
            if (ok) { return; }                    
            self.errors.push(msg);
        };
        
        //displays the final count
        var showTotal = function() {
            self.target.innerHTML += "<h4>Total Tests: " + self.total + "</h4>";
        };

        //handles doing the actual work for tests
        var performTest = function() {
            if (!test.tests[self.index]) { 
                showTotal();
                return; 
            }
	
            //reset
            self.errors = [];
        
            //try the method
            var count = null;
            try {
                count = test.time(function() { 
                    test.tests[self.index].method.apply(this);
                });
            }
            catch (e) {
                self.errors.push("Exception: " + e);
            }
        
            //if not okay, display the errors
            var result = ["<div class='result result-"];
            if (self.errors.length > 0) {
                result.push("error' >");
                result.push("<div class='result-title'>#" + (self.index + 1) + ": " + test.tests[self.index].name  + " :: " + self.tests + " tests (" + count + "ms)</div>");
                result.push("<div class='result-errors' >" + self.errors.join("<br />") + "</div>");
            }
            else {
                result.push("success' >");
                result.push("<div class='result-title'>#" + (self.index + 1) + ": " + test.tests[self.index].name  + " :: " + self.tests + " tests (" + count + "ms)</div>");
            }
            result.push("</div>");
            self.target.innerHTML += result.join("");
        
            //set the next test
            self.index++;
            self.total += self.tests;
            self.tests = 0;
            if (self.index >= test.tests.length) { 
                showTotal();
                return; 
            }
            setTimeout(performTest, 1);
    
        };

        //start the tests
        performTest();
    
    }

};

//start the testing framework
setTimeout(test.init, 100);
    