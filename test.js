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
        {name:"Base type checking works correctly", method:function() {
        
            //checking 'not' matches for a type
            var self = this;
            var gauntlet = function(type, name) {
                if (type != jlinq.type.array) {
                    self.assert(!jlinq.util.isType(type, new Array()), "Identified new Array() as a " + name);
                    self.assert(!jlinq.util.isType(type, []), "Identified [] as a " + name);
                }
                if (type != jlinq.type.object) {
                    self.assert(!jlinq.util.isType(type, new Object()), "Identified new Object() as a " + name);
                    self.assert(!jlinq.util.isType(type, {}), "Identified an object as a " + name);
                }
                if (type != jlinq.type.string) {
                    self.assert(!jlinq.util.isType(type, ""), "Identified '_' as a " + name);
                    self.assert(!jlinq.util.isType(type, new String()), "Identified new String() as a " + name);
                }
                if (type != jlinq.type.datetime) {
                    self.assert(!jlinq.util.isType(type, new Date()), "Identified new Date() as a " + name);
                }
                if (type != jlinq.type.bool) {
                    self.assert(!jlinq.util.isType(type, new Boolean()), "Identified new Boolean() as a " + name);
                    self.assert(!jlinq.util.isType(type, new Boolean(false)), "Identified new Boolean(false) as a " + name);
                    self.assert(!jlinq.util.isType(type, new Boolean(true)), "Identified new Boolean(true) as a " + name);
                    self.assert(!jlinq.util.isType(type, false), "Identified false as a " + name);
                    self.assert(!jlinq.util.isType(type, true), "Identified true as a " + name);
                }
                if (type != jlinq.type.regex) {
                    self.assert(!jlinq.util.isType(type, new RegExp()), "Identified new RegExp() as a " + name);
                    self.assert(!jlinq.util.isType(type, /a/), "Identified regex /a/ as a " + name);
                }
                if (type != jlinq.type.method) {
                    self.assert(!jlinq.util.isType(type, new Function()), "Identified new Function() as a " + name);
                    self.assert(!jlinq.util.isType(type, function() { }), "Identified function() { } as a " + name);
                }
                if (type != jlinq.type.nothing) {
                    self.assert(!jlinq.util.isType(type, null), "Identified null as a " + name);
                }
            };
            
            //array checking
            this.assert(jlinq.util.isType(jlinq.type.array, [1,2,3]), "Did not identify [1,2,3] as an array");
            this.assert(jlinq.util.isType(jlinq.type.array, new Array()), "Did not identify new Array() as an array");
            this.assert(jlinq.util.isType(jlinq.type.array, new Array(1,2,3)), "Did not identify new Array(1,2,3) as an array");
            gauntlet(jlinq.type.array, "array");
            
            //checking Number types
            this.assert(jlinq.util.isType(jlinq.type.number, 1), "Did not identify 1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, 0.1), "Did not identify 0.1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, 0), "Did not identify 0 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, 1.1), "Did not identify 1.1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, -1), "Did not identify -1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, -0.1), "Did not identify -0.1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, -0), "Did not identify -0 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, -1.1), "Did not identify -1.1 as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(1)), "Did not identify new Number(1) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(0.1)), "Did not identify new Number(0.1) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(0)), "Did not identify new Number(0) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(1.1)), "Did not identify new Number(1.1) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(-1)), "Did not identify new Number(-1) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(-0.1)), "Did not identify new Number(-0.1) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(-0)), "Did not identify new Number(-0) as a number.");
            this.assert(jlinq.util.isType(jlinq.type.number, new Number(-1.1)), "Did not identify new Number(-1.1) as a number.");
            gauntlet(jlinq.type.number, "number");
            
            //checking string
            this.assert(jlinq.util.isType(jlinq.type.string, ""), "Did not identify '' as a string");
            this.assert(jlinq.util.isType(jlinq.type.string, "  "), "Did not identify '  ' as a string");
            this.assert(jlinq.util.isType(jlinq.type.string, (5).toString()), "Did not identify (5).toString() as a string");
            this.assert(jlinq.util.isType(jlinq.type.string, new String()), "Did not identify new String() as a string");
            this.assert(jlinq.util.isType(jlinq.type.string, new String(" ")), "Did not identify new String(' ') as a string");
            this.assert(jlinq.util.isType(jlinq.type.string, new String(5)), "Did not identify new String(5) as a string");
            gauntlet(jlinq.type.string, "string");
            
            //checking booleans
            this.assert(jlinq.util.isType(jlinq.type.bool, false), "Did not identify false as boolean");
            this.assert(jlinq.util.isType(jlinq.type.bool, true), "Did not identify true as boolean");
            this.assert(jlinq.util.isType(jlinq.type.bool, new Boolean()), "Did not identify new Boolean() as boolean");
            this.assert(jlinq.util.isType(jlinq.type.bool, new Boolean(false)), "Did not identify new Boolean(false) as boolean");
            this.assert(jlinq.util.isType(jlinq.type.bool, new Boolean(true)), "Did not identify new Boolean(true) as boolean");
            gauntlet(jlinq.type.bool, "boolean");
            
            //checking regular expressions
            this.assert(jlinq.util.isType(jlinq.type.regex, /a/), "Did not identify /a/ as a regex");
            this.assert(jlinq.util.isType(jlinq.type.regex, /a/g), "Did not identify /a/g as a regex");
            this.assert(jlinq.util.isType(jlinq.type.regex, /a/gi), "Did not identify /a/gi as a regex");
            this.assert(jlinq.util.isType(jlinq.type.regex, new RegExp()), "Did not identify new RegExp() as a regex");
            this.assert(jlinq.util.isType(jlinq.type.regex, new RegExp("abc")), "Did not identify new RegExp('abc') as a regex");
            this.assert(jlinq.util.isType(jlinq.type.regex, new RegExp("abc", "gi")), "Did not identify new RegExp('abc','gi') as a regex");
            gauntlet(jlinq.type.regex, "regex");
            
            //checking dates
            this.assert(jlinq.util.isType(jlinq.type.datetime, new Date()), "Did not identify new Date() as a datetime");
            this.assert(jlinq.util.isType(jlinq.type.datetime, new Date("2000/1/1")), "Did not identify new Date('2000/1/1') as a datetime");
            this.assert(jlinq.util.isType(jlinq.type.datetime, new Date(2000,1,1)), "Did not identify new Date(2000,1,1) as a datetime");
            gauntlet(jlinq.type.datetime, "datetime");
            
            //checking objects
            this.assert(jlinq.util.isType(jlinq.type.object, {}), "Did not identify {} as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, {x:1}), "Did not identify {x:1} as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, {x:1,y:2}), "Did not identify {x:1,y:2} as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, new Object()), "Did not identify new Object() as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, new Object({})), "Did not identify new Object({}) as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, new Object({x:1})), "Did not identify new Object({x:1}) as an object.");
            this.assert(jlinq.util.isType(jlinq.type.object, new Object({x:1,y:2})), "Did not identify new Object({x:1,y:2}) as an object.");
            gauntlet(jlinq.util.object, "object");
            
            //checking methods
            this.assert(jlinq.util.isType(jlinq.type.method, function() { }), "Did not identify function(){} as a method.");
            this.assert(jlinq.util.isType(jlinq.type.method, jlinq.from), "Did not identify jlinq.from as a method.");
            gauntlet(jlinq.util.method, "method");
            
        }},
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
        {name:"Regex escaping matching is valid", method:function() {
        	this.assert(jlinq.from([{value:"x[r]{r}^r$"}]).ends("value", "[r]{r}^r$").any(), "Failed to escape regex characters for matching.");
			this.assert(jlinq.from([{value:"x^r$"}]).ends("value", "^R$").any(), "Failed to escape regex characters for matching - case-insensitive.");
			this.assert(jlinq.from([{value:"x^r$"}]).useCase().ends("value", "^R$").none(), "Failed to escape regex characters for matching - case-sensitive.");
        }},
        {name:"Sort command behaves correctly.", method:function() {	
            var letters = [{val:"D"},{val:"c"},{val:"A"},{val:"b"}];
            var numbers = [{val:3},{val:2},{val:0},{val:1}];
            var bools = [{val:true},{val:false}];
            var arrays = [{val:[1,1,1,1]},{val:[1,1,1]},{val:[1]}];
            var nulls = [{val:null},{val:"a"},{val:"b"},{val:null}];
            
            //check string sorting
            var results = jlinq.from(letters).sort("val").select(function(rec) { return rec.val.toLowerCase(); });
            var ordered = results[0] == "a" && results[1] == "b" && results[2] == "c" && results[3] == "d";
            this.assert(ordered, "String sorting failed to create the correct order.");
            
			//check numeric sorting
            results = jlinq.from(numbers).sort("val").select(function(rec) { return rec.val; });
            ordered = results[0] == 0 && results[1] == 1 && results[2] == 2 && results[3] == 3;
            this.assert(ordered, "Numeric sorting failed to create the correct order.");
            
            //boolean sorting
            results = jlinq.from(bools).sort("val").select(function(r) { return r.val; });
            ordered = results[0] === false && results[1] === true;
            this.assert(ordered, "Boolean sorting failed to create the correct order.");
            
            //array sorting
            results = jlinq.from(arrays).sort("val").select(function(r) { return r.val.length; });
            ordered = results[0] == 1 && results[1] == 3 && results[2] == 4;
            this.assert(ordered, "Array length sorting failed to create correct order.");
            
            //sorting with nulls
            results = jlinq.from(nulls).sort("val").select(function(r) { return r.val; });
            ordered = results[0] == null && results[1] == null && results[2] == "a" && results[3] == "b";
            this.assert(ordered, "Failed to sort null values correctly.");
        
        }},
		{name:"First command behaves correctly", method:function() {
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).first().val === 1, "failed to find the first record in the results.");
			this.assert(jlinq.from([]).first() == null, "failed to find null when nothing matched as the first value.");
			this.assert(jlinq.from([]).first({val:99}).val === 99, "failed to fall back to default value when nothing was found.");
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).first({val:99}).val === 1, "used default value instead of first value as expected.");
		}},
		{name:"Last command behaves correctly", method:function() {
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).last().val === 3, "failed to find the first record in the results.");
			this.assert(jlinq.from([]).last() == null, "failed to find null when nothing matched as the first value.");
			this.assert(jlinq.from([]).last({val:99}).val === 99, "failed to fall back to default value when nothing was found.");
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).last({val:99}).val === 3, "used default value instead of first value as expected.");
		}},
		{name:"At command behaves correctly", method:function() {
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).at(1).val === 2, "failed to find the first record in the results.");
			this.assert(jlinq.from([]).at(1) == null, "failed to find null when nothing matched as the first value.");
			this.assert(jlinq.from([]).at(2, {val:99}).val === 99, "failed to fall back to default value when nothing was found.");
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).at(1, {val:99}).val === 2, "used default value instead of first value as expected.");
		}},
		{name:"Count command behaves correctly", method:function() {
			this.assert(jlinq.from([]).count() == 0, "Found matches on empty array.");
			this.assert(jlinq.from([1,1,1]).count() == 3, "Did not find correct count on a non-query select.");
			this.assert(jlinq.from([{val:1},{val:1},{val:1},{val:2}]).equals("val", 1).count() == 3, "Did not select the correct number of records on a query count.");
		}},
		{name:"Any command works correctly", method:function() {
			this.assert(!jlinq.from([]).any(), "Returned that values were found .");
			this.assert(jlinq.from([1,1,1]).any(), "Did not find matches in an array.");
			this.assert(jlinq.from([{val:1},{val:1},{val:1},{val:2}]).equals("val", 2).any(), "Did not find match after query.");
		}},
		{name:"All command works correctly", method:function() {
			this.assert(jlinq.from([]).all(), "Empty query on all matches returns true.");
			this.assert(jlinq.from([1,1,1]).all(), "Returned not all values were a match when true should have been returned.");
			this.assert(!jlinq.from([{val:1},{val:1},{val:1},{val:2}]).equals("val", 1).all(), "Returned that all values were a match when false should have been returned.");
		}},
		{name:"None command works correctly", method:function() {
			this.assert(jlinq.from([]).none(), "Empty query on all matches returns true.");
			this.assert(!jlinq.from([1,1,1]).none(), "returned there were no matches when there should be.");
			this.assert(jlinq.from([{val:1},{val:1},{val:1},{val:2}]).equals("val", 999).none(), "Query attempt should show no matches but returned false.");
		}},
		{name:"Removed selector works correctly", method:function() {
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).equals("val", 1).removed().length == 2, "Did not return the correct number of non-matches");
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).less("val", 5).removed().length == 0, "Returned removed records when query should have nothing removed.");
			this.assert(jlinq.from([{val:1},{val:2},{val:3}]).greater("val", 5).removed().length == 3, "All records should be removed but not all records were returned.");
			this.assert(jlinq.from([]).removed().length == 0, "Empty array returned a value from removed.");
		}},
		{name:"Distinct command works correctly", method:function() {
			var data = [{val:"a"},{val:"b"},{val:"c"},{val:"A"},{val:"B"},{val:"C"}];
			this.assert(jlinq.from(data).distinct("val").length == 3, "Distinct case insensitive did not return the correct total");
			this.assert(jlinq.from(data).useCase().distinct("val").length == 6, "Distinct case sensitive did not return the correct total");
			this.assert(jlinq.from([{val:0},{val:0},{val:1},{val:1},{val:2},{val:2}]).distinct("val").length == 3, "numeric distinct did not return the correct count.");
			this.assert(jlinq.from([{val:false},{val:false},{val:true},{val:true}]).distinct("val").length == 2, "boolean distinct did not return the correct count.");
			this.assert(jlinq.from([{val:new Date("1/1/1900")},{val:new Date("1/1/1900")},{val:new Date("2/1/1980")},{val:new Date("2/1/1980")}]).distinct("val").length == 2, "date distinct did not return the correct count.");
		}},
		{name:"Group command works correctly", method:function() {
		
			//string matching
			var data = [{val:"a"},{val:"b"},{val:"c"},{val:"A"},{val:"B"},{val:"C"},{val:"A"},{val:"B"},{val:"C"}];
			var result = jlinq.from(data).group("val");
			this.assert(result["A"].length == 3 && result["B"].length == 3 && result["C"].length == 3, "Case insensitive grouping did not work correctly.");
			result = jlinq.from(data).useCase().group("val");
			this.assert(result["a"].length == 1 && result["b"].length == 1 && result["c"].length == 1 && result["A"].length == 2 && result["B"].length == 2 && result["B"].length == 2, "Case sensitive grouping did not work correctly.");

			//numeric grouping
			result = jlinq.from([{val:1},{val:1},{val:2},{val:2},{val:3},{val:3},{val:1},{val:2},{val:3}]).group("val");
			this.assert(result[1].length == 3 && result[2].length == 3 && result[3].length == 3, "numeric grouping did not work correctly.");
			this.assert(result["1"].length == 3 && result["2"].length == 3 && result["3"].length == 3, "numeric grouping did not work correctly.");
			
		}},
		{name:"Is command behaves correctly", method:function() {
			this.assert(jlinq.from([{val:true},{val:false},{val:true}]).is("val").count() == 2, "Failed to find the correct count for true values");
			this.assert(jlinq.from([{val:true},{val:false},{val:true}]).notIs("val").count() == 1, "Failed to find the correct count for false values");
			this.assert(jlinq.from([{val:{}},{val:null},{val:{}}]).is("val").count() == 2, "Failed to find the correct count for object values");
			this.assert(jlinq.from([{val:{}},{val:null},{val:{}}]).notIs("val").count() == 1, "Failed to find the correct count for empty object values");
		}},
		{name:"Memorizing for Fields and Commands behaves correctly", method:function() {
			var data = [{val:"abc"},{val:"abc"},{val:"cde"}];
			this.assert(jlinq.from(data).contains("val","a").orContains("b").count() == 2, "Failed to remember field name requested.");
			this.assert(jlinq.from(data).contains("val","a").or("val","b").count() == 2, "Failed to remember command requested.");
			this.assert(jlinq.from(data).contains("val","a").or("b").count() == 2, "Failed to remember field name and command requested.");
			this.assert(jlinq.from(data).contains("val","a").andNotContains("d").count() == 2, "Failed to remember field name requested for not request.");
			this.assert(jlinq.from(data).contains("val","a").andNot("val","d").count() == 2, "Failed to remember command requested for not request.");
			this.assert(jlinq.from(data).contains("val","a").andNot("d").count() == 2, "Failed to remember field name and command requested for not request.");
		
		}},
		{name:"Skip command works correctly", method:function() {
            this.assert(jlinq.from([1,2,3]).skip(0).count() == 3, "Skip using 0 still removed records.");
            this.assert(jlinq.from([1,2,3]).skip(1).count() == 2, "Skip removes too many records.");
            this.assert(jlinq.from([1,2,3]).skip(3).count() == 0, "Skip total record count doesn't return 0 records.");
            this.assert(jlinq.from([1,2,3]).skip(99).count() == 0, "Skip too many doesn't return 0 records.");
		}},
        {name:"Take command works correctly", method:function() {
            this.assert(jlinq.from([1,2,3]).take(0).length == 0, "Take using 0 returns records.");
            this.assert(jlinq.from([1,2,3]).take(1).length == 1, "Take includes too many records.");
            this.assert(jlinq.from([1,2,3]).take(3).length == 3, "Take total record count doesn't return all records.");
            this.assert(jlinq.from([1,2,3]).take(99).length == 3, "Take too many doesn't return all records.");
		}},
        {name:"SkipTake command works correctly", method:function() {
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(0,0).length == 0, "SkipTake 0,0 did not return 0 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(0,1).length == 1, "SkipTake 0,1 did not return 1 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(0,3).length == 3, "SkipTake 0,3 did not return 3 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(0,99).length == 6, "SkipTake 0,99 did not take all records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(1,0).length == 0, "SkipTake 1,0 did not return 0 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(3,0).length == 0, "SkipTake 3,0 did not return 0 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(99,0).length == 0, "SkipTake 99,0 did not return 0 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(1,1).length == 1, "SkipTake 1,1 did not return 1 record.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(3,1).length == 1, "SkipTake 3,1 did not return 1 record.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(99,1).length == 0, "SkipTake 99,1 did not return 0 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(1,1).length == 1, "SkipTake 1,1 did not return 1 record.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(3,3).length == 3, "SkipTake 3,3 did not return 3 records.");
            this.assert(jlinq.from([1,2,3,4,5,6]).skipTake(99,99).length == 0, "SkipTake 99,99 did not return 0 records.");
		}},
		{name:"JSON string data", method:function() {
        
        
            
            this.assert(jlinq.from([{"name":"joe"},{"name":"mike"}]).ends("name", "e").count() == 2, "Did not find correct data with string named JSON data.");
		
		}},
		{name:"", method:function() {
		
		}},
		{name:"", method:function() {
		
		}}
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
        	var next = test.tests[self.index];
            if (next == null || next.name == null || next.name.length == 0) { 
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
    