const isExist = (ref)       => typeof ref != 'undefined' && ref!=null;
const isArray = (ref)       => typeof ref=='object' && ref!=null;
const isFunction = (ref)    => typeof ref=='function' && ref!=null;
const isObject = (ref)      => typeof ref=='object' && ref!=null;
const getValue = (ref, def) => isExist(ref) ? ref : def;

function cloneObject(obj)
	{
	return JSON.parse(JSON.stringify(obj));	// nepouzivat Object.assign({}, obj), nefunguje spravne u parseru!
	}

function cloneArray(arr)
	{
	return JSON.parse(JSON.stringify(arr));
	}

Vue.component('info-category', {
    props: ['group_id', 'category', 'category_index'],
    template: `
    <div class="AttributeClass">
    <table>
        <tr is="info-item"
            v-for="(item, index) in category.list"
            v-bind:group_id="group_id"
            v-bind:attr="item"
            v-bind:category_index="category_index"
            v-bind:category_id="category.id"
        ></tr>
    </table>
    </div>`
  });

Vue.component('info-item', {
    props: ['group_id', 'attr', 'category_index', 'category_id'],
    data: function() {
           return  {
	      for_id: 'field[' + this.category_id + '][' + this.attr.id + ']',
	   }},
    template: `
    <tr>
        <td><label for="{{for_id}}">{{ attr.id }}</label></td>
        <td class="input"><input type="text" id="{{for_id}}" name="{{for_id}}"
		v-bind:value="attr.value"
                v-on:change=""
        ></td>
    </tr>`
  });

Vue.component('attribute-category', {
    props: ['category'],
    computed: {
        tooMany: function() {
            return this.category.sum > (this.category.allowed)
        }
    },
    methods: {
        recomputeSum: function() { 
            var newsum = 0
            for(var i = 0; i < this.category.list.length; i++) {
                newsum = newsum + this.category.list[i].value
            }            
            this.category.sum = newsum
            this.$emit('sumchanged')
        }        
    },
    template: `
    <div class="AttributeClass">
    <h3>{{ category.id }}
    <span 
        v-bind:class="{textred: tooMany}"> 
        {{ category.sum }}
    </span> of {{ category.allowed }}</h3>
    <table>
        <tr is="attribute-item"
            v-for="item in category.list"
            v-bind:attr="item"
            v-bind:key="item.id"
            v-on:attrchanged="recomputeSum"
        ></tr>
    </table>
    </div>
    `
})

Vue.component('attribute-item', {
    props: ['attr'],
    data: function() { return {
	hover: -1
    } },
    methods: {
        setAttrValue: function(attr, index) {
            attr.value = attr.value==index ? index-1 : index
            if (isExist(attr.value_range))
                {
                attr.value = attr.value<attr.value_range[0] ? attr.value_range[0] : attr.value>attr.value_range[1] ? attr.value_range[1] : attr.value
                }
        },
        setClass: function(value, index, hover) { return {
	    'circle'     : true,
	    'circleBlack': index<=value,
	    'circleGreen': hover>=0 && hover >value && index>value  && index<=hover,
	    'circleRed'  : hover>=0 && hover<=value && index>=hover && index<=value
        } },
        mouseOver: function(event) {
	    this.hover = event.target.attributes.index.value * 1
	    this.$forceUpdate()
        },
        mouseOut: function(event) {
            this.hover = -1
	    this.$forceUpdate()
        }
    },
    template: `
    <tr>
        <td>{{ attr.id }}</td>
        <td>{{ attr.value }}</td>
        <td>
            <div v-for="n in 5" 
                v-bind:index="n"
                v-bind:class="setClass(attr.value, n, hover)"
                v-on:click="setAttrValue(attr, n); $emit('attrchanged')"
                v-on:mouseover="mouseOver"
                v-on:mouseout="mouseOut"
            ></div>
        </td>
    </tr>`
  })

