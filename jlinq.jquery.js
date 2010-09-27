/*
 * jLinq - jQuery Extensions
 * Hugo Bonacci - hugoware.com
 * http://creativecommons.org/licenses/by/3.0/
 */

(function() {

    //common functions
    var fn = {
    
        //begins a new jlinq query using a selector
        //for the values matched with jQuery
        query:function(selector, source) {
            
            //perform the selector if needed
            var matches = jlinq.util.isType(jlinq.type.string, selector) 
                ? source.find(selector) 
                : source;
                
            //convert the object into an array
            var records = fn.toArray(matches);
            
            //then start the new query
            var query = jlinq.from(records);
            query.$ = source;
            return query;
            
        },
        
        //finds the target of a selection
        findTarget:function(selector, source) {
            if (selector instanceof jQuery) return selector;
            if (jlinq.util.isType(jlinq.type.string, selector)) source = source.find(selector);
            return selector;
        },
        
        //performs a selection for records
        select:function(selector, records) {
            var selection = $(records);
            return jlinq.util.isType(jlinq.type.string, selector) 
                ? selection.find(selector)
                : selection;
        },
        
        //converts a jQuery object into an array
        toArray:function(obj) {
            var records = [];
            obj.each(function(i, v) { records.push($(v)); });
            return records;
        }
        
    };
    
    //helper jQuery methods
    jlinq.extend([
        
        //selects all of the matching records
        { name:"$", type:jlinq.command.select,
        method:function() {
            return fn.select(selector, this.records);
        }},
        
        //grabs the elements and applies filtering if needed
        { name:"get", type:jlinq.command.select,
        method:function(selector) {
            return fn.select(selector, this.records);
        }},
        
        //performs additional selectors for records
        { name:"include", type:jlinq.command.action,
        method:function(selector, source) {
            
            //find the elements to match against
            source = source || this.query.$;
            var matches = source.find(selector);
            
            //merge with the selection
            var records = fn.toArray(matches);
            this.records = this.records.concat(records);
        }}
        
    ]);
        
    //extend jQuery
    $.fn.query = function(selector) {
        return fn.query(selector, this);
    }
    
    //and jlinq
    jLinq.$ = function(selector) {
        return fn.query(selector, $(document.body));
    };

})();