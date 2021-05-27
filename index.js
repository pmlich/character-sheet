Vue.component('attribute-category', {
    props: ['category'],
    computed: {
        tooMany: function() {
            return this.category.sum > (this.category.allowed)
        }
    },
    methods: {
        recomputeSum: function() { 
            newsum = 0
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
    template: `
    <tr>
        <td>{{ attr.id }}</td>
        <td>{{ attr.value }}</td>
        <td>
            <div class="circle" 
                v-for="n in 5" 
                v-bind:class="{circleBlack: n <= attr.value}"
                v-on:click="attr.value=n; $emit('attrchanged')">
            </div>
        </td>
    </tr>`
  })

var app = new Vue({ 
    el: '#chargen',
    data: { 
        Attributes: [
            {
                id: "Physical",                 
                list: [
                    { id: "Strength", value: 1 },
                    { id: "Dexterity", value: 1 },
                    { id: "Stamina", value: 1 },
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
        ],
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
            AttrAllowed = [7,6,5]
            AttrSums = [
                app.Attributes[0].sum,
                app.Attributes[1].sum,
                app.Attributes[2].sum
            ]            
            AttrSums.sort(function(a,b) {return a-b}).reverse()
            changed = []
            while (AttrSums.length > 0) {
                for (i=0; i < app.Attributes.length; i++) {
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