var app = new Vue({ 
    el: '#chargen',
    data: function() {
        var data = {
            props: {}, 
            form: {}, 
            form_structure: {
                info: {
                    id: "header-id",
                    list: [
                        { id: "item-id", value: "" }
                    ]
                },
                attributes: {
                    id: "header-id",
                    list: [
                        { id: "item-id", value: 1, value_range: [1, 5] }
                    ],
                    //priority: "C",
                    sum: 3,
                    allowed: 5
                },
                skills: {
                    id: "header-id",
                    list: [
                        { id: "item-id", value: 0 }
                    ],
                    sum: 0
                },
                spells: {
                    id: "header-id",
                    list: [
                        { id: "item-id", value: 0 }
                    ],
                    sum: 0
                }
            }
        }
	data.props = config;	// load config
	// load blank sheet to structure
	var
	blank      = cloneObject(data.props.blank),
	structure  = cloneObject(data.form_structure);
	this.formStructureParser(data.form, structure, blank);
//        this.computeAttrAll(data.form);
    return data;
    },

    methods: {

        error: function (source, text) {
            console.log(['Error app', source].join('.') + ': ' + text); // document.getElementById('error').innerHTML()
        },

        RecomputeAttributePriorities: function() { 
            /*
             * We compute how many attribute points are allowed based on highest assigned points
             * which will get most allowed points, other lower similarly
             * algorithm uses AttrAllowed as a source of restrictions
             * sorted AttrSums is used to recognize which Attribute category has most points assigned
             * changed array is used to track which categories were already modified to avoid double assigments 
             * and leaving other categories unchanged
             */
            var AttrAllowed = [7,6,5]
            var AttrSums = [
                app.form.attributes[0].sum,
                app.form.attributes[1].sum,
                app.form.attributes[2].sum
            ]            
            AttrSums.sort(function(a,b) {return a-b}).reverse()
            var changed = []
            while (AttrSums.length > 0) {
                for (var i=0; i < app.form.attributes.length; i++) {
                    if (app.form.attributes[i].sum == AttrSums[0] && !(changed.includes(i))) {
                        app.form.attributes[i].allowed = AttrAllowed[0]
                        AttrSums.shift()
                        AttrAllowed.shift()
                        changed.push(i)
                    }
                }
            }  
        },

        sheetImport: function(imported_sheet) {
            var fn = 'sheetImport';
//console.log(fn);
            var 
            sheet = isObject(imported_sheet) ? imported_sheet : {},
            blank = cloneObject(this.props.blank);
            this.sheetParser(blank, sheet);		// update blank-sheet by sheet
            this.formStructureParser(this.form, this.form_structure, blank);	// update form-data
//            this.computeAttrAll();
	},

        sheetParser: function (blank, sheet) {
            var fn, i;
            fn = 'sheetParser';
//console.log(fn);
            if (!isObject(blank) || !isObject(sheet))
                {
                return;
                }
            for(i in blank)
                {
                if (!isObject(sheet) || !(i in sheet))
                    {
                    continue;
                    }
                if (isObject(blank[i]))	// object, repeat
                    {
                    if (!isObject(sheet[i]))
                        {
                        this.error(fn, 'Value in "parsed object" is not type Object.');
                        }
                    this.sheetParser(blank[i], sheet[i]);
                    }
                else
                    {
                    blank[i] = sheet[i];	// copy value
                    }
                }
        },

        formStructureParser: function(out, structure, sheet) {	// parse sheet to form-structure
console.log('formdataParser');
            var i, j, k, jj, kk, temp, key, keys = {'sum':1, 'priority':1, 'allowed':1};
            for (i in structure)			// i = group / atributtes
                {
                if (!isObject(structure[i]) || !isObject(sheet[i]))
                    {
                    return;
                    }
                if (!isArray(out[i]))
                    {
                    out[i] = [];
                    }
//console.log('-- '+i+' --')
                jj = 0;
                for (j in sheet[i])			// j = category / physical
                    {
                    if (!isObject(sheet[i][j]))
                        {
                        return;
                        }
//console.log('-- '+j+' --')
                    if (!isObject(out[i][jj]))
                        {
                        out[i][jj] = cloneObject(structure[i]);
                        }
                    out[i][jj].id = j;							// copy group-id
                    if (isExist(structure[i].list) && (!isExist(out[i][jj].list) || !isArray(out[i][jj].list)))	// create plistriority, if not exist
                        {
                        out[i][jj].list = cloneObject(structure[i].list);
                        }
                    for (key in keys)	// create [sum, priority, allowed] if not exist
			{
                        if (isExist(structure[i][key]) && !isExist(out[i][jj][key]))		
                            {
                            out[i][jj][key] = structure[i][key];
                            }
			}
                    temp = cloneObject(structure[i].list[0]);
                    kk = 0;
                    for (k in sheet[i][j])
                        {
                        if (!isExist(out[i][jj].list[kk]))
                            {
                            out[i][jj].list[kk] = cloneObject(temp);
                            }
                         out[i][jj].list[kk].id    = k;
                         out[i][jj].list[kk].value = sheet[i][j][k];
                         kk++;
                        }
                    jj++;
                    }
                }
	}
    }
});