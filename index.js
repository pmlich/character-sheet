const isExist = (ref) => typeof ref != 'undefined' && ref!=null;

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
            Attributes: [
                {
                    id: "Physical",                 
                    list: [
                        { id: "Strength", value: 1, value_range:[1,5] },
                        { id: "Dexterity", value: 1, value_range:[1,5] },
                        { id: "Stamina", value: 1, value_range:[1,5] },
                    ],
                    sum: 3,
                    allowed: 7
                },
                {
                    id: "Social",                 
                    list: [
                        { id: "Charisma", value: 1 },
                        { id: "Manipulation", value: 1 },
                        { id: "Composure", value: 1 }     
                    ],
                    sum: 3,
                    allowed: 6
                },
                {
                    id: "Mental",                 
                    list: [
                        { id: "Intelligence", value: 1 },
                        { id: "Wits", value: 1 },
                        { id: "Resolve", value: 1 } 
                    ],
                    sum: 3,
                    allowed: 5
                },            
            ]
        }
	data.props = config; // load from config (global variable in file 'app-data.js')
    return data;
    },

    methods: {

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
                app.Attributes[0].sum,
                app.Attributes[1].sum,
                app.Attributes[2].sum
            ]            
            AttrSums.sort(function(a,b) {return a-b}).reverse()
            var changed = []
            while (AttrSums.length > 0) {
                for (var i=0; i < app.Attributes.length; i++) {
                    if (app.Attributes[i].sum == AttrSums[0] && !(changed.includes(i))) {
                        app.Attributes[i].allowed = AttrAllowed[0]
                        AttrSums.shift()
                        AttrAllowed.shift()
                        changed.push(i)
                    }
                }
            }  
        }

    }
});
