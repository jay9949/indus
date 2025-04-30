import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'passenger',
  title: 'Passenger',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'flightNo', title: 'Flight No', type: 'string'}),
    defineField({name: 'pnr', title: 'PNR', type: 'string'}),
    defineField({name: 'seatNo', title: 'Seat No', type: 'string'}),
    defineField({name: 'noOfBaggage', title: 'Number of Baggage', type: 'number'}),
    defineField({name: 'baggageWeight', title: 'Baggage Weight (kg)', type: 'string'}),
    defineField({name: 'departurePlace', title: 'Departure Place', type: 'string'}),
    defineField({name: 'arrivalPlace', title: 'Arrival Place', type: 'string'}),
    defineField({name: 'departureTime', title: 'Departure Time', type: 'string'}),
    defineField({name: 'arrivalTime', title: 'Arrival Time', type: 'string'}),
    defineField({
      name: 'identificationNo',
      title: 'Identification No',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'personImage',
      title: 'Person Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'baggageImages',
      title: 'Baggage Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
  ],
})
