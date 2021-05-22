Vue.component('attribute-category', {
    props: ['category'],
    template: `
    <div class="AttributeClass">
    <h3>{{ category.id }} {{ category.sum }} of {{ category.allowed + 3}}</h3>
    <table>
        <tr is="attribute-item"
            v-for="item in category.list"
            v-bind:attr="item"
            v-bind:key="item.id"
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
                v-bind:class="{full: n <= attr.value}"
                v-on:click="attr.value=n">
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
                allowed: 5
            },
            {
                id: "Social",                 
                list: [
                    { id: "Charisma", value: 1 },
                    { id: "Manipulation", value: 1 },
                    { id: "Composure", value: 1 }     
                ],
                sum: 3,
                allowed: 4
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
    }
});