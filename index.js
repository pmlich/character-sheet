Vue.component('attribute-item', {
    props: ['attr'],
    template: `
    <tr>
        <td>{{ attr.id }}</td>
        <td>{{ attr.value }}</td>
        <td>
            <div class="circle" 
                v-for="n in 5" 
                v-bind:class="{full: n <= attr.value}">
            </div>
        </td>
    </tr>`
  })

var app = new Vue({ 
    el: '#chargen',
    data: {
        PhysicalAttributes: [
            { id: "Strength", value: 1 },
            { id: "Dexterity", value: 1 },
            { id: "Stamina", value: 1 }
        ],
        SocialAttributes: [
            { id: "Charisma", value: 1 },
            { id: "Manipulation", value: 3 },
            { id: "Composure", value: 1 }            
        ],
        MentalAttributes: [
            { id: "Intelligence", value: 1 },
            { id: "Wits", value: 1 },
            { id: "Resolve", value: 1 }            
        ],
        test: 1
    }
});