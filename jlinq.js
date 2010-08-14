var jLinq;
var jlinq;
var jl;
(function() {

    //jLinq functionality
    var framework = {
    
        //command types for extensions
        command:{
        
            //queues a comparison to filter records
            query:0,
            
            //executes all queued commands and filters the records
            select:1,
            
            //performs an immediate action to the query
            action:2
        },
        
        //common expressions
        exp:{
            //gets each part of a dot notation path
            get_path:/\./g,
            
            //escapes string so it can be used in a regular expression
            escape_regex:/[-[\]{}()*+?.,\\^$|#\s]/g
        },
        
        //common javascript types
        type:{
            nothing:-1,
            undefined:0,
            string:1,
            number:2,
            array:3,
            regex:4,
            boolean:5,
            method:6,
            object:99
        },
        
        //contains jLinq commands and functions
        library:{
        
            //the current commands in jLinq
            commands:{},
            
            //the type comparisons for jLinq
            types:{},
        
            //includes a comparison to identify types
            addType:function(type, compare) {
                framework.library.types[type] = compare;
            },
        
            //adds a command to the jLinq library
            extend:function(commands) {
            
                //convert to an array if not already
                if (!framework.util.isType(framework.type.array, commands)) {
                    commands = [commands];
                }
                
                //append each method
                framework.util.each(commands, function(command) {
                    framework.library.commands[command.name] = command;
                });
            
            },
            
            //starts a new jLinq query
            query:function(collection, clone) {
            
                //make sure something is there
                if (!framework.util.isType(framework.type.array, collection)) {
                    throw "jLinq can only query arrays of JSON objects.";
                }
                
                //clone the collection instead of using the original
                collection = clone == null || clone == true
                    ? collection.slice()
                    : collection;
            
                //holds the state of the current query
                var self = {
                
                    //the public instance of the query
                    instance:{
                    
                        //should this query ignore case
                        ignoreCase:true,
                        
                        //should the next command be evaluated as not
                        not:false,
                        
                        //the action that was last invoked
                        lastCommand:null,
                        
                        //the name of the last field queried
                        lastField:null,
                    
                        //the current records available
                        records:collection,
                    
                        //records that have been filtered out
                        removed:[],
                        
                        //tells a query to start a new function
                        or:function() { self.startNewCommandSet(); },
                        
                        //the query creator object
                        query:{}
                        
                    },

                    //commands waiting to execute
                    commands:[[]],
                    
                    //executes the current query and updated the records
                    execute:function() {
                        var results = [];
                        
                        //get the current state of the query
                        var state = self.instance;
                        
                        //start checking each record
                        framework.util.each(self.instance.records, function(record) {
                            
                            //update the state
                            state.record = record;

                            //perform the evaluation
                            if (self.evaluate(state)) { 
                                results.push(record); 
                            }
                            else {
                                self.instance.removed.push(record);
                            }
                        });
                        
                        //update the matching records
                        self.instance.records = results;
                    },
                    
                    //tries to find a value from the path name
                    findValue:framework.util.findValue,
                    
                    //evaluates each queued command for matched
                    evaluate:function(state) {
                        
                        //check each of the command sets
                        for (var command in self.commands) {
                        
                            //each set represents an 'or' set - if any
                            //match then return this worked
                            var set = self.commands[command];
                            if (self.evaluateSet(set, state)) { return true; }
                            
                        };
                        
                        //since nothing evaluated, return it failed
                        return false;
                        
                    },
                    
                    //evaluates a single set of commands
                    evaluateSet:function(set, state) {
                    
                        //check each command in this set
                        for (var item in set) {
                            
                            //get the details to use
                            var command = set[item];
                            state.value = self.findValue(state.record, command.path);
                            state.compare = function(types) { return framework.util.compare(state.value, types, state); };
                            state.when = function(types) { return framework.util.when(state.value, types, state); };
                                
                            //evaluate the command
                            try {
                                var result = command.method.apply(state, command.args);
                                if (command.not) { result = !result; }
                                if (!result) { return false; }
                            }
                            //errors and exceptions just result in a failed
                            //to evaluate as true
                            catch (e) {
                                return false;
                            }
                            
                        }
                        
                        //if nothing failed then return it worked
                        return true;
                        
                    },
                    
                    //repeats the previous command with new
                    //arguments
                    repeat:function(arguments) {
                    
                        //make sure there is enough information to repeat a command
                        if (!(self.instance.lastCommand && 
                            arguments.length == self.instance.lastCommand.method.length)) {
                            return;
                        }
                        
                        //since the command is ready
                        self.queue(self.instance.lastCommand, arguments);
                    },
                    
                    //saves a command to evaluate later
                    queue:function(command, args) {
                        self.instance.lastCommand = command;
                        
                        //the base detail for the command
                        var detail = {
                            name:command.name,
                            method:command.method,
                            field:self.instance.lastField,
                            count:command.method.length,
                            args:args,
                            not:self.not
                        };
                        
                        //check to see if there is an extra argument which should
                        //be the field name argument
                        if (detail.args.length > command.method.length) {
                        
                            //if so, grab the name and update the arguments
                            detail.field = detail.args[0];
                            detail.args = framework.util.remaining(detail.args, 1);
                            self.instance.lastField = detail.field;
                        }
                        
                        //get the full path for the field name
                        detail.path = detail.field;
                        
                        //queue the command to the current set
                        self.commands[self.commands.length-1].push(detail);

                        //then reset the not state
                        self.not = false;
                    
                    },
                    
                    //creates a new set of methods that should be evaluated
                    startNewCommandSet:function() {
                        self.commands.push([]);
                    },
                    
                    //marks a command to evaluate as NOT
                    setNot:function() {
                        self.not = !self.not;
                    }
                    
                };
                
                //append each of the functions
                framework.util.each(framework.library.commands, function(command) {
                
                    //Query methods queue up and are not evaluated until
                    //a selection or action command is called
                    if (command.type == framework.command.query) {
                        
                        //the default action to perform
                        var action = function() {
                            self.queue(command, arguments);
                            return self.instance.query;
                        };
                        
                        //create the default action
                        self.instance.query[command.name] = action;
                        
                        //orCommand
                        var name = framework.util.operatorName(command.name);
                        self.instance.query["or"+name] = function() {
                            self.startNewCommandSet();
                            return action.apply(null, arguments);
                        };
                        
                        //orNotCommand
                        self.instance.query["orNot"+name] = function() {
                            self.setNot();
                            self.startNewCommandSet();
                            return action.apply(null, arguments);
                        };
                        
                        //andCommand
                        self.instance.query["and"+name] = function() {
                            return action.apply(null, arguments);
                        };
                        
                        //andNotCommand
                        self.instance.query["andNot"+name] = function() {
                            self.setNot();
                            return action.apply(null, arguments);
                        };
                        
                        //notCommand
                        self.instance.query["not"+name] = function() {
                            self.setNot();
                            return action.apply(null, arguments);
                        };
                        
                    }
                    
                    //Selections commands flush the queue of commands
                    //before they are executed. A selection command
                    //must return something (even if it is the current query)
                    else if (command.type == framework.command.select) {
                        self.instance.query[command.name] = function() {
                        
                            //apply the current changes
                            self.execute();
                            
                            //get the current state of the query
                            var state = self.instance;
                            state.compare = function(value, types) { return framework.util.compare(value, types, state); };
                            state.when = function(value, types) { return framework.util.when(value, types, state); };
                            
                            //perform the work
                            return command.method.apply(state, arguments);
                        };
                    }
                    
                    //actions evaluate immediately then return control to
                    //the query 
                    else if (command.type == framework.command.action) {
                        self.instance.query[command.name] = function() {
                        
                            //get the current state of the query
                            var state = self.instance;
                            state.compare = function(value, types) { return framework.util.compare(value, types, state); };
                            state.when = function(value, types) { return framework.util.when(value, types, state); };
                        
                            //perform the work
                            command.method.apply(state, arguments);
                            return self.instance.query;
                        };
                    }
                
                });
                
                //causes the next command to be an 'or'
                self.instance.query.or = function() {
                    self.startNewCommandSet();
                    self.repeat(arguments);
                    return self.instance.query;
                };
                
                //causes the next command to be an 'and' (which is default)
                self.instance.query.and = function() { 
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //causes the next command to be a 'not'
                self.instance.query.not = function() { 
                    self.setNot();
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //return the query information
                return self.instance.query;
            
            }
            
        },
        
        //variety of helper methods
        util:{
        
            //creates an invocation handler for a field
            //name instead of grabbing values
            invoke:function(obj, args) {
                //copy the array to avoid breaking any other calls
                args = args.concat();
                
                //the name should be the first argument
                var path = args[0];

                //find the method and extract the arguments
                var method = framework.util.findValue(obj, path);
                args = jLinq.util.select(args, null, 1, null);
                
                //return the result of the call
                try {
                    return method.apply(obj, args);
                }
                catch (e) {
                    return null;
                }
                
            },
        
            //gets a path from a field name
            getPath:function(path) {
                return (path+"").split(framework.exp.get_path);
            },
        
            //searches an object to find a value
            findValue:function(obj, path) {
            
                //start by checking if this is actualy an attempt to 
                //invoke a value on this property
                if (framework.util.isType(framework.type.array, path)) {
                    return framework.util.invoke(obj, path);
                    
                }
                //if this referring to a field
                else if (framework.util.isType(framework.type.string, path)) {

                    //get each part of the path
                    path = framework.util.getPath(path);

                    //search for the record
                    var index = 0;
                    while(obj != null && index < path.length) {
                        obj = obj[path[index++]];
                    }
                    
                    //return the final found object
                    return obj;
                    
                }
                //nothing that can be read, just return the value
                else {
                    return obj;
                }
                
            },
        
            //returns the value at the provided index
            elementAt:function(collection, index) {
                return collection && collection.length > 0 && index < collection.length && index >= 0 
                    ? collection[index]
                    : null;
            },
        
            //makes a string save for regular expression searching
            regexEscape:function(val) {
                return (val ? val : "").toString().replace(framework.exp.escape_regex, "\\$&");
            },
            
            //matches expressions to a value
            regexMatch:function(expression, source, ignoreCase) {
            
                //get the string value if needed
                if (framework.util.isType(framework.type.regex, expression)) {
                    expression = expression.source;
                }
            
                //create the actual expression and match
                expression = new RegExp((expression ? expression+"" : "").toString(), ignoreCase ? "gi" : "g");
                return (source+"").match(expression) != null;
            },
        
            //converts a command to an operator name
            operatorName:function(name) {
                return name.replace(/^\w/, function(match) { return match.toUpperCase(); });
            },
        
            //changes a value based on the type
            compare:function(value, types, state) {
                var result = framework.util.when(value, types, state);
                return result == true ? result : false;
            },
            
            //performs the correct action depending on the type
            when:function(value, types, state) {

                //get the kind of object this is
                var kind = framework.util.getType(value);
                
                //check each of the types
                for (var item in types) {
                    var type = framework.type[item];
                    if (type == kind) { 
                        return types[item].apply(state, [value]); 
                    }
                }
                
                //if there is a fallback comparison
                if (types.other) { return types.other.apply(state, [value]); }
                
                //no matches were found
                return null;
            },
        
            //performs an action on each item in a collection
            each:function(collection, action) {
                var index = 0;
                for(var item in collection) action(collection[item], index++);
            },
            
            //performs an action to each item in a collection and then returns the items
            grab:function(collection, action) {
                var list = [];
                framework.util.each(collection, function(item) {
                    list.push(action(item));
                });
                return list;
            },
            
            //performs an action on each item in a collection
            until:function(collection, action) {
                var index = 0;
                for(var item in collection) {
                    var result = action(collection[item], index++);
                    if (result === true) { return true; }
                }
                return false;
            },
        
            //checks if the types match
            isType:function(type, value) {
                return framework.util.getType(value) == type;
            },
            
            //finds the type for an object
            getType:function(obj) {
            
                //check if this even has a value
                if (obj == null) { return framework.type.nothing; }
                
                //check each type except object
                for (var item in framework.library.types) {
                    if (framework.library.types[item](obj)) { return item; }
                }
                
                //no matching type was found
                return framework.type.object;
            },
            
            //grabs remaining elements from and array
            remaining:function(array, at) {
                var results = [];
                for(; at < array.length; at++) results.push(array[at]);
                return results;
            },
            
            //append items onto a target object
            apply:function(target, source) {
                for(var item in source) {
                    target[item] = source[item];
                }
                return target;
            },
            
            //performs sorting on a collection of records
            reorder:function(collection, fields, ignoreCase) {
            
                //reverses the fields so that they are organized
                //in the correct order
                return framework.util._performSort(collection, fields, ignoreCase);
            },
            
            //handles actual work of reordering (call reorder)
            _performSort:function(collection, fields, ignoreCase) {
            
                //get the next field to use
                var field = fields.splice(0, 1);
                if (field.length == 0) { return collection; }
                field = field[0];
                               
                //check for the direction
                var desc = field.match(/^\-/);
                if (desc) { field = field.substr(1); }
                
                //reorder the actual collection now
                collection.sort(function(a, b) {
                    
                    //find the values to compare
                    a = framework.util.findValue(a, field);
                    b = framework.util.findValue(b, field);
                    
                    //check for case
                    if (ignoreCase && 
                        framework.util.isType(framework.type.string, a) && 
                        framework.util.isType(framework.type.string, b)) {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                    }
                    
                    //perform the sorting
                    var result = a < b ? -1 : a > b ? 1 : 0;
                    return desc ? -result : result;
                    
                });
                
                //check for sub groups if required
                if (fields.length > 0) {
                
                    //create the container for the results
                    var sorted = [];
                    var groups = framework.util.group(collection, field, ignoreCase);
                    framework.util.each(groups, function(group) {
                        var listing = fields.slice();
                        var records = framework.util._performSort(group, listing, ignoreCase);
                        sorted = sorted.concat(records);
                    });
                    
                    //update the main collection
                    collection = sorted;
                }
                
                //the final results
                return collection;
            },
            
            //returns groups of unique field values
            group:function(records, field, ignoreCase) {
            
                //create a container to track group names
                var groups = {};
                for(var item in records) {
                    
                    //get the values
                    var record = records[item];
                    var alias = framework.util.findValue(record, field)+"";
                    alias = ignoreCase ? alias.toUpperCase() : alias;

                    //check for existing values
                    if (!groups[alias]) { 
                        groups[alias] = [record]; 
                    }
                    else {
                        groups[alias].push(record);
                    }
                    
                }
                
                //return the matches
                return groups;
            
            },
            
            //compares two values for equality
            equals:function(val1, val2, ignoreCase) {
                return framework.util.when(val1, {
                    string:function() {
                        return framework.util.regexMatch(
                            "^"+framework.util.regexEscape(val2)+"$", 
                            val1, 
                            ignoreCase); 
                    },
                    other:function() { return (val1 == null && val2 == null) || (val1 === val2); }
                });
            },
            
            //converts an object to an array of elements
            toArray:function(obj) {
                var items = [];
                for (var item in obj) {
                    items.push(obj[item]);
                }
                return items;
            },
            
            //grabs a range and format for records
            select:function(collection, action, start, end) {

                //grab the records if there is a range
                start = start ? start : 0;
                end = end ? end : collection.length;
                var results = collection.splice(start, end);
                
                //check if this is a mapping method
                if (jLinq.util.isType(jLinq.type.object, action)) {
                    var map = action;
                    action = function(rec) {
                        
                        //map existing values or defaults
                        var create = {};
                        for (var item in map) {
                            create[item] = rec[item]
                                ? rec[item]
                                : map[item];
                        }
                        
                        //return the created record
                        return create;
                    
                    };
                };
                
                //if there is a selection method, use it
                if (jLinq.util.isType(jLinq.type.method, action)) {
                    for (var i = 0; i < results.length; i++) {
                        var record = results[i];
                        results[i] = action.apply(record, [record]);
                    }
                }
                
                //return the final set of records
                return results;
            }
            
        }
    
    };
    
    //default types
    framework.library.addType(framework.type.nothing, function(value) { return value == null; });
    framework.library.addType(framework.type.array, function(value) { return value.push && value.splice; });
    framework.library.addType(framework.type.string, function(value) { return value.substr && value.toLowerCase; });
    framework.library.addType(framework.type.number, function(value) { return value.toFixed && value.toExponential; });
    framework.library.addType(framework.type.regex, function(value) { return value.exec && value.compile; });
    framework.library.addType(framework.type.boolean, function(value) { return value === true || value === false; });
    framework.library.addType(framework.type.method, function(value) { return value.apply && value.call; });
    
    //add the default methods
    framework.library.extend([
    
        //sets a query to ignore case
        { name:"ignoreCase", type:framework.command.action, 
            method:function() {
                this.ignoreCase = true;
            }},
            
        //reverses the current set of records
        { name:"reverse", type:framework.command.action, 
            method:function() {
                this.records.reverse();
            }},
            
        //sets a query to evaluate case
        { name:"useCase", type:framework.command.action, 
            method:function() {
                this.ignoreCase = false;
            }},
            
        //performs an action for each record
        { name:"each", type:framework.command.action,
            method:function(field, action) {
                jLinq.util.each(this.records, function(record) { action(record); });
            }},
            
        //attaches a value or result of a method to each record
        { name:"attach", type:framework.command.action,
            method:function(field, action) {
                this.when(action, {
                    method:function() { jLinq.util.each(this.records, function(record) { record[field] = action(record); }); },
                    other:function() { jLinq.util.each(this.records, function(record) { record[field] = action; }); }
                });
            }},
            
        //joins two sets of records by the key information provided
        { name:"join", type:framework.command.action,
            method:function(source, alias, pk, fk) {
                jLinq.util.each(this.records, function(record) {
                    record[alias] = jLinq.from(source).equals(fk, record[pk]).select();
                });
            }},
            
        //joins a second array but uses only the first matched record. Allows for a default for a fallback value
        { name:"assign", type:framework.command.action,
            method:function(source, alias, pk, fk, fallback) {
                jLinq.util.each(this.records, function(record) {
                    record[alias] = jLinq.from(source).equals(fk, record[pk]).firstOr(fallback);
                });
            }},
            
        //joins two sets of records by the key information provided
        { name:"sort", type:framework.command.action,
            method:function() {
                var args = jLinq.util.toArray(arguments);
                this.records = jLinq.util.reorder(this.records, args, this.ignoreCase);
            }},
    
        //are the two values the same
        { name:"equals", type:framework.command.query, 
            method:function(value) {
                return jLinq.util.equals(this.value, value, this.ignoreCase);
            }},
            
        //does this start with a value
        { name:"starts", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return jLinq.util.equals(this.value[0], value, this.ignoreCase); },
                    other:function() { return jLinq.util.regexMatch(("^"+jLinq.util.regexEscape(value)), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"ends", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return jLinq.util.equals(this.value[this.value.length - 1], value, this.ignoreCase); },
                    other:function() { return jLinq.util.regexMatch((jLinq.util.regexEscape(value)+"$"), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"contains", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { 
                        var ignoreCase = this.ignoreCase;
                        return jLinq.util.until(this.value, function(item) { return jLinq.util.equals(item, value, ignoreCase); }); 
                    },
                    other:function() { return jLinq.util.regexMatch(jLinq.util.regexEscape(value), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"match", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { 
                        var ignoreCase = this.ignoreCase;
                        return jLinq.util.until(this.value, function(item) { return jLinq.util.regexMatch(value, item, ignoreCase); }); 
                    },
                    other:function() { return jLinq.util.regexMatch(value, this.value, this.ignoreCase); }
                });
            }},
            
        //checks if the value matches the type provided
        { name:"type", type:framework.command.query, 
            method:function(type) {
                return jLinq.util.isType(type, this.value);
            }},
            
        //is the value greater than the argument
        { name:"greater", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length > value; },
                    string:function() { return this.value.length > value; },
                    other:function() { return this.value > value; }
                });
            }},
            
        //is the value greater than or equal to the argument
        { name:"greaterEquals", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length >= value; },
                    string:function() { return this.value.length >= value; },
                    other:function() { return this.value >= value; }
                });
            }},
            
        //is the value less than the argument
        { name:"less", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length < value; },
                    string:function() { return this.value.length < value; },
                    other:function() { return this.value < value; }
                });
            }},
            
        //is the value less than or equal to the argument
        { name:"lessEquals", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length <= value; },
                    string:function() { return this.value.length <= value; },
                    other:function() { return this.value <= value; }
                });
            }},
            
        //is the value between the values provided
        { name:"between", type:framework.command.query, 
            method:function(low, high) {
                return this.compare({
                    array:function() { return this.value.length > low && this.value.length < high; },
                    string:function() { return this.value.length > low && this.value.length < high; },
                    other:function() { return this.value > low && this.value < high; }
                });
            }},
            
        //is the value between or equal to the values provided
        { name:"betweenEquals", type:framework.command.query, 
            method:function(low, high) {
                return this.compare({
                    array:function() { return this.value.length >= low && this.value.length <= high; },
                    string:function() { return this.value.length >= low && this.value.length <= high; },
                    other:function() { return this.value >= low && this.value <= high; }
                });
            }},
            
        //returns if a value is null or contains nothing
        { name:"empty", type:framework.command.query, 
            method:function() {
                return this.compare({
                    array:function() { return this.value.length == 0; },
                    string:function() { return this.value+"" == ""; },
                    other:function() { return this.value == null; }
                });
            }},
            
        //returns if a value is true or exists
        { name:"is", type:framework.command.query, 
            method:function() {
                return this.compare({
                    boolean:function() { return this.value === true; },
                    other:function() { return this.value != null; }
                });
            }},
        
        //gets the smallest value from the collection
        { name:"min", type:framework.command.select,
            method:function(field) {
                var matches = jLinq.util.reorder(this.records, [field], this.ignoreCase);
                return jLinq.util.elementAt(matches, 0);
            }},
            
        //gets the largest value from the collection
        { name:"max", type:framework.command.select,
            method:function(field) {
                var matches = jLinq.util.reorder(this.records, [field], this.ignoreCase);
                return jLinq.util.elementAt(matches, matches.length - 1);
            }},
            
        //returns the sum of the values of the field
        { name:"sum", type:framework.command.select,
            method:function(field) {
                var sum; 
                jLinq.util.each(this.records, function(record) {
                    var value = jLinq.util.findValue(record, field);
                    sum = sum == null ? value : (sum + value);
                });
                return sum;
            }},
            
        //returns the sum of the values of the field
        { name:"average", type:framework.command.select,
            method:function(field) {
                var sum; 
                jLinq.util.each(this.records, function(record) {
                    var value = jLinq.util.findValue(record, field);
                    sum = sum == null ? value : (sum + value);
                });
                return sum / this.records.length;
            }},
                
        //skips the requested number of records
        { name:"skip", type:framework.command.select,
            method:function(skip, selection) {
                var results = this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection, skip, null); },
                    object:function() { return jLinq.util.select(this.records, selection, skip, null); },
                    other:function() { return jLinq.util.select(this.records, null, skip, null); }
                });
                return jLinq.from(results);
            }},
            
        //takes the requested number of records
        { name:"take", type:framework.command.select,
            method:function(take, selection) {
                var results = this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection, null, take); },
                    object:function() { return jLinq.util.select(this.records, selection, null, take); },
                    other:function() { return jLinq.util.select(this.records, null, null, take); }
                });
                return jLinq.from(results);
            }},
            
        //skips and takes records
        { name:"skipTake", type:framework.command.select,
            method:function(skip, take, selection) {
                var results = this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection, skip, take); },
                    object:function() { return jLinq.util.select(this.records, selection, skip, take); },
                    other:function() { return jLinq.util.select(this.records, null, skip, take); }
                });
                return jLinq.from(results);
            }},
            
        //selects the remaining records
        { name:"select", type:framework.command.select,
            method:function(selection) {
                return this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection); },
                    object:function() { return jLinq.util.select(this.records, selection); },
                    other:function() { return this.records; }
                });
            }},
            
        //selects all of the distinct values for a field
        { name:"distinct", type:framework.command.select,
            method:function(field) {
                var groups = jLinq.util.group(this.records, field, this.ignoreCase);
                return jLinq.util.grab(groups, function(record) {
                    return jLinq.util.findValue(record[0], field);
                });
            }},
            
        //groups the values of a field by unique values
        { name:"group", type:framework.command.select,
            method:function(field) {
                return jLinq.util.group(this.records, field, this.ignoreCase);
            }},
            
        //selects records into a new format
        { name:"define", type:framework.command.select,
            method:function(selection) {
                var results = this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection); },
                    object:function() { return jLinq.util.select(this.records, selection); },
                    other:function() { return this.records; }
                });
                return jLinq.from(results);
            }},
            
        //returns if a collection contains any records
        { name:"any", type:framework.command.select,
            method:function() {
                return this.records.length > 0;
            }},
            
        //returns if no records matched this query
        { name:"none", type:framework.command.select,
            method:function() {
                return this.records.length == 0;
            }},
            
        //returns if all records matched the query
        { name:"all", type:framework.command.select,
            method:function() {
                return this.removed.length == 0;
            }},
            
        //returns the first record found
        { name:"first", type:framework.command.select,
            method:function() {
                return jLinq.util.elementAt(this.records, 0);
            }},
            
        //returns the last record found
        { name:"last", type:framework.command.select,
            method:function() {
                return jLinq.util.elementAt(this.records, this.records.length - 1);
            }},
            
        //returns the record at the provided index
        { name:"at", type:framework.command.select,
            method:function(index) {
                return jLinq.util.elementAt(this.records, index);
            }},
                
        //returns the first record found or the fallback value if nothing was found
        { name:"firstOr", type:framework.command.select,
            method:function(fallback) {
                var record = jLinq.util.elementAt(this.records, 0);
                return record == null ? fallback : record;
            }},
            
        //returns the last record found or the fallback value if nothing was found
        { name:"lastOr", type:framework.command.select,
            method:function(fallback) {
                var record = jLinq.util.elementAt(this.records, this.records.length - 1);
                return record == null ? fallback : record;
            }},
            
        //returns the record at the provided index or the fallback value if nothing was found
        { name:"atOr", type:framework.command.select,
            method:function(index) {
                var record = jLinq.util.elementAt(this.records, index);
                return record == null ? fallback : record;
            }},
                    
        //returns the remaining count of records
        { name:"count", type:framework.command.select,
            method:function() {
                return this.records.length;
            }},
            
        //selects the remaining records
        { name:"removed", type:framework.command.select,
            method:function() {
                return this.removed;
            }},
            
        //performs a manual comparison of records
        { name:"where", type:framework.command.select, 
            method:function(compare) {
                
                //filter the selection
                var state = this;
                var matches = [];
                jLinq.util.each(this.records, function(record) {
                    if (compare.apply(state, [record]) === true) { matches.push(record); }
                });
                
                //create a new query with matching arguments
                var query = jLinq.from(matches);
                if (!this.ignoreCase) { query.useCase(); }
                return query;
            }}
            
        ]);
    
    //set the public object
    jLinq = {
    
        //command types (select, query, action)
        command:framework.command,
        
        //types of object and values
        type:framework.type,
        
        //allows command to be added to the library
        extend:function() { framework.library.extend.apply(null, arguments); },
        
        //starts a new query with the array provided
        from:function(collection) { return framework.library.query(collection); },
        
        //returns a list of commands in the library
        getCommands:function() {
            return framework.util.grab(framework.library.commands, function(command) {
                return {
                    name:command.name,
                    typeId:command.type,
                    type:command.type == framework.command.select ? "select"
                        : command.type == framework.command.query ? "query"
                        : command.type == framework.command.action ? "action"
                        : "unknown"
                };
            });
        },
        
        //helper functions for jLinq
        util:{
        
            //loops and finds a value in an object from a path
            findValue:framework.util.findValue,
        
            //gets an element at the specified index (if any)
            elementAt:framework.util.elementAt,
        
            //returns a regex safe version of a string
            regexEscape:framework.util.regexEscape,
            
            //compares an expression to another string
            regexMatch:framework.util.regexMatch,
        
            //compares equality of two objects
            equals:framework.util.equals,
            
            //gets groups for a collection
            group:framework.util.group,
            
            //updates the order of a collection
            reorder:framework.util.reorder,
            
            //performs a function when a value matches a type
            when:framework.util.when,
            
            //converts an object to an array of values
            toArray:framework.util.toArray,
            
            //loops for each record in a set
            each:framework.util.each,
            
            //grabs a collection of items
            grab:framework.util.grab,
            
            //loops records until one returns true or the end is reached
            until:framework.util.until,
            
            //returns if an object is the provided type
            isType:framework.util.isType,
            
            //determines the matching type for a value
            getType:framework.util.getType,
            
            //applies each source property to the target
            apply:framework.util.apply,
            
            //uses the action to select items from a collection
            select:framework.util.select
            
        }
    };
    
    //set the other aliases
    jlinq = jLinq;
    jl = jLinq;
})();