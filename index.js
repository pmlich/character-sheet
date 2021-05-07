Vue.component('attribute-item', {
    props: ['attr'],
    template: '<tr><td>{{ attr.id }}</td><td>{{ attr.value }}</td></tr>'
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
            { id: "Manipulation", value: 1 },
            { id: "Composure", value: 1 }            
        ],
        MentalAttributes: [
            { id: "Intelligence", value: 1 },
            { id: "Wits", value: 1 },
            { id: "Resolve", value: 1 }            
        ],
    }
});